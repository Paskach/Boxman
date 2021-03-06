function startGame() {
  if (running) {
    return;
  }
  boxman.screenx = (boxman.x + 1) * 16;
  box.x = -1
  running = true;
  drawBorders();
  var boxDelay = 0;
  introJingle.play();
  var frame = function() { //Code to execute every frame
      if (boxDelay <= 400) {
        boxDelay++;
      }
      if (boxDelay == 399) {
        box.x = Math.floor(Math.random() * 12);
      }
      //boxDelay = -2;

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
        if (boxDelay > 400) {
          if (field.bonus < 30) {
            box.vel += .15;
          } else {
            box.vel += field.bonus / 200;
          }
          box.y += Math.floor(box.vel);
          checkBoxCollide();
          drawFallingBox();
        }
        redrawTops();
        if (score > highscore) {
          highscore = score;
        }
        textPrint((document.getElementById("game").width / 2) - 40, 0, sprites.font1, "high score");
        textPrint(16, 0, sprites.font1, "1up");
        textPrint(document.getElementById("game").width - (8 * 8), 0, sprites.font1, "tunnel");
        textPrint(40 - (8 * score.toString().length), 8, sprites.font, score + "0");
        textPrint(((document.getElementById("game").width / 2) - 24) - (8 * (highscore.toString().length - 5)), 8, sprites.font, highscore + "0");
        textPrint((document.getElementById("game").width / 2) - 40, 160, sprites.font1, gameOverString);
        drawTunnelBar();
        if (!running) {
          clearInterval(x);
          die();
        }
        pickup();
        setDown();

        if (boxman.carrying == -2) {
          drawSprite(boxman.screenx, boxman.screeny - 16, sprites.box);
          drawSprite(boxman.screenx, boxman.screeny - 32, sprites.eraser);
        }
        if (queue.charAt(0) == "d" && !boxman.jumping && boxman.carrying < 0) { //Key presses
          moveRight();
          queue = queue.slice(2);
        }
        if (queue.charAt(0) == "a" && !boxman.jumping && boxman.carrying < 0) {
          moveLeft();
          queue = queue.slice(2);
        }
        if (queue.charAt(0) == "p") {
          if (!boxman.jumping && boxman.carrying == -1 && tunnel == 48) {
            hyperspace();
            tunnel = 0;
          }
          queue = queue.slice(2);
        }
        if (queue.charAt(0) == "s" && !boxman.jumping && boxman.carrying < 0) {
          if (boxman.carrying == -1 && field.heights[boxman.x] > 0) {
            boxman.carrying = 0;
            queue = queue.slice(2);
            //pickup();
          }
          if (boxman.carrying == -2) {
            boxman.carrying = 17;
            queue = queue.slice(2);
            //setDown();
          }
        }
        if (queue.charAt(0) == "s" && field.heights[boxman.x] == 0 && !boxman.jumping) {
          queue = queue.slice(2);
        }
      }
      var keys = ["a", "s", "d", "p"];
      if (keys.indexOf(queue.charAt(0)) < 0) {
        queue = queue.slice(2);
      }
      fullscreen();
      document.getElementById("debug").innerHTML = queue;
    } // end frame code
  var x = setInterval(frame, 16);

  document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    if (document.getElementById("debug").innerHTML.length < 3) {
      document.getElementById("debug").innerHTML += charStr;
    }
    queue = document.getElementById("debug").innerHTML
  };
}

