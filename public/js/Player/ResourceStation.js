function ResourceStation(name, crewlist, min, max) {
  var station = this;
  var eventCards = [];
  var baseMinOut = min;
  var baseMaxOut = max;
  var crew = crewlist;

  this.name = name;
  this.MaxCrew = 5;

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
