function GUIModules(state) {
  var _State = state;

  this.Modules = {};
  this.addGUIModule = function(name) {
    this.Modules[name] = new GUIModule(name);
    return this.Modules[name];
  };

  this.updateBindings = function() {
    _.each(this.Modules, function(Module) {
      _.each(Module.Elements, function(Element) {
        Element.updateBinding();
      });
    });
  };

  return this;
}

function GUIModule(name) {
  this.name = name;
  this.Elements = {};
  this.LocalStage = new PIXI.Container();
  

  this.addGUIElement = function(name, obj) {
    this.Elements[name] = new GUIElement(name, obj);
    this.LocalStage.addChild(this.Elements[name].G);
    return this.Elements[name].G;
  };

  this.addTextElement = function(name, PIXIobj, DATAobj, DATAacc) {
    this.Elements[name] = new TextElement(name, PIXIobj, DATAobj, DATAacc);
    this.LocalStage.addChild(this.Elements[name].G);
    return this.Elements[name].G;
  };
}

function GUIElement(name, PIXIobj) {
  this.name = name;
  this.G = PIXIobj;
  this.updateBinding = function() {
    return true;
  };
}

function TextElement(name, PIXIobj, DATAobj, DATAacc) {
  this.name = name;
  this.G = PIXIobj;
  this.DATAobj = DATAobj;
  this.DATAacc = DATAacc;
  this.updateBinding = function() {
    this.G.text = (this.DATAobj[this.DATAacc]);
  };
}
