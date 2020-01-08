//globalized variables
const TOTAL = 350;
let birds = [];
let savedBirds = [];
var pipes = [];
var counter = 0;
var cycles = 100;
let playerBird;

let jumpSfx;
let scoreSfx;
let crashSfx;
let swooshSfx;
//let increaseTimeDurationSlider;


//two fonts from google fonts page
let thinFont;
let regularFont;

//singlePlayer statistic variables
let singlePlayerScore = 0;
let singlePlayerHighScore = 0;
let soundOn = 1;

//machine learning statistic variables
let highscore = 0;
let currentScore = 0;
let relativeHighScore = 0;
let relativeCurrentScore = 0;
let mutationRate = 0.2;
let birdGenerationNumber = 1;
let bestFitness = 0;
let isSufficientlyTrained = 0;
let relativeTextHeight = 60;

//machine learning screen
let machineLearningIsRunning = 0;
//neural network depiction on machine learning screen
let neuralNetworkAnimation = [];

//title screen variables
let titleScreenIsRunning = 1;
let titlePageBirdYPosition = 200;
let titlePageBirdVelocity = 0;
let instructionScreenRunning = 0;
let isSinglePlayer = false;

//machine Learning slider
let rectWidth = 5;

//train check
let trainBlinkEffectCounter = 0;

function preload() {
	thinFont = loadFont('assets/RobotoMono-Thin.ttf');
	regularFont = loadFont('assets/RobotoMono-Regular.ttf');
	jumpSfx = loadSound('assets/blop.mp3');
	scoreSfx = loadSound('assets/ding.mp3');
	crashSfx = loadSound('assets/pop.mp3');
	swooshSfx = loadSound('assets/swoosh.mp3');
	swoosh2Sfx = loadSound('assets/swoosh2.mp3');
}

function resetVariables() {
	//increaseTimeDurationSlider.value(1);
	rectWidth = 5;
	birds = [];
	savedBirds = [];
	pipes = [];
	counter = 0;
	cycles = 100;
	neuralNetworkAnimation = [];
	mutationRate = 0.2;
	thinFont;
	regularFont;
	highscore = 0;
	currentScore = 0;
	birdGenerationNumber = 1;
	bestFitness = 0;
	isSufficientlyTrained = 0;
	relativeHighScore = 0;
	relativeCurrentScore = 0;
	singlePlayerScore = 0;
}

function Neuron(x, y, n) {
	this.x = x;
	this.y = y;
	this.node = n;
	this.r = 30;
	this.r2 = 20;
	this.nextNode = [];

	this.show = function() {
		fill(255, 255, 255, 70);
		ellipse(this.x, this.y, this.r);
		fill(255);
		ellipse(this.x, this.y, this.r2);
	}

	this.addNodes = function(network) {
		if(this.node < 3) {
			for(let i = 0; i < network.length; i++) {
				if(network[i].node == this.node + 1) {
					this.nextNode.push(network[i]);
				}
			}
		}
	}

	this.connect = function() {
		for(let i = 0; i < this.nextNode.length ; i++) {
			let rand = random(100);
			push();
			if(rand < 2) {
				if(isSufficientlyTrained) {
					strokeWeight(6);
					stroke(0, 255, 0);
				} else {
					strokeWeight(6);
					stroke(255, 0, 0);
				}
			} else {
				strokeWeight(1);
				stroke(200);
			}
			line(this.x, this.y, this.nextNode[i].x, this.nextNode[i].y);
			pop();
		}
	}

}

function setup() {
	createCanvas(1400, 800);
	//increaseTimeDurationSlider = createSlider(1, 100, 1);
}

function startLearning() {
	for(var i = 0; i < TOTAL; i++) {
		birds[i] = new Bird();

	}
	for(let i = 80; i <= 340; i += 40) {
		if(i >= 120 && i <= 300) {
			neuralNetworkAnimation.push(new Neuron(880 + 110, i, 1));
		}
		neuralNetworkAnimation.push(new Neuron(910 + ((1300 - 880)/ 2), i, 2));
	}
	neuralNetworkAnimation.push(new Neuron(1300 - 60, 180, 3));
	neuralNetworkAnimation.push(new Neuron(1300 - 60, 220, 3));

	for(let i = 0; i < neuralNetworkAnimation.length; i++) {
		neuralNetworkAnimation[i].addNodes(neuralNetworkAnimation);
	}
}

