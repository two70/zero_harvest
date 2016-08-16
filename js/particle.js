Particle = function(key, point, velocity) {
  Phaser.Sprite.call(this, game, point.x, point.y, key);
  this.position = point || new Vector(0, 0);
  this.velocity = velocity || new Vector(0, 0);
  this.acceleration = new Vector(0, 0);
  this.ttl = 5000;
  this.lived = 0;
  //this.distanceToField;
  this.mass = 0.01;
  this.scale.set(0.05);
};

Particle.prototype = Object.create(Phaser.Sprite.prototype);
Particle.prototype.constructor = Particle;

Particle.prototype.move = function (fields) {
  // our starting acceleration this frame
  var totalAccelerationX = 0;
  var totalAccelerationY = 0;
  var distanceToField = 0;

  for (var i = 0; i < fields.length; i++) {
    // find the distance between the particle and the field
    var x = fields.getAt(i).position.x - this.position.x;
    var y = fields.getAt(i).position.y - this.position.y;

    distanceToField = Math.sqrt(x*x+y*y);

    if (distanceToField < 150 && fields.getAt(i).absorbing) {

      if (distanceToField < 2) // If this particle collided with a field, return which field to universe
        return i;
      else {
        var normalized = new Vector();
        normalized.x = x / distanceToField;
        normalized.y = y / distanceToField;
        this.position.add(normalized);
        return -1; 
      }
    }  
    
    if (distanceToField < 2) // If this particle collided with a field, return which field to universe
        return i;
    // calculate the force via MAGIC and HIGH SCHOOL SCIENCE!
    //var force = field.mass / Math.pow((vectorX*vectorX+field.mass/2+vectorY*vectorY+field.mass/2),1.5);
    var force = (fields.getAt(i).mass * this.mass) / Math.pow(distanceToField, 2);

    // add to the total acceleration the force adjusted by distance
    totalAccelerationX += x * force;
    totalAccelerationY += y * force;

  }
  // update our particle's acceleration
  this.acceleration = new Vector(totalAccelerationX, totalAccelerationY);

  // update velocity and position from acceleration
  this.velocity.add(this.acceleration);
  this.position.add(this.velocity);
  return -1;
};