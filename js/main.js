//* GLOBAL DOM ELEMENTS
const startScreenNode = document.querySelector("#start-screen");
const gameScreenNode = document.querySelector("#game-screen");
const gameOverScreenNode = document.querySelector("#game-over-screen");
const startBtnNode = document.querySelector("#start-btn");
const optionsBtnNode = document.querySelector("#options-btn");
const restartBtnNode = document.querySelector("#restart-btn");
const gameAreaNode = document.querySelector("#game-area");
const timerNode = document.querySelector("#timer");
const scoreNode = document.querySelector("#score");
const finalTimeNode = document.querySelector("#final-time");
const finalScoreNode = document.querySelector("#final-score");
const GAME_REFERENCE_WIDTH = 390;
const getGameScale = () => gameAreaNode.clientWidth / GAME_REFERENCE_WIDTH;
const ENEMY_THICKNESS = 70;
const ENEMY_SPAWN_INTERVAL_MS = 2520;
const PICKUP_POINTS = 10;
const SWEEPER_EVERY = 10;
const SWEEPER_WIDTH_RATIO = 0.4;
const SWEEPER_SPEED_RATIO = 0.012;
const DIFFICULTY_STEP = 1.1;
const DIFFICULTY_EVERY_SECONDS = 60;
let difficulty = 1;
const FLOOR_RISE_STEP = 0.05;
const FLOOR_RISE_EVERY_SECONDS = 30;
const FLOOR_RISE_MAX = 0.7;
let floorRise = 0;
const MUSIC_START_SECONDS = 7;
const music = new Audio("./audio/redlining.mp3");
music.volume = 0.5;
music.addEventListener("loadedmetadata", () => {
    music.currentTime = MUSIC_START_SECONDS;
}, { once: true });

music.addEventListener("ended", () => {
    music.currentTime = MUSIC_START_SECONDS;
    music.play();
});

// browsers block autoplay, so if it fails the music starts on the first click or key press
music.play().catch(() => {
    const unlock = () => {
        music.play();
        document.removeEventListener("click", unlock);
        document.removeEventListener("keydown", unlock);
    };
    document.addEventListener("click", unlock);
    document.addEventListener("keydown", unlock);
});
const ENEMY_COLLISION_TOP_RATIO = 0.22;
const ENEMY_COLLISION_HEIGHT_RATIO = 0.42;
const ENEMY_GAP_EDGE_COLLISION_INSET = 12;
let gameStartedAt = 0;
let elapsedTime = 0;
let gameScore = 0;

//* GLOBAL GAME VARIABLES
let playerObj = null;
let enemiesArr = [];
let enemyRowCount = 0;
let mainIntervalId = null;
let enemyIntervalId = null;
let pickupTimeoutId = null;
let pickupIntervalId = null;
let pickupsArr = [];
let lasersArr = [];
let laserTimeoutId = null;
let laserIntervalId = null;
const pressedKeys = new Set();
let previousFrameTime = 0;

//* GLOBAL GAME FUNCTIONS
function gameStart() {
    if (mainIntervalId !== null) return;

    startScreenNode.style.display = "none";
    gameScreenNode.style.display = "flex";

    music.currentTime = MUSIC_START_SECONDS;
    music.play();

    addPlayer();
    enemyRowCount = 0;
    addEnemy(true);

    gameStartedAt = performance.now();
    elapsedTime = 0;
    difficulty = 1;
    setFloorRise(0);
    gameScore = 0;
    timerNode.textContent = "0.0";
    scoreNode.textContent = String(gameScore);
    pressedKeys.clear();
    previousFrameTime = performance.now();

    mainIntervalId = setInterval(gameLoop, 1000 / 60);
    enemyIntervalId = setTimeout(spawnEnemyRow, ENEMY_SPAWN_INTERVAL_MS);
    // Offset by half a row so pickups fall between enemy rows
    pickupTimeoutId = setTimeout(spawnPickup, ENEMY_SPAWN_INTERVAL_MS / 2);
    laserTimeoutId = setTimeout(() => {
        addLaser();
        laserIntervalId = setInterval(addLaser, LASER_SPAWN_INTERVAL_MS);
    }, LASER_FIRST_SPAWN_MS);
}

// timeouts instead of intervals so the delay shrinks as the speed rises, keeping the rows evenly spaced
function spawnEnemyRow() {
    addEnemy();
    enemyIntervalId = setTimeout(spawnEnemyRow, ENEMY_SPAWN_INTERVAL_MS / difficulty);
}

function spawnPickup() {
    addPickup();
    pickupTimeoutId = setTimeout(spawnPickup, ENEMY_SPAWN_INTERVAL_MS / difficulty);
}

function setFloorRise(value) {
    floorRise = value;
    gameAreaNode.style.setProperty("--floor-rise", `${value * 100}%`);
}

