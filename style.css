:root {
  --bg1: #0b1020;
  --bg2: #121a35;
  --text: #f5f7ff;
  --muted: #c8cff9;
  --accent: #ff0000;
  --accent-dark: #cc0000;
  --gold: #ffcc00;
  --panel: rgba(0,0,0,0.78);
  --card: rgba(255,255,255,0.12);
  --win: #1fd36a;
  --warn: #ffae42;
  --bad: #ff4d4d;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: 'Trebuchet MS', sans-serif;
  color: var(--text);
  background: linear-gradient(135deg, var(--bg1), var(--bg2));
}

/* Hide HTML5 audio controls */
audio {
  display: none;
}

/* Full‐page view container & backgrounds */
.view {
  position: relative;
  min-height: 100vh;
  display: grid;
  place-items: center;
  overflow: hidden;
}
.view::before {
  content: "";
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  filter: brightness(0.45);
  z-index: 0;
}
/* Spidey backgrounds */
#hubView::before   { background-image: url('spidey1.jpg'); }
#guessView::before { background-image: url('spidey2.jpg'); }
#tttView::before   { background-image: url('spidey3.jpg'); }
#rpsView::before   { background-image: url('spidey4.jpg'); }
#dotsView::before  { background-image: url('spidey5.jpg'); }
#aboutView::before { background-image: url('spidey6.jpg'); }

.hidden {
  display: none !important;
}

/* Card container shared by hub & games */
.hub-container,
.game-shell {
  position: relative;
  z-index: 1;
  background: var(--panel);
  border: 1px solid rgba(255,255,255,0.18);
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  backdrop-filter: blur(6px);
  padding: 26px;
  width: min(960px, 92vw);
  text-align: center;
}
.game-shell {
  width: min(620px, 92vw);
}

/* HUB layout */
.hub-title {
  font-size: 2.4rem;
  color: var(--gold);
  margin-bottom: 8px;
  text-shadow: 0 2px 6px rgba(0,0,0,0.5);
}
.hub-sub {
  color: var(--muted);
  margin-bottom: 20px;
}
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px,1fr));
  gap: 20px;
}
.game-card {
  background: var(--card);
  padding: 18px;
  border-radius: 12px;
  text-align: left;
  border: 1px solid rgba(255,255,255,0.16);
  transition: transform 0.18s ease, background 0.2s ease;
}
.game-card:hover {
  transform: translateY(-4px);
  background: rgba(255,255,255,0.18);
}
.game-card h3 {
  margin-top: 0;
}
.game-card p {
  color: var(--muted);
  font-size: 0.95rem;
}
.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.footer-note {
  margin-top: 20px;
  color: var(--muted);
  font-size: 0.9rem;
}

/* Buttons */
.btn {
  background: var(--accent);
  color: #fff;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 700;
  transition: background 0.17s ease, transform 0.12s ease;
}
.btn:hover {
  background: var(--accent-dark);
  transform: translateY(-1px);
}
.btn.secondary {
  background: #565a6a;
}
.btn.secondary:hover {
  background: #3d4150;
}
.btn.ghost {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.35);
  color: var(--text);
}
.btn.ghost:hover {
  border-color: #fff;
}
.btn-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin: 12px 0;
  flex-wrap: wrap;
}

/* Titles & text */
.game-title {
  color: var(--gold);
  margin-bottom: 10px;
}
.game-subtle {
  color: var(--muted);
  margin-bottom: 10px;
}
.highlight {
  color: var(--accent);
  font-weight: 800;
}

/* GUESS THE NUMBER */
.guess-input {
  width: 80%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  margin: 6px 0 8px;
  font-size: 1rem;
}
.guess-feedback {
  font-weight: 800;
  margin: 8px 0;
}
.guess-prev {
  color: var(--gold);
}

/* Intro overlay */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.85);
  display: grid;
  place-items: center;
  z-index: 10;
}
.intro-screen {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 28px 22px;
  border-radius: 14px;
  text-align: center;
  width: min(520px, 92vw);
}
.intro-screen h1 {
  margin: 0 0 8px;
  color: var(--gold);
}

