//* GLOBAL DOM ELEMENTS
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");
const startBtnNode = document.querySelector("#start-btn");
const gameBoxNode = document.querySelector("#game-box");

//* GLOBAL GAME VARIABLES
let playerObj = null;
let enemiesArr = [];
let mainIntervalId = null;
let enemyIntervalId = null;

//* GLOBAL GAME FUNCTIONS
function gameStart() {
    if (mainIntervalId !== null) return;

    startScreenNode.style.display = "none";
    gameScreenNode.style.display = "flex";

    addPlayer();
    addEnemy();

    mainIntervalId = setInterval(gameLoop, 1000 / 60);
    enemyIntervalId = setInterval(addEnemy, 1200);
}

function gameLoop() {
    enemiesArr.forEach((enemy) => enemy.automaticMovement());
    checkEnemyDespawn();
    checkCollisionPlayerEnemy();
}

function addPlayer() {
    playerObj = new Player();
}

function addEnemy() {
    const gameWidth = gameBoxNode.clientWidth;
    const minBarrierWidth = 20;
    const maxGapWidth = gameWidth - minBarrierWidth * 2;
    const gapWidth = Math.min(Math.floor(Math.random() * 41) + 90, maxGapWidth);
    const maxGapX = gameWidth - minBarrierWidth - gapWidth;
    const gapX = minBarrierWidth + Math.floor(Math.random() * (maxGapX - minBarrierWidth + 1));

    enemiesArr.push(new Gate(gapX, gapWidth));
}

function checkEnemyDespawn() {
    enemiesArr = enemiesArr.filter((enemy) => {
        if (enemy.y >= gameBoxNode.clientHeight) {
            enemy.remove();
            return false;
        }

        return true;
    });
}

function checkCollision(element1, element2) {
    return (
        element1.x < element2.x + element2.width &&
        element1.x + element1.width > element2.x &&
        element1.y < element2.y + element2.height &&
        element1.y + element1.height > element2.y
    );
}

function checkCollisionPlayerEnemy() {
    if (enemiesArr.some((gate) => gate.bars.some((bar) => checkCollision(playerObj, bar)))) {
        gameOver();
    }
}

function gameOver() {
    clearInterval(mainIntervalId);
    clearInterval(enemyIntervalId);
    mainIntervalId = null;
    enemyIntervalId = null;
    playerObj = null;
    gameScreenNode.style.display = "none";
    gameOverScreenNode.style.display = "flex";
}

//* EVENT LISTENERS
startBtnNode.addEventListener("click", gameStart);

window.addEventListener("keydown", (event) => {
    if (!playerObj) return;

    if (event.code === "ArrowLeft") {
        event.preventDefault();
        playerObj.moveLeft();
    } else if (event.code === "ArrowRight") {
        event.preventDefault();
        playerObj.moveRight();
    }
});