function draw() {
	background(0);
	if(titleScreenIsRunning) {
		titleScreen();
	} else if(machineLearningIsRunning) {
		machineLearning();
		drawText();
	} else if(instructionScreenRunning) {
		instructionScreen();
	} else if(isSinglePlayer) {
		singlePlayer();
	}
}

function mousePressed() {
	//machine learning screen
	if(machineLearningIsRunning) {
		if(mouseX >= 1290 && mouseX <= 1390 && mouseY >= 680 + relativeTextHeight && mouseY <= 720 + relativeTextHeight) {
			machineLearningIsRunning = 0;
			titleScreenIsRunning = 1;
		}
		if(mouseX >= 938 && mouseX <= 1197 && mouseY <= 717 + relativeTextHeight && mouseY >= 683 + relativeTextHeight) {
			if((mouseX - 938) <= 1) {
				rectWidth = 1;
			} else {
				rectWidth = mouseX - 938;
			}
		}
		if(mouseX >= 1270 && mouseX < 1395 && mouseY >= 640 + relativeTextHeight && mouseY <= 670 + relativeTextHeight) {
			rectWidth = 5;
		}
	}
	//title screen
	if(titleScreenIsRunning) {
		if(mouseX >= 90 && mouseX <= 230 && mouseY >= 205 && mouseY <= 265) {
			generateSinglePlayerLevel();
		}
		if(mouseX >= 90 && mouseX <= 590 && mouseY >= 280 && mouseY <= 340) {
			resetVariables();
			startLearning();
			titleScreenIsRunning = 0;
			machineLearningIsRunning = 1;
		}
		if(mouseX >= 90 && mouseX <= 470 && mouseY >= 355 && mouseY <= 415) {
			instructionScreenRunning = true;
			titleScreenIsRunning = false;
		}
		if(mouseX >= 90 && mouseX <= 290 && mouseY >= 740 && mouseY <= 780) {
			if(soundOn == 1) {
				soundOn = 0;
			} else {
				soundOn = 1;
			}
		}

	}
	if(instructionScreenRunning) {
		rect(50, 710, 125, 40);
		if(mouseX >= 50 && mouseX <= 175 && mouseY >= 710 && mouseY <= 750) {
			instructionScreenRunning = false;
			titleScreenIsRunning = true;
		}
	}
	if(isSinglePlayer) {
		if(mouseX > 1230 && mouseX < 1375 && mouseY > 740 && mouseY < 775) {
			resetVariables();
			isSinglePlayer = false;
			titleScreenIsRunning = 1;
			return;
		}
	}
}

function keyPressed() {
	if(isSinglePlayer) {
  	if(key == ' ') {
			if(soundOn) {
				jumpSfx.play();
			}
    	playerBird.up();
  	}
	}
}

function machineLearning() {
	for(var n = 0; n < Math.ceil(rectWidth/5); n++) {

		if(counter % 120 == 0) {
			pipes.push(new Pipe());
		}
		counter++;

		for(var i = pipes.length - 1; i >= 0; i--) {
			pipes[i].update();

			for(var j = birds.length - 1; j >= 0; j--) {
				if(pipes[i].hits(birds[j])) {
					savedBirds.push(birds.splice(j, 1)[0]);
				}
			}

			if(pipes[i].offscreen()) {
				pipes.splice(i, 1);
				relativeCurrentScore++;
				if(relativeCurrentScore > relativeHighScore) {
					relativeHighScore = relativeCurrentScore;
				}
			}
		}

		for(var i = birds.length - 1; i >= 0; i--) {
			if(birds[i].offScreen()) {
				savedBirds.push(birds.splice(i, 1)[0]);
			}
		}

		for(let bird of birds) {
			bird.think(pipes);
			bird.update();
		}

		if((currentScore - highscore) >= 1000) {
			isSufficientlyTrained = 1;
		}

		if(birds.length == 0) {
			if(currentScore > highscore) {
				highscore = currentScore;
			}
			currentScore = 0;
			relativeCurrentScore = 0;
			counter = 0;
			nextGeneration();
			birdGenerationNumber++;
			pipes = [];
		}
	}

	//drawing
	background(0);

	for(let i = 0; i < neuralNetworkAnimation.length; i++) {
		neuralNetworkAnimation[i].show();
		neuralNetworkAnimation[i].connect();
	}

	for (let bird of birds) {
		bird.show();
	}
	for(let pipe of pipes) {
		pipe.show();
	}
	push();
	noStroke();
	rect(937, 682 + relativeTextHeight, rectWidth, 37);
	pop();

	push();
	stroke(255);
	strokeWeight(3);
	line(935, 680 + relativeTextHeight, 935, 720 + relativeTextHeight);
	line(935, 680 + relativeTextHeight, 1200, 680 + relativeTextHeight);
	line(935, 720 + relativeTextHeight, 1200, 720 + relativeTextHeight);
	line(1200, 680 + relativeTextHeight, 1200, 720 + relativeTextHeight);
	pop();
}