/* TIC TAC TOE */
.ttt-panel {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 10px;
  margin-bottom: 10px;
}
.pill {
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(255,255,255,0.16);
  border-radius: 999px;
  padding: 6px 10px;
  font-weight: 700;
}
.pill.warn {
  color: var(--warn);
}
.ttt-board {
  display: grid;
  grid-template-columns: repeat(3,120px);
  gap: 12px;
  justify-content: center;
  margin: 10px auto 8px;
}
.ttt-cell {
  width: 120px;
  height: 120px;
  background: rgba(15,21,48,0.85);
  border: 2px solid #2b356a;
  border-radius: 12px;
  display: grid;
  place-items: center;
  font-size: 2.6rem;
  font-weight: 900;
  color: #eaf0ff;
  cursor: pointer;
  text-shadow: 0 2px 6px rgba(0,0,0,0.4);
  transition: background 0.2s ease, transform 0.06s ease, border-color 0.2s ease;
}
.ttt-cell:hover {
  background: #141d43;
  border-color: #3a4aa3;
  transform: translateY(-1px);
}
.ttt-cell.win {
  background: rgba(31,211,106,0.25);
  border-color: var(--win);
  box-shadow: 0 0 14px rgba(31,211,106,0.6), inset 0 0 10px rgba(31,211,106,0.3);
}
.ttt-status {
  margin: 8px 0 4px;
  font-weight: 800;
}

/* ROCK PAPER SCISSORS */
.rps-mode {
  margin-bottom: 12px;
}
.rps-buttons {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 18px 0;
}
.rps-btn {
  font-size: 4rem;
  background: rgba(255,255,255,0.08);
  border: 2px solid #444;
  border-radius: 16px;
  padding: 20px 28px;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease;
}
.rps-btn:hover {
  background: rgba(255,255,255,0.18);
  transform: scale(1.15);
}
.rps-result {
  font-size: 1.2rem;
  font-weight: 800;
  margin: 10px 0;
}
.rps-score {
  margin-top: 6px;
  color: var(--muted);
}

/* DOTS & BOXES */
.dots-controls {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 12px;
  flex-wrap: wrap;
}
.dots-controls label {
  color: var(--text);
  font-weight: 700;
}
.dots-board {
  display: grid;
  justify-content: center;
  margin: 18px auto 10px;
  gap: 0;
  grid-auto-rows: 32px;
  grid-template-columns: repeat(calc(var(--dots-size)*2+1), 32px);
}
.dot {
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 50%;
  margin: auto;
}
.h-line, .v-line {
  background: transparent;
  cursor: pointer;
  transition: background 0.2s ease;
}
.h-line, .v-line {
  transform-origin: top left;
  transition: transform 0.3s ease;
}
.h-line.claime­d {
  transform: scaleX(1);
}
.v-line.claime­d {
  transform: scaleY(1);
}
.h-line {
  height: 6px;
  width: 100%;
  margin: 0 auto;
}
.v-line {
  width: 6px;
  height: 100%;
  margin: auto 0;
}

.h-line:hover, .v-line:hover {
  background: rgba(255,255,255,0.2);
}
.box {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1rem;
  background: rgba(255,255,255,0.05);
  margin: auto;
}
.box {
  transition: background 0.2s, transform 0.2s;
}
.box.claimed {
  background: rgba(255,255,255,0.15);
  transform: scale(1.1);
}

.dots-status {
  margin: 8px 0 2px;
  font-weight: 800;
}
.dots-score {
  margin: 2px 0 8px;
  color: var(--muted);
}
.rules {
  margin: 12px auto;
  max-width: 520px;
  text-align: left;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 10px;
  padding: 10px 14px;
}
.rules summary {
  font-weight: bold;
  cursor: pointer;
  color: var(--gold);
}
.rules ul {
  margin-top: 8px;
  padding-left: 18px;
}
.rules li {
  margin-bottom: 6px;
  color: var(--muted);
}

/* ABOUT view list */
ul {
  line-height: 1.6;
  color: var(--muted);
}
ul li b {
  color: var(--gold);
}

/* Responsive tweaks */
@media (max-width: 480px) {
  .ttt-board {
    grid-template-columns: repeat(3,90px);
    gap: 10px;
  }
  .ttt-cell {
    width: 90px;
    height: 90px;
    font-size: 2rem;
  }
  .rps-btn {
    font-size: 3rem;
    padding: 16px 20px;
  }
  .dots-board {
    grid-auto-rows: 36px;
  }
}
/* Coin Toss (spidey7) */
#tossView::before {
  background-image: url('spidey8.jpg');
}

/* Future Game or View (spidey8) */
#newGameView::before {
  background-image: url('spidey8.jpg');
}
