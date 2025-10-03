
window.tertiaryColor = '#333333';

let flock;
let sketchPaused = false;
let isTouchScreen = false;

if(window.matchMedia && window.matchMedia("(pointer: coarse)").matches) {
  isTouchScreen = true;
}

document.addEventListener('DOMContentLoaded', function() {
  new p5(function(p) {
    // Define all classes inside p5 scope
    
    function Flock() {
      this.boids = [];
    }
    
    Flock.prototype.addBoid = function(b) {
      this.boids.push(b);
    };
    
    Flock.prototype.run = function() {
      for (var i = 0; i < this.boids.length; i++) {
        this.boids[i].run(this.boids);
      }
    };
    
    function Boid(x, y, z) {
      this.acceleration = p.createVector(0, 0);
      this.velocity = p.createVector(p.random(-1, 1), p.random(-1, 1));
      this.position = p.createVector(x, y);
      this.r = 5.0;
      this.maxspeed = 7;
      this.maxforce = 0.05;
      this.maxTrailLength = 5 + parseInt(p.random(35));
      this.trail = [];
    }
    
    Boid.prototype.run = function(boids) {
      this.flock(boids);
      this.update();
      this.borders();
      this.render();
    };
    
    Boid.prototype.applyForce = function(force) {
      this.acceleration.add(force);
    };
    
    Boid.prototype.flock = function(boids) {
      var sep = this.separate(boids);
      var ali = this.align(boids);
      var coh = this.cohesion(boids);
      
      sep.mult(1.5);
      ali.mult(1.0);
      coh.mult(1.0);
      
      this.applyForce(sep);
      this.applyForce(ali);
      this.applyForce(coh);
    };
    
    Boid.prototype.update = function() {
      this.velocity.add(this.acceleration);
      this.velocity.limit(this.maxspeed);
      this.position.add(this.velocity);
      this.acceleration.mult(0);
      
      if (this.trail.length >= this.maxTrailLength) {
        this.trail.shift();
      }
      const pos = Object.assign({}, this.position);
      this.trail.push(pos);
    };
    
    Boid.prototype.seek = function(target) {
      var desired = p5.Vector.sub(target, this.position);
      desired.normalize();
      desired.mult(this.maxspeed);
      var steer = p5.Vector.sub(desired, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    };
    
    Boid.prototype.render = function() {
      var theta = this.velocity.heading() + p.radians(90);
      p.fill(window.tertiaryColor);
      p.noStroke();
      p.push();
      p.translate(this.position.x, this.position.y);
      p.rotate(theta);
      p.beginShape();
      p.vertex(0, -this.r * 1);
      p.vertex(-this.r, this.r * 1);
      p.vertex(this.r, this.r * 1);
      p.endShape(p.CLOSE);
      p.pop();
      
      p.stroke(window.tertiaryColor);
      p.noFill();
      p.strokeWeight(2);
      p.beginShape();
      for(let i = 0; i < this.trail.length; i++){
        if(i >= 1 && p.dist(this.trail[i-1].x, this.trail[i-1].y, this.trail[i].x, this.trail[i].y) > 50){
          p.endShape();
          p.beginShape();
        }
        p.vertex(this.trail[i].x, this.trail[i].y);
      }
      p.endShape();
    };
    
    Boid.prototype.borders = function() {
      if (this.position.x < -this.r) this.position.x = p.width + this.r;
      if (this.position.y < -this.r) this.position.y = p.height + this.r;
      if (this.position.x > p.width + this.r) this.position.x = -this.r;
      if (this.position.y > p.height + this.r) this.position.y = -this.r;
    };
    
    Boid.prototype.separate = function(boids) {
      var desiredseparation = 150.0;
      var steer = p.createVector(0, 0);
      var count = 0;
      
      for (var i = 0; i < boids.length; i++) {
        var d = p5.Vector.dist(this.position, boids[i].position);
        if ((d > 0) && (d < desiredseparation)) {
          var diff = p5.Vector.sub(this.position, boids[i].position);
          diff.normalize();
          diff.div(d);
          steer.add(diff);
          count++;
        }
      }
      
      if (count > 0) {
        steer.div(count);
      }
      if (steer.mag() > 0) {
        steer.normalize();
        steer.mult(this.maxspeed);
        steer.sub(this.velocity);
        steer.limit(this.maxforce);
      }
      return steer;
    };
    
    Boid.prototype.align = function(boids) {
      var neighbordist = 100;
      var sum = p.createVector(0, 0);
      var count = 0;
      for (var i = 0; i < boids.length; i++) {
        var d = p5.Vector.dist(this.position, boids[i].position);
        if ((d > 0) && (d < neighbordist)) {
          sum.add(boids[i].velocity);
          count++;
        }
      }
      if (count > 0) {
        sum.div(count);
        sum.normalize();
        sum.mult(this.maxspeed);
        var steer = p5.Vector.sub(sum, this.velocity);
        steer.limit(this.maxforce);
        return steer;
      } else {
        return p.createVector(0, 0);
      }
    };
    
    Boid.prototype.cohesion = function(boids) {
      var neighbordist = 100;
      var sum = p.createVector(0, 0);
      var count = 0;
      for (var i = 0; i < boids.length; i++) {
        var d = p5.Vector.dist(this.position, boids[i].position);
        if ((d > 0) && (d < neighbordist)) {
          sum.add(boids[i].position);
          count++;
        }
      }
      if (count > 0) {
        sum.div(count);
        return this.seek(sum);
      } else {
        return p.createVector(0, 0);
      }
    };
    
    p.setup = function() {
      p.createCanvas(window.innerWidth, window.innerHeight);
      const canvas = p.canvas;
      canvas.style.position = 'fixed';
      canvas.style.top = '0';
      canvas.style.left = '0';
      canvas.style.zIndex = '-1';
      canvas.style.pointerEvents = 'none';
      
      flock = new Flock();
      
      for (var i = 0; i < 10; i++) {
        var bA = new Boid(p.width, p.random()*p.height, 500);
        var bB = new Boid(0, p.random()*p.height, 500);
        var bC = new Boid(p.random()*p.width, 0, 500);
        var bD = new Boid(p.random()*p.width, p.height, 500);
        flock.addBoid(bA);
        flock.addBoid(bB);
        flock.addBoid(bC);
        flock.addBoid(bD);
      }
    };
    
    p.draw = function() {
      if(sketchPaused) return;
      p.clear();
      flock.run();
    };
    
    p.windowResized = function() {
      p.resizeCanvas(window.innerWidth, window.innerHeight);
    };
    
    p.keyPressed = function() {
      if(p.key === ' ') {
        sketchPaused = !sketchPaused;
      }
    };
  });
});
