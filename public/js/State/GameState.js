GameState.prototype = new BaseState();
GameState.prototype.constructor = MenuState;

function GameState() {
  BaseState.call(this);
  var State = this;

  return this;
}
