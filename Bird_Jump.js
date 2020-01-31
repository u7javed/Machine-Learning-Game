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
let runInstruction = true;

//machine learning screen
let machineLearningIsRunning = 0;
//neural network depiction on machine learning screen
let neuralNetworkAnimation = [];

//title screen variables
let titleScreenIsRunning = 1;
let titlePageBirdYPosition;
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
			let rand;
			if(rectWidth <= (mouseX - (width/1.6 + 20))/4) {
				rand = random(200);
			} else if(rectWidth <= (mouseX - (width/1.6 + 20))/2) {
				rand = random(150);
			} else if(rectWidth <= (mouseX - ((width/1.6 + 20))/2) + ((mouseX - (width/1.6 + 20))/4)) {
				rand = random(100);
			} else {
				rand = random(50);
			}
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

function windowResized() {
	if((402 + height/2.9 + height/36) >= windowHeight) {
		document.body.style.overflowY = "scroll";
		resizeCanvas(windowWidth, (402 + height/2.9 + height/36) + 20);
	} else {
		document.body.style.overflowY = "hidden";
		resizeCanvas(windowWidth, windowHeight);
	}
	resetVariables();
	titleScreenIsRunning = true;
	machineLearningIsRunning = false;
	instructionScreenRunning = false;
	isSinglePlayer = false;
	titlePageBirdYPosition = windowHeight/4;
}

function setup() {
	createCanvas(windowWidth, windowHeight)
	if((402 + height/2.9 + height/36) <= windowHeight) {
		document.body.style.overflowY = "hidden";
	} else if((402 + height/2.9 + height/36) >= windowHeight) {
		windowResized();
	}
	titlePageBirdYPosition = windowHeight/4;
	//increaseTimeDurationSlider = createSlider(1, 100, 1);
}

function startLearning() {
	for(var i = 0; i < TOTAL; i++) {
		birds[i] = new Bird();

	}
	for(let i = 80; i <= 340; i += 40) {
		if(i >= 120 && i <= 300) {
			neuralNetworkAnimation.push(new Neuron(width/1.6 + 40, i, 1));
		}
		neuralNetworkAnimation.push(new Neuron(((width/1.6) + (width - 160))/2, i, 2));
	}
	neuralNetworkAnimation.push(new Neuron(width - 160, 180, 3));
	neuralNetworkAnimation.push(new Neuron(width - 160, 220, 3));

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
		if(runInstruction) {
			instructionDialog();
		}
	} else if(instructionScreenRunning) {
		instructionScreen();
	} else if(isSinglePlayer) {
		singlePlayer();
	}
}

