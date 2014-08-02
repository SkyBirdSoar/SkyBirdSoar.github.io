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
  
  this.calculatePaperRequired = function() {
    var paperRequired = 1; // minimum
    var heart = {x: properties.breadthOfHeart, y: properties.lengthOfHeart};
    var heartLid = {x: properties.breadthOfLid, y: properties.lengthOfLid};
    if ((heartLid.y > window.PAPER.y) || (heartLid.x > window.PAPER.x)) { // using heartLid due to it being bigger.
      return {
        error: true,
        error_msg: 'The heart is bigger than paper size, try reducing the values.'
      };
    }
    var rY = window.PAPER.y; // r stands for remaining
    var rX = window.PAPER.x;
    var lateralArea = {length: properties.perimeterOfHeartBase / 2, breadth: height}; // half only!
    var lidLateralArea = {length: properties.perimeterOfLid / 2, breadth: lidHeight};
  
    var id = ['heart', 'latA', 'latB', 'heartLid', 'lidLatA', 'lidLatB'];
    if ((window.PAPER.y >= lidLateralArea.length) && (window.PAPER.x >= lidLateralArea.breadth)) { // vertical alignment (x dominant) |||
      var formula = [heart.x, lateralArea.breadth + 1, lateralArea.breadth + 1, heartLid.x, lidLateralArea.breadth + 1, lidLateralArea.breadth + 1];
      for (var i = 0; i < formula.length; i++) {
        if (rX > formula[i]) {
          rX = rX - formula[i];
        } else {
          paperRequired = paperRequired + 1;
          rX = window.PAPER.x;
          if (rX > formula[i]) {
            rX = rX - formula[i];
          } else {
            return {
              error: true,
              error_msg: id[i] + 'x exceeded paper breadth, try reducing the values.',
              alignment: 'vertical'
            };
          }
        }
      }
      return {
        paperRequired: paperRequired,
        alignment: 'vertical'
      };
    } else if ((window.PAPER.y >= lidLateralArea.breadth) && (window.PAPER.x >= lidLateralArea.length)) { // horizontal alignment (y dominant) =
      var formula = [heart.y, lateralArea.breadth + 1, lateralArea.breadth + 1, heartLid.y, lidLateralArea.breadth + 1, lidLateralArea.breadth + 1];
      for (var i = 0; i < formula.length; i++) {
        if (rY > formula[i]) {
          rY = rY - formula[i];
        } else {
          paperRequired = paperRequired + 1;
          rY = window.PAPER.x;
          if (rY > formula[i]) {
            rY = rY - formula[i];
          } else {
            return {
              error: true,
              error_msg: id[i] + 'y exceeded paper height, try reducing the values.',
              alignment: 'horizontal'
            };
          }
        }
      }
      return {
        paperRequired: paperRequired,
        alignment: 'horizontal'
      };
    } else {
      return {
        error: true,
        error_msg: 'The perimeter is bigger than paper size, try reducing the values.'
      };
    }
  };
  
  this.calculateBaseCost = function(paperSelected) {
    var data = this.calculatePaperRequired();
    if (data.hasOwnProperty('error')) {
      return data;
    }
    var basePaperCost = 0;
    var materialCost = 0;
    $.each(window.PAPER.paperAvailable, function (key, value) {
      if (paperSelected.toLowerCase() == key.toLowerCase()) {
        basePaperCost = value;
        materialCost = data.paperRequired * value;
        return false;
      }
    });
    return $.extend({basePaperCost: basePaperCost, materialCost: materialCost}, data);
  };
  
  this.calculateProperties();
};

//
//
//                    BOX 
//
//

window.Box = function(length, breadth, height, lidHeight) {
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
      var volumeOfBox = length * breadth * height;
      
      properties = {
        baseArea: baseArea,
        baseAreaOfLid: baseAreaOfLid,
        latA: latA,
        latB: latB,
        lateralArea: lateralArea,
        latALid: latALid,
        latBLid: latBLid,
        lateralAreaOfLid: lateralAreaOfLid,
        volumeOfBox: volumeOfBox
      };
    }
    return properties;
  };
  
  this.calculatePaperRequired = function() {
    return {paperRequired: Math.ceil((properties.baseArea + properties.baseAreaOfLid + properties.lateralArea + properties.lateralAreaOfLid) / window.PAPER.area)};
  };
  
  this.calculateBaseCost = function(paperSelected) {
    var data = this.calculatePaperRequired();
    if (data.hasOwnProperty('error')) {
      return data;
    }
    var basePaperCost = 0;
    var materialCost = 0;
    $.each(window.PAPER.paperAvailable, function (key, value) {
      if (paperSelected.toLowerCase() == key.toLowerCase()) {
        basePaperCost = value;
        materialCost = data.paperRequired * value;
        return false;
      }
    });
    return $.extend({basePaperCost: basePaperCost, materialCost: materialCost}, data);
  };
  
  this.calculateProperties();
};