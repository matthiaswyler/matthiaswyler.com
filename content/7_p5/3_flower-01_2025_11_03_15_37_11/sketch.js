let fg= '#1a1a1a';
let bg='rgb(255, 255, 255)';

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(bg);
  noStroke();
  fill(fg);
  rectMode(CORNER);

  for (let i = 0; i < mouseX; i++) {
    push();
    translate(width/2, height/2);
    rotate(radians(i*20.3+(i*frameCount*0.005)));
    rect(mouseX*0.002*i, 0, 100, 5);
    ellipse(mouseX*0.002*i+15, 35, 8, 8);
    pop();
  }

  translate(mouseX, mouseY);
  triangle(0, 0, 20, 20, 0, 30);
}