function gameLoop() {
    const currentTime = performance.now();
    elapsedTime = (currentTime - gameStartedAt) / 1000;
    difficulty = DIFFICULTY_STEP ** Math.floor(elapsedTime / DIFFICULTY_EVERY_SECONDS);
    const targetRise = Math.min(
        FLOOR_RISE_MAX,
        Math.floor(elapsedTime / FLOOR_RISE_EVERY_SECONDS) * FLOOR_RISE_STEP
    );
    // eases toward the target so the laser glides up instead of jumping
    timerNode.textContent = elapsedTime.toFixed(1);
    const deltaTime = Math.min((currentTime - previousFrameTime) / 1000, 0.05);
    previousFrameTime = currentTime;
    setFloorRise(floorRise + (targetRise - floorRise) * Math.min(1, deltaTime * 3));
    const movementDirection =
        Number(pressedKeys.has("ArrowRight")) - Number(pressedKeys.has("ArrowLeft"));

    if (movementDirection !== 0) {
        playerObj.move(movementDirection, deltaTime);
    }

    if (playerObj.update(deltaTime)) {
        gameOver();
        return;
    }
    enemiesArr.forEach((enemy) => enemy.automaticMovement());
    pickupsArr.forEach((pickup) => pickup.automaticMovement());
    checkEnemyDespawn();
    lasersArr.forEach((laser) => laser.automaticMovement());
    if (checkLasers()) return;
    checkPickups();
    checkCollisionPlayerEnemy();
}

function addPlayer() {
    playerObj = new Player();
}

function addEnemy(centerGap = false) {
    enemyRowCount++;
    if (enemyRowCount % SWEEPER_EVERY === 0) {
        enemiesArr.push(new Sweeper());
        return;
    }

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

function addPickup() {
    pickupsArr.push(new Pickup());
}

function addLaser() {
    lasersArr.push(new Laser());
}

function checkLasers() {
    const playerHitbox = {
        x: playerObj.x + playerObj.width / 2,
        y: playerObj.y + playerObj.height / 2,
        radius: Math.min(playerObj.width, playerObj.height) / 2
    };

    lasersArr = lasersArr.filter((laser) => {
        if (laser.y >= gameAreaNode.clientHeight) {
            laser.remove();
            return false;
        }

        return true;
    });

    const hitLaser = lasersArr.some((laser) =>
        laser.active && checkCircleCollision(playerHitbox, {
            x: 0,
            y: laser.y,
            width: gameAreaNode.clientWidth,
            height: laser.height
        })
    );
    if (hitLaser) {
        gameOver();
    }
    return hitLaser;
}

function clearLasers() {
    clearTimeout(laserTimeoutId);
    clearInterval(laserIntervalId);
    laserTimeoutId = null;
    laserIntervalId = null;
    lasersArr.forEach((laser) => laser.remove());
    lasersArr = [];
}

function checkPickups() {
    const player = {
        x: playerObj.x + playerObj.width / 2,
        y: playerObj.y + playerObj.height / 2,
        radius: Math.min(playerObj.width, playerObj.height) / 2
    };

    pickupsArr = pickupsArr.filter((pickup) => {
        const dx = player.x - (pickup.x + pickup.size / 2);
        const dy = player.y - (pickup.y + pickup.size / 2);
        const reach = player.radius + pickup.size / 2;

        if (dx * dx + dy * dy <= reach * reach) {
            gameScore += PICKUP_POINTS;
            scoreNode.textContent = String(gameScore);
            pickup.remove();
            return false;
        }

        if (pickup.y >= gameAreaNode.clientHeight) {
            pickup.remove();
            return false;
        }

        return true;
    });
}

function clearPickups() {
    clearTimeout(pickupTimeoutId);
    clearInterval(pickupIntervalId);
    pickupTimeoutId = null;
    pickupIntervalId = null;
    pickupsArr.forEach((pickup) => pickup.remove());
    pickupsArr = [];
}

function getGameGapWidth() {
    const gameWidth = gameAreaNode.clientWidth;
    const scale = getGameScale();
    const maximumGapWidth = Math.max(0, gameWidth - 80 * scale);
    const responsiveGapWidth = Math.max(30 * scale, Math.min(gameWidth * 0.115, 40 * scale));

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
    const playerHitboxInset = 2 * getGameScale();
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
            const edgeInset = bar.gapFacingSide === "none" ? 0 : Math.min(
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
    clearPickups();
    clearLasers();
    gameOverScreenNode.style.display = "none";
    gameStart();
}

function gameOver() {
    music.pause();
    elapsedTime = (performance.now() - gameStartedAt) / 1000;
    timerNode.textContent = elapsedTime.toFixed(1);
    finalTimeNode.textContent = elapsedTime.toFixed(1);
    finalScoreNode.textContent = String(gameScore);
    clearInterval(mainIntervalId);
    clearTimeout(enemyIntervalId);
    mainIntervalId = null;
    enemyIntervalId = null;
    clearPickups();
    clearLasers();
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
    pickupsArr.forEach((pickup) => pickup.resize());

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
