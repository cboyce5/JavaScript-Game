update_scores();

var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");

var blocks = [
	[true, true, true, true, true, true],
	[true, true, true, true, true, true],
	[true, true, true, true, true, true],
	[true, true, true, true, true, true],
	[true, true, true, true, true, true],
];

var colors = ["#ff0000", "#ffff00", "#00ff00", "#0000ff", "#810081", "#000000"];

var score = 0;
var scoreModifier = 1;

var balls = 2;

var paddleX = 250;

var x = 300;
var y = 535;

var dx, dy;

var timerHandle;
var timerRunning = false;

window.addEventListener("keydown", keyPress, false);

draw();

// Redraws the screen.
function draw() {
	//clear screen
	context.clearRect(0, 0, canvas.width, canvas.height);
	
	//draw blocks
	for (i = 0; i < blocks.length; i++) {
		for (j = 0; j < blocks[i].length; j++) {
			if (blocks[i][j]) {
				context.fillStyle = colors[i];
				context.fillRect(100+65*j, 100+25*i, 60, 20);
			}
		}
	}
	
	//draw paddle
	context.fillStyle = colors[5];
	context.fillRect(paddleX, 560, 100, 20);
	
	//draw ball
	if (balls != 0) {
		context.beginPath();
		context.arc(x,y,25,0,2 * Math.PI, false);
		context.fillStyle = colors[5];
		context.fill();
		context.stroke();
	}
	
	
	//draw score
	context.font = "30px Arial";
	context.fillText("Score: "+score, 5, 35);
	context.fillText("Balls: "+balls, 490, 35);
}

// Sets the direction of the ball randomly within a 90 degree range where 45 degrees is straight up.
function setDirection() {
	angle = Math.floor(Math.random() * 90);
	angle += 45;
	dx = Math.cos(angle * Math.PI / 180);
	dy = Math.sin(angle * Math.PI / 180);
}

// Resets the position of the ball to be above the paddle.
function resetBall() {
	x = paddleX+50;
	y = 535;
}

// Checks to see if a rectangle and circle are colliding. See readme for source.
function RectCircleColliding(rect, state){
    var distX = Math.abs(x - rect.x-rect.w/2);
    var distY = Math.abs(y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + 25)) { return false; }
    if (distY > (rect.h/2 + 25)) { return false; }

    if (distX <= (rect.w/2)) {
		if (state) {
			dy = dy * -1;
		}
		return true; 
	} 
    if (distY <= (rect.h/2)) {
		if (state) {
			dx = dx * -1;
		}
		return true; 
	}

    var dxx=distX-rect.w/2;
    var dyy=distY-rect.h/2;
    return (dxx*dxx+dyy*dyy<=(25*25));
}

// Checks collisions between window sides, paddle, and blocks.
function checkCollisions() {
	if (x - 25 < 0) { 	//bounce off left wall
		dx = dx * -1;
	}
	else if (x + 25 > 600) {	//bounce off right wall
		dx = dx * -1;
	}
	else if (y - 25 < 0) {	//bounce off top wall
		dy = dy * -1;
	}
	else if (y > 625) {		//go off bottom of screen
		timerRunning = false;
		clearInterval(timerHandle);
		resetBall();
		balls--;
		if (balls == 0) {
      highscore(score);
			alert("Game Over. You Lose. Your score: " + score);
		}
	}
	else if (y + 25 > 560) {	//paddle collision
		if ( x >= paddleX && x <= paddleX+100) {
			dy = dy * -1;
			scoreModifier = 1;
		}
	}
	for (i = 0; i < blocks.length; i++) {
		for (j = 0; j < blocks[i].length; j++) {
			var rect = {x:100+65*j,y:100+25*i,w:60,h:20};
			if (RectCircleColliding(rect, blocks[i][j]) && blocks[i][j]) {
				blocks[i][j] = false;
				score += scoreModifier;
				scoreModifier++;
			}
		}
	}
}

// Timer function for moving the ball once spacebar is pressed.
function timer() {
	x -= dx;
	y -= dy;
	checkCollisions();
	draw();
	var done = true;
	for (i = 0; i < blocks.length; i++) {
		for (j = 0; j < blocks[i].length; j++) {
			if (blocks[i][j]) {
				done = false;
			}
		}
	}
	if (done) {
    highscore(score);
		alert("Game Over. You Win. Your score: " + score)
	}
}

// Key press function for spacebar, left and right arrow.
function keyPress(event) {
	switch(event.keyCode) {
		case 32:	//spacebar
			if (!timerRunning) {
				timerRunning = true;
				setDirection();
				timerHandle = window.setInterval(timer, 10);
			}
			break;
		case 37:	//left arrow
			paddleX -= 8;
			if (paddleX < 0) {
				paddleX = 0;
			}
			context.clearRect(0, 560, canvas.width, 20);
			context.fillStyle = "#000000";
			context.fillRect(paddleX, 560, 100, 20);
			break;
		case 39:	//right arrow
			paddleX += 8;
			if (paddleX > 500) {
				paddleX = 500;
			}
			context.clearRect(0, 560, canvas.width, 20);
			context.fillStyle = "#000000";
			context.fillRect(paddleX, 560, 100, 20);
			break;
	}
}
