GameOverState.prototype = new BaseState();
GameOverState.prototype.constructor = GameOverState;

function GameOverState() {
  BaseState.call(this);
  var keyQueue = [];
  function pushInput( key ) {
    keyQueue.push(key);
  }

  var _State = this;

  var GUI = new GUIModules(this);

  this.OnEnter = function() {
    this.Stage = new PIXI.Container();
    this.game.Input.AddObserverCallback(pushInput);

    var GameOver = GUI.addGUIModule('GameOver');

    var GOText = GameOver.addGUIElement("GameOver", new PIXI.Text("Game Over", {font:"25px Consolas", fill: "white"}));
    GOText.anchor = new PIXI.Point(0.5, 0.5);
    GOText.position = new PIXI.Point(this.game.getWidth()/2, this.game.getHeight()/2);

    this.Stage.addChild(GameOver.LocalStage);
  };

  this.OnExit = function() {
    this.game.Input.ClearObservers();
    this.Stage.destroy(true);
  };

  this.Update = function() {
    var topKey = keyQueue.shift();
    switch( topKey ) {
      case "ENTER":
        this.gsm.Change("GAME");
      break;
      default:
      break;
    }
  };

  return this;
}
