//* GLOBAL DOM ELEMENTS
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");
const startBtnNode = document.querySelector("#start-btn");
const optionsBtnNode = document.querySelector("#options-btn");
const restartBtnNode = document.querySelector("#restart-btn");
const gameBoxNode = document.querySelector("#game-box");
const gameAreaNode = document.querySelector("#game-area");
const timerNode = document.querySelector("#timer");
const scoreNode = document.querySelector("#score");
const finalTimeNode = document.querySelector("#final-time");
const finalScoreNode = document.querySelector("#final-score");
const GAME_REFERENCE_WIDTH = 390;
const getGameScale = () => gameAreaNode.clientWidth / GAME_REFERENCE_WIDTH;
const ENEMY_IMAGE_ASPECT_RATIO = 2172 / 724;
const LEFT_ENEMY_OFFSET = 2;
const ENEMY_COLLISION_TOP_RATIO = 0.22;
const ENEMY_COLLISION_HEIGHT_RATIO = 0.42;
const ENEMY_GAP_EDGE_COLLISION_INSET = 12;
let gameStartedAt = 0;
let elapsedTime = 0;
let gameScore = 0;

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
    addEnemy(true);

    gameStartedAt = performance.now();
    elapsedTime = 0;
    gameScore = 0;
    timerNode.textContent = "0.0";
    scoreNode.textContent = String(gameScore);
    pressedKeys.clear();
    previousFrameTime = performance.now();

    mainIntervalId = setInterval(gameLoop, 1000 / 60);
    enemyIntervalId = setInterval(addEnemy, 2700);
}

function gameLoop() {
    const currentTime = performance.now();
    elapsedTime = (currentTime - gameStartedAt) / 1000;
    timerNode.textContent = elapsedTime.toFixed(1);
    const deltaTime = Math.min((currentTime - previousFrameTime) / 1000, 0.05);
    previousFrameTime = currentTime;
    const movementDirection =
        Number(pressedKeys.has("ArrowRight")) - Number(pressedKeys.has("ArrowLeft"));
    const verticalDirection =
        Number(pressedKeys.has("ArrowDown")) - Number(pressedKeys.has("ArrowUp"));

    if (movementDirection !== 0) {
        playerObj.move(movementDirection, deltaTime);
    }

    playerObj.update(deltaTime, verticalDirection);
    enemiesArr.forEach((enemy) => enemy.automaticMovement());
    checkEnemyDespawn();
    checkCollisionPlayerEnemy();
}

function addPlayer() {
    playerObj = new Player();
}

function addEnemy(centerGap = false) {
    const gameWidth = gameAreaNode.clientWidth;
    const scale = getGameScale();
    const gapWidth = getGameGapWidth();
    const minBarrierLength = 30 * scale;
    const availableBarrierWidth = gameWidth - gapWidth;
    const maxShortBarrierLength = Math.floor(availableBarrierWidth / 2) - 10 * scale;
    const shortBarrierLength = minBarrierLength + Math.floor(
        Math.random() * (maxShortBarrierLength - minBarrierLength + 1)
    );
    const longBarrierLength = availableBarrierWidth - shortBarrierLength;
    const leftBarrierLength = Math.random() < 0.5
        ? shortBarrierLength
        : longBarrierLength;
    const gapX = centerGap
        ? (gameWidth - gapWidth) / 2
        : leftBarrierLength;
    enemiesArr.push(new Gate(gapX, gapWidth));
}

function getGameGapWidth() {
    const gameWidth = gameAreaNode.clientWidth;
    const scale = getGameScale();
    const maximumGapWidth = Math.max(0, gameWidth - 80 * scale);
    const responsiveGapWidth = Math.max(90 * scale, Math.min(gameWidth * 0.42, 150 * scale));

    return Math.min(maximumGapWidth, responsiveGapWidth);
}

function checkEnemyDespawn() {
    enemiesArr = enemiesArr.filter((enemy) => {
        if (enemy.y >= gameAreaNode.clientHeight) {
            enemy.remove();
            return false;
        }

        return true;
    });
}

function checkCircleCollision(circle, rectangle) {
    const closestX = Math.max(
        rectangle.x,
        Math.min(circle.x, rectangle.x + rectangle.width)
    );
    const closestY = Math.max(
        rectangle.y,
        Math.min(circle.y, rectangle.y + rectangle.height)
    );
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;

    return (
        distanceX * distanceX + distanceY * distanceY <=
        circle.radius * circle.radius
    );
}

function checkCollisionPlayerEnemy() {
    const playerHitboxInset = 6 * getGameScale();
    const playerHitbox = {
        x: playerObj.x + playerObj.width / 2,
        y: playerObj.y + playerObj.height / 2,
        radius: Math.max(
            0,
            Math.min(playerObj.width, playerObj.height) / 2 - playerHitboxInset
        )
    };

    const hitEnemy = enemiesArr.some((gate) =>
        gate.bars.some((bar) => {
            const edgeInset = Math.min(
                ENEMY_GAP_EDGE_COLLISION_INSET * getGameScale(),
                bar.width / 2
            );
            const collisionBar = {
                ...bar,
                x: bar.x + (bar.gapFacingSide === "left" ? edgeInset : 0),
                width: Math.max(0, bar.width - edgeInset),
                y: bar.y + bar.height * ENEMY_COLLISION_TOP_RATIO,
                height: bar.height * ENEMY_COLLISION_HEIGHT_RATIO
            };

            return checkCircleCollision(playerHitbox, collisionBar);
        })
    );
    if (hitEnemy) {
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
    elapsedTime = (performance.now() - gameStartedAt) / 1000;
    timerNode.textContent = elapsedTime.toFixed(1);
    finalTimeNode.textContent = elapsedTime.toFixed(1);
    finalScoreNode.textContent = String(gameScore);
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

    const gapWidth = getGameGapWidth();
    enemiesArr.forEach((enemy) => enemy.resize(gapWidth));

    if (playerObj) {
        playerObj.resize();
    }
});

window.addEventListener("keydown", (event) => {
    if (!playerObj) return;

    if (event.code === "Space") {
        event.preventDefault();
        if (!event.repeat) {
            playerObj.jump();
        }
        return;
    }

    if (
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight" ||
        event.code === "ArrowUp" ||
        event.code === "ArrowDown"
    ) {
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
