class Gate {
  constructor(gapX, gapWidth, thickness = 24) {
    this.y = 0;
    this.speed = 3;
    this.bars = [
      this.createBar(0, gapX, thickness),
      this.createBar(gapX + gapWidth, gameBoxNode.clientWidth - gapX - gapWidth, thickness)
    ];
  }

  createBar(x, width, thickness) {
    const node = document.createElement("div");
    node.className = "enemy";
    node.style.width = `${width}px`;
    node.style.height = `${thickness}px`;
    node.style.boxSizing = "border-box";
    node.style.backgroundColor = "red";
    node.style.border = "solid white 2px";
    node.style.position = "absolute";
    node.style.top = `${this.y}px`;
    node.style.left = `${x}px`;
    gameBoxNode.append(node);

    return { node, x, width, height: thickness, y: this.y };
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