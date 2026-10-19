class Player {

  constructor() {
    //* all player properties will go here
  
  this.node = document.createElement ("div")
  gameBoxNode.append (this.node)
  
  this.node.className = "player"
  
  //GLOBE

this.width = 34;
this.height = 34;
this.x = getGameEdgeMargin();
this.y = gameBoxNode.clientHeight * GAME_FLOOR_HEIGHT_RATIO - this.height - 42;
 
 
  this.node.style.width = `${this.width}px`;
  this.node.style.height = `${this.height}px`;
  this.node.style.boxSizing = "border-box";
  this.node.style.backgroundImage = 'url("./images/e604a7f8-f817-4e51-98aa-84cee03230a8.png")';
  this.node.style.backgroundSize = "contain";
  this.node.style.backgroundPosition = "center";
  this.node.style.backgroundRepeat = "no-repeat";
  this.node.style.filter = "drop-shadow(0 0 6px #39ff14) drop-shadow(0 0 14px #39ff14) drop-shadow(0 0 28px #39ff14)";
  this.node.style.border = "2px solid #39ff14";
  this.node.style.borderRadius = "100%"
  
  this.node.style.position = "absolute"
  this.node.style.top = `${this.y}px`
  this.node.style.left = `${this.x}px`
  
this.speed = 240



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

}
