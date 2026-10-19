class Player {

  constructor() {
    //* all player properties will go here
  
  this.node = document.createElement ("div")
  gameBoxNode.append (this.node)
  
  this.node.className = "player"
  
  //GLOBE

this.width = 20;
this.height = 20;
this.x = GAME_EDGE_MARGIN;
this.y = gameBoxNode.clientHeight - this.height  -150 ; 
 
 
  this.node.style.width = `${this.width}px`;
  this.node.style.height = `${this.height}px`;
  this.node.style.boxSizing = "border-box";
  this.node.style.backgroundImage = 'url("./images/e604a7f8-f817-4e51-98aa-84cee03230a8.png")';
  this.node.style.backgroundSize = "cover";
  this.node.style.backgroundPosition = "center";
  this.node.style.backgroundRepeat = "no-repeat";
  this.node.style.filter = "drop-shadow(0 0 6px #ff1900) drop-shadow(0 0 14px #ff00ff) drop-shadow(0 0 28px #e600ff) drop-shadow(0 0 44px #e600ff)";
  this.node.style.border = "solid red 1px"
  this.node.style.borderRadius = "80%"
  
  this.node.style.position = "absolute"
  this.node.style.top = `${this.y}px`
  this.node.style.left = `${this.x}px`
  
this.speed = 240



}

  //* all player methods will go here

  //MOVEMENTS CHANGES

move(direction, deltaTime) {
const minX = GAME_EDGE_MARGIN;
const maxX = gameBoxNode.clientWidth - GAME_EDGE_MARGIN - this.width;
this.x = Math.max(minX, Math.min(maxX, this.x + direction * this.speed * deltaTime));
this.node.style.left = `${this.x}px`
}

}
