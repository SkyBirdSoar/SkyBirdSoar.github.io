//////////////////////////////////////////////////////////////////
/*              MAKING FORMULAS LOOK CLEANER                    */
//////////////////////////////////////////////////////////////////
Number.prototype.square = function() {
  return this.valueOf() * this.valueOf();
};
//////////////////////////////////////////////////////////////////

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

var Heart = function(radius, height, lidHeight) {
  this.radius = radius;
  this.height = height;
  this.lidHeight = lidHeight;
  
  var properties = null; // cache
  
  var pi = Math.PI;
  
  this.calculateProperties = function() {
    if (properties === null) {
      var lidRadius = radius + 0.2;
      var baseAreaOfHeart = (pi * radius.square()) + 4 * radius.square();
      var baseAreaOfLid = (pi * lidRadius.square()) + 4 * lidRadius.square();
      var volumeOfBox = baseAreaOfHeart * height;
      var perimeterOfHeartBase = (2 * pi * radius) + 4 * radius;
      var perimeterOfLid = (2 * pi * lidRadius) + 4 * lidRadius;
      var breadthOfHeart = 2 * radius + Math.sqrt(radius.square() + radius.square());
      var lengthOfHeart = 2 * Math.sqrt(0.5 * (2 * radius).square()) + (radius - (radius * Math.cos(toRadians(45))));
      var areaUsedByHeartBase = breadthOfHeart * lengthOfHeart;
      var breadthOfLid = 2 * lidRadius + Math.sqrt(lidRadius.square() + lidRadius.square());
      var lengthOfLid = 2 * Math.sqrt(0.5 * (2 * lidRadius).square()) + (lidRadius - (lidRadius * Math.cos(toRadians(45))));
      var areaUsedByLid = breadthOfLid * lengthOfLid;
      var lateralAreaOfBase = perimeterOfHeartBase * height;
      var lateralAreaOfLid = perimeterOfLid * lidHeight;
      
      properties = {
        baseAreaOfHeart: baseAreaOfHeart,
        baseAreaOfLid: baseAreaOfLid,
        volumeOfBox: volumeOfBox,
        perimeterOfHeartBase: perimeterOfHeartBase,
        perimeterOfLid: perimeterOfLid,
        breadthOfHeart: breadthOfHeart,
        lengthOfHeart: lengthOfHeart,
        areaUsedByHeartBase: areaUsedByHeartBase,
        breadthOfLid: breadthOfLid,
        lengthOfLid: lengthOfLid,
        areaUsedByLid: areaUsedByLid,
        lateralAreaOfBase: lateralAreaOfBase,
        lateralAreaOfLid: lateralAreaOfLid
      };
    }
    
    return properties;
  };
};