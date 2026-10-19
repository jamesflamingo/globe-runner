class Gate {
  constructor(gapX, gapWidth, edgeMargin) {
    this.y = 0;
    this.speed = 2;
    this.gapPositionRatio =
      (gapX - edgeMargin) /
      (gameBoxNode.clientWidth - edgeMargin * 2 - gapWidth);
    const thickness = 54;
    this.bars = [
      this.createBar(edgeMargin, gapX - edgeMargin, thickness),
      this.createBar(
        gapX + gapWidth,
        gameBoxNode.clientWidth - edgeMargin - gapX - gapWidth,
        thickness
      )
    ];
  }

  resize(gapWidth, edgeMargin) {
    const gameWidth = gameBoxNode.clientWidth;
    const availableWidth = gameWidth - edgeMargin * 2 - gapWidth;
    const gapX = edgeMargin + this.gapPositionRatio * availableWidth;
    const [leftBar, rightBar] = this.bars;

    leftBar.x = edgeMargin;
    leftBar.width = gapX - edgeMargin;
    leftBar.node.style.left = `${leftBar.x}px`;
    leftBar.node.style.width = `${leftBar.width}px`;

    rightBar.x = gapX + gapWidth;
    rightBar.width = gameWidth - edgeMargin - rightBar.x;
    rightBar.node.style.left = `${rightBar.x}px`;
    rightBar.node.style.width = `${rightBar.width}px`;
  }


  createBar(x, length, thickness) {
    const node = document.createElement("div");
    node.className = "enemy";
    node.style.width = `${length}px`;
    node.style.height = `${thickness}px`;
    node.style.boxSizing = "border-box";
    node.style.backgroundImage = 'url("./images/20e68d68-7675-4868-b08d-8f6f985472f0.png")';
    node.style.backgroundSize = "100% 100%";
    node.style.backgroundPosition = "center";
    node.style.backgroundRepeat = "no-repeat";
    node.style.position = "absolute";
    node.style.top = `${this.y}px`;
    node.style.left = `${x}px`;
    gameBoxNode.append(node);

    return { node, x, width: length, height: thickness, y: this.y };
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