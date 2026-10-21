// ---------- HTML ELEMENTS ----------
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

// ---------- GAME VALUES ----------
const GAME_REFERENCE_WIDTH = 390;
const ENEMY_THICKNESS = 70;
const ENEMY_SPAWN_INTERVAL_MS = 2520;
const PICKUP_POINTS = 10;

// every 10 rows a bar appears that moves side to side
const SWEEPER_EVERY = 10;
const SWEEPER_WIDTH_RATIO = 0.4;
const SWEEPER_SPEED_RATIO = 0.012;

// every 60 seconds everything gets 10% faster
const DIFFICULTY_STEP = 1.1;
const DIFFICULTY_EVERY_SECONDS = 60;

// the red line at the bottom rises 5% every 30 seconds
const FLOOR_RISE_STEP = 0.05;
const FLOOR_RISE_EVERY_SECONDS = 30;
const FLOOR_RISE_MAX = 0.7;

// collision area of the bars
const ENEMY_COLLISION_TOP_RATIO = 0.22;
const ENEMY_COLLISION_HEIGHT_RATIO = 0.42;
const ENEMY_GAP_EDGE_COLLISION_INSET = 12;

// ---------- SOUNDS ----------
const MUSIC_START_SECONDS = 3;
const MUSIC_DELAY_MS = 2000;
const START_SOUND_SKIP_SECONDS = 1;
const GAME_OVER_SOUND_SECONDS = 5;

const music = new Audio("./audio/redlining.mp3");
music.volume = 0.5;
const startSound = new Audio("./audio/error.mp3");
const gameOverSound = new Audio("./audio/glitch.mp3");
const buttonSound = new Audio("./audio/button.mp3");

// the music starts at second 3, and so does every repeat
music.addEventListener("loadedmetadata", function () {
    music.currentTime = MUSIC_START_SECONDS;
}, { once: true });

music.addEventListener("ended", function () {
    music.currentTime = MUSIC_START_SECONDS;
    music.play();
});

// the game over sound is cut after 5 seconds
gameOverSound.addEventListener("timeupdate", function () {
    if (gameOverSound.currentTime >= GAME_OVER_SOUND_SECONDS) {
        gameOverSound.pause();
    }
});

// ---------- VARIABLES ----------
let playerObj = null;
let enemiesArr = [];
let pickupsArr = [];
let lasersArr = [];

let gameStartedAt = 0;
let elapsedTime = 0;
let gameScore = 0;
let difficulty = 1;
let floorRise = 0;
let enemyRowCount = 0;
let previousFrameTime = 0;

let mainIntervalId = null;
let enemyTimeoutId = null;
let pickupTimeoutId = null;
let laserTimeoutId = null;
let laserIntervalId = null;
let musicTimeoutId = null;

const pressedKeys = new Set();

// ---------- FUNCTIONS ----------
function getGameScale() {
    return gameAreaNode.clientWidth / GAME_REFERENCE_WIDTH;
}

function getGameGapWidth() {
    const gameWidth = gameAreaNode.clientWidth;
    const scale = getGameScale();
    const maxGap = Math.max(0, gameWidth - 80 * scale);
    const gap = Math.max(30 * scale, Math.min(gameWidth * 0.115, 40 * scale));

    return Math.min(maxGap, gap);
}

function gameStart() {
    if (mainIntervalId !== null) return;

    startScreenNode.style.display = "none";
    gameScreenNode.style.display = "flex";

    // the error sound plays now and the music comes in 2 seconds later
    clearTimeout(musicTimeoutId);
    musicTimeoutId = setTimeout(function () {
        music.currentTime = MUSIC_START_SECONDS;
        music.play();
    }, MUSIC_DELAY_MS);
    startSound.currentTime = START_SOUND_SKIP_SECONDS;
    startSound.play();

    playerObj = new Player();
    enemyRowCount = 0;
    addEnemy(true);

    gameStartedAt = performance.now();
    previousFrameTime = performance.now();
    elapsedTime = 0;
    difficulty = 1;
    gameScore = 0;
    setFloorRise(0);
    timerNode.textContent = "0.0";
    scoreNode.textContent = String(gameScore);
    pressedKeys.clear();

    mainIntervalId = setInterval(gameLoop, 1000 / 60);
    enemyTimeoutId = setTimeout(spawnEnemyRow, ENEMY_SPAWN_INTERVAL_MS);
    // pickups spawn at half the interval so they fall between two rows
    pickupTimeoutId = setTimeout(spawnPickup, ENEMY_SPAWN_INTERVAL_MS / 2);
    laserTimeoutId = setTimeout(function () {
        addLaser();
        laserIntervalId = setInterval(addLaser, LASER_SPAWN_INTERVAL_MS);
    }, LASER_FIRST_SPAWN_MS);
}

