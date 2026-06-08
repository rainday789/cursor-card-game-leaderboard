import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputPath = resolve(root, 'supabase-config.js');

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('SUPABASE_URL 과 SUPABASE_ANON_KEY 환경 변수가 필요합니다.');
  process.exit(1);
}

function escapeJsString(value) {
  return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}

const content = `// Auto-generated at build time — do not commit this file.

window.SUPABASE_URL = '${escapeJsString(url)}';
window.SUPABASE_ANON_KEY = '${escapeJsString(key)}';
`;

writeFileSync(outputPath, content, 'utf8');
console.log('supabase-config.js generated successfully.');
