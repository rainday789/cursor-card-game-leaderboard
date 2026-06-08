const SYMBOLS = ['🍎', '🍊', '🍋', '🍇', '🍓', '🍒', '🍑', '🍉'];
const FLIP_BACK_DELAY = 900;
const DEAL_STAGGER = 50;

let cards = [];
let flippedIndices = [];
let matchedCount = 0;
let moves = 0;
let isLocked = false;
let timerInterval = null;
let startTime = null;
let elapsedSeconds = 0;
let gameCompleted = false;

const boardEl = document.getElementById('board');
const timerEl = document.getElementById('timer');
const movesEl = document.getElementById('moves');
const restartBtn = document.getElementById('restart-btn');
const modalOverlay = document.getElementById('modal-overlay');
const modalTimeEl = document.getElementById('modal-time');
const modalMovesEl = document.getElementById('modal-moves');
const saveForm = document.getElementById('save-form');
const playerNameInput = document.getElementById('player-name');
const saveBtn = document.getElementById('save-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const saveStatusEl = document.getElementById('save-status');

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createDeck() {
  const pairs = SYMBOLS.flatMap((symbol, pairId) => [
    { pairId, symbol },
    { pairId, symbol },
  ]);
  return shuffle(pairs);
}

function startTimer() {
  if (timerInterval) return;
  startTime = performance.now();
  timerInterval = setInterval(() => {
    elapsedSeconds = (performance.now() - startTime) / 1000;
    timerEl.textContent = elapsedSeconds.toFixed(2);
  }, 50);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  if (startTime) {
    elapsedSeconds = (performance.now() - startTime) / 1000;
    timerEl.textContent = elapsedSeconds.toFixed(2);
  }
}

function renderBoard() {
  boardEl.innerHTML = '';
  cards.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card';
    cardEl.style.animationDelay = `${index * DEAL_STAGGER}ms`;
    cardEl.dataset.index = index;
    cardEl.innerHTML = `
      <div class="card-inner">
        <div class="card-face card-front"></div>
        <div class="card-face card-back">${card.symbol}</div>
      </div>
    `;
    cardEl.addEventListener('click', () => handleCardClick(index));
    boardEl.appendChild(cardEl);
  });
}

function getCardElement(index) {
  return boardEl.querySelector(`[data-index="${index}"]`);
}

function triggerAnimation(el, className, duration) {
  el.classList.add(className);
  setTimeout(() => el.classList.remove(className), duration);
}

function handleCardClick(index) {
  if (isLocked || gameCompleted) return;

  const card = cards[index];
  const cardEl = getCardElement(index);

  if (
    card.matched ||
    card.flipped ||
    flippedIndices.includes(index) ||
    flippedIndices.length >= 2
  ) {
    return;
  }

  if (!startTime) startTimer();

  card.flipped = true;
  cardEl.classList.add('flipped');
  flippedIndices.push(index);

  if (flippedIndices.length === 2) {
    moves++;
    movesEl.textContent = moves;
    checkMatch();
  }
}

function checkMatch() {
  isLocked = true;
  const [first, second] = flippedIndices;
  const firstEl = getCardElement(first);
  const secondEl = getCardElement(second);
  const match = cards[first].pairId === cards[second].pairId;

  if (match) {
    setTimeout(() => {
      cards[first].matched = true;
      cards[second].matched = true;
      firstEl.classList.add('matched');
      secondEl.classList.add('matched');
      triggerAnimation(firstEl, 'match-pop', 450);
      triggerAnimation(secondEl, 'match-pop', 450);
      matchedCount++;
      flippedIndices = [];
      isLocked = false;

      if (matchedCount === SYMBOLS.length) {
        setTimeout(endGame, 600);
      }
    }, 300);
  } else {
    firstEl.classList.add('shake');
    secondEl.classList.add('shake');
    boardEl.classList.add('disabled');

    setTimeout(() => {
      firstEl.classList.remove('shake');
      secondEl.classList.remove('shake');
      cards[first].flipped = false;
      cards[second].flipped = false;
      firstEl.classList.remove('flipped');
      secondEl.classList.remove('flipped');
      flippedIndices = [];
      isLocked = false;
      boardEl.classList.remove('disabled');
    }, FLIP_BACK_DELAY);
  }
}

function endGame() {
  gameCompleted = true;
  stopTimer();
  modalTimeEl.textContent = `${elapsedSeconds.toFixed(2)}초`;
  modalMovesEl.textContent = `${moves}회`;
  playerNameInput.value = '';
  saveStatusEl.hidden = true;
  saveStatusEl.textContent = '';
  saveBtn.disabled = false;
  modalOverlay.hidden = false;
  playerNameInput.focus();
}

function hideModal() {
  modalOverlay.hidden = true;
}

function initGame() {
  stopTimer();
  cards = createDeck().map((card) => ({ ...card, flipped: false, matched: false }));
  flippedIndices = [];
  matchedCount = 0;
  moves = 0;
  isLocked = false;
  startTime = null;
  elapsedSeconds = 0;
  gameCompleted = false;

  timerEl.textContent = '0.00';
  movesEl.textContent = '0';
  hideModal();
  renderBoard();
}

async function handleSaveScore(event) {
  event.preventDefault();
  if (!gameCompleted) return;

  const playerName = playerNameInput.value.trim() || 'Anonymous';
  saveBtn.disabled = true;
  saveStatusEl.hidden = true;

  try {
    await saveScore({
      player_name: playerName,
      moves,
      elapsed_seconds: parseFloat(elapsedSeconds.toFixed(2)),
    });
    saveStatusEl.textContent = '점수가 저장되었습니다!';
    saveStatusEl.className = 'save-status success';
    saveStatusEl.hidden = false;
    await loadLeaderboard();
  } catch (err) {
    saveStatusEl.textContent = `저장 실패: ${err.message}`;
    saveStatusEl.className = 'save-status error';
    saveStatusEl.hidden = false;
    saveBtn.disabled = false;
  }
}

restartBtn.addEventListener('click', initGame);
playAgainBtn.addEventListener('click', initGame);
saveForm.addEventListener('submit', handleSaveScore);

initGame();
loadLeaderboard();
