function Player() {

  var Energy = 0;
  var Rations = 40;
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
    }
  };

  this.Load = function() {

  };

  this.NewGame = function() {

  };

  this.Save = function() {

  };

  return this;
}
