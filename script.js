"use strict";

document.addEventListener('DOMContentLoaded', () => {
  // Simple view router
  const views = {
    hub: document.getElementById('hubView'),
    guess: document.getElementById('guessView'),
    ttt: document.getElementById('tttView')
  };
  function showView(id) {
    Object.values(views).forEach(v => v.classList.add('hidden'));
    if (views[id]) views[id].classList.remove('hidden');
  }

  // Hub buttons
  document.getElementById('openGuess').addEventListener('click', () => {
    showView('guess');
    introOverlay.classList.add('hidden');
    initGuessGame();
  });
  document.getElementById('openGuessIntro').addEventListener('click', () => {
    showView('guess');
    introOverlay.classList.remove('hidden');
  });
  document.getElementById('openTTT').addEventListener('click', () => {
    showView('ttt');
    ttt.ensureReady();
  });
  document.getElementById('openTTTReset').addEventListener('click', () => {
    showView('ttt');
    ttt.resetMatch();
  });
  document.getElementById('backFromGuess').addEventListener('click', () => showView('hub'));
  document.getElementById('backFromTTT').addEventListener('click', () => showView('hub'));

  // ===== Guess The Number =====
  let randomNumber, chances, guesses;

  const guessInput = document.getElementById("guessInput");
  const guessBtn = document.getElementById("guessBtn");
  const feedback = document.getElementById("feedback");
  const chancesText = document.getElementById("chances");
  const previousGuesses = document.getElementById("previousGuesses");
  const restartBtn = document.getElementById("restartBtn");
  const introOverlay = document.getElementById("introOverlay");
  const startBtn = document.getElementById("startBtn");
  const skipIntro = document.getElementById("skipIntro");

  function initGuessGame() {
    randomNumber = Math.floor(Math.random() * 100) + 1;
    chances = 10;
    guesses = [];
    feedback.textContent = "";
    feedback.style.color = "";
    chancesText.textContent = chances;
    previousGuesses.textContent = "Previous Guesses: None";
    guessBtn.disabled = false;
    guessInput.disabled = false;
    guessInput.value = "";
    guessInput.focus();
  }

  function endGuessGame() {
    guessBtn.disabled = true;
    guessInput.disabled = true;
  }

  function checkGuess() {
    const val = Number(guessInput.value);
    if (!val || val < 1 || val > 100) {
      feedback.textContent = "⚠️ Enter a number between 1 and 100!";
      feedback.style.color = "var(--warn)";
      return;
    }

    guesses.push(val);
    chances--;
    chancesText.textContent = chances;
    previousGuesses.textContent = "Previous Guesses: " + guesses.join(", ");

    if (val === randomNumber) {
      feedback.textContent = "🎉 Correct! You nailed it!";
      feedback.style.color = "var(--win)";
      endGuessGame();
    } else if (chances === 0) {
      feedback.textContent = `❌ Game Over! The number was ${randomNumber}`;
      feedback.style.color = "var(--bad)";
      endGuessGame();
    } else {
      feedback.textContent = val > randomNumber ? "⬇️ Too High!" : "⬆️ Too Low!";
      feedback.style.color = "#ffcc00";
    }

    guessInput.value = "";
    guessInput.focus();
  }

  guessBtn.addEventListener("click", checkGuess);
  guessInput.addEventListener("keydown", (e) => { if (e.key === "Enter") checkGuess(); });
  restartBtn.addEventListener("click", initGuessGame);
  startBtn.addEventListener("click", () => { introOverlay.classList.add('hidden'); initGuessGame(); });
  skipIntro.addEventListener("click", () => { introOverlay.classList.add('hidden'); initGuessGame(); });

  // ===== Tic Tac Toe (Best of 5) =====
  class TicTacToe {
    constructor() {
      // UI elements
      this.boardEl = document.getElementById('tttBoard');
      this.statusEl = document.getElementById('tttStatus');
      this.turnPill = document.getElementById('turnPill');
      this.roundPill = document.getElementById('roundPill');
      this.matchPill = document.getElementById('matchPill');

      this.btnResetRound = document.getElementById('tttResetRound');
      this.btnResetMatch = document.getElementById('tttResetMatch');

      // Constant
      this.maxRounds = 5;

      // State will be set in ensureReady
      this.ensureReady();
      this.attach();
    }

    ensureReady() {
      // Initialize match only once or when returning
      if (!this.board) {
        this.winsX = 0;
        this.winsO = 0;
        this.round = 1;
        this.currentPlayer = "X";
        this.gameActive = true;
        this.board = Array(9).fill("");
      }
      if (!this.boardEl.hasChildNodes()) {
        this.renderBoard();
      }
      this.updateUI();
      this.statusEl.textContent = `Player ${this.currentPlayer}'s turn`;
    }

    attach() {
      this.btnResetRound.addEventListener('click', () => this.resetRound());
      this.btnResetMatch.addEventListener('click', () => this.resetMatch());
    }

    renderBoard() {
      this.boardEl.innerHTML = "";
      for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'ttt-cell';
        cell.dataset.index = i;
        cell.setAttribute('role', 'button');
        cell.setAttribute('aria-label', `Cell ${i+1}`);
        cell.addEventListener('click', () => this.handleClick(i));
        this.boardEl.appendChild(cell);
      }
    }

    handleClick(i) {
      if (!this.gameActive || this.board[i]) return;

      this.board[i] = this.currentPlayer;
      this.updateCell(i);

      const pattern = this.checkWin();
      if (pattern) {
        this.highlightWin(pattern);
        this.roundWin(this.currentPlayer);
        return;
      }

      if (this.board.every(c => c)) {
        this.roundDraw();
        return;
      }

      this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
      this.updateUI();
    }

    updateCell(i) {
      const el = this.boardEl.querySelector(`[data-index='${i}']`);
      el.textContent = this.board[i];
    }

    checkWin() {
      const P = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
      ];
      for (const line of P) {
        const [a,b,c] = line;
        if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
          return line;
        }
      }
      return null;
    }

    highlightWin(pattern) {
      pattern.forEach(i => {
        const el = this.boardEl.querySelector(`[data-index='${i}']`);
        if (el) el.classList.add('win');
      });
    }

    clearHighlights() {
      this.boardEl.querySelectorAll('.ttt-cell.win').forEach(el => el.classList.remove('win'));
    }

    roundWin(player) {
      this.gameActive = false;
      this.statusEl.textContent = `🎉 Player ${player} wins this round!`;
      if (player === "X") this.winsX++; else this.winsO++;
      this.afterRound();
    }

    roundDraw() {
      this.gameActive = false;
      this.statusEl.textContent = "🤝 Draw! No points this round.";
      this.afterRound();
    }

    afterRound() {
      this.updateUI();
      // Strictly finish after 5 rounds (no early stop)
      setTimeout(() => {
        if (this.round >= this.maxRounds) {
          const winner =
            this.winsX === this.winsO ? null :
            (this.winsX > this.winsO ? "X" : "O");

          if (winner) {
            this.statusEl.textContent = `🏆 Booyah! Player ${winner} wins the match ${this.winsX}-${this.winsO}!`;
          } else {
            this.statusEl.textContent = `🏁 Match over: Tie ${this.winsX}-${this.winsO}.`;
          }
          setTimeout(() => this.resetMatch(), 2500);
        } else {
          this.round++;
          this.resetBoardOnly(); // next round
        }
      }, 900);
    }

    resetBoardOnly() {
      this.clearHighlights();
      this.board = Array(9).fill("");
      this.gameActive = true;
      // Alternate starting player each round for fairness
      this.currentPlayer = (this.round % 2 === 1) ? "X" : "O";
      this.renderBoard();
      this.updateUI();
      this.statusEl.textContent = `Round ${this.round}. Player ${this.currentPlayer}'s turn`;
    }

    resetRound() {
      this.resetBoardOnly();
    }

    resetMatch() {
      this.winsX = 0;
      this.winsO = 0;
      this.round = 1;
      this.currentPlayer = "X";
      this.resetBoardOnly();
      this.updateUI();
      this.statusEl.textContent = "New match started. Player X begins!";
    }

    updateUI() {
      this.turnPill.textContent = `Turn: ${this.currentPlayer}`;
      this.roundPill.textContent = `Round: ${this.round} / ${this.maxRounds}`;
      this.matchPill.textContent = `Match: X ${this.winsX} — ${this.winsO} O`;
    }
  }

  // Create TTT instance once
  const ttt = new TicTacToe();

  // Start at hub
  showView('hub');
});
