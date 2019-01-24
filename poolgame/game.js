var canvas = document.getElementById("canvas");
const c    = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

const clearColor = "rgba(0, 0, 0, 0.4)";


const GRAV = new vec(0, 3);
const SPEED = 5;
const DRAG = 0.99;
const BOUNCEDRAG = 0.7;

window.addEventListener("keydown", keydownHandler);
window.addEventListener("keyup", keydownHandler);
window.addEventListener('mousemove', mouseHandler);



function mouseHandler(evt){
		//mouse.x = event.x;
		//mouse.y = event.y;
		var rect = canvas.getBoundingClientRect();
		var root = document.documentElement;
		mouse.x = evt.clientX - rect.left - root.scrollLeft;
		mouse.y = evt.clientY - rect.top - root.scrollTop;		
}



function controller(){
	this.left = false;
	this.up = false;
	this.right = false;
	this.down = false;
	this.mass = false;
	this.boids = false;

	this.control = function(player)
	{	
		if(this.left) player.vel 	= player.vel.add(new vec(-SPEED, 0));
		if(this.up) player.vel 		= player.vel.add(new vec(0, -SPEED));
		if(this.right) player.vel 	= player.vel.add(new vec(SPEED, 0));
		if(this.down) player.vel 	= player.vel.add(new vec(0, SPEED));
		if(this.mass) {
			player.mass = 40 * player.rad * 20; 
			player.color = "red"; 
		}
		else { 
			player.mass = player.rad * 20;
			player.color = player.defaultColor;
		}
	}
}

function keydownHandler(evt){
	var state = (evt.type == "keydown")? true:false;
	switch(evt.keyCode){
		case 65:
		case 37: ctrl.left  = state; break;
		case 87:
		case 38: ctrl.up    = state; break;
		case 68:
		case 39: ctrl.right = state; break;
		case 83:
		case 40: ctrl.down  = state; break;
		case 78 : ctrl.mass  = state; break;
		case 81: if(evt.type == "keydown") if(++playerIndex >= balls.length) playerIndex = 0; break;
		case 77: if(evt.type == "keydown") addBall(); break;
		case 66 : if(evt.type == "keydown") ctrl.boids = !ctrl.boids;
	}
	evt.preventDefault();
}


// clear screen
function clear() {
	c.fillStyle = clearColor;
	c.fillRect(0, 0, WIDTH, HEIGHT);
}


var colors = [

	"cyan",
	"darkblue",
	"skyblue",
	"lime",
	"yellow",
	"springgreen",
	"PaleTurquoise ",
	"salmon",
	"pink",
	"red",
	"violet"
];





// Ball object
function Ball(x, y, r, col){
	this.pos = new vec(x, y);
	this.vel = new vec(0, 0);
	this.rad = r;
	this.mass = this.rad * 20;
	this.color = col;
	this.defaultColor = col;

	

	
}


Ball.prototype.draw = function(){
	c.fillStyle = this.color;
	c.beginPath();
	c.arc(this.pos.x, this.pos.y,this.rad,0,2*Math.PI);
	c.fill();
}


Ball.prototype.update = function(dt){
	this.pos = this.pos.add(this.vel.scale(dt));

	if(this.pos.y >= HEIGHT - this.rad){
		this.pos.y = HEIGHT - this.rad;
		this.vel.y *= -BOUNCEDRAG;
	}
	if(this.pos.x >= WIDTH - this.rad){
		this.pos.x = WIDTH - this.rad;
		this.vel.x *= -BOUNCEDRAG;
	}
	if(this.pos.x <= this.rad){
		this.pos.x = this.rad;
		this.vel.x *= -BOUNCEDRAG;
	}

	
	this.vel = this.vel.add(GRAV);
	this.vel = this.vel.scale(DRAG);
	

}


function addBall() {
	var newBall = new Ball(mouse.x, mouse.y, 4, colors[Math.floor(Math.random() * (colors.length))]);
	balls.push(newBall);
	otherBalls.push(newBall);
}



//Returns true if the circles are touching, or false if they are not
function circlesColliding(ball1, ball2, dt)
{
	//compare the distance to combined radii
	var dx = ball2.pos.x - ball1.pos.x;
	var dy = ball2.pos.y - ball1.pos.y;
	var radii = ball1.rad + ball2.rad;

	if ((dx * dx) + (dy * dy) <= radii * radii) {

		var distance = Math.sqrt(((ball1.pos.x - ball2.pos.x)*(ball1.pos.x - ball2.pos.x)) + 
								((ball1.pos.y - ball2.pos.y)*(ball1.pos.y - ball2.pos.y)));

		var overLap = 0.5 * (distance - ball1.rad - ball2.rad);
		ball1.pos.x -= (overLap * (ball1.pos.x - ball2.pos.x) / distance);
		ball1.pos.y -= (overLap * (ball1.pos.y - ball2.pos.y) / distance);

		ball2.pos.x += (overLap * (ball1.pos.x - ball2.pos.x) / distance);
		ball2.pos.y += (overLap * (ball1.pos.y - ball2.pos.y) / distance);

		
		// dynamic collision
		distance = Math.sqrt(((ball1.pos.x - ball2.pos.x)*(ball1.pos.x - ball2.pos.x)) + 
								((ball1.pos.y - ball2.pos.y)*(ball1.pos.y - ball2.pos.y)));

		var nx = (ball1.pos.x - ball2.pos.x) / distance;
		var ny = (ball1.pos.y - ball2.pos.y) / distance;

		var tx = -ny;
		var ty = nx;

		var tan1 = ball1.vel.x * tx + ball1.vel.y * ty;
		var tan2 = ball2.vel.x * tx + ball2.vel.y * ty;

		var dpNorm1 = ball1.vel.x * nx + ball1.vel.y * ny;
		var dpNorm2 = ball2.vel.x * nx + ball2.vel.y * ny;


		var m1 = (dpNorm1 * (ball1.mass - ball2.mass) + 2 * ball2.mass * dpNorm2)/ (ball1.mass + ball2.mass);
		var m2 = (dpNorm2 * (ball2.mass - ball1.mass) + 2 * ball1.mass * dpNorm1)/ (ball1.mass + ball2.mass);


		ball1.vel.x = tx * tan1 + nx * m1;
		ball1.vel.y = ty * tan1 + ny * m1;
		ball2.vel.x = tx * tan2 + nx * m2;
		ball2.vel.y = ty * tan2 + ny * m2;

	}
}






// global stuff
var mouse = {
	x: undefined,
	y: undefined
}

var playerIndex = 0;
var ctrl = new controller();
var balls = [
	new Ball(400, 300, 10, "cyan"),
	new Ball(200, 300, 2, "yellow"),
	new Ball(500, 100, 50, "lightblue"),
	new Ball(50, 700, 40, "lightgreen")
];

var otherBalls = [];

//	GAME LOOP
let lastTime = 0;

function update(cc){
	clear();
	if(isNaN(cc)) cc = 0;
	const dt = (cc - lastTime)/1000;	// as miliseconds
	lastTime = cc;

	if(!ctrl.boids)
		ctrl.control(balls[playerIndex]);
	else
		for(var i in otherBalls)
			ctrl.control(otherBalls[i]);


	for(var i in balls){
		balls[i].update(dt);
	}

	for(var i in balls)
		for(var j in balls){
			if(i != j)
				circlesColliding(balls[i], balls[j], dt);
		}
	

	for(var i in balls){
		balls[i].draw();
	}

	requestAnimationFrame(update);
}

update();

