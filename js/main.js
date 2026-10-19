//* GLOBAL DOM ELEMENTS
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");
const startBtnNode = document.querySelector("#start-btn");
const restartBtnNode = document.querySelector("#restart-btn");
const gameBoxNode = document.querySelector("#game-box");
const GAME_EDGE_MARGIN = 80;
const GAME_FLOOR_HEIGHT_RATIO = 0.82;

//* GLOBAL GAME VARIABLES
let playerObj = null;
let enemiesArr = [];
let mainIntervalId = null;
let enemyIntervalId = null;
const pressedKeys = new Set();
let previousFrameTime = 0;

//* GLOBAL GAME FUNCTIONS
function gameStart() {
    if (mainIntervalId !== null) return;

    startScreenNode.style.display = "none";
    gameScreenNode.style.display = "flex";

    addPlayer();
    addEnemy();

    pressedKeys.clear();
    previousFrameTime = performance.now();

    //TIME CHANGES

    mainIntervalId = setInterval(gameLoop, 1000 / 60);
    enemyIntervalId = setInterval(addEnemy, 1500);
}

function gameLoop() {
    const currentTime = performance.now();
    const deltaTime = Math.min((currentTime - previousFrameTime) / 1000, 0.05);
    previousFrameTime = currentTime;
    const movementDirection =
        Number(pressedKeys.has("ArrowRight")) - Number(pressedKeys.has("ArrowLeft"));

    if (movementDirection !== 0) {
        playerObj.move(movementDirection, deltaTime);
    }

    enemiesArr.forEach((enemy) => enemy.automaticMovement());
    checkEnemyDespawn();
    checkCollisionPlayerEnemy();
}

function addPlayer() {
    playerObj = new Player();
}

function addEnemy() {
    const gameWidth = gameBoxNode.clientWidth;
    const edgeMargin = GAME_EDGE_MARGIN;
    const gapWidth = 55;
    const minBarrierLength = 30;
    const availableBarrierWidth = gameWidth - edgeMargin * 2 - gapWidth;
    const maxShortBarrierLength = Math.floor(availableBarrierWidth / 2) - 10;
    const shortBarrierLength = minBarrierLength + Math.floor(
        Math.random() * (maxShortBarrierLength - minBarrierLength + 1)
    );
    const longBarrierLength = availableBarrierWidth - shortBarrierLength;
    const leftBarrierLength = Math.random() < 0.5
        ? shortBarrierLength
        : longBarrierLength;
    const gapX = edgeMargin + leftBarrierLength;
    enemiesArr.push(new Gate(gapX, gapWidth, edgeMargin));
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
    const playerHitboxInset = 4;
    const playerHitbox = {
        x: playerObj.x + playerHitboxInset,
        y: playerObj.y + playerHitboxInset,
        width: playerObj.width - playerHitboxInset * 2,
        height: playerObj.height - playerHitboxInset * 2
    };

    const hitEnemy = enemiesArr.some((gate) =>
        gate.bars.some((bar) => checkCollision(playerHitbox, bar))
    );
    const floorY = gameBoxNode.clientHeight * GAME_FLOOR_HEIGHT_RATIO;
    const hitFloor = playerObj.y + playerObj.height >= floorY;

    if (hitEnemy || hitFloor) {
        gameOver();
    }
}

function restartGame() {
    enemiesArr.forEach((enemy) => enemy.remove());
    enemiesArr = [];
    gameOverScreenNode.style.display = "none";
    gameStart();
}

function gameOver() {
    clearInterval(mainIntervalId);
    clearInterval(enemyIntervalId);
    mainIntervalId = null;
    enemyIntervalId = null;
    pressedKeys.clear();
    playerObj.node.remove();
    playerObj = null;
    gameScreenNode.style.display = "none";
    gameOverScreenNode.style.display = "flex";
}

//* EVENT LISTENERS
startBtnNode.addEventListener("click", gameStart);
restartBtnNode.addEventListener("click", restartGame);

window.addEventListener("keydown", (event) => {
    if (!playerObj) return;

    if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
        event.preventDefault();
        pressedKeys.add(event.code);
    }
});

window.addEventListener("keyup", (event) => {
    pressedKeys.delete(event.code);
});

window.addEventListener("blur", () => {
    pressedKeys.clear();
});
