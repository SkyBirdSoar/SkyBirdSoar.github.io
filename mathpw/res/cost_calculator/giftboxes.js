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

window.Heart = function(radius, height, lidHeight) {
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
      var areaOfPaperUsedByHeartBase = breadthOfHeart * lengthOfHeart;
      var breadthOfLid = 2 * lidRadius + Math.sqrt(lidRadius.square() + lidRadius.square());
      var lengthOfLid = 2 * Math.sqrt(0.5 * (2 * lidRadius).square()) + (lidRadius - (lidRadius * Math.cos(toRadians(45))));
      var areaOfPaperUsedByLid = breadthOfLid * lengthOfLid;
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
        areaOfPaperUsedByHeartBase: areaOfPaperUsedByHeartBase,
        breadthOfLid: breadthOfLid,
        lengthOfLid: lengthOfLid,
        areaOfPaperUsedByLid: areaOfPaperUsedByLid,
        lateralAreaOfBase: lateralAreaOfBase,
        lateralAreaOfLid: lateralAreaOfLid
      };
    }
    return properties;
  };
  
  this.calculateProperties();
};

windowBox = function(length, breadth, height, lidHeight) {
  this.length = length;
  this.breadth = breadth;
  this.height = height;
  this.lidHeight = lidHeight;
  
  var properties = null;
  
  this.calculateProperties = function() {
    if (properties === null) {
      var baseArea = length * breadth;
      var baseAreaOfLid = (length + 0.2) * (breadth + 0.2);
      var latA = length * height;
      var latB = breadth * height;
      var lateralArea = (2 * latA) + (2 * latB);
      var latALid = (length + 0.2) * (lidHeight + 0.2);
      var latBLid = (breadth + 0.2) * (lidHeight + 0.2);
      var lateralAreaOfLid = (2 * latALid) + (2 * latBLid);
      
      properties = {
        baseArea: baseArea,
        baseAreaOfLid: baseAreaOfLid,
        latA: latA,
        latB: latB,
        lateralArea: lateralArea,
        latALid: latALid,
        latBLid: latBLid,
        lateralAreaOfLid: lateralAreaOfLid
      };
    }
    return properties;
  };
  
  this.calculateProperties();
};