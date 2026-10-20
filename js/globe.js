class Gate {
  constructor(gapX, gapWidth) {
    this.scale = getGameScale();
    this.speed = 2 * 0.9 * this.scale;
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
    this.speed = 2 * 0.9 * scale;
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
    this.y += this.speed;
    this.bars.forEach((bar) => {
      bar.y = this.y;
      bar.node.style.top = `${bar.y}px`;
    });
  }

  remove() {
    this.bars.forEach((bar) => bar.node.remove());
  }
}
