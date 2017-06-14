var actorChars = {
  "@": Player
};
var scale = 75;
function Level(plan) {
  this.width = plan[0].length;
  this.height = plan.length;
  this.grid = [];
  this.actors = [];

  for (var y = 0; y < this.height; y++) {
    var line = plan[y], gridLine = [];
    for (var x = 0; x < this.width; x++) {
      var ch = line[x], fieldType = null;
      var Actor = actorChars[ch];
      if (Actor)
        this.actors.push(new Actor(new Vector(x, y), ch));
      else if (ch == "x")
        fieldType = "wall";
      else if (ch=="e")
        fieldType="exit";
    gridLine.push(fieldType);
    }
    this.grid.push(gridLine);
  }
  this.player = this.actors.filter(function(actor) {
    return actor.type == "player";
  })[0];
  this.status = this.finishDelay = null;
}
Level.prototype.isFinished = function() {
  return this.status != null && this.finishDelay < 0;
};

function Vector(x, y) {
  this.x = x; this.y = y;
}
Vector.prototype.plus = function(other) {
  return new Vector(this.x + other.x, this.y + other.y);
};
Vector.prototype.times = function(factor) {
  return new Vector(this.x * factor, this.y * factor);
};
function Player(pos) {
  this.pos = pos.plus(new Vector(0,-0.176));
  this.size = new Vector(0.9224, 1.176);
  this.speed = new Vector(0, 0);
}
Player.prototype.type = "player";

function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}

function CanvasDisplay(parent, level) {
  this.canvas = document.createElement("canvas");
  this.canvas.width = Math.min(800, level.width * scale);
  this.canvas.height = Math.min(600, level.height * scale);
  parent.appendChild(this.canvas);
  this.cx = this.canvas.getContext("2d");

  this.level = level;
  this.animationTime = 0;
  this.viewport = {
    left: 0,
    top: 0,
    width: this.canvas.width / scale,
    height: this.canvas.height / scale
  };

  this.drawFrame(0);
}

CanvasDisplay.prototype.clear = function() {
  this.canvas.parentNode.removeChild(this.canvas);
};
var otherSprites = document.createElement("img");
otherSprites.src = "img/sprites.png";

CanvasDisplay.prototype.drawBackground = function() {
  var view = this.viewport;
  var xStart = Math.floor(view.left);
  var xEnd = Math.ceil(view.left + view.width);
  var yStart = Math.floor(view.top);
  var yEnd = Math.ceil(view.top + view.height);

  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var tile = this.level.grid[y][x];
      var screenX = (x - view.left) * scale;
      var screenY = (y - view.top) * scale;
      if(tile==null)
        tileX=2*scale;
      else if(tile=="wall")
        tileX=0;
      else if(tile=="exit")
        tileX=scale;
      this.cx.drawImage(otherSprites,tileX,0, scale, scale,screenX, screenY, scale, scale);
    }
  }
};

var playerSprites = document.createElement("img");
playerSprites.src = "img/player1.png";

CanvasDisplay.prototype.drawPlayer = function(x, y, width,height) {
  var player=this.level.player;
  var pixel,sprite;
  if (player.speed.x != 0||player.speed.y!=0){
  if(player.speed.y>0)
    pixel=0;
  else if(player.speed.y<0)
    pixel=1;
  else if(player.speed.x<0)
    pixel=2;
  else if(player.speed.x>0)
    pixel=3;
  sprite = Math.floor(this.animationTime * 12) % 6;}
  else
      {pixel=3;sprite=1;}

  this.cx.drawImage(playerSprites,sprite*width,pixel*height, width, height,x,y,width,height);

};
CanvasDisplay.prototype.updateViewport = function() {
  var view = this.viewport, marginw = view.width /2, marginh=view.height/2;
  var player = this.level.player;
  var center = player.pos.plus(player.size.times(0.5));

  if (center.x < view.left + marginw)
    view.left = Math.max(center.x - marginw, 0);
  else if (center.x > view.left + view.width - marginw)
    view.left = Math.min(center.x + marginw - view.width,
                         this.level.width - view.width);
  if (center.y < view.top + marginh)
    view.top = Math.max(center.y - marginh, 0);
  else if (center.y > view.top + view.height - marginh)
    view.top = Math.min(center.y + marginh - view.height,
                        this.level.height - view.height);
};
Level.prototype.obstacleAt = function(pos, size) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};
CanvasDisplay.prototype.drawActors = function() {
  this.level.actors.forEach(function(actor) {
    var width = actor.size.x * scale;
    var height = actor.size.y * scale;
    var x = (actor.pos.x - this.viewport.left) * scale;
    var y = (actor.pos.y - this.viewport.top) * scale;
    if (actor.type == "player") {
      this.drawPlayer(x, y, width, height);
    } 
  }, this);
};
CanvasDisplay.prototype.drawFrame = function(step) {
  this.animationTime += step;

  this.updateViewport();
  this.drawBackground();
  this.drawActors();
};

