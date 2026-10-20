class Gate {
  constructor(gapX, gapWidth) {
    this.scale = getGameScale();
    this.speed = 2 * this.scale;
    this.gapPositionRatio = gapX / (gameAreaNode.clientWidth - gapWidth);
    this.height = 72 * this.scale;
    this.length = this.height * ENEMY_IMAGE_ASPECT_RATIO;
    this.y = -this.height;

    this.bars = [
      this.createBar(gapX - this.length - LEFT_ENEMY_OFFSET, this.length, this.height, "left"),
      this.createBar(gapX + gapWidth, this.length, this.height, "right")
    ];
  }

  resize(gapWidth) {
    const gameWidth = gameAreaNode.clientWidth;
    const scale = getGameScale();
    this.y *= scale / this.scale;
    this.scale = scale;
    this.speed = 2 * scale;
    this.height = 72 * scale;
    this.length = this.height * ENEMY_IMAGE_ASPECT_RATIO;
    const gapX = this.gapPositionRatio * (gameWidth - gapWidth);
    const [leftBar, rightBar] = this.bars;

    leftBar.x = gapX - this.length - LEFT_ENEMY_OFFSET;
    leftBar.width = this.length;
    leftBar.height = this.height;
    leftBar.node.style.left = `${leftBar.x}px`;
    leftBar.node.style.width = `${leftBar.width}px`;
    leftBar.node.style.height = `${this.height}px`;
    leftBar.y = this.y;
    leftBar.node.style.top = `${this.y}px`;

    rightBar.x = gapX + gapWidth;
    rightBar.width = this.length;
    rightBar.height = this.height;
    rightBar.node.style.left = `${rightBar.x}px`;
    rightBar.node.style.width = `${rightBar.width}px`;
    rightBar.node.style.height = `${this.height}px`;
    rightBar.y = this.y;
    rightBar.node.style.top = `${this.y}px`;
  }


  createBar(x, length, thickness, side) {
    const node = document.createElement("div");
    node.className = "enemy";
    node.style.width = `${length}px`;
    node.style.height = `${thickness}px`;
    node.style.boxSizing = "border-box";
    node.style.backgroundImage = 'url("./images/a90f8d0c-6d10-4988-aa90-09df6639a64a-transparent.png")';
    node.style.backgroundSize = "100% 100%";
    node.style.backgroundRepeat = "no-repeat";
    node.style.position = "absolute";
    node.style.top = `${this.y}px`;
    node.style.left = `${x}px`;
    gameAreaNode.append(node);

    const gapFacingSide = side === "left" ? "right" : "left";

    return { node, x, width: length, height: thickness, y: this.y, gapFacingSide };
  }

  automaticMovement() {
    this.y += this.speed;
    this.bars.forEach((bar) => {
      bar.y = this.y;
      bar.node.style.top = `${this.y}px`;
    });
  }

  remove() {
    this.bars.forEach((bar) => bar.node.remove());
  }
}