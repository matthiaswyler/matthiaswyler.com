let bg = '#f1f1f1';
let fg = 'rgb(254, 255, 92)';

let txt = "«Vera Molnar is one of the very few artists who had the conviction and perseverance to make computer-based visual art at a time when it was not taken seriously as an art form, with critics denouncing the emergent form since they did not believe that the artist’s hand was evident in the work,» Michael Bouhanna, the global head of digital art at Sotheby’s, wrote in an email.";
let words;
let wordList = [];
let font;
let fontLoaded = false;

function setup() {
  createCanvas(600, 600, WEBGL);
  frameRate(30);
  
  loadFont('https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Light.otf', 
    function(loadedFont) {
      font = loadedFont;
      fontLoaded = true;
      
      words = txt.split(" ");
      for (let i = 0; i < words.length; i++) {
        let word = words[i];
        let w = new Word(word);
        wordList.push(w);
      }
    }
  );
}

function draw() {
  background(bg);
  
  if (!fontLoaded) return;
  textFont(font);
  
  push();
  translate(0, 0, -800);
  scale(1, 1);
  
  let rotY = map(mouseY, 0, width, -500, 500);
  let rotX = map(mouseX, 0, width, -500, 500);
  rotateY(radians(rotY));
  rotateX(radians(rotX));
  
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  textSize(60);
  
  for (let i = 0; i < wordList.length; i++) {
    let w = wordList[i];
    push();
    translate(w.x, w.y, w.z);
    
    push();
    translate(0, 0, -5);
    fill(fg);
    noStroke();
    rect(6, 5, textWidth(w.word) + 12, 62);
    pop();
    
    fill(0);
    noStroke();
    text(w.word, 0, 0);
    
    pop();
  }
  pop();
}

class Word {
  constructor(_word) {
    this.magX = 500;
    this.magY = 500;
    this.magZ = 500;
    this.x = random(-this.magX, this.magX);
    this.y = random(-this.magY, this.magY);
    this.z = random(-this.magZ, this.magZ);
    this.word = _word;
  }
}