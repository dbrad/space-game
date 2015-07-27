function DaySystem(difficulty, State) {
  var _difficulty = {
    "EASY" : {
      dayLength: 5,
      gameLength: 20
    },
    "NORMAL" : {
      dayLength: 3,
      gameLength: 30
    },
    "HARD" : {
      dayLength: 2,
      gameLength: 40
    }
  };

  var day = 1;
  var turn = 1;

  var dayLength = _difficulty[difficulty].dayLength || 3;
  var gameLength = _difficulty[difficulty].gameLength || 30;

  this.GUI = State.GUI;

  this.data = {
    get day() {
      return day;
    },
    get turn() {
      return turn;
    },
    incrementTurn: function() {
      turn++;
      if(turn > dayLength)
        this.incrementDay();
    },
    incrementDay: function() {
      day++;
      turn = 1;
      return !(this.isGameOver());
    },
    isGameOver: function() {
      var gameOver = (day > gameLength);
      return gameOver;
    }
  };

  this.initGUI = function(Stage) {
    var Module = this.GUI.addGUIModule("DaySystem");
    var DayEle = Module.addTextElement("Day", new PIXI.Text("0", { font : "50px Share Tech Mono", fill: "white"}), this.data, "day");
    DayEle.anchor.x = 1.0;
    DayEle.position.x = (40);

    var TurnEle = Module.addTextElement("Turn", new PIXI.Text("0", { font : "50px Share Tech Mono", fill: "white"}), this.data, "turn");
    TurnEle.anchor.x = 1.0;
    TurnEle.position.y = (50);
    TurnEle.position.x = (40);
    var Labels = Module.addGUIElement("Labels", new PIXI.Text("DAY\rTURN", {font: "50px Share Tech Mono", fill: "white", align: "right", lineHeight: 50}));
    Labels.anchor.x = 1.0;
    Labels.position.x = -35;

    Stage.addChild(Module.LocalStage);
  };

}
