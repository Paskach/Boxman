function startGame() {
  if (running) {
    return;
  }
  boxman.screenx = (boxman.x + 1) * 16;
  box.x = Math.floor(Math.random() * 12);
  running = true;
  drawBorders();
  var frame = function() { //Code to execute every frame
      if (field.heights[boxman.x] > 4 && field.scrolling == 0 & !boxman.jumping) {
        field.scrolling = 1;
      }
      scroll();
      if (field.scrolling == 0) {
        if ((box.x + 1) * 16 == boxman.screenx) {
          boxman.sprite = 4;
        } else {
          boxman.sprite = 1;
        }
        if (!boxman.jumping) {
          drawBoxman((boxman.x + 1) * 16, boxman.sprite);
        } else {
          moveBoxman();
        }
        box.vel += .25;
        box.y += Math.floor(box.vel);
        checkBoxCollide();
        drawFallingBox();
        redrawTops();
        if (score > highscore) {
          highscore = score;
        }
        textPrint((document.getElementById("game").width / 2) - 40, 0, sprites.font1, "high score");
        textPrint(16, 0, sprites.font1, "1up");
        textPrint(40 - (8 * score.toString().length), 8, sprites.font, score + "0");
        textPrint(((document.getElementById("game").width / 2) - 24) - (8 * (highscore.toString().length - 5)), 8, sprites.font, highscore + "0");
        textPrint((document.getElementById("game").width / 2) - 40, 160, sprites.font1, gameOverString);
        if (!running) {
          clearInterval(x);
          die();
        }
        pickup();
        setDown();
        if(boxman.carrying == -2)
        {
        drawSprite(boxman.screenx, boxman.screeny-16, sprites.box);
    	drawSprite(boxman.screenx, boxman.screeny-32, sprites.eraser);
        }
      }
    } // end frame code
  var x = setInterval(frame, 16);

  document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    document.getElementById("debug").innerHTML += charStr;
    if (field.scrolling == 0) {
      if (charStr == "d" && !boxman.jumping && boxman.carrying <0) { //Key presses
        moveRight();
      }
      if (charStr == "a" && !boxman.jumping && boxman.carrying <0) {
        moveLeft();
      }
      if (charStr == "s" && !boxman.jumping && boxman.carrying < 0) {
        if (boxman.carrying == -1 && field.heights[boxman.x] > 0) {
          boxman.carrying = 0;
          //pickup();
        }
        if (boxman.carrying == -2) {
          boxman.carrying = 17;
          //setDown();
        }
      }
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
  frame: 0,
  columnDif: 0,
  carrying: -1
};

var box = {
  x: 0,
  y: 32,
  vel: 0,
  type: "normal"
};

var field = {
  heights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  bomb: false,
  scrolling: 0,
  bonus: 0
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
    checkIfDead();
    score += field.heights[boxman.x] + field.bonus;
    drawSprite((box.x + 1) * 16, box.y - box.vel, sprites.eraser);
    drawSprite((box.x + 1) * 16, box.y - 16, sprites.eraser);
    box.vel = 0;
    drawSprite((box.x + 1) * 16, box.y, sprites.box)
    box.y = 32;
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
  if (sprite == 4) {
    drawSprite(x, document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32, sprites.guy4);
  }
}

function moveRight() {
  if (field.heights[boxman.x + 1] - field.heights[boxman.x] <= 1 && box.x - 1 != boxman.x) {
    boxman.screenx = (boxman.x + 1) * 16;
    boxman.screeny = document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32;
    boxman.moving = "right";
    boxman.jumping = true;
    boxman.frame = 0;
    boxman.columnDiff = field.heights[boxman.x + 1] - field.heights[boxman.x];
    boxman.sprite = 1;
  }
}

function moveLeft() {
  if (field.heights[boxman.x - 1] - field.heights[boxman.x] <= 1 && box.x + 1 != boxman.x) {
    boxman.screenx = (boxman.x + 1) * 16;
    boxman.screeny = document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32;
    boxman.moving = "left";
    boxman.jumping = true;
    boxman.frame = 0;
    boxman.columnDiff = field.heights[boxman.x - 1] - field.heights[boxman.x];
    boxman.sprite = 1;
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
      if (boxman.columnDiff == 1) {
        boxman.frame = 50;
      }
    }
    if (boxman.frame > 4 && boxman.frame <= 12) {
      drawSprite(boxman.screenx, boxman.screeny - 16, sprites.eraser);
      boxman.screenx += 2;
      drawSprite(boxman.screenx, boxman.screeny - 2, sprites.guy1);
    }
    if (boxman.frame == 12) {
      if (boxman.columnDiff < 0) {
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
      drawSprite(boxman.screenx, boxman.screeny - 16, sprites.eraser);
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
    if (boxman.frame == (99 + Math.abs(boxman.columnDiff) * 4)) {
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
      if (boxman.columnDiff == 1) {
        boxman.frame = 50;
      }
    }
    if (boxman.frame > 4 && boxman.frame <= 12) {
      drawSprite(boxman.screenx, boxman.screeny - 16, sprites.eraser);
      boxman.screenx -= 2;
      drawSprite(boxman.screenx, boxman.screeny - 2, sprites.guy1);
    }
    if (boxman.frame == 12) {
      if (boxman.columnDiff < 0) {
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
      drawSprite(boxman.screenx, boxman.screeny - 16, sprites.eraser);
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
    if (boxman.frame == (99 + Math.abs(boxman.columnDiff) * 4)) {
      boxman.frame = 13;
      drawSprite(boxman.screenx, boxman.screeny, sprites.guy1);
    }
  }
}

function redrawTops() { //change this to detect what block it needs to draw
  field.heights.forEach(function(height, index) {
    drawSprite((index + 1) * 16, document.getElementById("game").height - (height * 16 + 16), sprites.box);
  });
}

function checkIfDead() {
  if (box.y == document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32 && boxman.sprite == 4) {
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - (field.heights[boxman.x] * 16) - 16, sprites.blood);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32, sprites.box);
    running = false;
    gameOverString = "game over";
  }
}

function textPrint(x, y, sprite, string) {
  for (var i = 0; i < string.length; i++) {
    if (alphabet.indexOf(string.charAt(i)) >= 0) {
      document.getElementById("game").getContext("2d").drawImage(sprite, 12 * alphabet.indexOf(string.charAt(i)), 0, 8, 8, x + (8 * i), y, 8, 8);
    }
  }
}

function die() {
  setTimeout(function() {
    init();
  }, 2500);
}

function scroll() {
  if (field.scrolling > 0) {
    for (var j = 0; j < 12; j++) {
      for (var k = 0; k < field.heights[j]; k++) {
        drawSprite((j + 1) * 16, document.getElementById("game").height - (((k + 2) * 16) - (field.scrolling - 16)), sprites.eraser);
        drawSprite((j + 1) * 16, document.getElementById("game").height - (((k + 2) * 16) - field.scrolling), sprites.box);
      }
    }
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + field.scrolling, sprites.guy1);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 4) * 16) + field.scrolling, sprites.eraser);
    if(boxman.carrying == -2){
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 3) * 16) + field.scrolling, sprites.box);}
    document.getElementById("debug").innerHTML += "scroll DX"
    field.scrolling++;
  }
  if (field.scrolling > 16) {
    field.scrolling = 0;
    field.bonus++;
    for (var i = 0; i < 12; i++) {
      if (field.heights[i] > 0) {
        field.heights[i]--;
      }
    }
    boxman.screeny = document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32;
  }
}

