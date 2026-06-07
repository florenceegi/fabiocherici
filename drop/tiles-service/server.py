"""
@package drop-tiles — Preview service (A): anteprima JPEG leggera dei file ricevuti
@author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
@version 3.0.0 (thumbnail, memory-safe a qualsiasi dimensione)
@purpose Token-scoped. Per ogni file ricevuto su S3 genera UNA thumbnail JPEG (vips thumbnail =
         shrink-on-load/streaming, RAM minima) e la serve. L'originale resta su S3 e si scarica
         via URL firmata. Niente deep-zoom, niente piramidi: leggero e robusto.
Env: DROP_BUCKET, DROP_PREFIX, DROP_ME_URL, DROP_CACHE, DROP_ORIGIN, PORT, DROP_PREVIEW_MAXPX
"""
import os
import json
import re
import threading
import urllib.request
from http.server import HTTPServer, BaseHTTPRequestHandler
from socketserver import ThreadingMixIn
from urllib.parse import unquote, urlparse, parse_qs
import pyvips
import boto3
from botocore.config import Config

try:
    pyvips.cache_set_max(0)
    pyvips.cache_set_max_mem(0)
except Exception:
    pass

BUCKET = os.environ['DROP_BUCKET']
PREFIX = os.environ.get('DROP_PREFIX', 'incoming')
ME_URL = os.environ['DROP_ME_URL']
CACHE = os.environ.get('DROP_CACHE', '/var/lib/drop-tiles/cache')
ORIGIN = os.environ.get('DROP_ORIGIN', 'https://fabiocherici.com')
PORT = int(os.environ.get('PORT', '8095'))
MAXPX = int(os.environ.get('DROP_PREVIEW_MAXPX', '2000'))   # lato lungo anteprima

s3 = boto3.client('s3', region_name=os.environ.get('AWS_REGION', 'eu-north-1'),
                  config=Config(signature_version='s3v4'))
reg = {}                 # fslug -> base path (preview = base + '.jpg')
reg_key = {}             # fslug -> S3 key originale (per download firmato)
processing = set()
state_lock = threading.Lock()
work_sema = threading.Semaphore(1)


def slugify(name):
    name = os.path.splitext(name)[0].lower()
    return re.sub(r'[^a-z0-9]+', '-', name).strip('-')[:80]


def format_size(b):
    if b >= 1073741824:
        return f'{b / 1073741824:.2f} GiB'
    if b >= 1048576:
        return f'{b / 1048576:.1f} MiB'
    return f'{b // 1024} KiB'


def cors():
    return {
        'Access-Control-Allow-Origin': ORIGIN,
        'Vary': 'Origin',
        'Access-Control-Allow-Headers': 'content-type,x-drop-token',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Max-Age': '86400',
    }


def resolve_slug(token):
    if not token:
        return None
    try:
        req = urllib.request.Request(ME_URL, headers={'x-drop-token': token})
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read().decode()).get('slug')
    except Exception:
        return None


def presign(key):
    try:
        return s3.generate_presigned_url('get_object',
                                         Params={'Bucket': BUCKET, 'Key': key}, ExpiresIn=3600)
    except Exception:
        return None


def _process(fslug, key, tif_path, base):
    """Scarica l'originale, genera UNA thumbnail JPEG (memoria minima), poi cancella l'originale."""
    with work_sema:
        try:
            if os.path.exists(base + '.jpg'):
                return
            if not os.path.exists(tif_path):
                tmp = tif_path + '.part'
                s3.download_file(BUCKET, key, tmp)
                os.replace(tmp, tif_path)
            # thumbnail = shrink-on-load/streaming: RAM minima anche su file enormi
            img = pyvips.Image.thumbnail(tif_path, MAXPX)
            if img.format == 'ushort':
                img = img.cast('uchar', shift=True)
            elif img.format != 'uchar':
                img = img.cast('uchar')
            if img.bands > 3:
                img = img.extract_band(0, n=3)
            tmpjpg = base + '.jpg.part'
            img.jpegsave(tmpjpg, Q=85, strip=True)
            os.replace(tmpjpg, base + '.jpg')
            try:
                os.remove(tif_path)
            except OSError:
                pass
        except Exception as e:
            print(f'preview error {key}: {e}', flush=True)
        finally:
            with state_lock:
                processing.discard(fslug)


