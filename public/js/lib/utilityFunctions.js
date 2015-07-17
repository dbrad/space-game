function addSprite( container, frame, x, y ) {
  container.addChild(new PIXI.Sprite.fromFrame(frame));
  var sprite = container.children[container.children.length - 1];
  sprite.anchor = new PIXI.Point(0.5, 0.5);
  sprite.position = new PIXI.Point(x, y);
}