var boxman = {
  x: 0,
  oldx: 0,
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
    score += 2 + (2 * Math.floor((field.heights[boxman.x] + field.bonus)/5));
    drawSprite((box.x + 1) * 16, box.y - box.vel, sprites.eraser);
    drawSprite((box.x + 1) * 16, box.y - 16, sprites.eraser);
    box.vel = 0;
    drawSprite((box.x + 1) * 16, box.y, sprites.box)
    box.y = 32;
    boxHit.play();
    field.heights[box.x]++;
    box.x = Math.floor(Math.random() * 12);
    if (tunnel < 48) {
      tunnel++;
    }
    while (field.heights[box.x] > 9) {
      box.x = Math.floor(Math.random() * 12);
    }
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
      jumpSound.play();
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
      //document.getElementById("debug").innerHTML += boxman.screeny;
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
      jumpSound.play();
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
      //document.getElementById("debug").innerHTML += boxman.screeny;
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
    document.getElementById("game").getContext("2d").drawImage(sprites.eraser, 0, 0, document.getElementById("game").width, document.getElementById("game").height);
    gameOverString = "";
    checkHighScores(); //init();
  }, 4000);
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
    if (boxman.carrying == -2) {
      drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 3) * 16) + field.scrolling, sprites.box);
    }
    //document.getElementById("debug").innerHTML += "scroll DX"
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
    if (boxman.carrying == 0) {
      pickUp.play();
    }
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (boxman.carrying - 1), sprites.eraser);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 1) * 16), sprites.eraser);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (boxman.carrying), sprites.guy1);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (16 - boxman.carrying), sprites.box);
    boxman.carrying += 2;
    if (boxman.carrying > 16) {
      field.heights[boxman.x]--;
      boxman.carrying = -2;
      boxman.screeny = document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32
    }
  }
}

function setDown() {
  if (boxman.carrying > 16) {
    if (boxman.carrying == 17) {
      pickUp.play();
    }
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16), sprites.eraser);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (boxman.carrying - 49), sprites.eraser);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (17 - boxman.carrying), sprites.guy1);
    drawSprite((boxman.x + 1) * 16, document.getElementById("game").height - ((field.heights[boxman.x] + 2) * 16) + (boxman.carrying - 33), sprites.box);
    boxman.carrying += 2;
    if (boxman.carrying > 33) {
      field.heights[boxman.x]++;
      boxman.carrying = -1;
      boxman.screeny = document.getElementById("game").height - (field.heights[boxman.x] * 16) - 32
    }
  }
}

function jsUpdateSize() {
  // Get the dimensions of the viewport
  width = window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  height = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;
};

function fullscreen() {
  if (document.getElementById("fullscreen").checked) {
    jsUpdateSize();
    document.getElementById("game").style = "background-color: black; border: solid 1px #0077ff; height:" + (height - 50);
  } else {
    document.getElementById("game").style = "background-color: black; border: solid 1px #0077ff;";
  }
}

function hyperspace() {
  boxman.oldx = boxman.x;
  boxman.screenx = (boxman.x + 1) * 16;
  drawSprite(boxman.screenx, document.getElementById("game").height - (field.heights[boxman.x] + 2) * 16, sprites.eraser);
  while (boxman.x == boxman.oldx) {
    boxman.x = Math.floor(Math.random() * 12);
  }
  boxman.screenx = (boxman.x + 1) * 16;
}

function drawTunnelBar() {
  drawSprite(document.getElementById("game").width - 64, 10, sprites.tunnel);
  for (var i = 0; i < tunnel && i < 48; i++) {
    drawSprite(document.getElementById("game").width - 63 + i, 10, sprites.tunnelFill);
  }
}

