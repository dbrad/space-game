function Input() {
  var keys = [];

  var stale = [];

  this.keys = {
    get ENTER() { return PressableKey(13); },
    get P_UP () { return (PressableKey(38) || PressableKey(87)); },
    get UP () { return (keys[38] || keys[87]); },
    get P_DOWN () { return (PressableKey(40) || PressableKey(83)); },
    get DOWN () { return (keys[40] || keys[83]); },
    get LEFT () { return keys[37] || keys[65]; },
    get RIGHT () { return keys[39] || keys[68]; }
  };

  function PressableKey(id) {
    if(keys[id] && stale[id]) {
      return false;
    } else if(keys[id]) {
      stale[id] = true;
    }
    return keys[id];
  }

  $(window).keydown(function(event) {
    keys[event.which] = true;
  });

  $(window).keyup(function(event) {
      var keyVal = event.which;
      keys[keyVal] = false;
      stale[keyVal] = false;
      console.log(keyVal);
  });
}
