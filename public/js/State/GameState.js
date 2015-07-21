GameState.prototype = new BaseState();
GameState.prototype.constructor = GameState;

function GameState() {
  BaseState.call(this);
  var keyQueue = [];
  function pushInput( key ) {
    keyQueue.push(key);
  }

  var _State = this;
  this.turn = 1;
  this.day = 1;
  var Crew = [];
  populateCrew();

  var GUI = new GUIModules(this);

  var FoodStation   = new ResourceStation("Hydroponoic Farm", GUI, Crew, 0, 0);
  var SolarStation  = new ResourceStation("Solar Farm", GUI, Crew, 1, 1);
  var TheMine       = new ResourceStation("Asteroid Mine", GUI, Crew, 0, 0);
  var ResearchStation = {};
  var Upgrades = [];

  var TurnStatus = {};

  this.OnEnter = function() {
    this.game.Input.AddObserverCallback(pushInput);
    GUI.init(this.Stage);
    GUI.CrewStatusGUI.init(this.Stage);
    GUI.ResourceGUI.init(this.Stage);

    FoodStation.initGUI(this.Stage);
    GUI.Modules[FoodStation.name].LocalStage.position.x = 300;
    GUI.Modules[FoodStation.name].LocalStage.position.y = 250;

    SolarStation.initGUI(this.Stage);
    GUI.Modules[SolarStation.name].LocalStage.position.x = 600;
    GUI.Modules[SolarStation.name].LocalStage.position.y = 250;

    TheMine.initGUI(this.Stage);
    GUI.Modules[TheMine.name].LocalStage.position.x = 900;
    GUI.Modules[TheMine.name].LocalStage.position.y = 250;


    _.each(GUI.Modules, function(Module) {
      _.each(Module.Elements, function(Element) {
        Element.updateBinding();
      });
    });

    GUI.CrewStatusGUI.Unassigned.text = getUnassignedCount();
    GUI.CrewStatusGUI.Total.text = Crew.length;

    // TODO(david): MOVING THIS INTO PLAYER RESOURCE OBJECT
    GUI.ResourceGUI.Rations.text = this.player.Resources.Rations;
    GUI.ResourceGUI.Energy.text = this.player.Resources.Energy;
    GUI.ResourceGUI.Ore.text = this.player.Resources.Ore;
  };

  this.OnExit = function() {
    this.Stage.destory(true);
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

    // NOTE(david): Player has submitted turn orders
    if( this.player.ready ) {
      // TODO(david): Get new event.
      // TODO(david): Attach the event to the whatever is being affected

      // TODO(david): Resolve event if needed

      TurnStatus.deadCrew = 0;

      // NOTE(david): Generate Resources
      TurnStatus.foodEarned = FoodStation.doTurn();
      this.player.Resources.addRations(TurnStatus.foodEarned);

      TurnStatus.solarEarned = SolarStation.doTurn();
      this.player.Resources.addEnergy(TurnStatus.solarEarned);

      TurnStatus.oreEarned = TheMine.doTurn();
      this.player.Resources.addOre(TurnStatus.oreEarned);

      // NOTE(david): tick each crew memeber, this may un-injured, un-lock them.
      Crew.forEach(function(crew) {
        crew.doTurn();
      });

      // NOTE(david): Pay energy
      this.player.Resources.spendEnergy( TheMine.getCrewCount() );

      // NOTE(david): Day end processing goes in here
      // TODO(david): Make number of turns per day adjustable, way of setting difficulty due to food cost.
      if( this.turn % 3 === 0 ) {
        this.day++;
        this.turn = 0;

        // NOTE(david): Feed the crew, kill random crew if not enough food
        while(!this.player.Resources.spendRations(Crew.length)) {
          var randomCrew = Math.floor(Math.random() * Crew.length);
          Crew.splice(randomCrew, 1);
          TurnStatus.deadCrew++;
          if(Crew.length <= 0) {
            // TODO(david): GAMEOVER MAN
            break;
          }
        }
      }

      // TODO(david): Unassign miner crewmembers if energy < miner count

      this.turn++;
      this.player.ready = false;

      // TODO(david): Clean up data binding (in progress already)
      GUI.CrewStatusGUI.Injured.text = getInjuredCount();
      GUI.CrewStatusGUI.Unassigned.text = getUnassignedCount();
      GUI.CrewStatusGUI.Total.text = Crew.length;

      _.each(GUI.Modules, function(Module) {
        _.each(Module.Elements, function(Element) {
          Element.updateBinding();
        });
      });

      // TODO(david): MOVING THIS INTO PLAYER RESOURCE OBJECT
      GUI.ResourceGUI.Rations.text = this.player.Resources.Rations;
      GUI.ResourceGUI.Energy.text = this.player.Resources.Energy;
      GUI.ResourceGUI.Ore.text = this.player.Resources.Ore;
    }

  };



  // NOTE(daivd): Debug function to make a skeleton crew for testing.
  // TODO(david): This stuff will be based on difficulty
  function populateCrew() {
    for(var crewCount = 0; crewCount < 20; crewCount++) {
      Crew.push(new Crewman());
    }
    Crew[0].Station = Crew[1].Station = Crew[2].Station = Crew[3].Station = Crew[4].Station = "Hydroponoic Farm";
    Crew[5].Station = Crew[6].Station = Crew[7].Station = Crew[8].Station = Crew[9].Station = "Solar Farm";
    Crew[10].Station = Crew[11].Station = Crew[12].Station = Crew[13].Station = Crew[14].Station = "Asteroid Mine";
  }
  // NOTE(david): Helper Functions to get injured and unassigned count
  // TODO(david): Maybe move to a Crew Manager?
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