function checkHighScores() {
  var i = 0;
  for (i = 0; i <= 4; i += 1) {
    if (score >= highscores[i]) {
      break;
    }
  }
  if (i != 5) {
  	highScoreJingle.loop = true;
    highScoreJingle.play();
    highscores.splice(i, 0, score);
    highnames.splice(i, 0, "new");
    highscores.splice(5, 1);
    highnames.splice(5, 1);
    console.log(highscores);
    highScoreTable(true);
    var myName = "aaa";
    var enterLetter = 0;
    var counter = 0;
    var text = 0;
    document.onkeypress = function(evt) {
      evt = evt || window.event;
      var charCode = evt.keyCode || evt.which;
      var charStr = String.fromCharCode(charCode);
      if (charStr == "s") {
        enterLetter++;
        updateScores(myName.substr(0, enterLetter));
      }
      if (charStr == "d") {
        myName = myName.substr(0, enterLetter) + alphabet[(alphabet.indexOf(myName.charAt(enterLetter)) + 1) % 26] + myName.substr(enterLetter + 1, 2);
      }
      if (charStr == "a") {
        if (myName.charAt(enterLetter) != "a") {
          myName = myName.substr(0, enterLetter) + alphabet[alphabet.indexOf(myName.charAt(enterLetter)) - 1] + myName.substr(enterLetter + 1, 2);
        } else {
          myName = myName.substr(0, enterLetter) + "z" + myName.substr(enterLetter + 1, 2);
        }
      }
    }
    var loop = setInterval(function() {
      counter++;
      if (counter < 10) {
        text = sprites.font3;
      } else {
        text = sprites.font2;
        if (counter > 20) {
          counter = 0;
        }
      }
      textPrint(80 - (score.toString().length * 8), 88, sprites.font3, score + "0");
      textPrint(152, 88, sprites.font3, myName);
      textPrint(152 + (8 * enterLetter), 88, text, myName.charAt(enterLetter));

      if (enterLetter > 2 && enterLetter != 10) {
        enterLetter = 10;
        var pauser = 0;
        highScoreJingle.pause();
        highScoreJingle.currentTime = 0;
        var pause = setInterval(function() {
          pauser++;
          if (pauser > 200) {
            pauser = 0
            clearInterval(pause);
            clearInterval(loop);
            highnames[i] = myName;
            init();
            titleScreen();
            setCookie("highnames", highnames, 2000);
            setCookie("highscores", highscores, 2000);
          }
        }, 16);
      }
    }, 16);
  } else {
    init();
    titleScreen();
  }
}

function highScoreTable(game) {
  if (game) {
    textPrint(32, 48, sprites.font1, "enter your initials !");
    textPrint(48, 72, sprites.font3, "score");
    textPrint(144, 72, sprites.font3, "name");
  }
  textPrint(88, 144, sprites.font1, "top 5");
  textPrint(72, 160, sprites.font3, "score");
  textPrint(152, 160, sprites.font3, "name");
  textPrint((document.getElementById("game").width / 2) - 40, 0, sprites.font1, "high score");
  textPrint(16, 0, sprites.font1, "1up");
  textPrint(40 - (8 * score.toString().length), 8, sprites.font, score + "0");
  textPrint(((document.getElementById("game").width / 2) - 24) - (8 * (highscores[0].toString().length - 5)), 8, sprites.font, highscores[0] + "0");
  updateScores("");
}

function updateScores(name) {
  var nums = ["1st", "2nd", "3rd", "4th", "5th"];
  var myRow = highscores.indexOf(score);
  for (var i = 0; i <= 4; i++) {
    if (i == myRow) {
      textPrint(16, 176 + (16 * i), sprites.font2, nums[i]);
      textPrint(104 - (8 * score.toString().length), 176 + (16 * i), sprites.font2, score.toString() + "0");
      textPrint(160, 176 + (16 * i), sprites.font2, name);
    } else {
      textPrint(16, 176 + (16 * i), sprites.font3, nums[i]);
      textPrint(104 - (8 * highscores[i].toString().length), 176 + (16 * i), sprites.font3, highscores[i].toString() + "0");
      textPrint(160, 176 + (16 * i), sprites.font3, highnames[i]);
    }
  }
  //textPrint(0, 0, sprites.font1, " ");
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
  get font2() {
    return document.getElementById("font2");
  }
  get font3() {
    return document.getElementById("font3");
  }
  get tunnel() {
    return document.getElementById("tunnel");
  }
  get tunnelFill() {
    return document.getElementById("tunnelFill");
  }
  get logo() {
    return document.getElementById("logo");
  }
}

