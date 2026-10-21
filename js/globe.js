class Gate {
  constructor(gapX, gapWidth) {
    this.scale = getGameScale();
    this.speed = 2 * 0.9 * 0.9 * this.scale;
    this.gapPositionRatio = gapX / (gameAreaNode.clientWidth - gapWidth);
    this.rowHeight = ENEMY_THICKNESS * this.scale;
    this.y = -this.rowHeight;

    this.bars = [
      this.createBar("left"),
      this.createBar("right")
    ];
    this.layout(gapX, gapWidth);
  }

  // Each platform starts at its frame edge; all share the same thickness, so the image stretches horizontally.
  layout(gapX, gapWidth) {
    const gameWidth = gameAreaNode.clientWidth;
    const [leftBar, rightBar] = this.bars;

    this.placeBar(leftBar, 0, gapX);
    this.placeBar(rightBar, gapX + gapWidth, gameWidth - gapX - gapWidth);
  }

  placeBar(bar, x, width) {
    bar.x = x;
    bar.width = width;
    bar.height = this.rowHeight;
    bar.y = this.y;

    bar.node.style.left = `${bar.x}px`;
    bar.node.style.width = `${bar.width}px`;
    bar.node.style.height = `${bar.height}px`;
    bar.node.style.top = `${bar.y}px`;
  }

  resize(gapWidth) {
    const scale = getGameScale();
    this.y *= scale / this.scale;
    this.scale = scale;
    this.speed = 2 * 0.9 * 0.9 * scale;
    this.rowHeight = ENEMY_THICKNESS * scale;
    const gapX = this.gapPositionRatio * (gameAreaNode.clientWidth - gapWidth);

    this.layout(gapX, gapWidth);
  }

  createBar(side) {
    const node = document.createElement("div");
    node.className = "enemy";
    node.style.boxSizing = "border-box";
    node.style.backgroundImage = 'url("./images/a90f8d0c-6d10-4988-aa90-09df6639a64a-transparent.png")';
    node.style.backgroundSize = "100% 100%";
    node.style.backgroundRepeat = "no-repeat";
    node.style.position = "absolute";
    gameAreaNode.append(node);

    const gapFacingSide = side === "left" ? "right" : "left";

    return { node, x: 0, width: 0, height: 0, y: this.y, gapFacingSide };
  }

  automaticMovement() {
    this.y += this.speed * difficulty;
    this.bars.forEach((bar) => {
      bar.y = this.y;
      bar.node.style.top = `${bar.y}px`;
    });
  }

  remove() {
    this.bars.forEach((bar) => bar.node.remove());
  }
}

// every SWEEPER_EVERY rows a single bar sweeps from side to side instead of a gate
class Sweeper {
  constructor() {
    this.scale = getGameScale();
    this.speed = 2 * 0.9 * 0.9 * this.scale;
    this.rowHeight = ENEMY_THICKNESS * this.scale;
    this.y = -this.rowHeight;
    this.direction = 1;
    this.widthRatio = SWEEPER_WIDTH_RATIO;
    this.xRatio = 0;

    const node = document.createElement("div");
    node.className = "enemy";
    node.style.boxSizing = "border-box";
    node.style.backgroundImage = 'url("./images/a90f8d0c-6d10-4988-aa90-09df6639a64a-transparent.png")';
    node.style.backgroundSize = "100% 100%";
    node.style.backgroundRepeat = "no-repeat";
    node.style.position = "absolute";
    gameAreaNode.append(node);

    this.bars = [{ node, x: 0, width: 0, height: 0, y: this.y, gapFacingSide: "none" }];
    this.layout();
  }

  layout() {
    const gameWidth = gameAreaNode.clientWidth;
    const bar = this.bars[0];

    bar.width = gameWidth * this.widthRatio;
    bar.height = this.rowHeight;
    bar.x = this.xRatio * (gameWidth - bar.width);
    bar.y = this.y;

    bar.node.style.left = `${bar.x}px`;
    bar.node.style.width = `${bar.width}px`;
    bar.node.style.height = `${bar.height}px`;
    bar.node.style.top = `${bar.y}px`;
  }

  resize() {
    const scale = getGameScale();
    this.y *= scale / this.scale;
    this.scale = scale;
    this.speed = 2 * 0.9 * 0.9 * scale;
    this.rowHeight = ENEMY_THICKNESS * scale;
    this.layout();
  }

  automaticMovement() {
    this.y += this.speed * difficulty;
    this.xRatio += this.direction * SWEEPER_SPEED_RATIO * difficulty;
    if (this.xRatio >= 1 || this.xRatio <= 0) {
      this.xRatio = Math.max(0, Math.min(1, this.xRatio));
      this.direction *= -1;
    }
    this.layout();
  }

  remove() {
    this.bars[0].node.remove();
  }
}
