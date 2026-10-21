const PICKUP_SIZE = 26;
const PICKUP_SPEED = 2 * 0.9 * 0.9;

class Pickup {
  constructor() {
    this.scale = getGameScale();
    this.size = PICKUP_SIZE * this.scale;
    this.x = Math.random() * (gameAreaNode.clientWidth - this.size);
    this.y = -this.size;

    this.node = document.createElement("div");
    this.node.className = "pickup";
    this.node.style.position = "absolute";
    this.node.style.backgroundImage = 'url("./images/globe_runner_orbe_dorado.gif")';
    this.node.style.backgroundSize = "contain";
    this.node.style.backgroundPosition = "center";
    this.node.style.backgroundRepeat = "no-repeat";
    gameAreaNode.append(this.node);
    this.render();
  }

  render() {
    this.node.style.width = `${this.size}px`;
    this.node.style.height = `${this.size}px`;
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
    const glow = this.scale;
    this.node.style.filter = `drop-shadow(0 0 ${4 * glow}px #1df800) drop-shadow(0 0 ${10 * glow}px rgba(0, 248, 136, 0.9)) drop-shadow(0 0 ${22 * glow}px rgba(0, 248, 136, 0.6)) drop-shadow(0 0 ${40 * glow}px rgba(0, 248, 136, 0.35))`;
  this.node.style.border = "0px solid #ffffff";
  this.node.style.borderRadius = "100%"
  }


  automaticMovement() {
    this.y += PICKUP_SPEED * this.scale * difficulty;
    this.node.style.top = `${this.y}px`;
  }

  resize() {
    const scale = getGameScale();
    this.x *= scale / this.scale;
    this.y *= scale / this.scale;
    this.scale = scale;
    this.size = PICKUP_SIZE * scale;
    this.render();
  }

  remove() {
    this.node.remove();
  }
}
