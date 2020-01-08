function Bird(brain) {
  if(isSinglePlayer) {
    this.y = 80;
  } else {
    this.y = height/2;
  }
  this.x = 60;
  this.radius = 12;

  this.gravity = 0.9;
  this.jump = -18;
  this.velocity = 0;

  this.score = 0;
  this.fitness = 0;
  this.upDecision = false;
  if(brain) {
    this.brain = brain.copy();
  } else {
    this.brain = new NeuralNetwork(5, 8, 2);
  }

  this.show = function() {
    stroke(255);
    if(!isSinglePlayer) {
      if(!isSufficientlyTrained) {
        fill(255, 0, 0, 100);
      } else {
        fill(0, 255, 0, 100);
      }
    } else {
      fill(255);
    }
    ellipse(this.x, this.y, 2*this.radius, 2*this.radius);
  }

  this.up = function() {
    this.velocity += this.jump;
  }

  this.mutate = function() {
    this.brain.mutate(mutationRate);
  }

  this.think = function(pipes) {
    let closest = pipes[0];
    let closestD = Infinity;
    for(let i = 0; i < pipes.length; i++) {
      let d = (pipes[i].x + pipes[i].w) - this.x;
      if(d < closestD && d > 0) {
        closest = pipes[i];
        closestD = d;
      }
    }

    let inputs = [];
    inputs[0] = this.y / height;
    inputs[1] = closest.top / height;
    inputs[2] = closest.bottom / height;
    inputs[3] = closest.x / 880;
    inputs[4] = this.velocity / 10;
    if(this.x > closest.x) {
      currentScore++;
    }

    let output = this.brain.predict(inputs);
    if(output[0] > output[1] && this.velocity >= 0) {
      this.up();
      this.upDecision = true;
    } else {
      this.upDecision = false;
    }
  }

  this.offScreen = function() {
    return(this.y + this.radius > height || this.y - this.radius < 0);
  }

  this.update = function() {
    this.score ++;

      this.velocity += this.gravity;
      this.velocity *= 0.9;
      this.y += this.velocity;

  }
}