Level.prototype.obstacleAt = function(pos, size) {
  var xStart = Math.floor(pos.x);
  var xEnd = Math.ceil(pos.x + size.x);
  var yStart = Math.floor(pos.y);
  var yEnd = Math.ceil(pos.y + size.y);
  for (var y = yStart; y < yEnd; y++) {
    for (var x = xStart; x < xEnd; x++) {
      var fieldType = this.grid[y][x];
      if (fieldType) return fieldType;
    }
  }
};
Level.prototype.actorAt = function(actor) {
  for (var i = 0; i < this.actors.length; i++) {
    var other = this.actors[i];
    if (other != actor &&
        actor.pos.x + actor.size.x > other.pos.x &&
        actor.pos.x < other.pos.x + other.size.x &&
        actor.pos.y + actor.size.y > other.pos.y &&
        actor.pos.y < other.pos.y + other.size.y)
      return other;
  }
};
var maxStep = 0.05;

Level.prototype.animate = function(step, keys) {
  if (this.status != null)
    this.finishDelay -= step;

  while (step > 0) {
    var thisStep = Math.min(step, maxStep);
    this.actors.forEach(function(actor) {
      actor.act(thisStep, this, keys);
    }, this);
    step -= thisStep;
  }
};
var playerXSpeed = 8;
var playerYSpeed = 8;
Player.prototype.move = function(step, level, keys) {
  this.speed.y=0
  this.speed.x = 0;
  var motion;
  if(keys.left||keys.right){
  if (keys.left) this.speed.x -= playerXSpeed;
  if (keys.right) this.speed.x += playerXSpeed;
  motion = new Vector(this.speed.x * step, 0);
  }
  else if(keys.up||keys.down)
  {if (keys.up) this.speed.y -= playerYSpeed;
  if (keys.down) this.speed.y += playerYSpeed;
  motion = new Vector(0, this.speed.y * step);
}
  else
  motion= new Vector(0,0);
  var newPos = this.pos.plus(motion);
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle)
    level.playerTouched(obstacle);
  else
    this.pos = newPos;
};
Player.prototype.act = function(step, level, keys) {
  this.move(step, level, keys);
  var otherActor = level.actorAt(this);
  if (otherActor)
    level.playerTouched(otherActor.type, otherActor);
};
Level.prototype.playerTouched = function(type, actor) {
    if (type=="exit") {
      this.status = "won";
      this.finishDelay = 1;
    }
};
var arrowCodes = {37: "left", 38: "up", 39: "right", 40: "down"};
function trackKeys(codes) {
  var pressed = Object.create(null);
  function handler(event) {
    if (codes.hasOwnProperty(event.keyCode)) {
      var down = event.type == "keydown";
      pressed[codes[event.keyCode]] = down;
      event.preventDefault();
    }
  }
  addEventListener("keydown", handler);
  addEventListener("keyup", handler);
  return pressed;
}
function runAnimation(frameFunc) {
  var lastTime = null;
  function frame(time) {
    var stop = false;
    if (lastTime != null) {
      var timeStep = Math.min(time - lastTime, 100) / 1000;
      stop = frameFunc(timeStep) === false;
    }
    lastTime = time;
    if (!stop)
      requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
var arrows = trackKeys(arrowCodes);
function loseGame(level)
{
if(level.status==null)
{level.status="lost";
level.finishDelay=1;
}
}
function runLevel(level, Display, andThen) {
  var display = new Display(document.body, level);
  setTimeout(function(){loseGame(level);},60000);
  runAnimation(function(step) {
    level.animate(step, arrows);
    display.drawFrame(step);
    if (level.isFinished()) {
      display.clear();
      if (andThen)
        andThen(level.status);
      return false;
    }
  });
}
function runGame(plans, Display) {
  function startLevel(n) {
    runLevel(new Level(plans[n]), Display, function(status) {
      if (status == "lost")
        startLevel(n);
      else if (n < plans.length - 1)
        startLevel(n + 1);
      else
        console.log("You win!");
    });
  }
  startLevel(0);
}