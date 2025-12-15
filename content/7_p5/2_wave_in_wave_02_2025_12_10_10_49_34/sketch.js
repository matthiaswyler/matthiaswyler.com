function setup() {
  createCanvas(900, 900);
}

function draw() {
  background('#f1f1f1');
  
  noStroke();
  fill(0);
  
 
  for (let baseY = 10; baseY < height + 20; baseY += 50) {
    let phaseOffset = baseY * 0.01;
    for (let x = 0; x < width; x += 6) {
      let y = baseY + sin(x * 0.02 + frameCount * 0.05 + phaseOffset) * 30;
      y += sin(x * 0.1 + frameCount * 0.08) * 20;
      
   
      y += noise(x * 0.01, baseY * 0.01, frameCount * 0.01) * 10 - 5;
      

      let dotSize = 1 + noise(x * 0.02, baseY * 0.02) * 40;
      
      ellipse(x, y, dotSize, dotSize);
    }
  }
  

  for (let baseX = 10; baseX < width - 20; baseX += 50) {
    let phaseOffset = baseX * 0.01;
    for (let y = 0; y < height; y += 6) {
      let x = baseX + sin(y * 0.02 + frameCount * 0.05 + phaseOffset) * 20;
      x += sin(y * 0.1 + frameCount * 0.08) * 20;
      
      x += noise(baseX * 0.01, y * 0.01, frameCount * 0.01) * 10 - 5;
      
      let dotSize = 1 + noise(baseX * 0.02, y * 0.02) * 30;
      
      ellipse(x, y, dotSize, dotSize);
    }
  }
}