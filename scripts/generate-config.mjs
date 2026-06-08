import { writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('SUPABASE_URL 과 SUPABASE_ANON_KEY 환경 변수가 필요합니다.');
  process.exit(1);
}

const content = `// Generated at deploy time — do not commit this file.

window.SUPABASE_URL = '${url}';
window.SUPABASE_ANON_KEY = '${key}';
`;

writeFileSync(resolve(root, 'config.local.js'), content, 'utf8');
console.log('config.local.js generated successfully.');
