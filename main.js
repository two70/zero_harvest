
var width = 1200;
var height = 900;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'container', { preload: preload, create: create, update: update, render: render });

var clicked = -1;
var player;
var addEmitButton;
var absorbPartButton;
var selectedText;
var universe;

function preload() {
  game.time.advancedTiming = true;
  game.load.image('banner', 'img/banner.png');
  game.load.image('particle', 'img/particle.png');
  game.load.image('button', 'img/button.png');
}

function create() {
  universe = new Universe();
  universe.fields.inputEnableChildren = true;
  universe.addField(new Phaser.Point(200, 200), 20, 'particle');
  universe.addField(new Phaser.Point(600, 450), 5, 'particle');

  // set our world size to be bigger than the window so we can move the camera
  game.world.setBounds(0,0, 5000, 5000);
  game.input.mouse.mouseWheelCallback = mouseWheel;

  universe.fields.onChildInputOver.add(onOver, this);
  universe.fields.onChildInputUp.add(onUp, this);
  universe.fields.onChildInputDown.add(onDown, this);
  universe.fields.onChildInputOut.add(onOut, this);
  //universe.fields.hitArea.scale(2);

  addEmitButton = game.add.button(25, 50, 'button', addEmitter, this);
  addEmitButton.scale.set(0.1);
  absorbPartButton = game.add.button(25, 100, 'button', absorbParticles, this);
  absorbPartButton.scale.set(0.1);

  var style = { font: "25px Arial", fill: "#ffffff", align: "center" };

  selectedText = game.add.text(300 , 10, "", style);
}

function update() {
  universe.update();
  	
  // movement
  if (game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
    game.camera.y -= 5;
    //game.world.pivot.y -= 5;
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
    game.camera.y += 5;
    //game.world.pivot.y += 5;
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
    game.camera.x -= 5;
    //game.world.pivot.x -= 5;
  }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
    game.camera.x += 5;
    //game.world.pivot.x += 5;
  }
  if (game.input.keyboard.isDown(Phaser.Keyboard.F)) {
    universe.emitters.getAt(0).updateField(universe.fields.getAt(1));
  }

  if (clicked < 0) {
    addEmitButton.alpha = 0.5;
    absorbPartButton.alpha = 0.5;
  }
  else {
    addEmitButton.alpha = 1;
    absorbPartButton.alpha = 1;
  }
  selectedText.text = clicked;
}

function render() {
  var field = universe.fields.getAt(0).position;
  var emitter = universe.emitters.getAt(0).position;
  var mass1 = Math.floor(universe.fields.getAt(0).mass * 100);
  mass1 /= 100;
  var mass2 = Math.floor(universe.fields.getAt(1).mass * 100);
  mass2 /= 100;
  if (emitter) {
  var tanAngle = Math.atan2(emitter.y-field.y, emitter.x-field.x) * (180 / Math.PI);

  game.debug.text("FPS: " + game.time.fps, 25, 700);

  game.debug.text("FPS: " + game.time.fps + " " +universe.particles.length + 
      " " + mass1 + " " + mass2, 32, 32);	
  }
}

function mouseWheel(event) {
  // TODO: Get zoom working properly

  /*var delta = game.input.mouse.wheelDelta / 10;
  if (game.camera.scale.x + delta > 0.3 && game.camera.scale.x + delta < 5.1) {
      game.camera.scale.set(game.camera.scale.x + delta);
      if (delta < 0) {
          game.camera.x -= 100;
          game.camera.y -= 100;
      }
      else {
          game.camera.x += 100;
          game.camera.y += 100;
      }
  }*/
}

function addEmitter() {
  universe.addEmitter(universe.fields.getAt(clicked), 'particle');
}

function absorbParticles() {
  if (universe.fields.getAt(clicked).absorbing == false)
    universe.fields.getAt(clicked).absorbing = true;
  else
    universe.fields.getAt(clicked).absorbing = false;
}

function onOver(sprite) {
  sprite.alpha = 0.5;
}

function onDown(sprite) {
  clicked = universe.fields.getIndex(sprite);
  //console.log(clicked);
}

function onUp(sprite, pointer) {
}

function onOut(sprite) {
  sprite.alpha = 1;
}