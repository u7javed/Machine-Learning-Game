function Pipe() {
  this.top = random(height/2);
  if(isSinglePlayer) {
    this.x = width;
  } else {
    this.x = width/1.6 - 50;
  }
  this.w = 50;
  this.gap = 120;
  this.speed = 5;
  this.highLight = false;
  this.bottom = this.top + this.gap;

  this.show = function() {
    push();
    if(this.highLight) {
      fill(200, 0, 0);
    } else {
      fill(255);
    }
    pop();
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height - this.bottom);

  }

  this.hits = function(bird) {
    if(bird.y - bird.radius < this.top || bird.y + bird.radius > this.bottom) {
      if(bird.x + bird.radius > this.x && bird.x - bird.radius < this.x + this.w) {
        this.highLight = true;
        return true;
      }
    }
    this.highLight = false;
    return false;
  }

  this.update = function() {
    this.x -= this.speed;
  }

  this.offscreen = function() {
    return (this.x < -this.w);
  }
}
