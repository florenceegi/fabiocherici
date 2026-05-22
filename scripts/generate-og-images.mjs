#!/usr/bin/env node
/**
 * @package fabiocherici.com — OG Image Generator
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-23
 * @purpose Build-time generation of og:image PNGs for all pages × locales via satori + resvg.
 */

import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CACHE_DIR = join(__dirname, '.font-cache');
const OUT_DIR = join(ROOT, 'public', 'og');

const LOCALES = ['it', 'en', 'de', 'es', 'fr', 'pt', 'zh'];

const PAGES = [
  { slug: 'index', metaKey: 'home_title' },
  { slug: 'egi', metaKey: 'egi_title' },
  { slug: 'epp', metaKey: 'epp_title' },
  { slug: 'oracode', metaKey: 'oracode_title' },
  { slug: 'creazioni', metaKey: 'creazioni_title' },
  { slug: 'scrittore', metaKey: 'scrittore_title' },
  { slug: 'ai-nous', metaKey: 'ai_nous_title' },
  { slug: 'i-numeri', metaKey: 'numeri_title' },
  { slug: 'ecosistema', metaKey: 'ecosistema_title' },
  { slug: 'contatti', metaKey: 'contatti_title' },
  { slug: 'privacy', metaKey: 'privacy_title' },
  { slug: 'prove', metaKey: 'prove_title' },
];

const WIDTH = 1200;
const HEIGHT = 630;

const COLORS = {
  bg: '#111111',
  text: '#f0ebe3',
  muted: '#8a847d',
  accent: '#C8A96E',
};

function loadFont(pkg, subset, weight, style = 'normal') {
  const file = join(ROOT, 'node_modules', `@fontsource/${pkg}`, 'files', `${pkg}-${subset}-${weight}-${style}.woff`);
  if (!existsSync(file)) {
    throw new Error(`Font not found: ${file}\nRun: npm install -D @fontsource/${pkg}`);
  }
  return readFileSync(file);
}

function buildTemplate(title) {
  return {
    type: 'div',
    props: {
      style: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: COLORS.bg,
        padding: '80px',
      },
      children: [
        {
          type: 'div',
          props: {
            style: {
              width: '60px',
              height: '4px',
              backgroundColor: COLORS.accent,
              marginBottom: '40px',
            },
          },
        },
        {
          type: 'div',
          props: {
            style: {
              fontSize: title.length > 40 ? 48 : 60,
              fontFamily: 'Cormorant Garamond, Noto Sans SC',
              fontWeight: 300,
              color: COLORS.text,
              lineHeight: 1.3,
              maxWidth: '900px',
            },
            children: title,
          },
        },
        {
          type: 'div',
          props: {
            style: {
              display: 'flex',
              alignItems: 'center',
              marginTop: 'auto',
              gap: '16px',
            },
            children: [
              {
                type: 'div',
                props: {
                  style: {
                    width: '24px',
                    height: '2px',
                    backgroundColor: COLORS.accent,
                  },
                },
              },
              {
                type: 'div',
                props: {
                  style: {
                    fontSize: 18,
                    fontFamily: 'Inter',
                    fontWeight: 400,
                    color: COLORS.muted,
                    letterSpacing: '0.08em',
                  },
                  children: 'fabiocherici.com',
                },
              },
            ],
          },
        },
      ],
    },
  };
}

async function main() {
  console.log('Loading fonts...');
  const interData = loadFont('inter', 'latin', 400);
  const cormorantData = loadFont('cormorant-garamond', 'latin', 300);
  const cjkData = loadFont('noto-sans-sc', 'chinese-simplified', 400);

  const fonts = [
    { name: 'Cormorant Garamond', data: cormorantData, weight: 300, style: 'normal' },
    { name: 'Inter', data: interData, weight: 400, style: 'normal' },
    { name: 'Noto Sans SC', data: cjkData, weight: 400, style: 'normal' },
  ];

  let generated = 0;

  for (const locale of LOCALES) {
    const messagesPath = join(ROOT, 'messages', `${locale}.json`);
    const messages = JSON.parse(readFileSync(messagesPath, 'utf-8'));
    const meta = messages.meta || {};

    const localeDir = join(OUT_DIR, locale);
    mkdirSync(localeDir, { recursive: true });

    for (const page of PAGES) {
      const title = meta[page.metaKey] || page.slug;
      const svg = await satori(buildTemplate(title), { width: WIDTH, height: HEIGHT, fonts });
      const resvg = new Resvg(svg, { fitTo: { mode: 'width', value: WIDTH } });
      const png = resvg.render().asPng();

      const outPath = join(localeDir, `${page.slug}.png`);
      writeFileSync(outPath, png);
      generated++;
    }
  }

  console.log(`Generated ${generated} OG images (${PAGES.length} pages × ${LOCALES.length} locales)`);
}

main().catch((err) => {
  console.error('OG image generation failed:', err);
  process.exit(1);
});