function generateSinglePlayerLevel() {
	resetVariables();
	titleScreenIsRunning = 0;
	isSinglePlayer = true;
	playerBird = new Bird();
}

function singlePlayer() {
	if(isSinglePlayer) {
		if(counter % 120 == 0) {
			pipes.push(new Pipe())
		}
		counter++;

		for(var i = pipes.length - 1; i >= 0; i--) {
			pipes[i].update();
			if(pipes[i].hits(playerBird) || playerBird.offScreen()) {
				if(soundOn) {
					crashSfx.play();
				}
				generateSinglePlayerLevel();
				return;
			}
			if(pipes[i].offscreen()) {
				if(soundOn) {
					scoreSfx.play();
				}
				singlePlayerScore++;
				if(singlePlayerScore > singlePlayerHighScore) {
					singlePlayerHighScore = singlePlayerScore;
				}
				pipes.splice(i, 1);
			}
		}
		for(let pipe of pipes) {
			pipe.show();
		}
		playerBird.show();
		playerBird.update();
	}

	push();
	noStroke();
	textFont(regularFont);
	textSize(20);
	fill(50, 255, 50);
	text("Current Score: " + singlePlayerScore, 1150, 40);
	fill(255, 50, 50);
	text("HighScore: " + singlePlayerHighScore, 1150, 70);
	textSize(40);
	fill(255, 0, 0);
	text("RETURN", 1230, 770);
	pop();
}

function drawText() {
	push();
	strokeWeight(5);
	line(920, 0, 920, height);
	line(920, 360, 1400, 360);
	pop();

	//textSize = 20
	textSize(20);
	//text
	textSize(20);
	fill(255);
	text('BY: UMER JAVED', 1220, 340);
	textSize(25);
	text('NEUROEVOLUTION', 1180, 80);
	textSize(26);
	textFont(thinFont);
	text('JUMP', 1270, 186);
	text('FALL', 1270, 228);
	text('CURRENT SCORE:  ' + currentScore, 935, 400);
	text('HIGHSCORE:  ' + highscore, 935, 430);
	text('RELATIVE CURRENT SCORE:  ' + relativeCurrentScore, 935, 400 + relativeTextHeight);
	text('RELATIVE HIGHSCORE:  ' + relativeHighScore, 935, 430 + relativeTextHeight);
	text('GENERATION:  ' + birdGenerationNumber, 935, 460  + relativeTextHeight);
	text('MUTATION RATE: ' + mutationRate, 935, 520 + relativeTextHeight);
	text('BIRD COUNT: ' + birds.length, 935, 580 + relativeTextHeight);
	text('COST FUNCTION: SIGMOID', 935, 490 + relativeTextHeight);
  if(isSufficientlyTrained) {
		textFont(regularFont);
		text('SUFFICIENTLY TRAINED', 935, 610 + relativeTextHeight);
		push();
		stroke(0, 250, 0);
		strokeWeight(4);
		line(935, 620 + relativeTextHeight, 1245, 620 + relativeTextHeight);
		pop();
	} else {
		if(trainBlinkEffectCounter  <= 15) {
			trainBlinkEffectCounter++;
		} else {
			trainBlinkEffectCounter++;
			push();
			fill(250, 40, 40);
			noStroke();
			textFont(regularFont);
			text('NOT SUFFICIENTLY TRAINED', 935, relativeTextHeight + 610);
			pop();
			push();
			stroke(250, 0, 0);
			strokeWeight(4);
			line(935, 620 + relativeTextHeight, 1310, 620 + relativeTextHeight);
			pop();
			if(trainBlinkEffectCounter >= 30) {
				trainBlinkEffectCounter = 0;
			}
		}
	}
	textFont(thinFont);
	textSize(20);
	text('INCREASE TIME LAPSED', 935, 670 + relativeTextHeight);
	textSize(26);
	push();
	fill(255);
	rect(1290, 680 + relativeTextHeight, 100, 40);
	rect(1270, 640 + relativeTextHeight, 125, 30);
	fill(0);
	textFont(regularFont);
	textSize(20);
	text('RESET TIME', 1273, 663 + relativeTextHeight);
	textSize(26);
	text('RETURN', 1293, 710 + relativeTextHeight);
	strokeWeight(3);
	line(1250, 700 + relativeTextHeight, 1285, 700 + relativeTextHeight);
	line(1250, 700 + relativeTextHeight, 1260, 710 + relativeTextHeight);
	line(1250, 700 + relativeTextHeight, 1260, 690 + relativeTextHeight);
	pop();
	let num = Math.round((bestFitness*1000) * 10000) / 10000;
	text('PRIME FITNESS: ' + num, 935, 550 + relativeTextHeight);
	textSize(55);
	text('NEURAL NETWORK', 930, 48);
}

