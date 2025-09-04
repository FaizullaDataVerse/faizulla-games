"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // Sound Effects
  const clickSound = document.getElementById("clickSound");
  const winSound = document.getElementById("winSound");
  const errorSound = document.getElementById("errorSound");

  function play(sound) {
    if (sound && sound.play) {
      sound.currentTime = 0;
      sound.play();
    }
  }

  // View Router
  const views = {
    hub: document.getElementById("hubView"),
    guess: document.getElementById("guessView"),
    ttt: document.getElementById("tttView"),
    rps: document.getElementById("rpsView"),
    dots: document.getElementById("dotsView"),
    // after dots and about:
    toss: document.getElementById("tossView"),
    about: document.getElementById("aboutView")
  };

  function showView(id) {
    Object.values(views).forEach(v => v.classList.add("hidden"));
    views[id]?.classList.remove("hidden");
    play(clickSound);
  }

  // Navigation
  document.getElementById("openGuess").onclick = () => {
    showView("guess");
    introOverlay.classList.add("hidden");
    initGuessGame();
  };
  document.getElementById("openGuessIntro").onclick = () => {
    showView("guess");
    introOverlay.classList.remove("hidden");
  };
  document.getElementById("openTTT").onclick = () => {
    showView("ttt");
    ttt.ensureReady();
  };
  document.getElementById("openTTTReset").onclick = () => {
    showView("ttt");
    ttt.resetMatch();
  };
  document.getElementById("openRPS").onclick = () => {
    showView("rps");
    rps.resetMatch();
  };
  document.getElementById("openRPSReset").onclick = () => {
    showView("rps");
    rps.resetMatch();
  };
  document.getElementById("openDots").onclick = () => {
    showView("dots");
    dotsGame.reset();
  };
  document.getElementById("openDotsReset").onclick = () => {
    showView("dots");
    dotsGame.reset();
  };
    // Open Toss
  document.getElementById("openToss").onclick = () => {
    showView("toss");
    initToss();
    play(clickSound);
  };

  // Back from Toss
  document.getElementById("backFromToss").onclick = () => {
    showView("hub");
    play(clickSound);
  };
  document.getElementById("openAbout").onclick = () => {
    showView("about");
  };

  // Back buttons
  ["backFromGuess", "backFromTTT", "backFromRPS", "backFromDots", "backFromAbout"].forEach(id => {
    document.getElementById(id).onclick = () => showView("hub");
  });

  // ----------------------------
  // Guess The Number
  // ----------------------------
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
      play(errorSound);
      return;
    }

    guesses.push(val);
    chances--;
    chancesText.textContent = chances;
    previousGuesses.textContent = "Previous Guesses: " + guesses.join(", ");

    if (val === randomNumber) {
      feedback.textContent = "🎉 Correct! You nailed it!";
      feedback.style.color = "var(--win)";
      play(winSound);
      endGuessGame();
    } else if (chances === 0) {
      feedback.textContent = `❌ Game Over! The number was ${randomNumber}`;
      feedback.style.color = "var(--bad)";
      play(errorSound);
      endGuessGame();
    } else {
      feedback.textContent = val > randomNumber ? "⬇️ Too High!" : "⬆️ Too Low!";
      feedback.style.color = "#ffcc00";
      play(clickSound);
    }

    guessInput.value = "";
    guessInput.focus();
  }

  guessBtn.onclick = checkGuess;
  guessInput.onkeydown = e => { if (e.key === "Enter") checkGuess(); };
  restartBtn.onclick = initGuessGame;
  startBtn.onclick = () => { introOverlay.classList.add("hidden"); initGuessGame(); };
  skipIntro.onclick = () => { introOverlay.classList.add("hidden"); initGuessGame(); };

  // ----------------------------
  // Dots & Boxes
  // ----------------------------
  class DotsBoxes {
    constructor() {
      this.sizeSelect = document.getElementById("dotsSize");
      this.boardEl = document.getElementById("dotsBoard");
      this.statusEl = document.getElementById("dotsStatus");
      this.scoreEl = document.getElementById("dotsScore");
      this.btnReset = document.getElementById("dotsReset");

      this.size = Number(this.sizeSelect.value);
      this.currentPlayer = 1;
      this.scores = [0, 0];
      this.lines = {};
      this.boxes = {};

      this.attach();
      this.renderBoard();
    }

    attach() {
      this.sizeSelect.addEventListener("change", () => {
        this.size = Number(this.sizeSelect.value);
        this.reset();
      });
      this.btnReset.addEventListener("click", () => this.reset());
    }

    reset() {
      this.currentPlayer = 1;
      this.scores = [0, 0];
      this.lines = {};
      this.boxes = {};
      document.documentElement.style.setProperty('--dots-size', this.size);
      this.renderBoard();
      this.updateUI();
    }

    renderBoard() {
      this.boardEl.innerHTML = "";
      const gridSize = this.size * 2 + 1;
      this.boardEl.style.gridTemplateColumns = `repeat(${gridSize}, 44px)`;

      for (let r = 0; r < gridSize; r++) {
        for (let c = 0; c < gridSize; c++) {
          const key = `${r},${c}`;
          if (r % 2 === 0 && c % 2 === 0) {
            const dot = document.createElement("div");
            dot.className = "dot";
            this.boardEl.appendChild(dot);
          } else if (r % 2 === 0 && c % 2 === 1) {
            const line = document.createElement("div");
            line.className = "h-line";
            line.dataset.key = key;
            line.addEventListener("click", () => this.claimLine(key, "h"));
            this.boardEl.appendChild(line);
          } else if (r % 2 === 1 && c % 2 === 0) {
            const line = document.createElement("div");
            line.className = "v-line";
            line.dataset.key = key;
            line.addEventListener("click", () => this.claimLine(key, "v"));
            this.boardEl.appendChild(line);
          } else {
            const box = document.createElement("div");
            box.className = "box";
            box.dataset.key = key;
            this.boxes[key] = null;
            this.boardEl.appendChild(box);
          }
        }
      }
    }

    claimLine(key, type) {
      if (this.lines[key]) return;
      this.lines[key] = this.currentPlayer;
      const el = this.boardEl.querySelector(`[data-key='${key}']`);
      if (el) el.style.background = this.currentPlayer === 1 ? "var(--accent)" : "var(--gold)";
      play(clickSound);
      el.classList.add("claimed");
      const gotBox = this.checkAdjacentBoxes(key, type);
      if (!gotBox) this.currentPlayer = 3 - this.currentPlayer;
      this.updateUI();

      if (Object.keys(this.lines).length === this.totalLines()) this.finishGame();
    }

    checkAdjacentBoxes(key, type) {
      const [r, c] = key.split(",").map(Number);
      const adj = [];
      if (type === "h") {
        if (r > 0) adj.push([r - 1, c]);
        if (r < this.size * 2) adj.push([r + 1, c]);
      
        } else {
        if (c > 0) adj.push([r, c - 1]);
        if (c < this.size * 2) adj.push([r, c + 1]);
      }

      let claimed = false;
      for (const [br, bc] of adj) {
        const bKey = `${br},${bc}`;
        if (this.boxes[bKey]) continue;
        if (this.isBoxComplete(br, bc)) {
          this.boxes[bKey] = this.currentPlayer;
          this.scores[this.currentPlayer - 1]++;
          const boxEl = this.boardEl.querySelector(`[data-key='${bKey}']`);
          if (boxEl) {
            boxEl.textContent = this.currentPlayer === 1 ? "A" : "B";
            boxEl.style.background = "rgba(255,255,255,0.08)";
            boxEl.style.border = `2px solid ${this.currentPlayer === 1 ? "var(--accent)" : "var(--gold)"}`;
            boxEl.style.borderRadius = "8px";
          }
          play(winSound);
          claimed = true;
        }
      }
      return claimed;
    }

    isBoxComplete(r, c) {
      return (
        this.lines[`${r - 1},${c}`] &&
        this.lines[`${r + 1},${c}`] &&
        this.lines[`${r},${c - 1}`] &&
        this.lines[`${r},${c + 1}`]
      );
    }

    totalLines() {
      return (this.size + 1) * this.size * 2;
    }

    updateUI() {
      this.statusEl.textContent = `Player ${this.currentPlayer}'s turn`;
      this.scoreEl.textContent = `P1: ${this.scores[0]} — ${this.scores[1]} :P2`;
    }

    finishGame() {
      const [a, b] = this.scores;
      const msg = a === b
        ? `🏁 Tie game! ${a}-${b}`
        : a > b
          ? `🏆 Player 1 wins ${a}-${b}!`
          : `🏆 Player 2 wins ${b}-${a}!`;
      this.statusEl.textContent = msg;
      play(winSound);
    }
  }

  const dotsGame = new DotsBoxes();

  // ----------------------------
  // Rock Paper Scissors
  // ----------------------------
  class RPS {
    constructor() {
      this.modeSelect = document.getElementById("rpsMode");
      this.targetSelect = document.getElementById("rpsTarget");
      this.buttons = Array.from(document.querySelectorAll(".rps-btn"));
      this.resultEl = document.getElementById("rpsResult");
      this.scoreEl = document.getElementById("rpsScore");
      this.btnReset = document.getElementById("rpsReset");

      this.choices = ["rock", "paper", "scissors"];
      this.mode = this.modeSelect.value;
      this.targetWins = Number(this.targetSelect.value);

      this.p1Score = 0;
      this.p2Score = 0;
      this.awaitingP2 = false;
      this.p1Choice = null;

      this.attach();
      this.resetMatch();
    }

    attach() {
      this.modeSelect.onchange = () => {
        this.mode = this.modeSelect.value;
        this.resetMatch();
      };
      this.targetSelect.onchange = () => {
        this.targetWins = Number(this.targetSelect.value);
        this.resetMatch();
      };
      this.buttons.forEach(btn => btn.onclick = () => {
        this.handleChoice(btn.dataset.choice);
      });
      this.btnReset.onclick = () => this.resetMatch();
    }

    handleChoice(choice) {
      play(clickSound);
      if (this.mode === "cpu") {
        const cpu = this.randomChoice();
        this.playRound(choice, cpu);
      } else {
        if (!this.awaitingP2) {
          this.p1Choice = choice;
          this.awaitingP2 = true;
          this.setResult("Player 2's turn…", "var(--muted)");
        } else {
          this.playRound(this.p1Choice, choice);
          this.awaitingP2 = false;
          this.p1Choice = null;
        }
      }
    }

    playRound(p1, p2) {
      const winner = this.getWinner(p1, p2);
      if (this.mode === "cpu") {
        if (winner === 1) {
          this.p1Score++;
          this.setResult(`You 🏆 (${this.icon(p1)} vs ${this.icon(p2)})`, "var(--win)");
          play(winSound);
        } else if (winner === 2) {
          this.p2Score++;
          this.setResult(`CPU 🏆 (${this.icon(p2)} vs ${this.icon(p1)})`, "var(--bad)");
          play(errorSound);
        } else {
          this.setResult(`Draw (${this.icon(p1)} vs ${this.icon(p2)})`, "#ffcc00");
        }
      } else {
        if (winner === 1) {
          this.p1Score++;
          this.setResult(`P1 🏆 (${this.icon(p1)} vs ${this.icon(p2)})`, "var(--win)");
          play(winSound);
        } else if (winner === 2) {
          this.p2Score++;
          this.setResult(`P2 🏆 (${this.icon(p2)} vs ${this.icon(p1)})`, "var(--win)");
          play(winSound);
        } else {
          this.setResult(`Draw (${this.icon(p1)} vs ${this.icon(p2)})`, "#ffcc00");
        }
      }
      this.updateScore();
      this.checkMatchEnd();
    }

    getWinner(a, b) {
      if (a === b) return 0;
      if ((a === "rock" && b === "scissors") ||
          (a === "paper" && b === "rock") ||
          (a === "scissors" && b === "paper")) return 1;
      return 2;
    }

    icon(choice) {
      return choice === "rock" ? "🪨" : choice === "paper" ? "📄" : "✂️";
    }

    randomChoice() {
      return this.choices[Math.floor(Math.random() * this.choices.length)];
    }

    setResult(text, color) {
      this.resultEl.textContent = text;
      this.resultEl.style.color = color;
      this.resultEl.style.transform = "scale(1.06)";
      setTimeout(() => this.resultEl.style.transform = "scale(1)", 120);
    }

    updateScore() {
      this.scoreEl.textContent = (this.mode === "cpu")
        ? `You: ${this.p1Score} — ${this.p2Score} :CPU`
        : `P1: ${this.p1Score} — ${this.p2Score} :P2`;
    }

    checkMatchEnd() {
      if (this.p1Score >= this.targetWins || this.p2Score >= this.targetWins) {
        const winner = this.p1Score > this.p2Score
          ? (this.mode === "cpu" ? "You" : "Player 1")
          : (this.mode === "cpu" ? "CPU" : "Player 2");
        this.setResult(`🏆 ${winner} wins the match!`, "var(--win)");
        play(winSound);
        setTimeout(() => this.resetMatch(), 2200);
      }
    }

    resetMatch() {
      this.p1Score = 0;
      this.p2Score = 0;
      this.awaitingP2 = false;
      this.p1Choice = null;
      this.setResult(`First to ${this.targetWins} wins`, "var(--muted)");
      this.updateScore();
    }
  }

  const rps = new RPS();

  // ----------------------------
  // Tic Tac Toe
  // ----------------------------
  class TicTacToe {
    constructor() {
      this.boardEl = document.getElementById("tttBoard");
      this.statusEl = document.getElementById("tttStatus");
      this.turnPill = document.getElementById("turnPill");
      this.roundPill = document.getElementById("roundPill");
      this.matchPill = document.getElementById("matchPill");
      this.btnResetRound = document.getElementById("tttResetRound");
      this.btnResetMatch = document.getElementById("tttResetMatch");
      this.maxRounds = 5;
      this.attach();
    }

    attach() {
      this.btnResetRound.onclick = () => this.resetRound();
      this.btnResetMatch.onclick = () => this.resetMatch();
    }

    ensureReady() {
      this.winsX = 0;
      this.winsO = 0;
      this.round = 1;
      this.currentPlayer = "X";
      this.gameActive = true;
      this.board = Array(9).fill("");
      this.renderBoard();
      this.updateUI();
    }

    renderBoard() {
      this.boardEl.innerHTML = "";
      for (let i = 0; i < 9; i++) {
                const cell = document.createElement("div");
        cell.className = "ttt-cell";
        cell.dataset.index = i;
        cell.addEventListener("click", () => this.handleClick(i));
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
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      for (const [a, b, c] of P) {
        if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
          return [a, b, c];
        }
      }
      return null;
    }

    highlightWin(pattern) {
      pattern.forEach(i => {
        const el = this.boardEl.querySelector(`[data-index='${i}']`);
        el.classList.add("win");
      });
    }

    clearHighlights() {
      this.boardEl.querySelectorAll(".ttt-cell.win").forEach(el => el.classList.remove("win"));
    }

    roundWin(player) {
      this.gameActive = false;
      this.statusEl.textContent = `🎉 Player ${player} wins this round!`;
      if (player === "X") this.winsX++;
      else this.winsO++;
      play(winSound);
      this.afterRound();
    }

    roundDraw() {
      this.gameActive = false;
      this.statusEl.textContent = "🤝 Draw! No points this round.";
      play(clickSound);
      this.afterRound();
    }

    afterRound() {
      this.updateUI();
      setTimeout(() => {
        if (this.round >= this.maxRounds) {
          const winner = this.winsX === this.winsO ? null : (this.winsX > this.winsO ? "X" : "O");
          this.statusEl.textContent = winner
            ? `🏆 Booyah! Player ${winner} wins the match ${this.winsX}-${this.winsO}!`
            : `🏁 Match over: Tie ${this.winsX}-${this.winsO}.`;
          play(winSound);
          setTimeout(() => this.resetMatch(), 2200);
        } else {
          this.round++;
          this.resetBoardOnly();
        }
      }, 900);
    }

    resetBoardOnly() {
      this.clearHighlights();
      this.board = Array(9).fill("");
      this.gameActive = true;
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
      this.statusEl.textContent = "New match started. Player X begins!";
    }

    updateUI() {
      this.turnPill.textContent = `Turn: ${this.currentPlayer}`;
      this.roundPill.textContent = `Round: ${this.round} / ${this.maxRounds}`;
      this.matchPill.textContent = `Match: X ${this.winsX} — ${this.winsO} O`;
    }
  }

  const ttt = new TicTacToe();
    // --- Coin Toss Game ---
  const chooseHeads   = document.getElementById("chooseHeads");
  const chooseTails   = document.getElementById("chooseTails");
  const tossResult    = document.getElementById("tossResult");
  const tossReset     = document.getElementById("tossReset");

  function initToss() {
    tossResult.textContent = "";
    chooseHeads.disabled = false;
    chooseTails.disabled = false;
  }

  function handleToss(choice) {
    const outcome = Math.random() < 0.5 ? "Heads" : "Tails";
    const userWon = choice.toLowerCase() === outcome.toLowerCase();
    tossResult.textContent = userWon
      ? `🎉 It's ${outcome}! You win!`
      : `❌ It's ${outcome}! You lose.`;
    tossResult.style.color = userWon ? "var(--win)" : "var(--bad)";
    play(userWon ? winSound : errorSound);

    // disable buttons until reset
    chooseHeads.disabled = true;
    chooseTails.disabled = true;
  }

  chooseHeads.onclick = () => handleToss("Heads");
  chooseTails.onclick = () => handleToss("Tails");
  tossReset.onclick   = initToss;
  // Start at hub
  showView("hub");
});
