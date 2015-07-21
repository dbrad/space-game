function ResourceStation(name, GUI, crewlist, min, max) {
  var station = this;
  var eventCards = [];
  var baseMinOut = min;
  var baseMaxOut = max;
  var crew = crewlist;

  this.data = {
    get crew() {
      var result = 0;
      crew.forEach(function(crewman) {
        if(crewman.Station == station.name)
          result++;
      });
      return result;
    },
    get maxCrew() {
      var Default = 5;
      var result = Default;
      // TODO(david): Handle Upgrades
      return result;
    }
  };

  this.GUI = GUI;

  this.name = name;

  this.initGUI = function(Stage) {
    var Module = GUI.addGUIModule(this.name);
    var TitleEle = Module.addGUIElement("Title", new PIXI.Text(this.name, {font:"15px monospace", fill: "white"}));
    TitleEle.anchor.x = TitleEle.anchor.y = 0.5;

    var CrewCount = Module.addTextElement("Count", new PIXI.Text(this.data.crew, {font:"15px monospace", fill: "white"}), this.data, "crew");
    CrewCount.anchor.x = CrewCount.anchor.y = 0.5;
    CrewCount.position.y = 20;

    Stage.addChild(Module.LocalStage);
  };

  this.getCrewCount = function() {
    var station = this;
    var result = 0;
    crew.forEach(function(crewman) {
      if(crewman.Station == station.name)
        result++;
    });
    return result;
  };

  this.calculatedMin = function() {
    var minOut = baseMinOut;
    var crewCount = this.getCrewCount();
    minOut += crewCount;
    eventCards.forEach(function(eventCard) {
      if(eventCard.mod_type == "MIN")
        minOut -= eventCard.value;
    });
    return minOut;
  };

  this.calculatedMax = function() {
    var maxOut = baseMaxOut;
    var crewCount = this.getCrewCount();
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

  return this;
}
