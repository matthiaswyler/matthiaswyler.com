function setup() {
  createCanvas(900, 900);
}

function draw() {
  background('#f1f1f1');
  
  noStroke();
  fill(0);
  
  for (let baseY = 10; baseY < height + 20; baseY += 50) {
    for (let x = 0; x < width; x += 6) {
      let y = baseY + sin(x * 0.02 + frameCount * 0.05) * 20;
      y += sin(x * 0.1 + frameCount * 0.08) * 20;
      ellipse(x, y, 6, 6);
    }
  }
}