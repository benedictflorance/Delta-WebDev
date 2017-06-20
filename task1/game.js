var canvas1=document.getElementById("statusbar");
var ctx = canvas1.getContext("2d");
var bar = document.createElement("img");
var gold=0,silver=0,bronze=0,level=1,lifedown=0,scale=65,life=60,score=0,scorePrev=0,goldPrev=0,silverPrev=0,bronzePrev=0,time=90;
bar.src = "img/status.png";
var font = new FontFace('gamef','url(http://ff.static.1001fonts.net/n/e/neuropol-x-free.regular.ttf)');
ctx.drawImage(bar,0,0);
bar.onload = function() {
  ctx.drawImage(bar,0,0);
}
var actorChars = {
  "@": Player,
  "c": Coin,
  "f": Food,
  "l": Enemy, "r":Enemy, "u": Enemy, "d": Enemy,
  "<": Arrow, ">": Arrow, "^": Arrow, "v":Arrow
};
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
  this.pos = pos.plus(new Vector(0.141,0.08));
  this.size = new Vector(0.712, 0.91);
  this.speed = new Vector(0, 0);
}
Player.prototype.type = "player";

function Coin(pos)
{
  this.pos = pos.plus(new Vector(0.1576,0.241));
  this.size = new Vector(0.6846,0.7589); 
  var random=Math.floor(Math.random()*3+1);
  if(random==1) this.type='g';
  else if(random==2) this.type='b';
  else this.type='s';
}
function Food(pos)
{
  this.pos=pos.plus(new Vector(0,0));
  this.size=new Vector(1,1);
}
Food.prototype.type="food";
function Enemy(pos,ch)
{
  this.pos=pos.plus(new Vector(0.076,0.076));
  this.size=new Vector(0.923,0.923);
  if(ch=='l')
    this.type='enemyl';
  else if(ch=='r')
    this.type='enemyr';
  else if (ch=='u')
    this.type='enemyu'
  else
    this.type='enemyd';
}
function Arrow(pos,ch)
{ 
  if(ch=='<')
  {
    this.type='arrowl';
    this.pos=pos.plus(new Vector(0.076,0.384));
    this.size=new Vector(0.923,0.230);
    this.speed = new Vector(-3, 0);
  }
  else if(ch=='>')
  {
    this.type='arrowr';
    this.pos=pos.plus(new Vector(0.076,0.384));
    this.size=new Vector(0.923,0.230);
    this.speed = new Vector(3, 0);
  }
  else if (ch=='^')
  {
    this.type='arrowu'
    this.pos=pos.plus(new Vector(0.384,0.076));
    this.size=new Vector(0.230,0.923);
    this.speed = new Vector(0, -4);
  }
  else
  {
    this.type='arrowd';
    this.pos=pos.plus(new Vector(0.384,0.076));
    this.size=new Vector(0.230,0.923);
    this.speed = new Vector(0, 4);
  }
  this.repeatPos=this.pos;
}
function elt(name, className) {
  var elt = document.createElement(name);
  if (className) elt.className = className;
  return elt;
}
function CanvasDisplay(parent, level) {
  this.canvas = document.createElement("canvas");
  this.canvas.width = Math.min(800, level.width * scale);
  this.canvas.height = Math.min(600, level.height * scale);
  this.canvas.id="game";
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
playerSprites.src = "img/player.png";

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
var coin = document.createElement("img");
coin.src = "img/coin.png";

CanvasDisplay.prototype.drawCoin = function(x,y,width,height,type)
{
  var sprite = Math.floor(this.animationTime * 8) % 9;
  if(type=="g")  {this.cx.drawImage(coin,8.5+sprite*width,4.5, width, height,x,y,width,height);}
  else if(type=="b")  this.cx.drawImage(coin,8.5+sprite*width,4.5+1*height, width, height,x,y,width,height);
  else this.cx.drawImage(coin,8.5+sprite*width,4.5+2*height, width, height,x,y,width,height);
};
CanvasDisplay.prototype.drawFood=function(x,y,width,height){
  this.cx.drawImage(otherSprites,3*scale,0, scale, scale,x,y, scale, scale);
};
var enemy = document.createElement("img");
enemy.src = "img/enemy.png";
CanvasDisplay.prototype.drawEnemy=function(x,y,width,height,type){
  if(type=='enemyd')
    this.cx.drawImage(enemy,0,0,width,height,x,y,width,height);
  else if(type=='enemyr')
    this.cx.drawImage(enemy,width,0,width,height,x,y,width,height);
  else if(type=='enemyl')
    this.cx.drawImage(enemy,2*width,0,width,height,x,y,width,height);
  else if(type=='enemyu')
    this.cx.drawImage(enemy,3*width,0,width,height,x,y,width,height);
};
CanvasDisplay.prototype.drawArrow=function(x,y,width,height,type,actor){
    if(type=='arrowd')
    this.cx.drawImage(enemy,20,60,15,60,x,y,width,height);
  else if(type=='arrowr')
    this.cx.drawImage(enemy,60,75,60,15,x,y,width,height);
  else if(type=='arrowl')
    this.cx.drawImage(enemy,120,75,60,15,x,y,width,height);
  else if(type=='arrowu')
    this.cx.drawImage(enemy,205,60,15,60,x,y,width,height);
  }
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
    else if(actor.type=="g"||actor.type=="b"||actor.type=="s")
    {
    this.drawCoin(x, y, width, height,actor.type);
    } 
    else if(actor.type=="food")
      this.drawFood(x,y,width,height);
    else if(actor.type=="enemyr"||actor.type=="enemyl"||actor.type=="enemyu"||actor.type=="enemyd")
      this.drawEnemy(x,y,width,height,actor.type);
    else if(actor.type=="arrowr"||actor.type=="arrowl"||actor.type=="arrowu"||actor.type=="arrowd")
      this.drawArrow(x,y,width,height,actor.type,actor);
  }, this);
};
CanvasDisplay.prototype.drawFrame = function(step) {
  this.animationTime += step;
  var minutes=Math.floor(time/60);
  var seconds=time-minutes*60;
  ctx.clearRect(0,0,800,50);
  ctx.drawImage(bar,0,0);
  ctx.fillStyle = 'black';
  ctx.font = 'bold 25px "gamefont"';
  ctx.fillText(level,14,35);
  ctx.fillStyle = '#00008B';
  ctx.font = 'bold 20px "gamefont"';
  ctx.fillText('Score:'+score,48,33);
  if(seconds>9)
  ctx.fillText('0'+minutes+':'+seconds,228,33);
  else
  ctx.fillText('0'+minutes+':'+'0'+seconds,228,33);
  ctx.fillStyle='white';
  ctx.font = 'bold 18px "gamefont"';
  ctx.fillText(gold,375,32);
  ctx.fillText(silver,470,32);
  ctx.fillText(bronze,562,32);
  if(life>60)
  ctx.fillStyle= '#6aff00';
  else if(life<20)
  ctx.fillStyle= '#fffa00';
  else
  ctx.fillStyle = 'red';
  ctx.fillRect(663,14,life*1.444,15);
  if(lifedown==1)
    if(this.level.status==null)
    {this.level.status="lost";
    this.level.finishDelay=1;
    }
  this.updateViewport();
  this.drawBackground();
  this.drawActors();
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
var playerXSpeed = 7;
var playerYSpeed = 7;
Player.prototype.move = function(step, level, keys) {
  this.speed.y=0
  this.speed.x=0;
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
  var actor="",player="";//created just for function definition
  var obstacle = level.obstacleAt(newPos, this.size);
  if (obstacle)
    level.playerTouched(obstacle,actor,player,this.pos.x,this.pos.y);
  else
    this.pos = newPos;
};
Player.prototype.act = function(step, level, keys) {
  this.move(step, level, keys);
  var otherActor = level.actorAt(this);
  if (otherActor)
    level.playerTouched(otherActor.type,otherActor,this);
};
Coin.prototype.act = function(step,level,keys){};
Enemy.prototype.act = function(step,level,keys){};
Arrow.prototype.act = function(step,level,keys){
    var newPos = this.pos.plus(this.speed.times(step));
  if (!level.obstacleAt(newPos, this.size))
    this.pos = newPos;
  else if (this.repeatPos)
    this.pos = this.repeatPos;
};
Food.prototype.act = function(step,level,keys){};
Level.prototype.playerTouched = function(type,actor,player,x,y) {
    if (type=="exit") {
      this.grid[Math.floor(y)][Math.ceil(x)]=null;
      this.status = "won";
      this.finishDelay = 1;
    }
    else if(type=="b"||type=="g"||type=="s")
    {
      this.actors = this.actors.filter(function(other) {
      return other != actor;
    });
    if(type=="g")
      {score+=20;
        gold++;}
    else if(type=="s")
      {score+=15;
        silver++;}
    else
      {score+=10;
        bronze++;}}
    else if(type=="food")
      {this.actors = this.actors.filter(function(other) {
      return other != actor;});
        life+=15;}
    else if(type=="enemyr"||type=="enemyl"||type=="enemyu"||type=="enemyd")
      { 
      this.actors = this.actors.filter(function(other) {
      return other!=player;});       
      lifedown=1; 
      }
    else if(type=="arrowr"||type=="arrowl"||type=="arrowu"||type=="arrowd")
      { 
      this.actors = this.actors.filter(function(other) {
      return other!=player;});       
      lifedown=1; 
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

function runLevel(level, Display, andThen) {
  var display = new Display(document.body, level);
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
    level=n+1;
    runLevel(new Level(plans[n]), Display, function(status) {
      if (status == "lost")
       {score=scorePrev;
        gold=goldPrev;
        silver=silverPrev;
        bronze=bronzePrev;
        life=60;
        time=90;
        lifedown=0;
        startLevel(n);}
      else if (n < plans.length - 1)
        {scorePrev=score;
        goldPrev=gold;
        bronzePrev=bronze;
        silverPrev=silver;
        life=60;
        time=90;
        lifedown=0;
        startLevel(n + 1);
        }
      else
       {console.log("You win!");
     life=0;}
    });
  }
  startLevel(0);
}
setInterval(function(){
    time--;
    if(life!=0)
      life--;
    else if(life==0)
      lifedown=1;},1000);
setTimeout(function(){lifedown=1;},90000);

