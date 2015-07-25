function ResourceStation(name, State, min, max) {
  var station = this;
  var eventCards = [];
  var baseMinOut = min;
  var baseMaxOut = max;

  this.name = name;

  this.MetaData = {
    get CrewCount() {
      return State.player.Crew.StationCounts[station.name];
    }
  };

  this.initGUI = function(Stage) {
    var Module = State.GUI.addGUIModule(this.name);
    var TitleEle = Module.addGUIElement("Title", new PIXI.Text(this.name, {font:"15px Consolas", fill: "white"}));
    TitleEle.anchor.x = TitleEle.anchor.y = 0.5;

    var Plus = Module.addGUIElement("Plus", PIXI.Sprite.fromImage('assets/plus.png'));
    Plus.anchor.x = Plus.anchor.y = 0.5;
    Plus.scale = new PIXI.Point(0.75,0.75);
    Plus.position.x = 50;
    Plus.position.y = 40;
    Plus.defaultCursor = "url('assets/cursor_hand.png'), pointer";
    Plus.interactive = true;
    Plus.buttonMode = true;


    var Minus = Module.addGUIElement("Minus", PIXI.Sprite.fromImage('assets/minus.png'));
    Minus.anchor.x = Minus.anchor.y = 0.5;
    Minus.scale = new PIXI.Point(0.75,0.75);
    Minus.position.x = -50;
    Minus.position.y = 40;
    Minus.defaultCursor = "url('assets/cursor_hand.png'), pointer";
    Minus.interactive = true;
    Minus.buttonMode = true;

    var CrewCount = Module.addTextElement("Count", new PIXI.Text(this.MetaData.CrewCount, {font:"15px Consolas", fill: "white"}), this.MetaData, "CrewCount");
    CrewCount.anchor.x = CrewCount.anchor.y = 0.5;

    CrewCount.position.y = 40;

    Stage.addChild(Module.LocalStage);
  };

  this.calculatedMin = function() {
    var minOut = baseMinOut;
    var crewCount = State.Crew.StationCounts[this.name];
    minOut += crewCount;
    eventCards.forEach(function(eventCard) {
      if(eventCard.mod_type == "MIN")
        minOut -= eventCard.value;
    });
    return minOut;
  };

  this.calculatedMax = function() {
    var maxOut = baseMaxOut;
    var crewCount = State.Crew.StationCounts[this.name];
    maxOut += Math.floor(crewCount / 2);
    eventCards.forEach(function(eventCard) {
      if(eventCard.mod_type == "MAX")
        maxOut -= eventCard.value;
    });
    return maxOut;
  };

  this.doTurn = function() {
    var minOut = this.calculatedMin();
    var maxOut = this.calculatedMax();

    var result = Math.floor((Math.random() * maxOut) + minOut);
    eventCards.forEach(function(eventCard) {
      eventCard.duration--;
    });
    eventCards = _.reject(eventCards, function(eventCard) {
      return eventCard.duration === 0;
    });
    return result;
  };

  this.increaseCrew = function() {

  };

  this.descreaseCrew = function() {

  };

  return this;
}
