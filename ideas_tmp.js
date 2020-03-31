function giveIndexFromTo(url, checkFormat, callbackSuccess, callbackFail) {
  $.ajax({
    url: url, 
    success: function(data) {
      var lines = data.split('\n');
      // extract posts names
      var filenames = new Array();
      var cnt = 0;
      for (var i=0 ; i<lines.length ; i++) {
        if (checkFormat(lines[i])) {
          filenames.push(lines[i].split(' ')[0].trim());    // add trim to avoid weird spaces
          cnt += 1;
        }
      }
      callbackSuccess(filenames);
    },
    error: function() {
      callbackFail(); // if request fails, display error msg
    }
  });
}