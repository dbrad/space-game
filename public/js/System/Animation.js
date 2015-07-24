var Animation = {};

Animation.Glitch = function(obj) {
  this.obj = obj;

  this.last = 0;
  this.next = Math.floor((Math.random() * 15000) + 4000);

  var running = false;
  var waiting = true;
  this.config = {
    glitch: 1,
    glitchPace: 60,
    glitchRate: 5 / 59.00,
    glitchCounter: 0,
    scale: 1,
    zoomPace: 180,
    zoomRate: -0.05 / 179.00,
    zoomCounter: 0
  };
  this.update = function(delta) {
    if(!running)
      return;
    this.last += delta;
    if(this.last >= this.next && waiting) {
        this.last -= this.next;
        waiting = false;
        this.next = Math.floor((Math.random() * 15000) + 4000);
    }
    if(!waiting) {
      if(this.config.glitchCounter >= this.config.glitchPace) {
        this.config.glitchRate = -this.config.glitchRate;
        this.config.glitchCounter = 0;
      }
      this.config.glitchCounter++;
      this.config.glitch += this.config.glitchRate;
      this.obj.filters[0].size = new PIXI.Point(this.config.glitch, this.config.glitch);
      if(this.config.glitch <= 1)
        waiting = true;
    }

    // if(this.config.zoomCounter >= this.config.zoomPace) {
    //   this.config.zoomRate = -this.config.zoomRate;
    //   this.config.zoomCounter = 0;
    // }
    // this.config.zoomCounter++;
    // this.config.scale += this.config.zoomRate;
    //
    // this.obj.scale = new PIXI.Point(this.config.scale, this.config.scale);

  };

  this.stop = function() {
    running = false;
  };
  this.start = function() {
    running = true;
  };
};
