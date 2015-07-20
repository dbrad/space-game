function Crewman() {
  var injured = 0;
  this.Station = "UNASSIGNED";
  var locked = false;



  this.Injure = function(turns) {
    injured += turns;
  };
  this.isInjured = function() {
    return (injured > 0);
  };

  this.doTurn = function() {
    --injured;
  };
}