function titleScreen() {
	let gravity = 0.5;
	push();
	fill(255);
	textFont(thinFont);
	textSize(40);
	text("BY UMER JAVED", 400, 150);
	textFont(regularFont);
	textSize(80);
	text("WELCOME TO BIRD JUMP", 200, 100);
	fill(255);
	rect(90, 205, 140, 60);
	rect(90, 280, 500, 60);
	rect(90, 355, 380, 60);
	rect(90, 740, 200, 40);
	textSize(50);
	fill(0);
	text("PLAY", 100, 253);
	text("MACHINE LEARNING", 100, 330);
	text("INSTRUCTIONS", 100, 405);
	textSize(30);
	if(soundOn) {
		text("SOUND: ON", 100, 772);
	} else {
		text("SOUND: OFF", 100, 772);
	}
	pop();
	push();
	fill(255);
	if(titlePageBirdYPosition <= 400) {
		gravity *= 1;
	} else {
		gravity *= -1;
	}
	if((titlePageBirdVelocity == 10 && gravity < 0 || titlePageBirdVelocity == -10 && gravity > 0) && soundOn) {
	  swoosh2Sfx.play();
	}
	titlePageBirdVelocity += gravity;
	titlePageBirdYPosition += titlePageBirdVelocity;
	ellipse(1000, titlePageBirdYPosition, 100);

	pop();
}

function instructionScreen() {
	let gravity = 0.5;
	background(255);
	push();
	fill(0);
	textSize(35);
	textFont(regularFont);
	text("IN BIRD JUMP, YOU ARE A FRIVOLOUS BIRD.\nLOOKING FOR AN ADVENTURE. PRESS\n"
	 + "THE SPACE BAR TO JUMP AND AVOID\nTHE PIPES AT ALL COSTS. LETS SEE\nHOW FAR YOU CAN MAKE IT. IF NOT,\n"
	 + "WATCH AN AI, SPECIFICALLY, AN\nARTIFICIAL NEURAL NETWORK LEARN\nTO PLAY THE GAME BETTER THAN ANY\n"
	 + "HUMAN BY UTILIZING NEUROEVOLUTION\nVIA GENETIC ALGORITHM. GOOD LUCK!", 50, 50);
	text("RETURN", 50, 740);
	if(titlePageBirdYPosition <= 400) {
		gravity *= 1;
	} else {
		gravity *= -1;
	}
	if((titlePageBirdVelocity == 10 && gravity < 0 || titlePageBirdVelocity == -10 && gravity > 0) && soundOn) {
	  swooshSfx.play();
	}
	titlePageBirdVelocity += gravity;
	titlePageBirdYPosition += titlePageBirdVelocity;
	ellipse(1000, titlePageBirdYPosition, 100);
	pop();

}