// setTimeout instead of setInterval so the delay shrinks when the difficulty goes up
function spawnEnemyRow() {
    addEnemy(false);
    enemyTimeoutId = setTimeout(spawnEnemyRow, ENEMY_SPAWN_INTERVAL_MS / difficulty);
}

function spawnPickup() {
    pickupsArr.push(new Pickup());
    pickupTimeoutId = setTimeout(spawnPickup, ENEMY_SPAWN_INTERVAL_MS / difficulty);
}

function addLaser() {
    lasersArr.push(new Laser());
}

function setFloorRise(value) {
    floorRise = value;
    gameAreaNode.style.setProperty("--floor-rise", value * 100 + "%");
}

function gameLoop() {
    const currentTime = performance.now();
    elapsedTime = (currentTime - gameStartedAt) / 1000;
    timerNode.textContent = elapsedTime.toFixed(1);

    const deltaTime = Math.min((currentTime - previousFrameTime) / 1000, 0.05);
    previousFrameTime = currentTime;

    difficulty = DIFFICULTY_STEP ** Math.floor(elapsedTime / DIFFICULTY_EVERY_SECONDS);

    // the red line rises slowly up to its target
    let targetRise = Math.floor(elapsedTime / FLOOR_RISE_EVERY_SECONDS) * FLOOR_RISE_STEP;
    if (targetRise > FLOOR_RISE_MAX) targetRise = FLOOR_RISE_MAX;
    setFloorRise(floorRise + (targetRise - floorRise) * Math.min(1, deltaTime * 3));

    // player movement
    let direction = 0;
    if (pressedKeys.has("ArrowRight")) direction += 1;
    if (pressedKeys.has("ArrowLeft")) direction -= 1;
    if (direction !== 0) {
        playerObj.move(direction, deltaTime);
    }

    // touching the floor (the red line at the bottom) ends the game
    if (playerObj.update(deltaTime)) {
        gameOver();
        return;
    }

    for (let i = 0; i < enemiesArr.length; i++) {
        enemiesArr[i].automaticMovement();
    }
    for (let i = 0; i < pickupsArr.length; i++) {
        pickupsArr[i].automaticMovement();
    }
    for (let i = 0; i < lasersArr.length; i++) {
        lasersArr[i].automaticMovement();
    }

    removeEnemiesOutside();
    if (checkLasers()) return;
    checkPickups();
    checkEnemies();
}

function addEnemy(centerGap) {
    enemyRowCount++;

    // every few rows the moving bar appears
    if (enemyRowCount % SWEEPER_EVERY === 0) {
        enemiesArr.push(new Sweeper());
        return;
    }

    const gameWidth = gameAreaNode.clientWidth;
    const scale = getGameScale();
    const gapWidth = getGameGapWidth();
    const barsWidth = gameWidth - gapWidth;

    // one short bar and one long bar, the left one can be either
    const minShort = 30 * scale;
    const maxShort = Math.floor(barsWidth / 2) - 10 * scale;
    const shortBar = minShort + Math.floor(Math.random() * (maxShort - minShort + 1));
    const longBar = barsWidth - shortBar;

    let leftBar = longBar;
    if (Math.random() < 0.5) leftBar = shortBar;

    let gapX = leftBar;
    if (centerGap) gapX = (gameWidth - gapWidth) / 2;

    enemiesArr.push(new Gate(gapX, gapWidth));
}

function getPlayerCircle(insetPx) {
    const size = Math.min(playerObj.width, playerObj.height);

    return {
        x: playerObj.x + playerObj.width / 2,
        y: playerObj.y + playerObj.height / 2,
        radius: Math.max(0, size / 2 - insetPx)
    };
}

// checks if a circle touches a rectangle
function checkCircleCollision(circle, rectangle) {
    const closestX = Math.max(rectangle.x, Math.min(circle.x, rectangle.x + rectangle.width));
    const closestY = Math.max(rectangle.y, Math.min(circle.y, rectangle.y + rectangle.height));
    const distanceX = circle.x - closestX;
    const distanceY = circle.y - closestY;

    return distanceX * distanceX + distanceY * distanceY <= circle.radius * circle.radius;
}

function removeEnemiesOutside() {
    const stillInside = [];

    for (let i = 0; i < enemiesArr.length; i++) {
        if (enemiesArr[i].y >= gameAreaNode.clientHeight) {
            enemiesArr[i].remove();
        } else {
            stillInside.push(enemiesArr[i]);
        }
    }
    enemiesArr = stillInside;
}

// returns true if a laser that is on touches the player
function checkLasers() {
    const player = getPlayerCircle(0);
    const stillInside = [];
    let hit = false;

    for (let i = 0; i < lasersArr.length; i++) {
        const laser = lasersArr[i];

        if (laser.y >= gameAreaNode.clientHeight) {
            laser.remove();
            continue;
        }
        stillInside.push(laser);

        if (laser.active) {
            const laserBox = { x: 0, y: laser.y, width: gameAreaNode.clientWidth, height: laser.height };
            if (checkCircleCollision(player, laserBox)) {
                hit = true;
            }
        }
    }
    lasersArr = stillInside;

    if (hit) gameOver();
    return hit;
}

