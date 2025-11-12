let palette = ['#f1f1f1', '#000000', '#292929', '#3e3e3e'];
let numFrames = 70;

function setup() {
  createCanvas(500, 500);
  noiseSeed(12345);
}

function randomValue(p, seed) {
  let scl = 120.0;
  return pow((noise(scl * p, seed) + 1) / 2.0, 2.0);
}

function position(p) {
  let q = sqrt(p);
  let theta = 7 * TWO_PI * q;
  let r = 0.4 * width * q;
  
  return createVector(r * cos(theta), r * sin(theta));
}

function drawThing(p) {
  let v1 = randomValue(p, 100);
  let v2 = randomValue(p, 200);
  let v3 = randomValue(p, 300);
  
  let sumv = v1 + v2 + v3;
  
  let alpha = 10 * TWO_PI * p;
  
  let theta0 = alpha + 0;
  let theta1 = alpha + map(v1 / sumv, 0, 1, 0, TWO_PI);
  let theta2 = alpha + map((v1 + v2) / sumv, 0, 1, 0, TWO_PI);
  let theta3 = alpha + TWO_PI;
  
  let r = 30 * sin(PI * p);
  
  let pos = position(p);
  
  noStroke();
  
  fill(palette[1]);
  arc(pos.x, pos.y, r, r, theta0, theta1);
  
  fill(palette[2]);
  arc(pos.x, pos.y, r, r, theta1, theta2);
  
  fill(palette[3]);
  arc(pos.x, pos.y, r, r, theta2, theta3);
}

function draw() {
  background(palette[0]);
  
  let t = 1.0 * (frameCount - 1) / numFrames;
  
  push();
  translate(width / 2, height / 2);
  

  let K = 130;
  for (let i = 0; i < K; i++) {
    let p = 1.0 * (i + t) / K;
    drawThing(p);
  }
  
  pop();
}