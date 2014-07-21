$(document).ready(function() {
  $.get('nav.html', function(f) {
    $('#navWrap').html(f);
  });
});