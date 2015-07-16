var Profiler = {
  FPS: 0,
  renderCounter: 0,
  renderTimer: 0,
  render: function(delta) {
    this.renderTimer += delta;
    if(this.renderTimer >= 1000) {
      this.FPS = this.renderCounter;
      this.renderCounter = 0;
      this.renderTimer -= 1000;
    }
  },
  UPS: 0,
  updateCounter: 0,
  updateTimer: 0,
  update: function(delta) {
    this.updateTimer += delta;
    if(this.updateTimer >= 1000) {
      this.UPS =  this.updateCounter;
      this.updateCounter = 0;
      this.updateTimer -= 1000;
    }
  }
};
