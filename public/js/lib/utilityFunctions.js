function addSprite( container, frame, x, y ) {
  container.addChild(new PIXI.Sprite.fromFrame(frame));
  var sprite = container.children[container.children.length - 1];
  sprite.anchor = new PIXI.Point(0.5, 0.5);
  sprite.position = new PIXI.Point(x, y);
}

function BuildMenu(sTitle, aOptions, position) {
  var paOptions = [];

  var pTitle = new PIXI.Text(sTitle, {font: "24px Tahoma", fill: 0XFFFFFF});
  pTitle.anchor.y = pTitle.anchor.x = 0.5;
  pTitle.position.x = position.x;
  pTitle.position.y = position.y;

  var offsetY = 50;
  var text = null;
  aOptions.forEach( function(option) {
    text = new PIXI.Text(option, {font: "20px Tahoma", fill: 0XFFFFFF});
    text.anchor.y = text.anchor.x = 0.5;
    text.position.x = position.x;
    text.position.y = position.y + offsetY;
    paOptions.push(text);
    offsetY += 50;
  });

  return {
    title: pTitle,
    options: paOptions
  };
}