function pickup() {
  if (boxman.carrying > -1 && boxman.carrying < 17) {
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (boxman.carrying - 1), sprites.eraser);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 1) * 16), sprites.eraser);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (boxman.carrying), sprites.guy1);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (16 - boxman.carrying), sprites.box);
    boxman.carrying+=2;
    if (boxman.carrying > 16) {
    	field.heights[boxman.x]--;
      boxman.carrying = -2;
      boxman.screeny = document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32
    }
  }
}

function setDown() {
  if (boxman.carrying > 16) {
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16), sprites.eraser);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (boxman.carrying - 49), sprites.eraser);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (17-boxman.carrying), sprites.guy1);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (boxman.carrying - 33), sprites.box);
    boxman.carrying+=2;
    if (boxman.carrying > 33) {
    	field.heights[boxman.x]++;
      boxman.carrying = -1;
      boxman.screeny = document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32
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
  get guy4() {
    return document.getElementById("guy4");
  }
  get blood() {
    return document.getElementById("blood");
  }
  get eraser() {
    return document.getElementById("eraser");
  }
  get font() {
    return document.getElementById("font");
  }
  get font1() {
    return document.getElementById("font1");
  }
}

function init() {
  running = false;
  score = 0;
  boxman = {
    x: 0,
    screeny: 0,
    screenx: 0,
    sprite: "1",
    jumping: false,
    moving: "",
    frame: 0,
    columnDif: 0,
  	carrying: -1
  };

  box = {
    x: 0,
    y: 0,
    vel: 0,
    type: "normal"
  };

  field = {
    heights: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    bomb: false,
    scrolling: 0,
    bonus: 0
  };
  gameOverString = "";
  document.getElementById("game").getContext("2d").drawImage(sprites.eraser, 0, 0, document.getElementById("game").width, document.getElementById("game").height);
  startGame(); //change this to title screen
}

const sprites = new Sprites();
var running = false;
var score = 0;
var highscore = 2000
var gameOverString = "";
var imgData = 0;
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
