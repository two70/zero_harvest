Emitter = function(universeParticles, field, key) {
  this.field = field; // The field that this emitter belongs to

  Phaser.Sprite.call(this, game, field.position.x, field.position.y, key);
  this.position = new Vector(field.position.x, field.position.y); // Position Vector
  this.velocity = new Vector(0,0);
  this.emitVelocity = new Vector(0.1,0.1); // Vector
  this.spread = Math.PI / 2; // 
  this.particles = universeParticles;
  this.anchor.setTo(0.5,0.5);
  this.scale.set(0.2);
  this.emissionRate = 10;
  this.maxParticles = 5000;
  this.tint = 0x555555;
  this.roangle = 0;
  game.time.events.loop(Phaser.Timer.SECOND, this.emitParticle, this);
};

Emitter.prototype = Object.create(Phaser.Sprite.prototype);
Emitter.prototype.constructor = Emitter;

Emitter.prototype.emitParticle = function() {
  if (this.particles.length >= this.maxParticles) return;

  this.emissionRate = 200 / this.field.mass;
  for (var j = 0; j < this.emissionRate; j++) {
    // The emitter's position
    var position = new Vector(this.position.x, this.position.y);

    // New random velocity for each particle
    var velocity = new Vector((Math.random() * 2 - 1) / 10, (Math.random() * 2 - 1) / 10);
    var particle = new Particle('particle', position, velocity);
    particle.tint = 0x0000ff;
    this.particles.add(particle);
  }
};

Emitter.prototype.updateField = function(field) {
  this.field = field;
};

Emitter.prototype.update = function() {
  var x = this.field.position.x - this.position.x;
  var y = this.field.position.y - this.position.y;
  var distanceToField = Math.sqrt(x*x+y*y);

  if (distanceToField <= 55) {
    var radius = 50;
    this.position.x = this.field.position.x + radius * Math.cos(this.roangle * Math.PI / 180);
    this.position.y = this.field.position.y + radius * Math.sin(this.roangle * Math.PI / 180);

    if (this.field.emitters.length > 1 && this.field.emitters.getAt(0) != this) {
      var angleOffset = this.roangle - this.field.emitters.getAt(0).roangle;
      if (angleOffset < 0)
        angleOffset += 360;
      //console.log(angleOffset);
      if (angleOffset < 175 || angleOffset > 185)
        this.roangle += 0.6;
      else
        this.roangle += 0.2;
    }
    else
      this.roangle += 0.2;
  
    if(this.roangle > 360) this.roangle = 0;
    
  }

  else {
    var normalized = new Vector();
    normalized.x = x / distanceToField;
    normalized.y = y / distanceToField;
    this.position.add(normalized);
    this.roangle = Math.atan2(this.position.y-this.field.position.y, this.position.x-this.field.position.x) * (180 / Math.PI);
  }
};