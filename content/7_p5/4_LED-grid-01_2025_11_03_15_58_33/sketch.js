function setup() {
  createCanvas(600, 600);
}

function draw() {
  background(0);
  noStroke();

  let tilesX = 6 * 2;
  let tilesY = 6 * 2;

  let tileW = width/tilesX;
  let tileH = height/tilesY;

  let w = map(sin(radians(frameCount)),-1,1,0,3);
  for (let x = 0; x < tilesX; x++) {
    for (let y = 0; y < tilesY; y++) {
      let a = map(tan(radians(x*1 + y*1)),-1,1,-300,300);
      let c = map(tan(radians(frameCount * 0.5 + x * w + y * w * a)), -1, 1, 0, 255);  
      fill(c);
      rect(x * tileW, y * tileH, tileW, tileH);
    }
  }
}