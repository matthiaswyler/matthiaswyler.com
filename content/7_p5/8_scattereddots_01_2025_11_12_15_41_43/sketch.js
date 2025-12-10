let time;
let mouseYNormalized;

function ease(p, g) {
  if (p < 0.5) 
    return 0.5 * pow(2*p, g);
  else
    return 1 - 0.5 * pow(2*(1 - p), g);
}

function draw() {
  time = (mouseX*1.3/width) % 1;
  mouseYNormalized = mouseY*1.0/height;
  if (mouseIsPressed)
    console.log(mouseYNormalized);
  draw_();
}

let numberOfJumps = 200;
let numberOfVisibleDots = 60;
let emptyMargin = 50;

class DotPath {
  constructor() {
    this.startX = random(emptyMargin, width-emptyMargin);
    this.startY = random(emptyMargin, height-emptyMargin);
    this.positions = [];
    this.sizes = [];
    
    let x = this.startX;
    let y = this.startY;
    this.positions.push(createVector(x, y));
    this.sizes.push(0.0);
    
    for (let i=0; i<numberOfJumps; i++) {
      let jumpLength = random(25, 300);
      let choice = floor(random(0, 8));
      
      if (choice==0) {
        x += jumpLength;
      }
      if (choice==1) {
        x -= jumpLength;
      }
      if (choice==2) {
        y += jumpLength;
      }
      if (choice==3) {
        y -= jumpLength;
      }
      if (choice==4) {
        x += jumpLength;
        y += jumpLength;
      }
      if (choice==5) {
        x -= jumpLength;
        y += jumpLength;
      }
      if (choice==6) {
        x += jumpLength;
        y -= jumpLength;
      }
      if (choice==7) {
        x -= jumpLength;
        y -= jumpLength;
      }
      
      if (x > width-emptyMargin) {
        x -= 2*jumpLength;
      }
      if (x < emptyMargin) {
        x += 2*jumpLength;
      }
      if (y > height-emptyMargin) {
        y -= 2*jumpLength;
      }
      if (y < emptyMargin) {
        y += 2*jumpLength;
      }
      
      this.positions.push(createVector(x, y));
      
      if (i == numberOfJumps-1) {
        this.sizes.push(0.0);
      }
      else {
        this.sizes.push(random(1, 6));
      }
    }
  }
  
  show(p) {
    let floatIndex = p*numberOfJumps*0.9999;
    let i1 = floor(floatIndex);
    let i2 = i1+1;
    let lerpParameter = floatIndex-i1;
    lerpParameter = ease(lerpParameter, 4.0);
    
    let pos1 = this.positions[i1];
    let pos2 = this.positions[i2];
    let X = lerp(pos1.x, pos2.x, lerpParameter);
    let Y = lerp(pos1.y, pos2.y, lerpParameter);
    
    let size1 = this.sizes[i1];
    let size2 = this.sizes[i2];
    let dotSize = lerp(size1, size2, lerpParameter);
    
    noStroke();
    fill(0);
    ellipse(X, Y, dotSize, dotSize);
  }
  
  showReplacement() {
    for (let i=0; i<numberOfVisibleDots; i++) {
      let p = (i+time)/numberOfVisibleDots;
      this.show(p);
    }
  }
}

let dotPath;

function setup() {
  createCanvas(600, 600);
  randomSeed(234);
  dotPath = new DotPath();
}

function draw_() {
  background('#f1f1f1');
  dotPath.showReplacement();
}