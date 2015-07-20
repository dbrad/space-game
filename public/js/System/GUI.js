function GUIModules(state) {
  var _State = state;

  this.Modules = {};
  this.addGUIModule = function(name) {
    this.Modules[name] = new GUIModule(name);
    return this.Modules[name];
  };

  this.init = function(Stage) {
    var TurnTracker = this.addGUIModule("TurnTracker");
    var DayEle = TurnTracker.addGUIElement("Day", new PIXI.Text("0", { font : "20px monospace", fill: "white"}));

    var numberX =  (_State.game.getWidth()/2 + 5);
    DayEle.position.x = numberX;

    var TurnEle = TurnTracker.addGUIElement("Turn", new PIXI.Text("0", { font : "20px monospace", fill: "white"}));
    TurnEle.position.x = numberX;
    TurnEle.position.y = (19);

    Stage.addChild(TurnTracker.LocalStage);
  };

  this.DayTurnGUI = {
    Day: new PIXI.Text("0", { font : "20px monospace", fill: "white"}),
    Turn: new PIXI.Text("0", { font : "20px monospace", fill: "white"}),

    init: function(Stage) {
      this.LocalStage = new PIXI.Container();

      var Header = new PIXI.Text("DAY\rTURN", {font: "20px monospace", fill: "white", align: "right"});
      Header.anchor.x = 1;
      Header.position.x = (_State.game.getWidth()/2) - 5 ;
      this.LocalStage.addChild(Header);
/*
      var numberX =  (_State.game.getWidth()/2 + 5);

      this.Day.position.x = numberX;
      Stage.addChild(this.Day);
      this.Turn.position.x = numberX;
      this.Turn.position.y = (19);
      this.LocalStage.addChild(this.Turn);
      */
      Stage.addChild(this.LocalStage);
    },
    cleanUp: function() {
      if(this.LocalStage)
        this.LocalStage.destroy(true);
    }
  };

  this.ResourceGUI = {
    Rations: new PIXI.Text("0", { font : "15px monospace", fill: "white"}),
    Energy: new PIXI.Text("0", { font : "15px monospace", fill: "white"}),
    Ore: new PIXI.Text("0", { font : "15px monospace", fill: "white"}),


    init : function(Stage) {
      var Labels = new PIXI.Text("RATIONS\rENERGY\rORE", {font: "15px monospace", fill: "white"});
      Stage.addChild(Labels);
      var numbersX = 75;
      this.Rations.position.x = numbersX;
      Stage.addChild(this.Rations);
      this.Energy.position.x = numbersX;
      this.Energy.position.y = 15;
      Stage.addChild(this.Energy);
      this.Ore.position.x = numbersX;
      this.Ore.position.y = 30;
      Stage.addChild(this.Ore);
    }
  };

  this.CrewStatusGUI = {
    Total: new PIXI.Text("0", { font : "15px monospace", fill: "white"}),
    Unassigned: new PIXI.Text("0", { font : "15px monospace", fill: "white"}),
    Injured: new PIXI.Text("0", { font : "15px monospace", fill: "white"}),

    init : function(Stage) {
      var labelX =  (_State.game.getWidth() - 40);
      var Header = new PIXI.Text("CREW STATUS", {font: "25px monospace", fill: "white", align: "right"});
      Header.anchor.x = 1.0;
      Header.position.x = _State.game.getWidth() - 2;
      Stage.addChild(Header);
      var headerYOff = 25;

      var Labels = new PIXI.Text("TOTAL\rUNASSIGNED\rINJURED", {font: "15px monospace", fill: "white", align: "right"});
      Labels.anchor.x = 1.0;
      Labels.position.y = headerYOff;
      Labels.position.x = labelX;
      Stage.addChild(Labels);

      var numberX =  (_State.game.getWidth() - 30);
      var lineYOff = 15;
      this.Total.position.x = numberX;
      this.Total.position.y = headerYOff;
      Stage.addChild(this.Total);
      this.Unassigned.position.x = numberX;
      this.Unassigned.position.y = headerYOff + lineYOff;
      Stage.addChild(this.Unassigned);
      this.Injured.position.x = numberX;
      this.Injured.position.y = headerYOff + lineYOff + lineYOff;
      Stage.addChild(this.Injured);
    }
  };

  this.StatusGUI = {};

  this.TurnSummaryGUI = {};
}

function GUIModule(name) {
  this.name = name;
  this.Elements = {};
  this.LocalStage = new PIXI.Container();

  this.addGUIElement = function(name, obj) {
    this.Elements[name] = obj;
    this.LocalStage.addChild(this.Elements[name]);
    return this.Elements[name];
  };
  /*
  this.addGUIElement = function(name, obj) {
    this.Elements[name] = new GUIElement(name, obj);
    this.LocalStage.addChild(this.Elements[name]);
    return this.Elements[name];
  };*/
  this.addTextElement = function(name, PIXIobj, DATAobj, DATAacc) {
    this.Elements[name] = new TextElement(name, PIXIobj, DATAobj, DATAacc);
    this.LocalStage.addChild(this.Elements[name]);
    return this.Elements[name];
  };
}

function GUIElement(name, PIXIobj) {
  this.name = name;
  this.G = PIXIobj;
  this.updateBinding = function() {
    return true;
  };
}

function TextElement(name, PIXIobj, DATAobj, DATAacc) {
  this.name = name;
  this.G = PIXIobj;
  this.DATAobj = DATAobj;
  this.DATAacc = DATAacc;
  this.updateBinding = function() {
    this.G.text = this.DATAobj[this.DATAacc];
  };
}
