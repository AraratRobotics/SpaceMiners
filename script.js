// Game variables
var canvas = document.getElementById("gameCanvas");
var context = canvas.getContext("2d");
canvas.height = 600;
canvas.width = 800;
var player = { x: canvas.width / 2, y: canvas.height - 20, width: 40, height: 20 };
var invaders = []; // Array to store the invaders
var bullets = []; // Array to store the bullets
var rightPressed = false;
var leftPressed = false;
var spacePressed = false;
var gameOver = false;

// Create the invaders
function createInvaders() {
  for (var i = 0; i < 10; i++) {
    invaders.push({ x: i * 50 + 20, y: 30, width: 30, height: 30 });
  }
}

// Event listeners for player movement and bullet firing
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(event) {
  if (event.keyCode === 39) {
    rightPressed = true;
  } else if (event.keyCode === 37) {
    leftPressed = true;
  } else if (event.keyCode === 32) {
    spacePressed = true;
    fireBullet();
  }
}

function keyUpHandler(event) {
  if (event.keyCode === 39) {
    rightPressed = false;
  } else if (event.keyCode === 37) {
    leftPressed = false;
  } else if (event.keyCode === 32) {
    spacePressed = false;
  }
}

// Draw the player
function drawPlayer() {
  var playerImg = new Image();
  playerImg.src = "player.png"; // Replace with the path to your custom player image
  context.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

// Draw the invaders
function drawInvaders() {
  for (var i = 0; i < invaders.length; i++) {
    var invaderImg = new Image();
    invaderImg.src = "invader.png"; // Replace with the path to your custom invader image
    context.drawImage(invaderImg, invaders[i].x, invaders[i].y, invaders[i].width, invaders[i].height);
  }
}

// Draw the bullets
function drawBullets() {
  for (var i = 0; i < bullets.length; i++) {
    context.beginPath();
    context.rect(bullets[i].x, bullets[i].y, 2, 10);
    context.fillStyle = "#FFFFFF";
    context.fill();
    context.closePath();
  }
}

// Update game state
function update() {
  if (gameOver) {
    return;
  }

  // Move the player
  if (rightPressed && player.x < canvas.width - player.width) {
    player.x += 5;
  } else if (leftPressed && player.x > 0) {
    player.x -= 5;
  }

  // Move the bullets
  for (var i = 0; i < bullets.length; i++) {
    bullets[i].y -= 5;
    // Check collision with invaders
    for (var j = 0; j < invaders.length; j++) {
      if (
        bullets[i].x > invaders[j].x &&
        bullets[i].x < invaders[j].x + invaders[j].width &&
        bullets[i].y > invaders[j].y &&
        bullets[i].y < invaders[j].y + invaders[j].height
      ) {
        // Remove the bullet and the invader
        bullets.splice(i, 1);
        invaders.splice(j, 1);
        break;
      }
    }
  }

  // Move the invaders
  for (var i = 0; i < invaders.length; i++) {
    invaders[i].y += 1; // Adjust the speed at which invaders approach the bottom

    // Check if any invader reaches the bottom
    if (invaders[i].y + invaders[i].height > canvas.height) {
      endGame();
      return;
    }
  }

  // Respawn invaders if all are dead
  if (invaders.length === 0) {
    respawnInvaders();
  }
}

// Respawn invaders at random positions
function respawnInvaders() {
  var maxInvaders = 10; // Adjust the maximum number of invaders as needed
  for (var i = 0; i < maxInvaders; i++) {
    var invader = {
      x: Math.random() * (canvas.width - 30), // Adjust the invader's width (30) as needed
      y: Math.random() * -200, // Adjust the initial y position off the canvas as needed
      width: 30, // Adjust the invader's width as needed
      height: 30, // Adjust the invader's height as needed
    };
    invaders.push(invader);
  }
}

// Fire a bullet
function fireBullet() {
  var bullet = { x: player.x + player.width / 2, y: player.y, width: 2, height: 10 };
  bullets.push(bullet);
}

// End the game
function endGame() {
  gameOver = true;
  // Display "GAME OVER" message and restart button
  var gameOverMsg = document.createElement("div");
  gameOverMsg.textContent = "GAME OVER";
  gameOverMsg.className = "game-over-msg";
  var restartBtn = document.createElement("button");
  restartBtn.textContent = "Restart";
  restartBtn.className = "restart-btn";
  restartBtn.addEventListener("click", restartGame);
  var container = document.querySelector(".container");
  container.appendChild(gameOverMsg);
  container.appendChild(restartBtn);
}

// Restart the game
function restartGame() {
  invaders = [];
  bullets = [];
  gameOver = false;
  var gameOverMsg = document.querySelector(".game-over-msg");
  var restartBtn = document.querySelector(".restart-btn");
  var container = document.querySelector(".container");
  container.removeChild(gameOverMsg);
  container.removeChild(restartBtn);
  startGame();
}

// Render the game
function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawInvaders();
  drawBullets();
}

// Game loop
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Start the game
function startGame() {
  createInvaders();
  gameLoop();
}

startGame();
