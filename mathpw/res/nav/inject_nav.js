$(document).ready(function() {
  $.get('/mathpw/res/nav/nav.html', function(f) {
    $('#navWrap').html(f);
  });
});