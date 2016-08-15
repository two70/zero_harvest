Particle = function(key, point, velocity, mass) {
  Phaser.Sprite.call(this, game, point.x, point.y, key);
  this.position = point || new Vector(0, 0);
  this.velocity = velocity || new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.ttl = 5000;
  this.lived = 0;
  this.totalDistance;
  this.mass = mass;
  this.scale.set(0.05);
};

Particle.prototype = Object.create(Phaser.Sprite.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.move = function (fields) {
  // our starting acceleration this frame
  var totalAccelerationX = 0;
  var totalAccelerationY = 0;

  for (var i = 0; i < fields.length; i++) {
    // find the distance between the particle and the field
    var vectorX = fields.getAt(i).position.x - this.position.x;
    var vectorY = fields.getAt(i).position.y - this.position.y;

    this.totalDistance = Math.sqrt(vectorX*vectorX+vectorY*vectorY);

    if (this.totalDistance < 2) // If this particle collided with a field return which field to universe
      return i;

    // calculate the force via MAGIC and HIGH SCHOOL SCIENCE!
    //var force = field.mass / Math.pow((vectorX*vectorX+field.mass/2+vectorY*vectorY+field.mass/2),1.5);
    var force = (fields.getAt(i).mass * this.mass) / Math.pow(this.totalDistance, 2);

    //if (vectorX > 200 || vectorY > 200 || vectorX < -200 || vectorY < -200)
      //force *= 200;

    // add to the total acceleration the force adjusted by distance
    totalAccelerationX += vectorX * force;
    totalAccelerationY += vectorY * force;
  }
  // update our particle's acceleration
  this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);

  // update velocity and position from acceleration
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  return -1;
};