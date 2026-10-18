class Player {

  constructor() {
    //* all player properties will go here
  
  this.node = document.createElement ("div")
  gameBoxNode.append (this.node)
  
  this.node.className = "player"
  
  //GLOBE

this.width = 30;
this.height = 30;
this.x = 70;
this.y = gameBoxNode.clientHeight - this.height  -150 ; 
 
 
  this.node.style.width = `${this.width}px`;
  this.node.style.height = `${this.height}px`;
  this.node.style.boxSizing = "border-box";
  this.node.style.background = `
    radial-gradient(circle at 30% 30%, #fef9c3, #fde047 45%, #eab308 75%, #a16207)
  `;
  this.node.style.border = "solid black 2px"
  this.node.style.borderRadius = "50%"
  
  this.node.style.position = "absolute"
  this.node.style.top = `${this.y}px`
  this.node.style.left = `${this.x}px`
  
this.speed = 20



}

  //* all player methods will go here

  //MOVEMENTS CHANGES

moveLeft() {
const maxX = gameBoxNode.clientWidth - this.width;
this.x = Math.max(0, Math.min(maxX, this.x - this.speed));
this.node.style.left = `${this.x}px`
}

moveRight() {
const maxX = gameBoxNode.clientWidth - this.width;
this.x = Math.max(0, Math.min(maxX, this.x + this.speed));
this.node.style.left = `${this.x}px`
}

}
