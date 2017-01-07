Field = function(point, mass, key) {
	Phaser.Sprite.call(this, game, point.x, point.y, key);
	this.position = new Vector(point.x, point.y);
	this.mass = mass || 100;
	this.anchor.setTo(0.5,0.5);
	//this.tint = 0x000000;
	this.scale.set(this.mass * 0.01);
	this.absorbing = false;

	this.emitters = game.add.group();

	var fragmentShader = [
    'precision mediump float;',
    '',
    'varying vec2 vTextureCoord;',
    
    'uniform float time;',
    'uniform vec4 dimensions;',
    'uniform vec2 offset;',
    'uniform sampler2D uSampler;',
    
    'void main(void)',
    '{',
    '    vec4 pixel = texture2D(uSampler, vTextureCoord);',
    '    pixel.g *= sin(time);',
    '    pixel.b *= sin(time);',
    '    gl_FragColor = vec4(pixel.r, pixel.g, pixel.b, pixel.a);',
    '}'
  ];

  this.filter = new Phaser.Filter(game, null, fragmentShader);
  //this.filter.setResolution(field.width,field.height);

  this.filters = [this.filter];
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
	this.filter.update();
};