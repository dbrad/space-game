function ResourceStation(name, State, min, max) {
  var station = this;
  var eventCards = [];
  var baseMinOut = min;
  var baseMaxOut = max;

  this.name = name;
  this.MaxCrew = 5;

  this.MetaData = {
    get CrewCount() {
      return State.player.Crew.StationCounts[station.name];
    },
    get MinGen() {
      return station.calculatedMin();
    },
    get MaxGen() {
      return station.calculatedMax();
    }
  };

  this.initGUI = function(Stage) {
    var Module = State.GUI.addGUIModule(this.name);
    var TitleEle = Module.addGUIElement("Title", new PIXI.Text(this.name, {font:"21px Share Tech Mono", fill: "white"}));
    TitleEle.anchor.x = TitleEle.anchor.y = 0.5;

    var YRow = 20;

    var MaxCrewLabel = Module.addGUIElement("MaxCrewLabel", new PIXI.Text("Max Crew", {font:"16px Share Tech Mono", fill: "white"}));
    MaxCrewLabel.anchor.x = 0.5;
    MaxCrewLabel.anchor.y = 0.5;
    MaxCrewLabel.position.y = YRow;

    YRow += 20;

    var MaxCrew = Module.addTextElement("MaxCrew", new PIXI.Text(this.MaxCrew, {font:"16px Share Tech Mono", fill: "white"}), this, "MaxCrew");
    MaxCrew.anchor.x = 0.5;
    MaxCrew.anchor.y = 0.5;
    MaxCrew.position.y = YRow;

    YRow += 20;

    var GenerationLabel = Module.addGUIElement("GenerationLabel", new PIXI.Text("Generation", {font:"16px Share Tech Mono", fill: "white"}));
    GenerationLabel.anchor.x = 0.5;
    GenerationLabel.anchor.y = 0.5;
    GenerationLabel.position.y = YRow;

    YRow += 20;

    var GenDash = Module.addGUIElement("GenDash", new PIXI.Text("-", {font:"16px Share Tech Mono", fill: "white"}));
    GenDash.anchor.x = 0.5;
    GenDash.anchor.y = 0.5;
    GenDash.position.y = YRow;

    var GenMin = Module.addTextElement("GenMin", new PIXI.Text(this.MetaData.MinGen, {font:"16px Share Tech Mono", fill: "white"}), this.MetaData, "MinGen");
    GenMin.anchor.x = 0.5;
    GenMin.anchor.y = 0.5;
    GenMin.position.y = YRow;
    GenMin.position.x = -20;

    var GenMax = Module.addTextElement("GenMax", new PIXI.Text(this.MetaData.MaxGen, {font:"16px Share Tech Mono", fill: "white"}), this.MetaData, "MaxGen");
    GenMax.anchor.x = 0.5;
    GenMax.anchor.y = 0.5;
    GenMax.position.y = YRow;
    GenMax.position.x = 20;

    YRow += 20;

    var CrewCount = Module.addTextElement("Count", new PIXI.Text(this.MetaData.CrewCount, {font:"16px Share Tech Mono", fill: "white"}), this.MetaData, "CrewCount");
    CrewCount.anchor.x = CrewCount.anchor.y = 0.5;
    CrewCount.position.y = YRow;

    var Plus = Module.addGUIElement("Plus", PIXI.Sprite.fromImage('assets/plus.png'));
    Plus.anchor.x = Plus.anchor.y = 0.5;
    Plus.scale = new PIXI.Point(0.75,0.75);
    Plus.position.x = 50;
    Plus.position.y = YRow;
    Plus.defaultCursor = "url('assets/cursor_hand.png'), pointer";
    Plus.interactive = true;
    Plus.buttonMode = true;


    var Minus = Module.addGUIElement("Minus", PIXI.Sprite.fromImage('assets/minus.png'));
    Minus.anchor.x = Minus.anchor.y = 0.5;
    Minus.scale = new PIXI.Point(0.75,0.75);
    Minus.position.x = -50;
    Minus.position.y = YRow;
    Minus.defaultCursor = "url('assets/cursor_hand.png'), pointer";
    Minus.interactive = true;
    Minus.buttonMode = true;



    Stage.addChild(Module.LocalStage);
  };

  this.calculatedMin = function() {
    var minOut = baseMinOut;
    var crewCount = State.Crew.StationCounts[this.name];
    minOut += Math.ceil((crewCount+2) / 2);
    if(crewCount === 0)
      minOut = baseMinOut;
    eventCards.forEach(function(eventCard) {
      if(eventCard.mod_type == "MIN")
        minOut -= eventCard.value;
    });
    return minOut;
  };

  this.calculatedMax = function() {
    var maxOut = baseMaxOut;
    var crewCount = State.Crew.StationCounts[this.name];
    maxOut += Math.ceil((crewCount+3) / 2);
    if(crewCount === 0)
      maxOut = baseMaxOut;
    eventCards.forEach(function(eventCard) {
      if(eventCard.mod_type == "MAX")
        maxOut -= eventCard.value;
    });
    return maxOut;
  };

  this.doTurn = function() {
    var minOut = this.calculatedMin();
    var maxOut = this.calculatedMax();

    var result = Math.floor((Math.random() * (maxOut - minOut + 1) + minOut) );
    eventCards.forEach(function(eventCard) {
      eventCard.duration--;
    });
    eventCards = _.reject(eventCards, function(eventCard) {
      return eventCard.duration === 0;
    });
    return result;
  };

  this.increaseCrew = function(event) {
    if(this.MetaData.CrewCount < this.MaxCrew)
      State.player.Crew.assignCrew(this.name, event);
  };

  this.descreaseCrew = function() {

  };

  return this;
}
