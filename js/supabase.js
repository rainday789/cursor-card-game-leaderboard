function assertSupabaseConfig() {
  if (window.__SUPABASE_CONFIG_ERROR__) {
    throw new Error(window.__SUPABASE_CONFIG_ERROR__);
  }
  if (!window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    throw new Error(
      'Supabase 설정이 없습니다. supabase-config.example.js 를 참고해 supabase-config.js 를 생성하세요.'
    );
  }
}

function getSupabaseClient() {
  assertSupabaseConfig();
  return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}

const supabaseClient = getSupabaseClient();

async function saveScore({ player_name, moves, elapsed_seconds }) {
  const { error } = await supabaseClient.from('game_scores').insert({
    player_name,
    moves,
    elapsed_seconds,
  });

  if (error) throw new Error(error.message);
}

async function fetchLeaderboard(limit = 10) {
  const { data, error } = await supabaseClient
    .from('game_scores')
    .select('player_name, moves, elapsed_seconds, created_at')
    .order('moves', { ascending: true })
    .order('elapsed_seconds', { ascending: true })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data;
}

function formatElapsed(seconds) {
  return `${Number(seconds).toFixed(2)}초`;
}

async function loadLeaderboard() {
  const loadingEl = document.getElementById('leaderboard-loading');
  const listEl = document.getElementById('leaderboard-list');
  const emptyEl = document.getElementById('leaderboard-empty');
  const errorEl = document.getElementById('leaderboard-error');

  loadingEl.hidden = false;
  listEl.hidden = true;
  emptyEl.hidden = true;
  errorEl.hidden = true;

  try {
    const scores = await fetchLeaderboard();
    loadingEl.hidden = true;

    if (!scores.length) {
      emptyEl.hidden = false;
      return;
    }

    const rankIcons = ['🥇', '🥈', '🥉'];

    listEl.innerHTML = scores
      .map((score, i) => {
        const rankClass = i < 3 ? `rank-${i + 1}` : '';
        const rankDisplay = i < 3 ? rankIcons[i] : `${i + 1}`;
        return `
          <li class="${rankClass}">
            <span class="leaderboard-rank">${rankDisplay}</span>
            <span class="leaderboard-name">${escapeHtml(score.player_name)}</span>
            <span class="leaderboard-score">${score.moves}회 · ${formatElapsed(score.elapsed_seconds)}</span>
          </li>
        `;
      })
      .join('');

    listEl.hidden = false;
  } catch (err) {
    loadingEl.hidden = true;
    errorEl.textContent = `리더보드를 불러올 수 없습니다: ${err.message}`;
    errorEl.hidden = false;
  }
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
