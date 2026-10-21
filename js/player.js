class Player {

  constructor() {
    //* all player properties will go here
  
  this.node = document.createElement ("div")
  gameAreaNode.append (this.node)
  
  this.node.className = "player"
  
  //GLOBE

this.scale = 1;
this.width = 14;
this.height = 14;
this.x = (gameAreaNode.clientWidth - this.width) / 2;
this.y = gameAreaNode.clientHeight * 0.05;
 
 
  this.node.style.width = `${this.width}px`;
  this.node.style.height = `${this.height}px`;
  this.node.style.boxSizing = "border-box";
  this.node.style.backgroundImage = 'url("./images/41805bc3-a383-42b8-a8ea-83e9307c67e0.png")';
  this.node.style.backgroundSize = "contain";
  this.node.style.backgroundPosition = "center";
  this.node.style.backgroundRepeat = "no-repeat";
  this.node.style.boxShadow = "0 0 6px 2px #00f888, 0 0 16px 6px rgba(0, 248, 136, 0.9), 0 0 36px 14px rgba(0, 248, 136, 0.6), 0 0 70px 28px rgba(0, 248, 136, 0.35)";
  this.node.style.border = "0px solid #060000";
  this.node.style.borderRadius = "100%"
  
  this.node.style.position = "absolute"
  this.node.style.top = `${this.y}px`
  this.node.style.left = `${this.x}px`
  
this.speed = 240;
this.gravity = 256 * 0.85 * 0.9;
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
this.gravitySpeed = -256 * 0.9 * Math.SQRT1_2 * this.scale;
}

// Returns true when the globe touches the bottom of the play area.
update(deltaTime) {
this.gravitySpeed += this.gravity * deltaTime;
this.y += this.gravitySpeed * deltaTime;

if (this.y < 0) {
  this.y = 0;
  this.gravitySpeed = 0;
}

const maxY = Math.max(0, gameAreaNode.clientHeight * (1 - floorRise) - this.height);
const touchedBottom = this.y >= maxY;
if (touchedBottom) {
  this.y = maxY;
  this.gravitySpeed = 0;
}

this.node.style.top = `${this.y}px`;
return touchedBottom;
}

resize() {
const oldMaxX = Math.max(0, gameAreaNode.clientWidth - this.width);
const xRatio = oldMaxX > 0 ? this.x / oldMaxX : 0.5;
const scale = getGameScale();
const maxX = Math.max(0, gameAreaNode.clientWidth - 14 * scale);
const previousScale = this.scale;

this.scale = scale;
this.width = 14 * scale;
this.height = 14 * scale;
this.x = Math.max(0, Math.min(maxX, xRatio * maxX));
this.y = Math.min(gameAreaNode.clientHeight * 0.05, gameAreaNode.clientHeight - this.height);
this.speed = 240 * scale;
this.gravity = 256 * 0.85 * 0.9 * scale;
this.gravitySpeed *= scale / previousScale;

this.node.style.width = `${this.width}px`;
this.node.style.height = `${this.height}px`;
this.node.style.borderWidth = "0px";
this.node.style.boxShadow = `0 0 ${6 * scale}px ${2 * scale}px #00f888, 0 0 ${16 * scale}px ${6 * scale}px rgba(0, 248, 136, 0.9), 0 0 ${36 * scale}px ${14 * scale}px rgba(0, 248, 136, 0.6), 0 0 ${70 * scale}px ${28 * scale}px rgba(0, 248, 136, 0.35)`;
this.node.style.left = `${this.x}px`;
this.node.style.top = `${this.y}px`;
}

}
