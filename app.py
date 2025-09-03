# app.py
from flask import Flask, render_template_string

app = Flask(__name__)

HTML = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Prince's Game Hub</title>
  <style>
    :root{
      --bg1:#0b1020;
      --bg2:#121a35;
      --card:rgba(255,255,255,0.08);
      --card-strong:rgba(0,0,0,0.75);
      --text:#f5f7ff;
      --muted:#b9c0ff;
      --accent:#ff0000;     /* red */
      --accent-dark:#cc0000;
      --gold:#ffcc00;       /* yellow */
      --primary:#2a5298;    /* blue */
      --primary-dark:#1e3c72;
      --good:#7CFC00;
      --warn:#ffae42;
      --bad:#ff4d4d;
    }

    /* Global layout */
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Trebuchet MS', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: var(--text);
      min-height: 100vh;
      background:
        radial-gradient(1200px 600px at 20% -10%, #1b2558 0%, transparent 60%),
        radial-gradient(1000px 600px at 110% 110%, #2a376b 0%, transparent 60%),
        linear-gradient(135deg, var(--bg1), var(--bg2));
      display: grid;
      place-items: center;
      overflow: hidden;
    }

    .hidden { display: none !important; }

    .btn {
      background: var(--accent);
      color: #fff;
      border: none;
      padding: 10px 18px;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 700;
      letter-spacing: 0.3px;
      box-shadow: 0 6px 16px rgba(0,0,0,0.25);
      transition: transform .15s ease, background .2s ease, box-shadow .2s ease;
      text-decoration: none;
      display: inline-block;
    }
    .btn:hover { background: var(--accent-dark); transform: translateY(-1px); }
    .btn.secondary { background: #555; }
    .btn.secondary:hover { background: #333; }
    .btn.ghost {
      background: transparent; border: 2px solid var(--muted); color: var(--muted);
    }
    .btn.ghost:hover { border-color: #fff; color: #fff; }

    /* Hub */
    .hub-container {
      width: min(960px, 92vw);
      padding: 28px;
      background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0.4));
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 18px;
      backdrop-filter: blur(8px);
      box-shadow: 0 12px 36px rgba(0,0,0,.35);
      text-align: center;
    }
    .hub-title { margin: 0 0 6px; font-size: 2rem; color: #fff; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
    .hub-sub { margin: 0 0 22px; color: var(--muted); }
    .game-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(240px, 1fr));
      gap: 20px;
    }
    @media (max-width: 620px) {
      .game-grid { grid-template-columns: 1fr; }
    }
    .game-card {
      background: var(--card);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 14px;
      padding: 18px;
      text-align: left;
      display: grid;
      gap: 10px;
      transition: transform .18s ease, background .2s ease, border-color .2s ease;
    }
    .game-card:hover {
      transform: translateY(-3px);
      background: rgba(255,255,255,0.12);
      border-color: rgba(255,255,255,0.24);
    }
    .game-card h3 { margin: 0; color: #fff; }
    .game-card p { margin: 0; color: var(--muted); font-size: .95rem; }
    .actions { display: flex; gap: 10px; margin-top: 6px; }

    /* Shared game container (dark theme like Guess) */
    .game-shell {
      width: min(520px, 92vw);
      padding: 28px;
      background: var(--card-strong);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 18px;
      backdrop-filter: blur(8px);
      box-shadow: 0 12px 36px rgba(0,0,0,.35);
      text-align: center;
    }
    .game-title { margin: 0 0 10px; font-size: 1.9rem; color: var(--gold); text-shadow: 0 2px 6px #000; }
    .game-subtle { color: var(--muted); margin-top: 0; }

    /* Intro overlay (Guess) */
    .overlay {
      position: fixed; inset: 0;
      background: rgba(0,0,0,0.85);
      display: grid; place-items: center;
      z-index: 50;
    }
    .intro-screen {
      text-align: center;
      background: rgba(255,255,255,0.08);
      padding: 36px 28px;
      border-radius: 16px;
      border: 1px solid rgba(255,255,255,0.14);
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .intro-screen h1 { font-size: 2rem; margin: 0 0 14px; color: var(--gold); text-shadow: 0 2px 5px #000; }
    .highlight { color: var(--accent); font-weight: 800; }

    /* Guess the Number specific */
    .guess-input { width: 80%; padding: 10px; border-radius: 10px; border: none; }
    .guess-feedback { font-weight: 700; margin: 12px 0; }
    .guess-prev { color: var(--gold); }

    /* Tic Tac Toe specific (dark theme) */
    .ttt-board {
      display: grid;
      grid-template-columns: repeat(3, 110px);
      gap: 12px;
      justify-content: center;
      margin: 14px auto 12px;
    }
    .ttt-cell {
      width: 110px; height: 110px;
      background: #0f1530;
      border: 2px solid #2b356a;
      border-radius: 12px;
      font-size: 2.4rem;
      display: grid; place-items: center;
      cursor: pointer;
      transition: background .2s ease, transform .06s ease, border-color .2s ease;
      color: #eaf0ff;
      font-weight: 800;
      text-shadow: 0 2px 6px rgba(0,0,0,.4);
    }
    .ttt-cell:hover { background: #141d43; border-color:#3a4aa3; transform: translateY(-1px); }
    .ttt-status { margin: 8px 0 6px; font-weight: 700; }
    .ttt-panel {
      display: grid; gap: 8px;
      grid-template-columns: repeat(3, 1fr);
      text-align: center;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 10px;
      margin: 10px 0 14px;
    }
    .pill {
      background: rgba(0,0,0,0.35);
      border: 1px solid rgba(255,255,255,0.14);
      border-radius: 999px;
      padding: 6px 10px;
      font-weight: 700;
      color: #fff;
    }
    .pill.good { border-color: rgba(124,252,0,0.45); color: var(--good); }
    .pill.warn { border-color: rgba(255,204,0,0.45); color: var(--gold); }
    .pill.bad  { border-color: rgba(255,77,77,0.45); color: var(--bad); }

    .footer-note { margin-top: 10px; color: var(--muted); font-size: .9rem; }

    /* View containers */
    .view { width: 100%; display: grid; place-items: center; padding: 20px; }
  </style>
</head>
<body>

  <!-- HUB VIEW -->
  <section id="hubView" class="view">
    <div class="hub-container">
      <h1 class="hub-title">🎮 Prince's Game Hub</h1>
      <p class="hub-sub">Choose your challenge</p>
      <div class="game-grid">
        <div class="game-card">
          <h3>🔢 Guess The Number</h3>
          <p>Find the secret number between 1 and 100. You have 10 chances.</p>
          <div class="actions">
            <button class="btn" id="openGuess">Play</button>
            <button class="btn ghost" id="openGuessIntro">Start with Intro</button>
          </div>
        </div>
        <div class="game-card">
          <h3>🕹️ Tic Tac Toe — Best of 5</h3>
          <p>5 rounds. Score more victories than your opponent. Booyah to the winner!</p>
          <div class="actions">
            <button class="btn" id="openTTT">Play</button>
            <button class="btn ghost" id="openTTTReset">Reset Match & Play</button>
          </div>
        </div>
      </div>
      <p class="footer-note">© 2025 Prince • Unified dark theme</p>
    </div>
  </section>

  <!-- GUESS THE NUMBER VIEW -->
  <section id="guessView" class="view hidden">
    <div class="game-shell">
      <h2 class="game-title">🎯 Guess The Number</h2>
      <p class="game-subtle">Guess a number between <b>1</b> and <b>100</b></p>

      <input type="number" id="guessInput" class="guess-input" placeholder="Enter your guess" />
      <div style="display:flex; gap:10px; justify-content:center; margin:10px 0 4px;">
        <button id="guessBtn" class="btn">Guess</button>
        <button id="restartBtn" class="btn secondary">Restart</button>
        <button class="btn ghost" id="backFromGuess">Back to Hub</button>
      </div>

      <p id="feedback" class="guess-feedback"></p>
      <p>Chances Left: <span id="chances">10</span></p>
      <p id="previousGuesses" class="guess-prev">Previous Guesses: None</p>
      <p class="footer-note">Designed & Developed by <span class="highlight">Faijulla</span></p>
    </div>

    <!-- Intro overlay (optional) -->
    <div class="overlay hidden" id="introOverlay">
      <div class="intro-screen">
        <h1>🎮 Welcome to <span class="highlight">Guess The Number</span></h1>
        <p>Created by <b class="highlight">Faijulla</b></p>
        <button id="startBtn" class="btn">▶ Start Game</button>
        <div style="margin-top:10px;">
          <button id="skipIntro" class="btn ghost">Skip Intro</button>
        </div>
      </div>
    </div>
  </section>

  <!-- TIC TAC TOE VIEW -->
  <section id="tttView" class="view hidden">
    <div class="game-shell">
      <h2 class="game-title">🕹️ Tic Tac Toe</h2>
      <p class="game-subtle">Best of 5 rounds. Score more wins to get <span class="highlight">Booyah!</span></p>

      <div class="ttt-panel">
        <div class="pill warn" id="roundPill">Round: 1 / 5</div>
        <div class="pill" id="turnPill">Turn: X</div>
        <div class="pill" id="matchPill">Match: 0 - 0</div>
      </div>

      <div id="tttBoard" class="ttt-board"></div>

      <p id="tttStatus" class="ttt-status">Player X's turn</p>
      <div style="display:flex; gap:10px; justify-content:center; margin-top:8px;">
        <button id="tttResetRound" class="btn secondary">Reset Round</button>
        <button id="tttResetMatch" class="btn ghost">Reset Match</button>
        <button id="backFromTTT" class="btn">Back to Hub</button>
      </div>
      <p class="footer-note">Dark theme matched to Guess The Number</p>
    </div>
  </section>

  <script>
    // Simple view router
    const hubView = document.getElementById('hubView');
    const guessView = document.getElementById('guessView');
    const tttView = document.getElementById('tttView');

    function showView(which) {
      hubView.classList.add('hidden');
      guessView.classList.add('hidden');
      tttView.classList.add('hidden');
      if (which === 'hub') hubView.classList.remove('hidden');
      if (which === 'guess') guessView.classList.remove('hidden');
      if (which === 'ttt') tttView.classList.remove('hidden');
    }

    // Hub buttons
    document.getElementById('openGuess').addEventListener('click', () => {
      showView('guess');
      // start Guess immediately, no intro
      document.getElementById('introOverlay').classList.add('hidden');
      initGuessGame();
    });
    document.getElementById('openGuessIntro').addEventListener('click', () => {
      showView('guess');
      document.getElementById('introOverlay').classList.remove('hidden');
    });

    document.getElementById('openTTT').addEventListener('click', () => {
      showView('ttt');
      ttt.ensureReady();
    });
    document.getElementById('openTTTReset').addEventListener('click', () => {
      showView('ttt');
      ttt.resetMatch();
    });

    document.getElementById('backFromGuess').addEventListener('click', () => {
      showView('hub');
    });
    document.getElementById('backFromTTT').addEventListener('click', () => {
      showView('hub');
    });

    /* =========================
       Guess The Number (dark)
       ========================= */
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

    function checkGuess() {
      const userGuess = Number(guessInput.value);
      if (!userGuess || userGuess < 1 || userGuess > 100) {
        feedback.textContent = "⚠️ Enter a number between 1 and 100!";
        feedback.style.color = "var(--warn)";
        return;
      }

      guesses.push(userGuess);
      chances--;
      chancesText.textContent = chances;
      previousGuesses.textContent = "Previous Guesses: " + guesses.join(", ");

      if (userGuess === randomNumber) {
        feedback.textContent = "🎉 Correct! You nailed it!";
        feedback.style.color = "var(--good)";
        endGuessGame();
      } else if (chances === 0) {
        feedback.textContent = `❌ Game Over! The number was ${randomNumber}`;
        feedback.style.color = "var(--bad)";
        endGuessGame();
      } else {
        feedback.textContent = userGuess > randomNumber ? "⬇️ Too High!" : "⬆️ Too Low!";
        feedback.style.color = "var(--gold)";
      }

      guessInput.value = "";
      guessInput.focus();
    }

    function endGuessGame() {
      guessBtn.disabled = true;
      guessInput.disabled = true;
    }

    // Guess listeners
    restartBtn.addEventListener("click", initGuessGame);
    guessBtn.addEventListener("click", checkGuess);
    guessInput.addEventListener("keydown", (e) => { if (e.key === "Enter") checkGuess(); });
    if (startBtn) startBtn.addEventListener("click", () => { introOverlay.classList.add("hidden"); initGuessGame(); });
    if (skipIntro) skipIntro.addEventListener("click", () => { introOverlay.classList.add("hidden"); initGuessGame(); });

    /* =========================
       Tic Tac Toe — Best of 5
       ========================= */
    class TicTacToe {
      constructor() {
        this.boardEl = document.getElementById('tttBoard');
        this.statusEl = document.getElementById('tttStatus');
        this.turnPill = document.getElementById('turnPill');
        this.roundPill = document.getElementById('roundPill');
        this.matchPill = document.getElementById('matchPill');

        this.btnResetRound = document.getElementById('tttResetRound');
        this.btnResetMatch = document.getElementById('tttResetMatch');

        this.maxRounds = 5;
        this.ensureReady();
        this.attach();
      }

      ensureReady() {
        // initialize state if not present
        if (!this.board) {
          this.board = Array(9).fill("");
          this.currentPlayer = "X";
          this.gameActive = true;

          this.round = 1;
          this.winsX = 0;
          this.winsO = 0;
          this.renderBoard();
          this.updateUI();
        } else {
          // Coming back from hub: keep current match state, just ensure board exists
          if (!this.boardEl.hasChildNodes()) this.renderBoard();
          this.updateUI();
        }
      }

      attach() {
        this.btnResetRound.addEventListener('click', () => this.resetRound());
        this.btnResetMatch.addEventListener('click', () => this.resetMatch());
      }

      renderBoard() {
        this.boardEl.innerHTML = "";
        this.board.forEach((_, idx) => {
          const cell = document.createElement('div');
          cell.className = 'ttt-cell';
          cell.dataset.index = idx;
          cell.addEventListener('click', () => this.handleClick(idx));
          this.boardEl.appendChild(cell);
        });
      }

      handleClick(i) {
        if (!this.gameActive || this.board[i]) return;
        this.board[i] = this.currentPlayer;
        this.updateCell(i);

        const winner = this.checkWin();
        if (winner) {
          this.gameActive = false;
          this.statusEl.textContent = `🎉 Player ${winner} wins this round!`;
          if (winner === "X") this.winsX++; else this.winsO++;
          this.afterRound();
          return;
        }

        if (this.board.every(c => c)) {
          this.gameActive = false;
          this.statusEl.textContent = "🤝 Draw! No points this round.";
          this.afterRound();
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
        for (const [a,b,c] of P) {
          if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
            return this.board[a];
          }
        }
        return null;
      }

      updateUI() {
        this.turnPill.textContent = `Turn: ${this.currentPlayer}`;
        this.roundPill.textContent = `Round: ${this.round} / ${this.maxRounds}`;
        this.matchPill.textContent = `Match: ${this.winsX} - ${this.winsO}`;
        if (this.gameActive) {
          this.statusEl.textContent = `Player ${this.currentPlayer}'s turn`;
        }
      }

      afterRound() {
        this.updateUI();
        setTimeout(() => {
          // Advance round and decide match if needed
          if (this.round >= this.maxRounds) {
            const result = this.winsX === this.winsO ? "Tie" : (this.winsX > this.winsO ? "X" : "O");
            if (result === "Tie") {
              this.statusEl.textContent = `🏁 Match over: It's a tie at ${this.winsX}-${this.winsO}.`;
            } else {
              this.statusEl.textContent = `🏆 Booyah! Player ${result} wins the match ${this.winsX}-${this.winsO}!`;
            }
            // Auto-start new match after short pause
            setTimeout(() => this.resetMatch(), 2200);
          } else {
            this.round++;
            this.resetBoardOnly(); // start next round
          }
        }, 900);
      }

      resetBoardOnly() {
        this.board = Array(9).fill("");
        this.gameActive = true;
        // Alternate starting player each round for fairness
        this.currentPlayer = (this.round % 2 === 1) ? "X" : "O";
        this.renderBoard();
        this.updateUI();
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
    }

    const ttt = new TicTacToe();

    // Start app at hub
    showView('hub');
  </script>
</body>
</html>
"""

@app.route("/")
def index():
  return render_template_string(HTML)

if __name__ == "__main__":
  app.run(debug=True, port=5000)
