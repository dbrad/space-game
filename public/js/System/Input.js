function Input() {
  var input = this;
  var keys = [];
  var observers = [];

  this.Notify = function(key) {
    observers.forEach(function(obv) {
      obv(key);
    });
  };

  this.AddObserverCallback = function( callback ) {
    observers.push( callback );
  };

  this.keys = {
    13 : "ENTER",
    38 : "UP",
    87 : "UP",
    40 : "DOWN",
    83 : "DOWN",
    37 : "LEFT",
    65 : "LEFT",
    39 : "RIGHT",
    68 : "RIGHT"
  };

  $(window).keydown(function(event) {
    var keyCode = event.which;
    if(keys[keyCode])
      return;
    var VKEY = input.keys[keyCode];
    if(VKEY && !keys[keyCode]) {
      input.Notify(VKEY);
    }
    keys[keyCode] = true;
  });

  $(window).keyup(function(event) {
      var keyCode = event.which;
      keys[keyCode] = false;
  });
}
