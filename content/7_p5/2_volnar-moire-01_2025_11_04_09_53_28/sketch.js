let bg = 'rgb(255, 255, 255)';
let fg = '#333333';

function setup() {
  createCanvas(900, 900);
  pixelDensity(1);
  rectMode(CENTER);
}

function draw() {
  background(bg);
  stroke(0);
  noFill();
  
  let amount = 10;
  let stepSize = width/amount;
  
  push();
  translate(width/2, height/2);
  
  for ( let i = 0; i < amount; i++) {
    strokeWeight(stepSize/4);
    square(0, 0, i * stepSize);
  }
  pop();
  
  push();
  translate(width/2, height/2);
  let wave = sin(radians(frameCount)) * 12; 
  rotate(radians(wave));
  for ( let i = 0; i < amount; i++) {
    strokeWeight(stepSize/4);
    square(0, 0, i * stepSize);
  }
  pop();
}