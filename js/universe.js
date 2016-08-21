function Universe() {
	this.particles = game.add.group();
	this.fields = game.add.group();
}

Universe.prototype.addField = function(point, mass, key) {
	var field = new Field(point, mass, key);
	this.fields.add(field);
  /*var ellipse = game.add.graphics();
  ellipse.lineStyle(1, 0x555555);
  ellipse.drawEllipse(point.x, point.y, mass+5, mass);*/
};
  
Universe.prototype.addEmitter = function(field, key) {
  if (field.mass >= 20) {
    var numEmitters = field.emitters.length;
    var angle;
    switch (numEmitters) {
      case 0:
        angle = 0;
        break;
      case 1:
        angle = field.emitters.getAt(0).roangle - 180;
        break;
      default:
        return;
    }
    if (angle < 0)
      angle += 360;

    var emitter = new Emitter(this.particles, field, key);
    emitter.roangle = angle;
    field.emitters.add(emitter);
    //console.log(field.emitters);
    field.mass -= 5;
  }
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
      var collide = particle.move(this.fields);
  		//console.log(collide);
  		if (collide >= 0) {
  			//console.log("collided with " + collide);
  			if (this.fields.getAt(collide).mass < 70)
          this.fields.getAt(collide).mass += particle.mass;
  			this.particles.remove(particle);
  		}
  	}
	}	
};

Universe.prototype.update = function() {
	this.moveParticles();
};