def manifest(token):
    slug = resolve_slug(token)
    if not slug:
        return {'mode': 'received', 'works': [], 'error': 'invalid_token'}
    pdir = os.path.join(CACHE, slug, 'preview')
    rdir = os.path.join(CACHE, slug, 'raw')
    os.makedirs(pdir, exist_ok=True)
    os.makedirs(rdir, exist_ok=True)
    works = []
    pending = 0
    paginator = s3.get_paginator('list_objects_v2')
    for page in paginator.paginate(Bucket=BUCKET, Prefix=f'{PREFIX}/{slug}/'):
        for obj in page.get('Contents', []):
            key = obj['Key']
            fname = key.split('/')[-1]
            if not fname or key.endswith('/'):
                continue
            display = fname.split('__', 1)[1] if '__' in fname else fname
            fslug = 'rx-' + slugify(slug + '-' + display)
            base = os.path.join(pdir, fslug)
            reg[fslug] = base
            reg_key[fslug] = key
            size = obj['Size']
            is_img = fname.lower().endswith(('.tif', '.tiff', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.heic', '.heif', '.avif'))
            common = {
                'originalName': display, 'slug': fslug, 'source': 'received', 'client': slug,
                'fileSizeBytes': size, 'fileSizeHuman': format_size(size),
                'downloadUrl': presign(key),
            }
            if not is_img:
                works.append({**common, 'status': 'file'})   # non-immagine: solo download
                continue
            if os.path.exists(base + '.jpg') and os.path.getsize(base + '.jpg') > 0:
                works.append({**common, 'status': 'ready', 'previewUrl': f'/preview/{fslug}.jpg'})
            else:
                pending += 1
                with state_lock:
                    if fslug not in processing:
                        processing.add(fslug)
                        threading.Thread(target=_process,
                                         args=(fslug, key, os.path.join(rdir, fname), base),
                                         daemon=True).start()
                works.append({**common, 'status': 'preparing'})
    return {'mode': 'received', 'client': slug, 'pending': pending, 'works': works}


class Handler(BaseHTTPRequestHandler):
    def _h(self, code, ctype, length, extra=None):
        self.send_response(code)
        for k, v in cors().items():
            self.send_header(k, v)
        if extra:
            for k, v in extra.items():
                self.send_header(k, v)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(length))
        self.end_headers()

    def _json(self, code, obj):
        body = json.dumps(obj).encode()
        self._h(code, 'application/json', len(body))
        self.wfile.write(body)

    def _file(self, path, ctype):
        if not os.path.isfile(path):
            self._json(404, {'error': 'not_found'})
            return
        with open(path, 'rb') as f:
            data = f.read()
        self._h(200, ctype, len(data), {'Cache-Control': 'public, max-age=86400'})
        self.wfile.write(data)

    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in cors().items():
            self.send_header(k, v)
        self.end_headers()

    def do_GET(self):
        try:
            p = urlparse(self.path)
            path = unquote(p.path)
            q = parse_qs(p.query)
            if path == '/health':
                self._h(200, 'text/plain', 2)
                self.wfile.write(b'OK')
                return
            if path == '/api/manifest.json':
                self._json(200, manifest((q.get('token') or [None])[0]))
                return
            m = re.match(r'^/preview/([a-z0-9-]+)\.jpg$', path)
            if m and m.group(1) in reg:
                self._file(reg[m.group(1)] + '.jpg', 'image/jpeg')
                return
            self._json(404, {'error': 'not_found'})
        except Exception as e:
            try:
                self._json(500, {'error': str(e)})
            except Exception:
                pass

    def log_message(self, fmt, *args):
        if '/preview/' not in str(args[0] if args else ''):
            super().log_message(fmt, *args)


class ThreadedHTTP(ThreadingMixIn, HTTPServer):
    daemon_threads = True


if __name__ == '__main__':
    os.makedirs(CACHE, exist_ok=True)
    print(f'drop-preview v3 on :{PORT} bucket={BUCKET} origin={ORIGIN} maxpx={MAXPX}', flush=True)
    ThreadedHTTP(('127.0.0.1', PORT), Handler).serve_forever()