function mousePressed() {
	//machine learning screen
	if(machineLearningIsRunning) {

		//return button
		if(mouseX >= (width - 110) && mouseX <= (width - 10) && mouseY >= (height - 40) && mouseY <= (height - 5)) {
			machineLearningIsRunning = 0;
			titleScreenIsRunning = 1;
		}
		//time lapse scroll
		else if(mouseX >= (width/1.6 + 20) && mouseX <= (width/1.6 + 18 + (width - width/1.6)/2) && mouseY >= (390 + height/2.9) && mouseY <= (400 + height/2.9 + height/36)) {
			if(mouseX <= (width/1.6 + 20)) {
				rectWidth = 1;
			} else {
				rectWidth = mouseX - (width/1.6 + 20);
			}
		}
		//reset time
		else if(mouseX >= (width - 130) && mouseX <= width && mouseY >= (height - 80) && mouseY <= (height - 45)) {
			rectWidth = 5;
		}
		//reset machine learning
		else if(mouseX >= (width - 110) && mouseX <= (width - 10) && mouseY >= (height - 120) && mouseY <= (height - 85)) {
			resetVariables();
			startLearning();
		} else if(mouseX > (width/4 + width/4.4) && mouseX < (width/4 + width/4.4 + width/12) && mouseY > (height/4 + height/1.65) && mouseY < (height/4 + height/1.65 + height/16)) {
				runInstruction = false;
		}
	}
	//title screen
	else if(titleScreenIsRunning) {
		//single player
		if(mouseX >= width/14 && mouseX <= (width/14 + 140) && mouseY >= height/3 && mouseY <= (height/3 + 60)) {
			generateSinglePlayerLevel();
		}

		//machine learning
		if(mouseX >= width/14 && mouseX <= (width/14 + 500) && mouseY >= height/2.2 && mouseY <= (height/2.2 + 60)) {
			resetVariables();
			startLearning();
			runInstruction = true;
			titleScreenIsRunning = 0;
			machineLearningIsRunning = 1;
		}

		//instructionScreen
		if(mouseX >= width/14 && mouseX <= (width/14 + 380) && mouseY >= height/1.72 && mouseY <= (height/1.72 + 60)) {
			instructionScreenRunning = true;
			titleScreenIsRunning = false;
		}
		//sound on or off
		if(mouseX >= width/14 && mouseX <= (width/14 + 200) && mouseY >= (height - 50) && mouseY <= (height - 10)) {
			if(soundOn == 1) {
				soundOn = 0;
			} else {
				soundOn = 1;
			}
		}

	} else if(instructionScreenRunning) {
		//return to main screen
		if(mouseX >= 50 && mouseX <= 175 && mouseY >= (height - 60) && mouseY <= (height - 30)) {
			instructionScreenRunning = false;
			titleScreenIsRunning = true;
		}
	}
	if(isSinglePlayer) {
		//return
		if(mouseX > width - 180 && mouseX < width - 35 && mouseY > height - 60 && mouseY < height - 30) {
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

function instructionDialog() {
	push();
	fill(0, 250, 250, 80);
	rect(width/4, height/5.4, width/2.78, height/1.46, 20);
	fill(50, 250, 80, 190);
	rect(width/4 + width/4.4, height/4 + height/1.65, width/12, height/16, 10);
	fill(255);
	textSize(width/72);
	text("Welcome to the MACHINE LEARNING ASPECT\nof the Bird Jump Game. Here, an\n"
	+ "Artifical Neural Network will learn to\nplay the game by tweaking weights based on\n"
	+ "which bird has the best fitness called\nprime fitness. The bird with the best\n"
	+ "fitness will than pass on its data to\nthe network, allowing it to learn.\n\n"
	+ "YOU CAN TIME LAPSE BY INCREASING THE\nTIME LAPSE BAR at the bottom since\n"
	+ "training a NN can often take some time.\n"
	+ "HIT RESET TIME to return time to normal.\n\n"
	+ "Hit the RED RESET button to start the\ntraining of the network from scratch.\n\n"
	+ "Hit the RETURN button to return to Menu.", width/4 + width/120, height/4.5);
	textSize(width/40);
	strokeWeight(3);
	text("OK", width/1.98, height/1.104)
	pop();
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
	text("Current Score: " + singlePlayerScore, width - 220, 40);
	fill(255, 50, 50);
	text("HighScore: " + singlePlayerHighScore, width - 220, 70);
	textSize(40);
	fill(255, 0, 0);
	text("RETURN", width - 180, height - 30);
	pop();
}

function drawText() {
	push();
	strokeWeight(5);
	line(width/1.6, 0, width/1.6, height);
	line(width/1.6, 360, width, 360);
	pop();

	//textSize = 20
	textSize(20);
	fill(255);
	text('BY: UMER JAVED', width - 180, 340);
	textSize(25);
	text('NEUROEVOLUTION', width - 220, 80);
	textSize(26);
	textFont(thinFont);
	text('JUMP', width - 130, 186);
	text('FALL', width - 130, 228);

	textSize(20);
	text('CURRENT SCORE:  ' + currentScore, width/1.6 + 20, 360 + height/18);
	text('HIGHSCORE:  ' + highscore, width/1.6 + 20, 360 + height/12);
	text('RELATIVE CURRENT SCORE:  ' + relativeCurrentScore, width/1.6 + 20, 360 + height/8.8);
	text('RELATIVE HIGHSCORE:  ' + relativeHighScore, width/1.6 + 20, 360 + height/7);
	text('GENERATION:  ' + birdGenerationNumber, width/1.6 + 20, 360 + height/5.86);
	text('MUTATION RATE: ' + mutationRate, width/1.6 + 20, 360 + height/5.02);
	text('BIRD COUNT: ' + birds.length, width/1.6 + 20, 360 + height/4.4);
	text('ACTIVATION FUNCTION: SIGMOID', width/1.6 + 20, 360 + height/3.9);
	let num = Math.round((bestFitness*1000) * 10000) / 10000;
	text('PRIME FITNESS: ' + num, width/1.6 + 20,360 + height/3.51);
  if(isSufficientlyTrained) {
		textFont(regularFont);
		text('SUFFICIENTLY TRAINED', width/1.6 + 20, 360 + height/3.2);
		push();
		stroke(0, 250, 0);
		strokeWeight(4);
		line(width/1.6 + 20, 370 + height/3.2, width/1.6 + 320, 370 + height/3.2);
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
			text('NOT SUFFICIENTLY TRAINED', width/1.6 + 20, 360 + height/3.2);
			pop();
			push();
			stroke(250, 0, 0);
			strokeWeight(4);
			line(width/1.6 + 20, 370 + height/3.2, width/1.6 + 320, 370 + height/3.2);
			pop();
			if(trainBlinkEffectCounter >= 30) {
				trainBlinkEffectCounter = 0;
			}
		}
	}
	textFont(thinFont);
	textSize(20);
	text('INCREASE TIME LAPSED', width/1.6 + 20, 380 + height/2.9);
	textSize(26);
	push();
	fill(255);

	//return
	fill(255);
	strokeWeight(3);
	line(width - 120, height - 22, width - 180, height - 22);
	line(width - 180, height - 22, width - 160, height - 35);
	line(width - 180, height - 22, width - 160, height - 9);

	//return box
	rect(width - 110, height - 40, 100, 35);

	//reset timebox
	rect(width - 130, height - 80, 130, 35);

	//reset Learning
	push();
	noStroke();
	fill(255, 0, 0, 190);
	rect(width - 110, height - 120, 100, 35);
	pop();

	fill(0);
	textFont(regularFont);
	textSize(20);
	text('RESET TIME', width - 126, height - 55);
	textSize(26);
	strokeWeight(3);
	text('RETURN', width - 106, height - 12);
	push();
	fill(255);
	strokeWeight(1);
	text('RESET', width - 98, height - 94);
	pop();

	//time lapsed
	line(width/1.6 + 18, 388 + height/2.9, width/1.6 + (width - width/1.6)/2 + 20, 388 + height/2.9);
	line(width/1.6 + 18, 388 + height/2.9, width/1.6 + 18, 402 + height/2.9 + height/36);
	line(width/1.6 + 18, 402 + height/2.9 + height/36, width/1.6 + (width - width/1.6)/2 + 20, 402 + height/2.9 + height/36);
	line(width/1.6 + (width - width/1.6)/2 + 20, 388 + height/2.9, width/1.6 + (width - width/1.6)/2 + 20, 402 + height/2.9 + height/36);

	//return

	//time LAPSEDpush();
	if(isSufficientlyTrained) {
		fill(0, 255, 0);
	} else {
		fill(255, 0, 0);
	}
	noStroke();
	rect(width/1.6 + 20, 390 + height/2.9, rectWidth, height/36 + 11);
	pop();

	textSize(55);
	text('NEURAL NETWORK', width/1.6 + width/86, 48);
}

function titleScreen() {
	push();
	fill(255);

	//welcome to bird JUMP text
	textFont(regularFont);
	textSize(80);
	text("WELCOME TO BIRD JUMP", width/2 - width/2.8, height/9);

	//my name
	textFont(thinFont);
	textSize(40);
	text("BY UMER JAVED", width/2 - width/8, height/5);

	fill(255);
	//play rectangle
	rect(width/14, height/3, 140, 60);
	//machine learning rectangle
	rect(width/14, height/2.2, 500, 60);
	//instructions rectangle
	rect(width/14, height/1.72, 380, 60);
	//sound rectangle
	rect(width/14, height - 50, 200, 40);

	textSize(50);
	fill(0);
	text("PLAY", width/14 + 10, height/3 + 50);
	text("MACHINE LEARNING", width/14 + 10, height/2.2 + 50);
	text("INSTRUCTIONS", width/14 + 10, height/1.72 + 50);
	textSize(30);
	if(soundOn) {
		text("SOUND: ON", width/14 + 10, height - 18);
	} else {
		text("SOUND: OFF", width/14 + 10, height - 18);
	}
	pop();
	push();
	fill(255);

	birdAnimation();

	pop();
}

function birdAnimation() {
	let gravity = 0.5;
	if(titlePageBirdYPosition <= windowHeight/1.8) {
		gravity *= 1;
	} else {
		gravity *= -1;
	}
	if((titlePageBirdVelocity == 10 && gravity < 0 || titlePageBirdVelocity == -10 && gravity > 0) && soundOn) {
		if(titleScreenIsRunning) {
			swoosh2Sfx.play();
		} else if(instructionScreenRunning) {
			swooshSfx.play();
		}
	}
	titlePageBirdVelocity += gravity;
	titlePageBirdYPosition += titlePageBirdVelocity;
	ellipse(width/1.3, titlePageBirdYPosition, 100);
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
	text("RETURN", 50, height - 30);
	birdAnimation();
	pop();

}
