function BaseState() {
  this.Stage = new PIXI.Container();
  return this;
}

BaseState.prototype.OnEnter = function() {};

BaseState.prototype.OnExit = function() {};

BaseState.prototype.Update = function() {};

BaseState.prototype.Render = function( graphics ) {
  $('#StateName').html(this.name);
  graphics.render(this.Stage);
};
