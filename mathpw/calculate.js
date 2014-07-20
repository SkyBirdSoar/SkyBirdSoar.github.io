function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function calculateHeartSquare(radius) {
  var length = 2 * Math.sqrt(0.5 * Math.pow(2 * radius, 2)) + (radius - (radius * Math.cos(toRadians(45))));
  var breadth = 2 * radius + Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2));
  return {
    y: length,
    x: breadth,
    area: length * breadth
  };
}

function calculateLateralArea(radius, height) {
  var cir = Math.PI * radius; // half circle
  var length = (2 * radius) + cir; // aka diameter + cir
  return {
    length: (length >= height) ? length : height, // take the longer
    breadth: (length >= height) ? height : length, // take the shorter
    cir: cir,
    area: length * height
  };
}

function calculatePaperRequired(radius, height, lidHeight) {
  var paperRequired = 1; // minimum
  var heart = calculateHeartSquare(radius);
  var heartLid = calculateHeartSquare(radius + 0.2);
  if ((heartLid.y > PAPER.y) || (heartLid.breadth > PAPER.breadth)) { // using heartLid due to it being bigger.
    return {
      error: true,
      error_msg: 'The heart is bigger than paper size (landscape), try reducing the values.'
    };
  }
  var rY = PAPER.y; // r stands for remaining
  var rX = PAPER.x;
  var lateralArea = calculateLateralArea(radius, height); // half only!
  var lidLateralArea = calculateLateralArea(radius + 0.2, lidHeight);

  var id = ['heart', 'latA', 'latB', 'heartLid', 'lidLatA', 'lidLatB'];
  if ((PAPER.y >= lidLateralArea.length) && (PAPER.x >= lidLateralArea.breadth)) { // vertical alignment (x dominant) |||
    var formula = [heart.x, lateralArea.breadth + 1, lateralArea.breadth + 1, heartLid.x, lidLateralArea.breadth + 1, lidLateralArea.breadth + 1];
    for (var i = 0; i < formula.length; i++) {
      if (rX > formula[i]) {
        rX = rX - formula[i];
      } else {
        paperRequired = paperRequired + 1;
        rX = PAPER.x;
        if (rX > formula[i]) {
          rX = rX - formula[i];
        } else {
          return {
            error: true,
            error_msg: id[i] + '@rX exceeded limit, try reducing the values.',
            alignment: 'vertical'
          };
        }
      }
    }
    return {
      paperRequired: paperRequired,
      alignment: 'vertical',
      heartHeight: heart.y.toFixed(2) + " cm",
      heartWidth: heart.x.toFixed(2) + " cm",
      heartLidHeight: heartLid.y.toFixed(2) + " cm",
      heartLidWidth: heartLid.x.toFixed(2) + " cm",
      lateralAreaLength: (lateralArea.breadth + 1).toFixed(2) + " cm",
      lateralAreaBreadth: (lateralArea.length + 1).toFixed(2) + " cm",
      lidLateralAreaLength: (lidLateralArea.breadth + 1).toFixed(2) + " cm",
      lidLateralAreaBreadth: (lidLateralArea.length + 1).toFixed(2) + " cm"
    };
  } else if ((PAPER.y >= lidLateralArea.breadth) && (PAPER.x >= lidLateralArea.length)) { // horizontal alignment (y dominant) =
    var formula = [heart.y, lateralArea.breadth + 1, lateralArea.breadth + 1, heartLid.y, lidLateralArea.breadth + 1, lidLateralArea.breadth + 1];
    for (var i = 0; i < formula.length; i++) {
      if (rY > formula[i]) {
        rY = rY - formula[i];
      } else {
        paperRequired = paperRequired + 1;
        rY = PAPER.x;
        if (rY > formula[i]) {
          rY = rY - formula[i];
        } else {
          return {
            error: true,
            error_msg: id[i] + '@rY exceeded limit, try reducing the values.',
            alignment: 'horizontal'
          };
        }
      }
    }
    return {
      paperRequired: paperRequired,
      alignment: 'horizontal',
      heartHeight: heart.y.toFixed(2) + " cm",
      heartWidth: heart.x.toFixed(2) + " cm",
      heartLidHeight: heartLid.y.toFixed(2) + " cm",
      heartLidWidth: heartLid.x.toFixed(2) + " cm",
      lateralAreaLength: (lateralArea.length + 1).toFixed(2) + " cm",
      lateralAreaBreadth: (lateralArea.breadth + 1).toFixed(2) + " cm",
      lidLateralAreaLength: (lidLateralArea.length + 1).toFixed(2) + " cm",
      lidLateralAreaBreadth: (lidLateralArea.breadth + 1).toFixed(2) + " cm"
    };
  } else {
    return {
      error: true,
      error_msg: 'The perimeter is bigger than paper size, try reducing the values.'
    };
  }
}

function calculateCosts(paperSelected, radius, height, lidHeight) {
  var data = calculatePaperRequired(radius, height, lidHeight);
  if (data.hasOwnProperty('error')) {
    return data;
  }
  var baseCost = 0;
  var cost = 0;
  $.each(window.PAPER.paperAvailable, function (key, value) {
    if (paperSelected.toLowerCase() == key.toLowerCase()) {
      baseCost = value;
      cost = data.paperRequired * value;
      return false;
    }
  });
  return $.extend({baseCost: "$" + baseCost.toFixed(2), cost: "$" + cost.toFixed(2)}, data);
}