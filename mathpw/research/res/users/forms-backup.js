// @universal
var sortByIndex = function(a, b) {
  var aindex = a.get("index");
  var bindex = b.get("index");
  return (aindex < bindex) ? -1 : ((aindex > bindex) ? 1 : 0);
};

// @universal
var updateRecords = function(source, records) {
  $.each(records, function (i, record) {
    if (source.length > i) {
      record.update(source[i]);
    } else {
      record.deleteRecord();
    }
  });
  var excess = records.length - source.length;
  for (var i = 0; i < excess; i++) {
    records.pop();
  }
  if (source.length > records.length) {
    var nRecord = records.length; // prevent recalculations
    excess = source.length - nRecord;
    for (var i = -1; i < excess; i++) {
      var index = nRecord + i; // This statement is correct
      var newRecord = window.TABLE.insert(source[index]);
      records.push(newRecord);
    }
  }
  sync();
};

// @universal
var sync = function() {
  toastr.info("Syncing to Dropbox...");
  var syncID = setInterval(function () {
    if (!window.DATASTORE.getSyncStatus()['uploading']) {
      toastr.success("Sync completed.");
      clearInterval(syncID);
    }
  }, 1000);
};

// @universal
var readPromo = function() {
  var textareas = $("#promotions > textarea");
  textareas = $.map($.makeArray(textareas), function(textarea, i) {
    return {
      type: "promo",
      index: i,
      text: $(textarea).val()
    };
  });
  return textareas;
}

// @universal
var readTableRow = function(tr) {
  tr = $(tr);
  var dict = {};
  tr.children().each(function(i, child) {
    var text = child.innerHTML;
    text.replace(/<[^>]*>?/g, '');
    switch (i) {
      case 0:
        dict.website = text;
        break;
      case 1:
        dict.remarks = text;
        break;
      case 2:
        dict.price = text;
        break;
      case 3:
        dict.quantity = text;
        break;
    }
  });
  return dict;
};

var readGiftbox = function() {
  var trs = $.makeArray($("#giftbox tr"));
  trs.shift();
  trs = $.map(trs, function(tr, i) {
    return $.extend({
      type: "giftbox",
      index: i
    }, readTableRow(tr));
  });
  return trs;
};

var promoInit = function(promo) {
  var textareas = $("#promotions > textarea");
  $.each(promo, function (i, record) {
    if (textareas.length >= i) { // should not update value.
      $(textareas[i]).val(record.get("text"));
    } else {
      $("#promotions > textarea").last().after($("<textarea>").val(record.get("text")));
    }
  });
  promoButtons(promo);
};

var promoButtons = function(promo) {
  $("#add_promo").click(function (e) {
    $("#promotions > textarea").last().after("<textarea></textarea>");
  });
  $("#rem_promo").click(function (e) {
    if ($("#promotions").children("textarea").length > 3) {
      $("#promotions > textarea").last().remove();
    } else {
      toastr.error("You need to enter at least 3 promotions!");
    }
  });
  
  $("#promotions").submit(function(e) {
    if (window.DROPBOX_ENABLED && window.S_ENABLE_SAVE) {
      var textareas = readPromo();
      updateRecords(textareas, promo);
      e.preventDefault();
    } else {
      toastr.error("Please export your data on the bottom of the page.", "Dropbox not activated");
      e.preventDefault();
    }
  });
};

var giftboxInit = function(giftboxes) {
  var trs = $.makeArray($("#giftbox tr"));
  trs.shift();

  $.each(giftboxes, function(i, record) {
    var a = "<td contenteditable=\"true\">" + record.get("website") + "</td>";
    var b = "<td contenteditable=\"true\">" + record.get("remarks") + "</td>";
    var c = "<td contenteditable=\"true\">" + record.get("price") + "</td>";
    var d = "<td contenteditable=\"true\">" + record.get("quantity") + "</td>";
    if (trs.length >= i) {
      $(trs[i]).html(a + b + c + d);
    }
    else {
      var s = $("#giftbox tr").last().after("<tr contenteditable=\"true\">" + a + b + c + d + "</td>");
    }
  });
  giftboxButtons(giftboxes);
};

var giftboxButtons = function(giftboxes) {
   $("#add_giftbox").click(function (e) {
    $("#giftbox tr").last().after("<tr contenteditable=\"true\"><td></td><td></td><td></td><td></td></tr>");
  });
  $("#rem_giftbox").click(function (e) {
    if ($("#giftbox tr").length > 6) {
      $("#giftbox tr").last().remove();
    } else {
      toastr.error("You need to research at least 5 giftboxes!");
    }
  });
  
  $("#submit_giftbox").click(function(e) {
    if (window.DROPBOX_ENABLED && window.S_ENABLE_SAVE) {
      var trs = readGiftbox();
      updateRecords(trs, giftboxes);
      e.preventDefault();
    } else {
      toastr.error("Please export your data on the bottom of the page.", "Dropbox not activated");
      e.preventDefault();
    }
  });
};

var exportJSON = function() {
  var promo = readPromo();
  var giftbox = readGiftbox();
  var string = {
    name: window.NAME,
    promo: promo,
    giftbox: giftbox
  };
  return JSON.stringify(string, undefined, 2);
};

$(document).ready(function() {
  toastr.options.timeOut = 5000;
  if (window.DROPBOX_ENABLED) {
    switch (window.S_DB_DELETE_ALL) {
      case false:
        break;
      case true:
        $.each(window.TABLE.query(), function (i, record) {
          record.deleteRecord();
        });
        break;
      case "promo":
        $.each(window.TABLE.query({
          type: "promo"
        }), function (i, record) {
          record.deleteRecord();
        });
        break;
      case "giftbox":
        $.each(window.TABLE.query({
          type: "giftbox"
        }), function (i, record) {
          record.deleteRecord();
        });
        break;
    }
    var promo = window.TABLE.query({type: "promo"});
    promo.sort(sortByIndex);
    promoInit(promo);

    var giftboxes = window.TABLE.query({type: "giftbox"});
    giftboxes.sort(sortByIndex);
    giftboxInit(giftboxes);
    $("#export").click(function(e) {
      $(this).attr('href', "data:text/plain;charset=UTF-8," + encodeURIComponent(exportJSON()));
    });
  }
  else {
    //make buttons work
    promoButtons(null);
    giftboxButtons(null);
     $("#export").click(function(e) {
      $(this).attr('href', "data:text/plain;charset=UTF-8," + encodeURIComponent(exportJSON()));
    });
  }
});

if (window.DROPBOX_ENABLED) {
  $(window).bind('beforeunload', function (e) {
    if (window.DATASTORE.getSyncStatus()['uploading']) {
      return "Progress has not been saved! Are you sure you want to leave?";
    }
  });
}