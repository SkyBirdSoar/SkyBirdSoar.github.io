$(document).ready(function () {
  toastr.options.timeOut = 0;
  window.NAME = $("#name").text().replace(" ", "_");
  window.DROPBOX_ENABLED = false;
  if (window.S_ENABLE_DROPBOX && window.URL_PARAMS['token'] != null) {
    window.CLIENT = new Dropbox.Client({
      key: "xjnqbt5axzmwl9e",
      token: window.URL_PARAMS["token"]
    });
    window.CLIENT.authenticate({
      interactive: false
    }, function (e) {
      if (e) {
        toastr.warning("Please export your data when you are done.", "JSON Mode");
        $.get("tasks.html", function (f) {
          $("#tasks").html(f);
        });
      } else {
        var t = window.CLIENT.getDatastoreManager();
        t.openDefaultDatastore(function (e, t) {
          if (e) {
            toastr.warning("Please export your data when you are done.", "JSON Mode");
            $.get("tasks.html", function (f) {
            $("#tasks").html(f);
        });
          } else {
            window.DATASTORE = t;
            window.TABLE = t.getTable(window.NAME);
            window.DROPBOX_ENABLED = true;
            $.get("tasks.html", function (f) {
              $("#tasks").html(f);
            });
          }
        });
      }
    });
  } else {
    toastr.warning("Please export your data when you are done.", "JSON Mode");
    $.get("/mathpw/research/users/tasks.html", function(f) { $("#tasks").html(f) });
  }
});