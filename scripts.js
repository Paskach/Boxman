function startGame() {
  if (running) {
    return;
  }
  running = true;
  drawBorders();
  var frame = function() { //Code to execute every frame
    box.vel++;
    box.y += box.vel
    checkBoxCollide();
    drawFallingBox();
  }
  var x = setInterval(frame, 16);
}

function drawSprite(x, y, img) {
  document.getElementById("game").getContext("2d").drawImage(img, x, y);
}

var box = {
  x: 0,
  y: 0,
  vel: 0,
  type: "normal"
};

var field = {
  heights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  bomb: false
};

function drawBorders() {
  for (var i = 2; i < 36; i++) {
    drawSprite(0, i * 16, sprites.box);
    drawSprite(208, i * 16, sprites.box);
  }
  for (var i = 0; i < 28; i++) {
    drawSprite(i * 16, 272, sprites.box);
  }
}

function drawFallingBox() {
  //alert(box.x);
  drawSprite((box.x + 1) * 16, box.y - box.vel, sprites.eraser);
  drawSprite((box.x + 1) * 16, box.y, sprites.box);
}

function checkBoxCollide() {
  if (box.y > document.getElementById("game").height - (field.heights[box.x] * 16) - 32) {
    box.y = document.getElementById("game").height - (field.heights[box.x] * 16) - 32;
    drawSprite((box.x + 1) * 16, box.y - box.vel, sprites.eraser);
    drawSprite((box.x + 1) * 16, box.y - 16, sprites.eraser);
    box.vel = 0;
    drawSprite((box.x + 1) * 16, box.y, sprites.box)
    box.y = 16;
    field.heights[box.x]++;
    box.x = Math.floor(Math.random() * 12);
  }
}

class Sprites {
  constructor() {}
  get box() {
    return document.getElementById("box");
  }
  get guy1() {
    return document.getElementById("guy1");
  }
  get eraser() {
    return document.getElementById("eraser");
  }
}

const sprites = new Sprites();
var running = false;
