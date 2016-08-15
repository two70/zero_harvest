function Universe() {
	this.particles = game.add.group();
	this.fields = game.add.group();
	this.emitters = game.add.group();
  //this.scale.setTo(1);
  this.mapScaleTarget = 1;
  this.bounds = Phaser.Rectangle.clone(game.world.bounds);
}

Universe.prototype.addEmitter = function(field, key) {
  if (field.mass >= 20) {
    var emitter = new Emitter(this.particles, field, key);
    this.emitters.add(emitter);
    field.mass -= 5;
  }
};

Universe.prototype.addField = function(point, mass, key) {
	var field = new Field(point, mass, key);
	this.fields.add(field);
};

Universe.prototype.moveParticles = function() {
	for (var i = 0; i < this.particles.length; i++) {
  	var particle = this.particles.getAt(i);

  	// If this particle is dead, remove it from group
  	if (++particle.lived >= particle.ttl) {
    		this.particles.remove(particle);
  	}

  	// Else update its velocity
  	else {
    	// Update velocities and accelerations to account for the fields and then move the particles
    	var collide = particle.move(this.fields); //TODO account for all fields
  		//console.log(collide);
  		if (collide >= 0) {
  			//console.log("collided with " + collide);
  			if (this.fields.getAt(collide).mass < 50)
          this.fields.getAt(collide).mass += particle.mass;
  			this.particles.remove(particle);
  		}
  	}
	}	
};

Universe.prototype.update = function() {
	this.moveParticles();
	/*for (var i = 0; i < this.fields.length; i++)
		this.fields.getAt(i).update();

  for (var i = 0; i < this.emitters.length; i++)
    this.emitters.getAt(i).update();*/
};

Universe.prototype.absorbParticles = function(clicked) {
  this.fields.getAt(clicked).mass = 75;
};
