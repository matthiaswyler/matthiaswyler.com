let time = 0;

function setup() {
  createCanvas(500, 500);
}

function draw() {
  background(240);
  
  time += 0.03;
  
  let gridSpacing = 31;
  
  for (let col = 0; col < width; col += gridSpacing) {
    for (let row = 0; row < height; row += gridSpacing) {
      // Checkerboard pattern
      if ((row + col) % 2 < 1) {
        fill(0);
        beginShape();
        
        let numPetals = 4;
        
        for (let petalIndex = 0; petalIndex < numPetals; petalIndex++) {
          // Calculate rotation based on distance and time
          let distanceFromCorner = dist(width, height, col, row);
          let rotationAmount = max(min(sin(time + distanceFromCorner) * 1.5 + sin(time/2) / 2, 1), -1) * PI;
          let petalBaseAngle = petalIndex * PI/2 + rotationAmount;
          
          // Draw petal curve
          let outerRadius = 32;
          let innerRadius = 18;
          
          for (let curveAngle = petalBaseAngle + 3.9; curveAngle > petalBaseAngle + 2.3; curveAngle -= 0.1) {
            vertex(
              col + cos(petalBaseAngle) * outerRadius + cos(curveAngle) * innerRadius,
              row + sin(petalBaseAngle) * outerRadius + sin(curveAngle) * innerRadius
            );
          }
        }
        
        endShape(CLOSE);
      }
    }
  }
}