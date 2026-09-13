const game = document.getElementById("game");

const player = document.getElementById("player");
const crow = document.getElementById("crow");
const goat = document.getElementById("goat");

const scoreText = document.getElementById("score");
const finalScore = document.getElementById("finalScore");

const message = document.getElementById("message");
const gameOverScreen = document.getElementById("gameOver");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const jumpBtn = document.getElementById("jumpBtn");
const duckBtn = document.getElementById("duckBtn");

/* SOUNDS */

const jumpSound = new Audio("jump.mp3");
const duckSound = new Audio("duck.mp3");

jumpSound.volume = 0.8;
duckSound.volume = 0.8;

/* GAME VARIABLES */

let gameRunning = false;
let score = 0;

let scoreTimer;
let obstacleTimer;
let collisionTimer;

let jumping = false;
let ducking = false;

/* START GAME */

function startGame() {

  gameRunning = true;
  score = 0;

  scoreText.textContent = "0";

  message.style.display = "none";
  gameOverScreen.style.display = "none";

  player.classList.remove("jumping");
  player.classList.remove("ducking");

  crow.classList.remove("fly");
  goat.classList.remove("run");

  startScore();
  startObstacles();
  startCollisionCheck();
}

/* SCORE */

function startScore() {

  clearInterval(scoreTimer);

  scoreTimer = setInterval(() => {

    if (!gameRunning) return;

    score++;

    scoreText.textContent = score;

  }, 100);
}

/* OBSTACLES */

function startObstacles() {

  clearTimeout(obstacleTimer);

  spawnObstacle();
}

function spawnObstacle() {

  if (!gameRunning) return;

  const randomTime = Math.random() * 1200 + 700;

  obstacleTimer = setTimeout(() => {

    if (!gameRunning) return;

    const type = Math.random() < 0.5 ? "crow" : "goat";

    if (type === "crow") {

      crow.classList.remove("fly");

      void crow.offsetWidth;

      crow.classList.add("fly");

      setTimeout(() => {
        crow.classList.remove("fly");
      }, 2300);

    } else {

      goat.classList.remove("run");

      void goat.offsetWidth;

      goat.classList.add("run");

      setTimeout(() => {
        goat.classList.remove("run");
      }, 2600);
    }

    spawnObstacle();

  }, randomTime);
}

/* JUMP */

function jump() {

  if (!gameRunning) return;

  if (jumping) return;

  if (ducking) return;

  jumping = true;

  player.classList.remove("jumping");

  void player.offsetWidth;

  player.classList.add("jumping");

  try {
    jumpSound.currentTime = 0;
    jumpSound.play();
  } catch (e) {}

  setTimeout(() => {

    player.classList.remove("jumping");
    jumping = false;

  }, 650);
}

/* DUCK */

function startDuck(event) {

  if (event) {
    event.preventDefault();
  }

  if (!gameRunning) return;

  if (jumping) return;

  if (ducking) return;

  ducking = true;

  player.classList.add("ducking");

  try {
    duckSound.currentTime = 0;
    duckSound.play();
  } catch (e) {}
}

/* STOP DUCK */

function stopDuck(event) {

  if (event) {
    event.preventDefault();
  }

  ducking = false;

  player.classList.remove("ducking");
}

/* COLLISION */

function startCollisionCheck() {

  clearInterval(collisionTimer);

  collisionTimer = setInterval(() => {

    if (!gameRunning) return;

    checkCollision();

  }, 20);
}

function checkCollision() {

  const playerRect = player.getBoundingClientRect();

  /* CROW COLLISION */

  if (crow.classList.contains("fly")) {

    const crowRect = crow.getBoundingClientRect();

    if (isColliding(playerRect, crowRect)) {

      /* Ducking avoids the crow */

      if (!ducking) {
        endGame();
        return;
      }
    }
  }

  /* GOAT COLLISION */

  if (goat.classList.contains("run")) {

    const goatRect = goat.getBoundingClientRect();

    if (isColliding(playerRect, goatRect)) {

      /* Jumping avoids the goat */

      if (!jumping) {
        endGame();
        return;
      }
    }
  }
}

/* COLLISION FUNCTION */

function isColliding(a, b) {

  const padding = 12;

  return (
    a.left + padding < b.right &&
    a.right - padding > b.left &&
    a.top + padding < b.bottom &&
    a.bottom - padding > b.top
  );
}

/* GAME OVER */

function endGame() {

  if (!gameRunning) return;

  gameRunning = false;

  clearInterval(scoreTimer);
  clearInterval(collisionTimer);
  clearTimeout(obstacleTimer);

  player.classList.remove("jumping");
  player.classList.remove("ducking");

  crow.classList.remove("fly");
  goat.classList.remove("run");

  jumping = false;
  ducking = false;

  finalScore.textContent = score;

  gameOverScreen.style.display = "block";
}

/* RESTART */

function restartGame() {

  gameOverScreen.style.display = "none";

  startGame();
}

/* BUTTON CONTROLS */

jumpBtn.addEventListener("pointerdown", function(e) {
  e.preventDefault();
  jump();
});

duckBtn.addEventListener("pointerdown", function(e) {
  startDuck(e);
});

duckBtn.addEventListener("pointerup", function(e) {
  stopDuck(e);
});

duckBtn.addEventListener("pointercancel", function(e) {
  stopDuck(e);
});

duckBtn.addEventListener("pointerleave", function(e) {
  stopDuck(e);
});

/* KEYBOARD */

document.addEventListener("keydown", function(e) {

  if (e.code === "Space" || e.key === "ArrowUp") {

    e.preventDefault();

    jump();
  }

  if (e.key === "ArrowDown") {

    e.preventDefault();

    startDuck();
  }
});

document.addEventListener("keyup", function(e) {

  if (e.key === "ArrowDown") {

    e.preventDefault();

    stopDuck();
  }
});

/* START / RESTART */

startBtn.addEventListener("click", startGame);

restartBtn.addEventListener("click", restartGame);

/* PREVENT MOBILE PAGE SCROLL WHILE PLAYING */

document.addEventListener("touchmove", function(e) {

  if (gameRunning) {
    e.preventDefault();
  }

}, { passive: false });
