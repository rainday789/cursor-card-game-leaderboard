(function () {
  const PLACEHOLDER_PATTERNS = ['YOUR_PROJECT_REF', 'YOUR_ANON_KEY'];

  function isPlaceholder(value) {
    if (!value || typeof value !== 'string') return true;
    return PLACEHOLDER_PATTERNS.some((token) => value.includes(token));
  }

  const urlMissing = isPlaceholder(window.SUPABASE_URL);
  const keyMissing = isPlaceholder(window.SUPABASE_ANON_KEY);

  if (urlMissing || keyMissing) {
    const message =
      'Supabase 설정이 없습니다. supabase-config.example.js 를 복사해 supabase-config.js 를 만들고 실제 URL과 anon key를 입력하세요.';

    console.error(message);
    window.__SUPABASE_CONFIG_ERROR__ = message;
  }
})();
