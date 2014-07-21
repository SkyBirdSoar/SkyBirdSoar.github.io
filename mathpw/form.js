$(document).ready(function() {
  window.PAPER = {
    y: 21,
    x: 29.7,
    area: 623.7,
    paperAvailable: {
      'U-GRADE Stardream Metalic': 0.51,
      'U-GRADE DD Card': 0.33
    }
  }; // landscape

  $("#paperSize").change(function(e) {
    var paperSize = $("#paperSize");
    switch (paperSize.val()) {
      case 'A4':
        window.PAPER = {
          y: 21,
          x: 29.7,
          area: 623.7,
          paperAvailable: {
            'U-GRADE Stardream Metalic': 0.51,
            'U-GRADE DD Card': 0.33
          }
        };
        $("#material").html('<input type="radio" name="paper" value="U-GRADE Stardream Metalic" required>U-GRADE Stardream Metalic<br><input type="radio" name="paper" value="U-GRADE DD Card" required>U-GRADE D&amp;D Card<br>');
        $("input[name=paper]:radio").change(function(e) {}); // clear
        break;
      case 'Bigger':
        window.PAPER = {
          y: 36,
          x: 51,
          area: 1836,
          paperAvailable: {
            'Stardream': 0.63,
            'Dali': 0.46
          }
        };
        $("#material").html('<input type="radio" name="paper" value="Stardream" required>Stardream<br><input type="radio" name="paper" value="Dali" required>Dali<br>');
        $("input[name=paper]:radio").change(function(e) {
          if ($("input[name=paper]:radio").val() == "Stardream") {
            window.PAPER = $.extend(window.PAPER, {
              y: 36,
              x: 51,
              area: 1836
            });
          }
          else {
            window.PAPER = $.extend(window.PAPER, {
              y: 36,
              x: 50.5,
              area: 1818
            });
          }
        });
        break;
    }
  });

  $("#form").submit(function(e) {
    var container = $("#result");
    container.html(""); // clear
    var data = calculateCosts($("#material input[name=paper]:checked").val(), +$("#radius").val(), +$("#height").val(), +$("#lidHeight").val());
    var html = '';
    if (data.hasOwnProperty('error')) {
      html = "<div class='error'>" + data.error_msg + "</div>";
    }
    else {
      $.each(data, function(key, val) {
        html = html + key + ": " + val.toString() + "<br>";
      });
      html = "<div>" + html + "</div>";
    }

    $("#result").html(html);
    e.preventDefault();
  });
});
