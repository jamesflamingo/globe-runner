class Gate {
  constructor(gapX, gapWidth, edgeMargin) {
    this.y = 0;
    this.speed = 2;
    const thickness = 80;
    this.bars = [
      this.createBar(edgeMargin, gapX - edgeMargin, thickness),
      this.createBar(
        gapX + gapWidth,
        gameBoxNode.clientWidth - edgeMargin - gapX - gapWidth,
        thickness
      )
    ];
  }



  createBar(x, length, thickness) {
    const node = document.createElement("div");
    node.className = "enemy";
    node.style.width = `${length}px`;
    node.style.height = `${thickness}px`;
    node.style.boxSizing = "border-box";
    node.style.backgroundImage = 'url("./images/82b04f89-6b33-4713-b68e-7266b21b8d88.png")';
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