
var width = 1200;
var height = 900;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'container', { preload: preload, create: create, update: update, render: render });

var clicked = -1;
var awaitingDest = false;
var player;
var addEmitButton;
var absorbPartButton;
var selectedText;
var universe;

var origDragPoint = null;

function preload() {
  game.time.advancedTiming = true;
  game.load.image('banner', 'img/banner.png');
  game.load.image('particle', 'img/particle.png');
  game.load.image('planet', 'img/planet.png');
  game.load.image('button', 'img/button.png');
}

function create() {
  universe = new Universe();
  universe.fields.inputEnableChildren = true;
  universe.addField(new Phaser.Point(200, 200), 20, 'particle');
  universe.addField(new Phaser.Point(1000, 450), 10, 'particle');

  // set our world size to be bigger than the window so we can move the camera
  game.world.setBounds(0,0, 5000, 5000);

  universe.fields.onChildInputOver.add(onOver, this);
  universe.fields.onChildInputUp.add(onUp, this);
  universe.fields.onChildInputDown.add(onDown, this);
  universe.fields.onChildInputOut.add(onOut, this);

  addEmitButton = game.add.button(25, 50, 'button', addEmitter, this);
  addEmitButton.scale.set(0.1);
  addEmitButton.fixedToCamera = true;
  absorbPartButton = game.add.button(25, 100, 'button', absorbParticles, this);
  absorbPartButton.scale.set(0.1);
  absorbPartButton.fixedToCamera = true;
  launchEmitterButton = game.add.button(25, 150, 'button', moveEmitter, this);
  launchEmitterButton.scale.set(0.1);
  launchEmitterButton.fixedToCamera = true;

  var style = { font: "25px Arial", fill: "#ffffff", align: "center" };

  selectedText = game.add.text(300 , 10, "", style);
  selectedText.fixedToCamera = true;
}

function update() {
  universe.update();
  	
  if (game.input.activePointer.isDown) { 
    if (origDragPoint) {
      // move the camera by the amount the mouse has moved since last update    
      game.camera.x += origDragPoint.x - game.input.activePointer.position.x;   
      game.camera.y += origDragPoint.y - game.input.activePointer.position.y; 
    } 
  // set new drag origin to current position  
  origDragPoint = game.input.activePointer.position.clone();
  }
  else {  
    origDragPoint = null;
  }

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

  if (clicked < 0) {
    addEmitButton.alpha = 0.5;
    absorbPartButton.alpha = 0.5;
    launchEmitterButton.alpha = 0.5;
  }
  else {
    addEmitButton.alpha = 1;
    absorbPartButton.alpha = 1;
    launchEmitterButton.alpha = 1;
  }
  if (awaitingDest)
    game.debug.text("Select Destination", universe.fields.getAt(clicked).position.x, universe.fields.getAt(clicked).position.y + 100);
  selectedText.text = clicked;
}

function render() {
  var mass1 = Math.floor(universe.fields.getAt(0).mass * 10);
  mass1 /= 10;
  var mass2 = Math.floor(universe.fields.getAt(1).mass * 10);
  mass2 /= 10;

  game.debug.text("FPS: " + game.time.fps + " " +universe.particles.length + 
      " " + mass1 + " " + mass2, 32, 32);
}

function addEmitter() {
  awaitingDest = false;
  if (clicked >= 0)
    universe.addEmitter(universe.fields.getAt(clicked), 'particle');
}

function absorbParticles() {
  awaitingDest = false;
  if (clicked >= 0) {
    if (universe.fields.getAt(clicked).absorbing == false)
      universe.fields.getAt(clicked).absorbing = true;
    else
      universe.fields.getAt(clicked).absorbing = false;
  }
}

function moveEmitter() {
  if (clicked >= 0)
    awaitingDest = true;
}

function onOver(sprite) {
  sprite.alpha = 0.5;
}

function onDown(sprite) {
  if (awaitingDest) {
    var dest = universe.fields.getAt(universe.fields.getIndex(sprite));
    var source = universe.fields.getAt(clicked);

    // Can't send emitter to self
    if (dest == source) {
      awaitingDest = false;
      return;
    }
    // If the destination already has two emitters or the source doesn't have any to give
    if (dest.emitters.length > 1 || source.emitters.length < 1) {
      awaitingDest = false;
      return;
    }
    var emitter = source.emitters.getAt(0);
    emitter.updateField(dest);
    dest.emitters.add(emitter);
    source.emitters.remove(emitter);
    awaitingDest = false;
  }
  else
    clicked = universe.fields.getIndex(sprite);
}

function onUp(sprite, pointer) {
}

function onOut(sprite) {
  sprite.alpha = 1;
}