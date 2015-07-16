MenuState.prototype = new BaseState();
MenuState.prototype.constructor = MenuState;

function MenuState() {
  BaseState.call(this);
  var State = this;

  return this;
}
