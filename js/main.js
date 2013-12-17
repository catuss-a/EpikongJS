
var unit = { "w": 50, "h": 50 };

function Perso(perso, map) {
    this.sprite = new Sprite(perso.sprite);
    this.map = map;
    this.x = perso.x * 50;
    this.y = perso.y * 50;
    this.moves = [];
    this.moves[37] = false;
    this.moves[39] = false;

    var RUNNING_RIGHT = 0;
    var RUNNING_LEFT = 1;
    var IDLE = 2;

    this.state = IDLE;

    this.spriteCoord = {
	"x": 0,
	"y": 0
    };
    this.animTab = [0, 0, 0, 0, 0, 0];

    this.update = function() {
	this.state = IDLE;
	this.moveRight();
	this.moveLeft();
	this.gravity();
	this.computeCoordAnim();
    }

    this.computeCoordAnim = function() {
	if (this.state == IDLE) {
	    this.pickSprite(IDLE, 53, 0.5);
	}
	this.spriteCoord.y = this.state * this.sprite.h;
	this.spriteCoord.x = Math.floor(this.animTab[this.state]) * this.sprite.w;
    }

    this.pickSprite = function(state, nbSprite, inc) {
	this.state = state;
	if (this.animTab[state] > nbSprite) {
	    this.animTab[state] = 0;
	} else {
	    this.animTab[state] += inc;
	}
    }

    this.moveLeft = function() {
	if (this.moves[37]) {
	    var can = true;
	    for (var i = 0; i < this.sprite.h; i++) {
		var posx = Math.floor((this.x - 1) / 50);
		var posy = Math.floor((this.y + i) / 50);
		if (this.map[posy][posx] == 1) {
		    can = false;
		    break;
		}
	    }
	    if (can) {
		this.x -= 10;
		this.pickSprite(RUNNING_LEFT, 7, 0.5);
	    }
	}
    }

    this.moveRight = function() {
	if (this.moves[39])
	    var can = true;
	    for (var i = 0; i < this.sprite.h; i++) {
		var posx = Math.floor((this.x + this.sprite.w - 10 + 1) / 50);
		var posy = Math.floor((this.y + i) / 50);
		if (this.map[posy][posx] == 1) {
		    can = false;
		    break;
		}
	    }
	if (can) {
	    this.x += 10;
	    this.pickSprite(RUNNING_RIGHT, 7, 0.5);
	}
    }

    this.gravity = function() {
	var can = true;
	for (var i = 0; i < this.sprite.w - 10; i++) {
	    var posx = Math.floor((this.x + i) / 50);
	    var posy = Math.floor((this.y + this.sprite.h + 1) / 50);
	    if (this.map[posy][posx] != 0) {
		can = false;
		break;
	    }
	}
	if (can)
	    this.y += 10;
    }

    this.draw = function(ctx, camera) {
	this.sprite.draw(ctx, this.spriteCoord.x, this.spriteCoord.y,
			 this.sprite.w, this.sprite.h,
			 this.x - camera.lookAt.x, this.y - camera.lookAt.y,
			 this.sprite.w, this.sprite.h);
    }
}

function Camera(perso, map) {
    this.lookAt = { "x": 0, "y": 0};
    this.map = map;
    this.perso = perso;

    this.update = function() {
	this.lookAt.x = perso.x - (800 / 2);
	this.lookAt.y = perso.y - (600 / 2);
	if (this.lookAt.y < 0)
	    this.lookAt.y = 0;
	if (this.lookAt.x < 0)
	    this.lookAt.x = 0;

	if (this.lookAt.x + 800 > this.map[0].length * 50)
	    this.lookAt.x = (this.map[0].length * 50) - 800;
	if (this.lookAt.y + 600 > this.map.length * 50)
	    this.lookAt.y = (this.map.length * 50) - 600;
    }
}

function epikongJS(name) {
    var xhr = new XMLHttpRequest();

    xhr.open("GET", './maps/' + name + '.json', false);
    xhr.send(null);
    if (xhr.readyState != 4 || (xhr.status != 200 && xhr.status != 0)) {
	throw new Error("Impossible de charger la carte nommée \"" +
			name + "\" (code HTTP : " + xhr.status + ").");
    }
    mapJsonData = xhr.responseText;
    conf = JSON.parse(mapJsonData);
    this.map = conf.map;

    this.wall = new Sprite(conf.wall);
    this.outdoor = new Sprite(conf.outdoor);
    this.bush = new Sprite(conf.bush);
    this.ladder = new Sprite(conf.ladder);
    this.mainPerso = new Perso(conf.bunny, this.map);
    this.camera = new Camera(this.mainPerso, this.map);

    this.getHeight = function() { return this.map.length; }
    this.getWidth = function() { return this.map[0].length; }

    this.drawScene = function(ctx) {
	// ctx.clearRect(0, 0, 800, 600);
	ctx.fillStyle = "#FF";
	ctx.fillRect(0, 0, 800, 600);
	this.drawMap(ctx);
	this.mainPerso.draw(ctx, this.camera);
    }

    this.drawMap = function(ctx) {
	var basey = 0 - (this.camera.lookAt.y % 50);
    	for (var y = Math.floor(this.camera.lookAt.y / 50), h = this.getHeight(); y < h; y++, basey += 50.0) {
	    var basex = 0 - (this.camera.lookAt.x % 50);
    	    for (var x = Math.floor(this.camera.lookAt.x / 50), w = this.getWidth(); x < w; x++, basex += 50.0) {
    		if (this.map[y][x] == 1)
		    this.wall.draw(ctx, 0, 0, this.wall.w, this.wall.h,
				   basex, basey, this.wall.w, this.wall.h);
    		if (this.map[y][x] == 2)
		    this.bush.draw(ctx, 0, 0, this.bush.w, this.bush.h,
				   basex, basey, this.bush.w, this.bush.h);
    		if (this.map[y][x] == 3)
		    this.ladder.draw(ctx, 0, 0, this.ladder.w, this.ladder.h,
				     basex, basey, this.ladder.w, this.ladder.h);
    		if (this.map[y][x] == 6)
		    this.outdoor.draw(ctx, 0, 0, this.outdoor.w, this.outdoor.h,
				     basex, basey, this.outdoor.w, this.outdoor.h);

    	    }
    	}
    }

    this.treatments = function() {
	this.mainPerso.update();
	this.camera.update();
   }

    this.mainLoop = function(ctx) {
	this.treatments();
	this.drawScene(ctx);
    }
}

var epi = new epikongJS('level1');

window.onload = function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    document.body.addEventListener("keydown", function(e) {
	epi.mainPerso.moves[e.keyCode] = true;
    });

    document.body.addEventListener("keyup", function(e) {
	epi.mainPerso.moves[e.keyCode] = false;
    });
    setInterval(function() {
	epi.mainLoop(ctx);
    }, 40);
}
