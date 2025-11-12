let fg= '#000000';
let bg='#f1f1f1';

function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(bg);
  noStroke();
  fill(fg);

  let tilesX = mouseX / 30;
  let tilesY = mouseY / 30;

  let tileW = width / tilesX;
  let tileH = height / tilesY;
  translate(tileW/2, tileH/2);
  
  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {
      ellipse(x*tileW, y*tileH, tileW * 0.9, tileH * 0.9);
    }
  }
}