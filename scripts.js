function startGame() {
  if (running) {
    return;
  }
  running = true;
  drawBorders();
  var frame = function() { //Code to execute every frame
    if (!boxman.jumping) {
      drawBoxman((boxman.x + 1) * 16, boxman.sprite);
    } else {
      moveBoxman();
    }
    box.vel += .25;
    box.y += Math.floor(box.vel);
    checkBoxCollide();
    drawFallingBox();
  }
  var x = setInterval(frame, 16);
  document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    document.getElementById("debug").innerHTML += charStr;

    if (charStr == "d" && !boxman.jumping) {
      moveRight();
    } //Key presses
    if (charStr == "a" && !boxman.jumping) {
      moveLeft();
    }
  };
}

var boxman = {
  x: 0,
  screeny: 0,
  screenx: 0,
  sprite: "1",
  jumping: false,
  moving: "",
  frame: 0
};

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

function drawSprite(x, y, img) {
  document.getElementById("game").getContext("2d").drawImage(img, x, y);
}

function drawBoxman(x, sprite) {
  if (sprite == 1) {
    drawSprite(x, document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32, sprites.guy1);
  }
  if (sprite == 2) {
    drawSprite(x, document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32, sprites.guy2);
  }
  if (sprite == 3) {
    drawSprite(x, document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32, sprites.guy3);
  }
}

function moveRight() {
  if (field.heights[boxman.x + 1] - field.heights[boxman.x] <= 1 && box.x - 1 != boxman.x) {
    boxman.screenx = (boxman.x + 1) * 16;
    boxman.screeny = document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32;
    boxman.moving = "right";
    boxman.jumping = true;
    boxman.frame = 0;
  }
}

function moveLeft() {
  if (field.heights[boxman.x - 1] - field.heights[boxman.x] <= 1 && box.x + 1 != boxman.x) {
    boxman.screenx = (boxman.x + 1) * 16;
    boxman.screeny = document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32;
    boxman.moving = "left";
    boxman.jumping = true;
    boxman.frame = 0;
  }
}

function moveBoxman() {
  if (boxman.moving == "right") {
    boxman.frame++;
    drawSprite(boxman.screenx, Math.floor(boxman.screeny / 16) * 16, sprites.eraser);
    if (boxman.frame == 1) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy2);
    }
    if (boxman.frame == 2) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy3);
    }
    if (boxman.frame == 3) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy2);
    }
    if (boxman.frame == 4) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
      if (field.heights[boxman.x + 1] - field.heights[boxman.x] == 1) {
        boxman.frame = 50;
      }
    }
    if (boxman.frame > 4 && boxman.frame <= 12) {
      boxman.screenx += 2;
      drawSprite(boxman.screenx, boxman.screeny - 2, sprites.guy1);
    }
    if (boxman.frame == 12) {
      if (field.heights[boxman.x + 1] - field.heights[boxman.x] < 0) {
        boxman.frame = 100;
        //alert('fall');
      }
    }
    if (boxman.frame == 13) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy2);
    }
    if (boxman.frame == 14) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy3);
    }
    if (boxman.frame == 15) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy2);
    }
    if (boxman.frame == 16) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
      boxman.moving = "";
      boxman.frame = 0;
      boxman.jumping = false;
      boxman.x++;
    }
    if (boxman.frame >= 50 && boxman.frame < 99) {
      boxman.screeny -= 4;
      drawSprite(boxman.screenx, boxman.screeny + 4, sprites.eraser);
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
    }
    if (boxman.frame == 53) {
      boxman.screenx += 2;
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
      boxman.frame = 5;
    }
    if (boxman.frame >= 100) {
      document.getElementById("debug").innerHTML += boxman.screeny;
      boxman.screeny += 4;
      drawSprite(boxman.screenx, boxman.screeny - 4, sprites.eraser);
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
    }
    if (boxman.frame == (99 + Math.abs(field.heights[boxman.x + 1] - field.heights[boxman.x]) * 4)) {
      boxman.frame = 13;
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
    }
  }
  if (boxman.moving == "left") {
    boxman.frame++;
    drawSprite(boxman.screenx, Math.floor(boxman.screeny / 16) * 16, sprites.eraser);
    if (boxman.frame == 1) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy2);
    }
    if (boxman.frame == 2) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy3);
    }
    if (boxman.frame == 3) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy2);
    }
    if (boxman.frame == 4) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
      if (field.heights[boxman.x - 1] - field.heights[boxman.x] == 1) {
        boxman.frame = 50;
      }
    }
    if (boxman.frame > 4 && boxman.frame <= 12) {
      boxman.screenx -= 2;
      drawSprite(boxman.screenx, boxman.screeny - 2, sprites.guy1);
    }
    if (boxman.frame == 12) {
      if (field.heights[boxman.x - 1] - field.heights[boxman.x] < 0) {
        boxman.frame = 100;
      }
    }
    if (boxman.frame == 13) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy2);
    }
    if (boxman.frame == 14) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy3);
    }
    if (boxman.frame == 15) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy2);
    }
    if (boxman.frame == 16) {
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
      boxman.moving = "";
      boxman.frame = 0;
      boxman.jumping = false;
      boxman.x--;
    }
    if (boxman.frame >= 50 && boxman.frame < 99) {
      boxman.screeny -= 4;
      drawSprite(boxman.screenx, boxman.screeny + 4, sprites.eraser);
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
    }
    if (boxman.frame == 53) {
      boxman.screenx -= 2;
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
      boxman.frame = 5;
    }
    if (boxman.frame >= 100) {
      document.getElementById("debug").innerHTML += boxman.screeny;
      boxman.screeny += 4;
      drawSprite(boxman.screenx, boxman.screeny - 4, sprites.eraser);
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
    }
    if (boxman.frame == (99 + Math.abs(field.heights[boxman.x - 1] - field.heights[boxman.x]) * 4)) {
      boxman.frame = 13;
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
    }
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
  get guy2() {
    return document.getElementById("guy2");
  }
  get guy3() {
    return document.getElementById("guy3");
  }
  get eraser() {
    return document.getElementById("eraser");
  }
}

const sprites = new Sprites();
var running = false;
