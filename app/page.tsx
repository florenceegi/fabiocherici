/**
 * @package fabiocherici.com — Root Page Redirect
 * @author Padmin D. Curtis (AI Partner OS3.0) for Fabio Cherici
 * @version 1.0.0 (FlorenceEGI — fabiocherici.com)
 * @date 2026-05-15
 * @purpose Redirect / to /it/ (default locale) for static export
 */

import { redirect } from 'next/navigation';

export default function RootPage() {
  redirect('/it');
}
