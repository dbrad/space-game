function Game(width, height) {
  var _game = this;
  var _running = true;
  var _handler = null;
  var graphics = new PIXI.autoDetectRenderer(width, height);

  this.Player = new Player();
  this.Input = new Input();
  this.GSM = new StateMachine(this);

  $('body').append(graphics.view);

  this.GSM.Add("MENU", new MenuState(), this);

  this.GSM.Change("MENU");

  var _busy       = false;
  var _delta      = 0.0;
  var DELTA_CONST = 3.0;

  var _frameRate    = 60.0;
  var _updateRate   = _frameRate * 2;
  var _updateDelta  = 0.0;
  var _renderDelta  = 0.0;

  var _renderTiming = 1000/_frameRate;
  var _updateTiming = 1000/_updateRate;

  function loop() {
    _delta += DELTA_CONST;
    if(!_busy) {
      _busy = true;

      _updateDelta += _delta;
      if(_updateDelta >= _updateTiming) {
        _updateDelta -= _updateTiming;
        Profiler.updateCounter++;
        _game.GSM.Update(_delta);
      }
      Profiler.update(_delta);

      _renderDelta += _delta;
      if(_renderDelta >= _renderTiming) {
        _renderDelta -= _renderTiming;
        Profiler.renderCounter++;
        _game.GSM.Render(graphics);
        $('#Profiler').html("Updates per Sec: " + Profiler.UPS + "<br>Renders Per Sec: " + Profiler.FPS);
      }
      Profiler.render(_delta);

      _delta -= DELTA_CONST;
      _busy = false;
    }
  }

  this.start = function() {
    _handler = setInterval(loop, DELTA_CONST);
  };

  this.stop = function() {
    clearInterval(_handler);
  };

  return this;
}
