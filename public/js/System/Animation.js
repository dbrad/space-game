var Animation = {};

Animation.Glitch = function(obj) {
  this.obj = obj;

  this.last = 0;
  this.next = 6000;

  var running = false;
  var waiting = true;
  this.config = {
    scale: 1,
    zoomPace: 60,
    zoomRate: 5 / 59.00,
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
      if(this.config.zoomCounter >= this.config.zoomPace) {
        this.config.zoomRate = -this.config.zoomRate;
        this.config.zoomCounter = 0;
      }
      this.config.zoomCounter++;
      this.config.scale += this.config.zoomRate;
      this.obj.filters[0].size = new PIXI.Point(this.config.scale, this.config.scale);
      if(this.config.scale <= 1)
        waiting = true;
    }
  //  this.obj.position.y += this.config.zoomRate;
  //  this.obj.rotation = this.config.zoomCounter * 0.1;
  };

  this.stop = function() {
    running = false;
  };
  this.start = function() {
    running = true;
  };
};
