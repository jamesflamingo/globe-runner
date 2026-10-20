class Player {

  constructor() {
    //* all player properties will go here
  
  this.node = document.createElement ("div")
  gameBoxNode.append (this.node)
  
  this.node.className = "player"
  
  //GLOBE

this.width = 34;
this.height = 34;
this.x = (gameBoxNode.clientWidth - this.width) / 2;
this.y = gameBoxNode.clientHeight * GAME_FLOOR_HEIGHT_RATIO - this.height - PLAYER_FLOOR_CLEARANCE;
 
 
  this.node.style.width = `${this.width}px`;
  this.node.style.height = `${this.height}px`;
  this.node.style.boxSizing = "border-box";
  this.node.style.backgroundImage = 'url("./images/7b3cd448-d137-4950-92ee-9164f9cb705d.png")';
  this.node.style.backgroundSize = "contain";
  this.node.style.backgroundPosition = "center";
  this.node.style.backgroundRepeat = "no-repeat";
  this.node.style.filter = "drop-shadow(0 0 6px #ffffff) drop-shadow(0 0 14px #ffffff) drop-shadow(0 0 28px #ffffff)";
  this.node.style.border = "2px solid #ffffff";
  this.node.style.borderRadius = "100%"
  
  this.node.style.position = "absolute"
  this.node.style.top = `${this.y}px`
  this.node.style.left = `${this.x}px`
  
this.speed = 240
this.gravity = 256;
this.gravitySpeed = 0;



}

  //* all player methods will go here

  //MOVEMENTS CHANGES

move(direction, deltaTime) {
const edgeMargin = getGameEdgeMargin();
const minX = edgeMargin;
const maxX = gameBoxNode.clientWidth - edgeMargin - this.width;
const responsiveSpeed = this.speed * gameBoxNode.clientWidth / GAME_REFERENCE_WIDTH;
this.x = Math.max(minX, Math.min(maxX, this.x + direction * responsiveSpeed * deltaTime));
this.node.style.left = `${this.x}px`
}

jump() {
this.gravitySpeed = -256;
}

update(deltaTime) {
this.gravitySpeed += this.gravity * deltaTime;
this.y += this.gravitySpeed * deltaTime;

if (this.y < 0) {
  this.y = 0;
  this.gravitySpeed = 0;
}

this.node.style.top = `${this.y}px`;
}

}
