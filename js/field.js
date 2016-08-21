Field = function(point, mass, key) {
	Phaser.Sprite.call(this, game, point.x, point.y, key);
	this.position = new Vector(point.x, point.y);
	this.mass = mass || 100;
	this.anchor.setTo(0.5,0.5);
	this.tint = 0xff1100;
	this.scale.set(this.mass * 0.01);
	this.absorbing = false;
};

Field.prototype = Object.create(Phaser.Sprite.prototype);
Field.prototype.constructor = Field;

Field.prototype.setMass = function(mass) {
	this.mass = mass;
};

Field.prototype.move = function(acceleration) {
};

Field.prototype.update = function() {
	this.scale.set(this.mass * 0.01);
};