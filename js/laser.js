const LASER_THICKNESS = 4;
const LASER_ON_MS = 1000;
const LASER_OFF_MS = 3000;
const LASER_FIRST_SPAWN_MS = 19000;
const LASER_SPAWN_INTERVAL_MS = 5000;
const LASER_COLOR = "255, 30, 30";

class Laser {
  constructor() {
    this.scale = getGameScale();
    this.height = LASER_THICKNESS * this.scale;
    this.y = -this.height;
    this.speed = 2 * 0.9 * 0.9 * this.scale;
    this.bornAt = performance.now();
    this.active = false;

    this.node = document.createElement("div");
    this.node.className = "laser";
    this.node.style.position = "absolute";
    this.node.style.left = "0";
    this.node.style.width = "100%";
    this.node.style.height = `${this.height}px`;
    this.node.style.background = `rgb(${LASER_COLOR})`;
    this.node.style.boxShadow = `0 0 ${6 * this.scale}px ${2 * this.scale}px rgba(${LASER_COLOR}, 0.9), 0 0 ${18 * this.scale}px ${6 * this.scale}px rgba(${LASER_COLOR}, 0.5)`;
    this.node.style.display = "none";
    gameAreaNode.append(this.node);
  }

  // starts visible at the top: LASER_ON_MS on, then LASER_OFF_MS off, repeating
  updateState() {
    const cycle = LASER_OFF_MS + LASER_ON_MS;
    this.active = (performance.now() - this.bornAt) % cycle < LASER_ON_MS;
    this.node.style.display = this.active ? "block" : "none";
  }

  automaticMovement() {
    this.y += this.speed * difficulty;
    this.node.style.top = `${this.y}px`;
    this.updateState();
  }

  remove() {
    this.node.remove();
  }
}
