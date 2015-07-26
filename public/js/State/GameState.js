GameState.prototype = new BaseState();
GameState.prototype.constructor = GameState;

function GameState() {
  BaseState.call(this);
  var keyQueue = [];
  function pushInput( key ) {
    keyQueue.push(key);
  }

  var _State = this;

  this.GUI = new GUIModules(this);

  var TimeTracking;
  var FoodStation;
  var SolarStation;
  var TheMine;
  var ResearchStation;

  var TurnStatus;

  this.OnEnter = function() {
    this.player.Crew.debugCrew();

    TimeTracking = new DaySystem("NORMAL", this);

    FoodStation   = new ResourceStation("Hydroponic Farm", this , 0, 0);
    SolarStation  = new ResourceStation("Solar Farm", this , 1, 1);
    TheMine       = new ResourceStation("Asteroid Mine", this , 0, 0);
    ResearchStation = {};
    TurnStatus = {};


    this.Stage = new PIXI.Container();
    this.Resources = this.player.Resources;
    this.Crew = this.player.Crew;
    this.player.GUI = this.GUI;

    this.game.Input.AddObserverCallback(pushInput);

    this.initGUI();

    TimeTracking.initGUI(this.Stage);
    this.GUI.Modules.DaySystem.LocalStage.position.x = this.game.getWidth()/2;
    this.GUI.Modules.DaySystem.LocalStage.position.y = 35;

    this.Resources.initGUI(this.Stage);
    this.GUI.Modules.Resources.LocalStage.position.x = 60+17;
    this.GUI.Modules.Resources.LocalStage.position.y = 35+17;

    this.Crew.initGUI(this.Stage);
    this.GUI.Modules.Crew.LocalStage.position.x = (this.game.getWidth() - 92);
    this.GUI.Modules.Crew.LocalStage.position.y = (52);

    this.Animations = [];
    this.Animations.push(new Animation.Glitch(this.GUI.Modules.Crew.LocalStage));
    this.Animations[this.Animations.length - 1].start();

    this.Animations.push(new Animation.Glitch(this.GUI.Modules.Resources.LocalStage));
    this.Animations[this.Animations.length - 1].start();

    FoodStation.initGUI(this.Stage);
    this.GUI.Modules[FoodStation.name].LocalStage.position.x = this.game.getWidth()/4;
    this.GUI.Modules[FoodStation.name].LocalStage.position.y = 200;
    this.GUI.Modules[FoodStation.name].Elements.Plus.G.mousedown = FoodStation.increaseCrew.bind(FoodStation); //this.Crew.assignCrew.bind(this.player.Crew, FoodStation.name);
    this.GUI.Modules[FoodStation.name].Elements.Minus.G.mousedown = this.Crew.unassignCrew.bind(this.player.Crew, FoodStation.name);

    SolarStation.initGUI(this.Stage);
    this.GUI.Modules[SolarStation.name].LocalStage.position.x = this.game.getWidth()/2;
    this.GUI.Modules[SolarStation.name].LocalStage.position.y = 200;
    this.GUI.Modules[SolarStation.name].Elements.Plus.G.mousedown = SolarStation.increaseCrew.bind(SolarStation); //this.Crew.assignCrew.bind(this.player.Crew, SolarStation.name);
    this.GUI.Modules[SolarStation.name].Elements.Minus.G.mousedown = this.Crew.unassignCrew.bind(this.player.Crew, SolarStation.name);

    TheMine.initGUI(this.Stage);
    this.GUI.Modules[TheMine.name].LocalStage.position.x = this.game.getWidth()/4 * 3;
    this.GUI.Modules[TheMine.name].LocalStage.position.y = 200;
    this.GUI.Modules[TheMine.name].Elements.Plus.G.mousedown = TheMine.increaseCrew.bind(TheMine); //this.Crew.assignCrew.bind(this.player.Crew, TheMine.name);
    this.GUI.Modules[TheMine.name].Elements.Minus.G.mousedown = this.Crew.unassignCrew.bind(this.player.Crew, TheMine.name);

    this.GUI.updateBindings();
  };

  this.OnExit = function() {
    this.game.Input.ClearObservers();
    PIXI.Texture.removeTextureFromCache('assets/minus.png');
    PIXI.Texture.removeTextureFromCache('assets/plus.png');

    this.Stage.destroy(true);
  };

  this.Update = function(delta) {
    var topKey = keyQueue.shift();
    switch( topKey ) {
      case "ENTER":
        this.player.ready = true;
      break;
      default:
      break;
    }

    TheMine.MaxCrew = this.Resources.Energy;

    this.Animations.forEach(function(animation) {
      animation.update(delta);
    });

    // NOTE(david): Player has submitted turn orders
    if( this.player.ready ) {
      // TODO(david): Get new event.
      // TODO(david): Attach the event to the whatever is being affected

      // TODO(david): Resolve event if needed

      TurnStatus.deadCrew = 0;

      // NOTE(david): Generate Resources
      TurnStatus.foodEarned = FoodStation.doTurn();
      this.Resources.addRations(TurnStatus.foodEarned);

      TurnStatus.solarEarned = SolarStation.doTurn();
      this.Resources.addEnergy(TurnStatus.solarEarned);

      TurnStatus.oreEarned = TheMine.doTurn();
      this.Resources.addOre(TurnStatus.oreEarned);

      // NOTE(david): tick each crew memeber, this may un-injured, un-lock them.
      this.Crew.Members.forEach(function(crew) {
        crew.doTurn();
      });

      // NOTE(david): Pay energy
      this.Resources.spendEnergy( this.Crew.StationCounts[TheMine.name] );

      // NOTE(david): Day end processing goes in here
      // TODO(david): Make number of turns per day adjustable, way of setting difficulty due to food cost.
      if( TimeTracking.data.turn % 3 === 0 ) {

        // NOTE(david): Feed the crew, kill random crew if not enough food
        while(!this.Resources.spendRations(this.Crew.Members.length)) {
          var randomCrew = Math.floor(Math.random() * this.Crew.Members.length);
          this.Crew.Members.splice(randomCrew, 1);
          TurnStatus.deadCrew++;
          if(this.Crew.Members.length <= 0) {
            this.gsm.Change("GAMEOVER");
            break;
          }
        }
      }

      while(this.Resources.Energy < this.Crew.StationCounts[TheMine.name]) {
        this.Crew.unassignCrew(TheMine.name);
        if(this.Resources.Energy <= 0)
          break;
      }
      // TODO(david): Unassign miner crewmembers if energy < miner count

      TimeTracking.data.incrementTurn();
      if(TimeTracking.data.isGameOver())
        this.gsm.Change("GAMEOVER");
      this.player.ready = false;


    }
    this.GUI.updateBindings();
  };

  this.initGUI = function() {
    var Module = this.GUI.addGUIModule("BaseGui");

    var Background = Module.addGUIElement("BG", new PIXI.Graphics());
    Background.beginFill(0x3b9bff, 0.25);
    Background.lineStyle(3, 0x3b9bff, 0.5);
    Background.drawRect(2, 2, 800-4, 100);
    Background.endFill();

    this.Stage.addChild(Module.LocalStage);
  };

  return this;
}