function init() {
  running = false;
  score = 0;
  boxman = {
    x: 0,
    oldx: 0,
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
  highscore = highscores[0];
  gameOverString = "";
  tunnel = 0;
  document.getElementById("game").getContext("2d").drawImage(sprites.eraser, 0, 0, document.getElementById("game").width, document.getElementById("game").height);
}

function titleScreen() {
  document.getElementById("game").getContext("2d").drawImage(sprites.eraser, 0, 0, document.getElementById("game").width, document.getElementById("game").height);

  textPrint((document.getElementById("game").width / 2) - 40, 0, sprites.font1, "high score");
  textPrint(16, 0, sprites.font1, "1up");
  textPrint(40 - (8 * score.toString().length), 8, sprites.font, score + "0");
  textPrint(((document.getElementById("game").width / 2) - 24) - (8 * (highscore.toString().length - 5)), 8, sprites.font, highscore + "0");
  textPrint((document.getElementById("game").width / 2) - 40, 160, sprites.font1, gameOverString);
  var counter = 0;
  document.onkeypress = function(evt) {
    evt = evt || window.event;
    var charCode = evt.keyCode || evt.which;
    var charStr = String.fromCharCode(charCode);
    if (charStr == "s") {
    	introSound.play();
      var introDelayer = 0;
      var introDelay = setInterval(function() {
      	introDelayer++;
      	if(introDelayer > 10)
      	{
      		clearInterval(introDelay);
          clearInterval(title);
      document.getElementById("game").getContext("2d").drawImage(sprites.eraser, 0, 0, document.getElementById("game").width, document.getElementById("game").height);
      startGame();
      	}
      }, 100);
    }
  }
  var title = setInterval(function() {
    fullscreen();
    //title screen animation code
    counter++;
    var fonts = [sprites.font, sprites.font1, sprites.font2, sprites.font3];
    if (counter < 50) {
      drawSprite((224 - 128) / 2, counter + 30, sprites.logo);
    }
    if (counter > 50) {
      var toPrint = "get as high as you can !";
      textPrint(8 * Math.floor(((224 - (toPrint.length * 8)) / 2) / 8), 120, sprites.font1, toPrint);
      toPrint = "more points per box";
      textPrint(8 * Math.floor(((224 - (toPrint.length * 8)) / 2) / 8), 136, sprites.font1, toPrint);
      toPrint = "the higher you climb !";
      textPrint(8 * Math.floor(((224 - (toPrint.length * 8)) / 2) / 8), 144, sprites.font1, toPrint);
      toPrint = "start";
      textPrint(8 * Math.floor(((224 - (toPrint.length * 8)) / 2) / 8), 184, fonts[Math.floor(counter / 6) % 4], toPrint);
    }
  }, 16);
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

const sprites = new Sprites();
var running = false;
var score = 0;
var cookieHighscores = getCookie("highscores");
if (cookieHighscores == "") {
  var highscores = [2000, 2000, 2000, 2000, 2000];
} else {
  var highscores = cookieHighscores.split(',').map(Number);
}
var cookieHighnames = getCookie("highnames");
if (cookieHighnames == "") {
  var highnames = highnames = ["box", "man", "box", "man", "box"];
} else {
  var highnames = cookieHighnames.split(',');
}
var highscore = highscores[0];
console.log(document.cookie);
console.log(cookieHighscores);
console.log(cookieHighnames);
console.log(highscores);
console.log(highnames);
var gameOverString = "";
var imgData = 0;
var queue = 0;
var width = 0;
var height = 0;
var tunnel = 0;
var tcx;
var boxHit = new Audio('https://paskach.github.io/Boxman/BoxHit.wav');
var pickUp = new Audio('https://paskach.github.io/Boxman/Randomize248.wav');
var jumpSound = new Audio('https://paskach.github.io/Boxman/Jump.wav');
var warningSound = new Audio('https://paskach.github.io/Boxman/Warning.wav');
var introSound = new Audio('https://paskach.github.io/Boxman/Intro.wav');
var introJingle = new Audio('https://paskach.github.io/Boxman/Introjingle.wav');
var highScoreJingle = new Audio('https://paskach.github.io/Boxman/Highscoreloop.wav');
var alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '!', '', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
