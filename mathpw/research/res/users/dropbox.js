var urlParams;
(window.onpopstate = function () {
  var match,
      pl     = /\+/g,  // Regex for replacing addition symbol with a space
      search = /([^&=]+)=?([^&]*)/g,
      decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
      query  = window.location.search.substring(1);

  urlParams = {};
  while (match = search.exec(query))
     urlParams[decode(match[1])] = decode(match[2]);
})();

if (urlParams["token"] == null) {
  alert("Error: No token. Click ok to continue anyways.");
} else {
  var client = new Dropbox.Client({key: "xjnqbt5axzmwl9e", token: urlParams["token"]});

  // Try to finish OAuth authorization.
  client.authenticate({interactive: false}, function (error) {
    if (error) {
      alert('Dropbox Authentication error: ' + error);
    }
  });
}

$(document).ready(function() {
  $.get("tasks.html", function(data) {
    $("#tasks").html(data);
  });
});