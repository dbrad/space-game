GameState.prototype = new BaseState();
GameState.prototype.constructor = GameState;

function GameState() {
  BaseState.call(this);
  var keyQueue = [];
  function pushInput( key ) {
    keyQueue.push(key);
  }

  var _State = this;
  var turn = 1;
  var day = 1;
  var Crew = [];
  populateCrew();

  var FoodStation   = new ResourceStation("FOOD", Crew, 0, 0);
  var SolarStation  = new ResourceStation("SOLAR", Crew, 1, 1);
  var TheMine       = new ResourceStation("MINE", Crew, 0, 0);
  var ResearchStation = {};
  var Upgrades = [];

  var TurnStatus = {};
  var GUI = new GUIModules(this);

  this.OnEnter = function() {
    this.game.Input.AddObserverCallback(pushInput);
    GUI.init(this.Stage);
    GUI.CrewStatusGUI.init(this.Stage);
    GUI.ResourceGUI.init(this.Stage);
    GUI.DayTurnGUI.init(this.Stage);

    /*
      GUI.Modules.forEach(function(Module) {
        Module.Elements.forEach(function(Element) {
          Element.updateBinding();
        });
      });

    */

    GUI.Modules["TurnTracker"].Elements["Day"].text = day;
    GUI.Modules["TurnTracker"].Elements["Turn"].text = turn;

    GUI.CrewStatusGUI.Unassigned.text = getUnassignedCount();
    GUI.CrewStatusGUI.Total.text = Crew.length;

    GUI.ResourceGUI.Rations.text = this.player.Rations;
    GUI.ResourceGUI.Energy.text = this.player.Energy;
    GUI.ResourceGUI.Ore.text = this.player.Ore;
  };

  this.OnExit = function() {
    this.Stage.removeChild(GUI.DayTurnGUI.LocalStage);
    GUI.DayTurnGUI.cleanUp();
  };

  this.Update = function() {
    var topKey = keyQueue.shift();
    switch( topKey ) {
      case "ENTER":
        this.player.ready = true;
      break;
      default:
      break;
    }

    // Player has submitted turn orders
    if( this.player.ready ) {
      TurnStatus.deadCrew = 0;
      TurnStatus.foodEarned = FoodStation.doTurn();
      this.player.Rations += TurnStatus.foodEarned;

      TurnStatus.solarEarned = SolarStation.doTurn();
      this.player.Energy += TurnStatus.solarEarned;

      TurnStatus.oreEarned = TheMine.doTurn();
      this.player.Ore += TurnStatus.oreEarned;

      Crew.forEach(function(crew) {
        crew.doTurn();
      });

      this.player.Energy -= TheMine.getCrewCount();

      if( turn % 3 === 0 ) {
        // New day begins, feed people (or random crew members will die)


        day++;
        turn = 0;
        while(this.player.Rations < Crew.length) {
          var randomCrew = Math.floor(Math.random() * Crew.length);
          Crew.splice(randomCrew, 1);
          TurnStatus.deadCrew++;
          if(Crew.length <= 0) {
            // GAME OVER
          }
        }
        this.player.Rations -= Crew.length;
      }

      // TODO(david): Unassign miner crewmembers if energy < miner count
      
      turn++;
      this.player.ready = false;

      GUI.CrewStatusGUI.Injured.text = getInjuredCount();
      GUI.CrewStatusGUI.Unassigned.text = getUnassignedCount();
      GUI.CrewStatusGUI.Total.text = Crew.length;

      GUI.Modules["TurnTracker"].Elements["Day"].text = day;
      GUI.Modules["TurnTracker"].Elements["Turn"].text = turn;

      GUI.ResourceGUI.Rations.text = this.player.Rations;
      GUI.ResourceGUI.Energy.text = this.player.Energy;
      GUI.ResourceGUI.Ore.text = this.player.Ore;
    }

  };

  function populateCrew() {
    for(var crewCount = 0; crewCount < 20; crewCount++) {
      Crew.push(new Crewman());
    }
    Crew[0].Station = Crew[1].Station = Crew[2].Station = Crew[3].Station = Crew[4].Station = "FOOD";
    Crew[5].Station = Crew[6].Station = Crew[7].Station = Crew[8].Station = Crew[9].Station = "SOLAR";
    Crew[10].Station = Crew[11].Station = Crew[12].Station = Crew[13].Station = Crew[14].Station = "MINE";
  }

  function getInjuredCount() {
    var result = 0;
    Crew.forEach(function(crew) {
      if(crew.isInjured())
        result++;
    });
    return result;
  }

  function getUnassignedCount() {
    var result = 0;
    Crew.forEach(function(crew) {
      if(crew.Station === "UNASSIGNED")
        result++;
    });
    return result;
  }

  return this;
}
