$(document).ready(function() {
  $.get('/mathpw/nav.html', function(f) {
    $('#navWrap').html(f);
  });
});