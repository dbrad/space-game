function Player() {
  var player = this;

  var Energy = 10;
  var Rations = 10;
  var Ore = 0;

  this.Resources = {
    // NOTE(david): ENERGY ACCESSORS
    get Energy() {
      return Energy;
    },
    addEnergy: function(value) {
      if(value < 0)
        return false;
      Energy += value;
      return true;
    },
    spendEnergy: function(value) {
      if(value > Energy)
        return false;
      Energy -= value;
        return true;
    },

    // NOTE(david): RATION ACCESSORS
    get Rations() {
      return Rations;
    },
    addRations: function(value) {
      if(value < 0)
        return false;
      Rations += value;
      return true;
    },
    spendRations: function(value) {
      if(value > Rations)
        return false;
      Rations -= value;
        return true;
    },

    // NOTE(david): ORE ACCESSORS
    get Ore() {
      return Ore;
    },
    addOre: function(value) {
      if(value < 0)
        return false;
      Ore += value;
      return true;
    },
    spendOre: function(value) {
      if(value > Ore)
        return false;
      Ore -= value;
        return true;
    },
    initGUI: function(Stage) {
      var Module = player.GUI.addGUIModule("Resources");

      // var Background = Module.addGUIElement("BG", new PIXI.Graphics());
      // Background.beginFill(0x999999, 0.25);
      // Background.lineStyle(2, 0x999999, 0.5);
      // Background.drawRect(-10, -10, 145, 90);
      // Background.endFill();

      var Header = Module.addGUIElement("Header", new PIXI.Text("RESOURCES", {font:"25px Share Tech Mono", fill: "white", lineHeight: 25}));

      var Labels = Module.addGUIElement("Labels", new PIXI.Text("RATIONS\rENERGY\rORE", {font:"16px Share Tech Mono", fill: "white", lineHeight: 15}));
      Labels.position.y = 25;

      var Rations = Module.addTextElement("Rations", new PIXI.Text(this.Rations, {font:"16px Share Tech Mono", fill: "white", lineHeight: 15}), this, "Rations");
      Rations.position.x = 125;
      Rations.anchor.x = 1.0;
      Rations.position.y = 25;

      var Energy = Module.addTextElement("Energy", new PIXI.Text(this.Energy, {font:"16px Share Tech Mono", fill: "white", lineHeight: 15}), this, "Energy");
      Energy.position.x = 125;
      Energy.anchor.x = 1.0;
      Energy.position.y = 40;

      var Ore = Module.addTextElement("Ore", new PIXI.Text(this.Ore, {font:"16px Share Tech Mono", fill: "white", lineHeight: 15}), this, "Ore");
      Ore.position.x = 125;
      Ore.anchor.x = 1.0;
      Ore.position.y = 55;

      Module.LocalStage.pivot.y = 35;
      Module.LocalStage.pivot.x = 60;

      Module.LocalStage.filters = [new PIXI.filters.PixelateFilter()];
      Module.LocalStage.filters[0].size = new PIXI.Point(1,1);
      Stage.addChild(Module.LocalStage);
    }
  };

  this.Crew = {
    Members: [],
    get Total() {
      return this.Members.length;
    },
    get InjuredCount() {
      var result = 0;
      _.each(this.Members, function(member) {
        if(member.isInjured())
          result++;
      });
      return result;
    },
    get UnassignedCount() {
      return this.StationCounts.UNASSIGNED;
    },
    get StationCounts() {
      var result = { "UNASSIGNED": 0, "Hydroponic Farm": 0, "Solar Farm": 0, "Asteroid Mine": 0};
      _.each(this.Members, function(member) {
        if(!result[member.Station])
          result[member.Station] = 0;
        result[member.Station]++;
      });
      return result;
    },
    assignCrew: function(station, event) {
      var success = false;
      if(this.UnassignedCount > 0) {
        var crewman = _.findWhere(this.Members, {Station: "UNASSIGNED"});
        if(crewman) {
          crewman.Station = station;
          success = true;
        }
      }
      return success;
    },
    unassignCrew: function(station, event) {
      var success = false;
      if(this.StationCounts[station] > 0) {
        var crewman = _.findWhere(this.Members, {Station: station});
        if(crewman) {
          crewman.Station = "UNASSIGNED";
          success = true;
        }
      }
      return success;
    },
    debugCrew: function() {
      var Crew = this.Members;
      for(var crewCount = 0; crewCount < 10; crewCount++) {
        Crew.push(new Crewman());
      }
      //Crew[0].Station = Crew[1].Station = Crew[2].Station = Crew[3].Station = Crew[4].Station = "Hydroponic Farm";
      //Crew[5].Station = Crew[6].Station = Crew[7].Station = Crew[8].Station = Crew[9].Station = "Solar Farm";
      //Crew[10].Station = Crew[11].Station = Crew[12].Station = Crew[13].Station = Crew[14].Station = "Asteroid Mine";
    },
    initGUI: function(Stage) {
      var Module = player.GUI.addGUIModule("Crew");

      // var Background = Module.addGUIElement("BG", new PIXI.Graphics());
      // Background.beginFill(0x999999, 0.25);
      // Background.lineStyle(2, 0x999999, 0.5);
      // Background.drawRect(-10, -10, 170, 90);
      // Background.endFill();

      var Header = Module.addGUIElement("Header", new PIXI.Text("CREW STATUS", {font:"25px Share Tech Mono", fill: "white", lineHeight: 25}));
    //  Header.anchor.x = 1.0;

      var Labels = Module.addGUIElement("Labels", new PIXI.Text("TOTAL\rUNASSIGNED", {font:"16px Share Tech Mono", fill: "white", lineHeight: 15}));
    //  Labels.anchor.x = 1.0;
      Labels.position.x = 0;
      Labels.position.y = 25;

      var Total = Module.addTextElement("Total", new PIXI.Text(this.Total, {font:"16px Share Tech Mono", fill: "white", lineHeight: 15}), this, "Total");
      Total.anchor.x = 1.0;
      Total.position.x = 150;
      Total.position.y = 25;

      var Unassigned = Module.addTextElement("Unassigned", new PIXI.Text(this.UnassignedCount, {font:"16px Share Tech Mono", fill: "white", lineHeight: 15}), this, "UnassignedCount");
      Unassigned.anchor.x = 1.0;
      Unassigned.position.x = 150;
      Unassigned.position.y = 40;

      // var Injured = Module.addTextElement("Injured", new PIXI.Text(this.InjuredCount, {font:"16px Share Tech Mono", fill: "white", lineHeight: 15}), this, "InjuredCount");
      // Injured.anchor.x = 1.0;
      // Injured.position.x = 150;
      // Injured.position.y = 55;

      Module.LocalStage.pivot.y = 35;
      Module.LocalStage.pivot.x = 75;

      Module.LocalStage.filters = [new PIXI.filters.PixelateFilter()];
      Module.LocalStage.filters[0].size = new PIXI.Point(1,1);
      Stage.addChild(Module.LocalStage);
    }
  };

  this.Upgrades = {};

  this.Load = function() {

  };

  this.NewGame = function() {

  };

  this.Save = function() {

  };

  return this;
}