function checkPickups() {
    const player = getPlayerCircle(0);
    const remaining = [];

    for (let i = 0; i < pickupsArr.length; i++) {
        const pickup = pickupsArr[i];
        const dx = player.x - (pickup.x + pickup.size / 2);
        const dy = player.y - (pickup.y + pickup.size / 2);
        const reach = player.radius + pickup.size / 2;

        if (dx * dx + dy * dy <= reach * reach) {
            // picked up: add points
            gameScore += PICKUP_POINTS;
            scoreNode.textContent = String(gameScore);
            pickup.remove();
        } else if (pickup.y >= gameAreaNode.clientHeight) {
            pickup.remove();
        } else {
            remaining.push(pickup);
        }
    }
    pickupsArr = remaining;
}

function checkEnemies() {
    const scale = getGameScale();
    const player = getPlayerCircle(2 * scale);

    for (let i = 0; i < enemiesArr.length; i++) {
        const bars = enemiesArr[i].bars;

        for (let j = 0; j < bars.length; j++) {
            const bar = bars[j];

            // the side of the bar facing the gap is made a bit shorter
            let edgeInset = 0;
            if (bar.gapFacingSide !== "none") {
                edgeInset = Math.min(ENEMY_GAP_EDGE_COLLISION_INSET * scale, bar.width / 2);
            }
            let boxX = bar.x;
            if (bar.gapFacingSide === "left") boxX += edgeInset;

            const box = {
                x: boxX,
                y: bar.y + bar.height * ENEMY_COLLISION_TOP_RATIO,
                width: Math.max(0, bar.width - edgeInset),
                height: bar.height * ENEMY_COLLISION_HEIGHT_RATIO
            };

            if (checkCircleCollision(player, box)) {
                gameOver();
                return;
            }
        }
    }
}

function clearEnemies() {
    for (let i = 0; i < enemiesArr.length; i++) {
        enemiesArr[i].remove();
    }
    enemiesArr = [];
}

function clearPickups() {
    clearTimeout(pickupTimeoutId);
    pickupTimeoutId = null;
    for (let i = 0; i < pickupsArr.length; i++) {
        pickupsArr[i].remove();
    }
    pickupsArr = [];
}

function clearLasers() {
    clearTimeout(laserTimeoutId);
    clearInterval(laserIntervalId);
    laserTimeoutId = null;
    laserIntervalId = null;
    for (let i = 0; i < lasersArr.length; i++) {
        lasersArr[i].remove();
    }
    lasersArr = [];
}

function restartGame() {
    gameOverSound.pause();
    clearEnemies();
    clearPickups();
    clearLasers();
    gameOverScreenNode.style.display = "none";
    gameStart();
}

function gameOver() {
    clearTimeout(musicTimeoutId);
    music.pause();
    gameOverSound.currentTime = 0;
    gameOverSound.play();

    elapsedTime = (performance.now() - gameStartedAt) / 1000;
    timerNode.textContent = elapsedTime.toFixed(1);
    finalTimeNode.textContent = elapsedTime.toFixed(1);
    finalScoreNode.textContent = String(gameScore);

    clearInterval(mainIntervalId);
    clearTimeout(enemyTimeoutId);
    mainIntervalId = null;
    enemyTimeoutId = null;
    clearPickups();
    clearLasers();
    pressedKeys.clear();

    playerObj.node.remove();
    playerObj = null;

    gameScreenNode.style.display = "none";
    gameOverScreenNode.style.display = "flex";
}

function playButtonSound() {
    buttonSound.currentTime = 0;
    buttonSound.play();
}

// ---------- EVENTS ----------
startBtnNode.addEventListener("click", function () {
    playButtonSound();
    gameStart();
});

optionsBtnNode.addEventListener("click", function () {
    playButtonSound();
    // wait a moment so the sound is heard before changing page
    setTimeout(function () {
        window.location.href = "./options.html";
    }, 150);
});

restartBtnNode.addEventListener("click", function () {
    playButtonSound();
    restartGame();
});

window.addEventListener("resize", function () {
    if (mainIntervalId === null) return;

    const gapWidth = getGameGapWidth();
    for (let i = 0; i < enemiesArr.length; i++) {
        enemiesArr[i].resize(gapWidth);
    }
    for (let i = 0; i < pickupsArr.length; i++) {
        pickupsArr[i].resize();
    }
    if (playerObj) {
        playerObj.resize();
    }
});

window.addEventListener("keydown", function (event) {
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

window.addEventListener("keyup", function (event) {
    pressedKeys.delete(event.code);
});

window.addEventListener("blur", function () {
    pressedKeys.clear();
});
