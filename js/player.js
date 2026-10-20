class Player {

  constructor() {
    //* all player properties will go here
  
  this.node = document.createElement ("div")
  gameAreaNode.append (this.node)
  
  this.node.className = "player"
  
  //GLOBE

this.scale = 1;
this.width = 34;
this.height = 34;
this.x = (gameAreaNode.clientWidth - this.width) / 2;
this.y = gameAreaNode.clientHeight * 0.05;
 
 
  this.node.style.width = `${this.width}px`;
  this.node.style.height = `${this.height}px`;
  this.node.style.boxSizing = "border-box";
  this.node.style.backgroundImage = 'url("./images/113f8409-a90a-4eb0-be36-a2bd885a7115.png")';
  this.node.style.backgroundSize = "contain";
  this.node.style.backgroundPosition = "center";
  this.node.style.backgroundRepeat = "no-repeat";
  this.node.style.filter = "drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 14px #ffffff) drop-shadow(0 0 28px #ffffff)";
  this.node.style.border = "2px solid #ffffff";
  this.node.style.borderRadius = "100%"
  
  this.node.style.position = "absolute"
  this.node.style.top = `${this.y}px`
  this.node.style.left = `${this.x}px`
  
this.speed = 240;
this.gravity = 256;
this.gravitySpeed = 0;

this.resize();

}

  //* all player methods will go here

  //MOVEMENTS CHANGES

move(direction, deltaTime) {
const maxX = gameAreaNode.clientWidth - this.width;
this.x = Math.max(0, Math.min(maxX, this.x + direction * this.speed * deltaTime));
this.node.style.left = `${this.x}px`
}

jump() {
this.gravitySpeed = -256 * this.scale;
}

update(deltaTime, verticalDirection = 0) {
if (verticalDirection !== 0) {
  const maxY = Math.max(0, gameAreaNode.clientHeight - this.height);
  this.y = Math.max(
    0,
    Math.min(maxY, this.y + verticalDirection * this.speed * deltaTime)
  );
  this.gravitySpeed = 0;
  this.node.style.top = `${this.y}px`;
  return;
}

this.gravitySpeed += this.gravity * deltaTime;
this.y += this.gravitySpeed * deltaTime;

if (this.y < 0) {
  this.y = 0;
  this.gravitySpeed = 0;
}

const maxY = Math.max(0, gameAreaNode.clientHeight - this.height);
if (this.y >= maxY) {
  this.y = maxY;
  this.gravitySpeed = 0;
}

this.node.style.top = `${this.y}px`;
}

resize() {
const oldMaxX = Math.max(0, gameAreaNode.clientWidth - this.width);
const xRatio = oldMaxX > 0 ? this.x / oldMaxX : 0.5;
const scale = getGameScale();
const maxX = Math.max(0, gameAreaNode.clientWidth - 34 * scale);
const previousScale = this.scale;

this.scale = scale;
this.width = 34 * scale;
this.height = 34 * scale;
this.x = Math.max(0, Math.min(maxX, xRatio * maxX));
this.y = Math.min(gameAreaNode.clientHeight * 0.05, gameAreaNode.clientHeight - this.height);
this.speed = 240 * scale;
this.gravity = 256 * scale;
this.gravitySpeed *= scale / previousScale;

this.node.style.width = `${this.width}px`;
this.node.style.height = `${this.height}px`;
this.node.style.borderWidth = `${2 * scale}px`;
this.node.style.filter = `drop-shadow(0 0 ${6 * scale}px #ffffff) drop-shadow(0 0 ${14 * scale}px #ffffff) drop-shadow(0 0 ${28 * scale}px #ffffff)`;
this.node.style.left = `${this.x}px`;
this.node.style.top = `${this.y}px`;
}

}
