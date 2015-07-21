function GUIModules(state) {
  var _State = state;

  this.Modules = {};
  this.addGUIModule = function(name) {
    this.Modules[name] = new GUIModule(name);
    return this.Modules[name];
  };

  // TODO(david): Move modules to logical objects
  this.init = function(Stage) {
    // NOTE(david): Turn / day GUI
    // TODO(david): Move to a Turn Tracker object?
    var TurnTracker = this.addGUIModule("TurnTracker");
    var DayEle = TurnTracker.addTextElement("Day", new PIXI.Text("0", { font : "20px monospace", fill: "white"}), _State, "day");

    var numberX =  (_State.game.getWidth()/2 + 5);
    DayEle.position.x = numberX;

    var TurnEle = TurnTracker.addTextElement("Turn", new PIXI.Text("0", { font : "20px monospace", fill: "white"}), _State, "turn");
    TurnEle.position.x = numberX;
    TurnEle.position.y = (20);

    var Labels = TurnTracker.addGUIElement("Labels", new PIXI.Text("DAY\rTURN", {font: "20px monospace", fill: "white", align: "right", lineHeight: 20}));
    Labels.anchor.x = 1;
    Labels.position.x = (_State.game.getWidth()/2) - 5 ;

    Stage.addChild(TurnTracker.LocalStage);
  };

  this.ResourceGUI = {
    Rations: new PIXI.Text("0", { font : "15px monospace", fill: "white"}),
    Energy: new PIXI.Text("0", { font : "15px monospace", fill: "white"}),
    Ore: new PIXI.Text("0", { font : "15px monospace", fill: "white"}),


    init : function(Stage) {
      var Labels = new PIXI.Text("RATIONS\rENERGY\rORE", {font: "15px monospace", fill: "white", lineHeight: 15});
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

      var Labels = new PIXI.Text("TOTAL\rUNASSIGNED\rINJURED", {font: "15px monospace", fill: "white", align: "right", lineHeight: 15});
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
    this.Elements[name] = new GUIElement(name, obj);
    this.LocalStage.addChild(this.Elements[name].G);
    return this.Elements[name].G;
  };

  this.addTextElement = function(name, PIXIobj, DATAobj, DATAacc) {
    this.Elements[name] = new TextElement(name, PIXIobj, DATAobj, DATAacc);
    this.LocalStage.addChild(this.Elements[name].G);
    return this.Elements[name].G;
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
    this.G.text = (this.DATAobj[this.DATAacc]);
  };
}
