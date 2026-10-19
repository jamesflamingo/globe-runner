//* GLOBAL DOM ELEMENTS
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");
const startBtnNode = document.querySelector("#start-btn");
const optionsBtnNode = document.querySelector("#options-btn");
const restartBtnNode = document.querySelector("#restart-btn");
const gameBoxNode = document.querySelector("#game-box");
const scoreNode = document.querySelector("#score");
const finalScoreNode = document.querySelector("#final-score");
const GAME_BACKGROUND_WIDTH = 971;
const GAME_BACKGROUND_HEIGHT = 1619;
const GAME_BUILDING_EDGE_X = 200;
const GAME_IMAGE_WIDTH_RATIO = 0.8;
const GAME_IMAGE_WIDTH_OFFSET = 32;
const GAME_REFERENCE_WIDTH = 390;
const GAME_FLOOR_HEIGHT_RATIO = 0.82;
let gameStartedAt = 0;
let finalScore = 0;

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

    gameStartedAt = performance.now();
    finalScore = 0;
    scoreNode.textContent = "0.0";
    pressedKeys.clear();
    previousFrameTime = performance.now();

    mainIntervalId = setInterval(gameLoop, 1000 / 60);
    enemyIntervalId = setInterval(addEnemy, 1500);
}

function gameLoop() {
    const currentTime = performance.now();
    finalScore = (currentTime - gameStartedAt) / 1000;
    scoreNode.textContent = finalScore.toFixed(1);
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
    const edgeMargin = getGameEdgeMargin();
    const gapWidth = getGameGapWidth();
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

function getGameEdgeMargin() {
    const imageWidth = Math.max(
        0,
        gameBoxNode.clientWidth * GAME_IMAGE_WIDTH_RATIO - GAME_IMAGE_WIDTH_OFFSET
    );
    const imageOffsetX = (gameBoxNode.clientWidth - imageWidth) / 2;
    const buildingEdge = GAME_BUILDING_EDGE_X / GAME_BACKGROUND_WIDTH * imageWidth;

    return imageOffsetX + buildingEdge;
}

function getGameGapWidth() {
    return Math.max(45, Math.min(gameBoxNode.clientWidth * 0.12, 120)) * 0.88;
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
    finalScore = (performance.now() - gameStartedAt) / 1000;
    scoreNode.textContent = finalScore.toFixed(1);
    finalScoreNode.textContent = finalScore.toFixed(1);
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
optionsBtnNode.addEventListener("click", () => {
    window.location.href = "./options.html";
});
restartBtnNode.addEventListener("click", restartGame);

window.addEventListener("resize", () => {
    if (mainIntervalId === null) return;

    const edgeMargin = getGameEdgeMargin();
    const gapWidth = getGameGapWidth();

    enemiesArr.forEach((enemy) => enemy.resize(gapWidth, edgeMargin));

    if (playerObj) {
        const maxX = gameBoxNode.clientWidth - edgeMargin - playerObj.width;
        playerObj.x = Math.max(edgeMargin, Math.min(maxX, playerObj.x));
        playerObj.y = gameBoxNode.clientHeight * GAME_FLOOR_HEIGHT_RATIO - playerObj.height - 42;
        playerObj.node.style.left = `${playerObj.x}px`;
        playerObj.node.style.top = `${playerObj.y}px`;
    }
});

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
