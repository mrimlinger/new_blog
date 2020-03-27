// others.js - general tool functions used by other modules

function generateYear(id) {
  n =  new Date();
  y = n.getFullYear();
  document.getElementById(id).innerHTML = y;
}

function givePostInfoTo(callbackSuccess, callbackFail) {
  $.ajax({
    url: "posts/post_index.txt", 
    success: function(data) {
      var lines = data.split('\n');
      // extract posts names
      var filenames = new Array();
      var cnt = 0;
      for (var i=0 ; i<lines.length ; i++) {
        if (checkFormat(lines[i])) {
          filenames.push(lines[i].split(' ')[0]);
          console.log(filenames[cnt]);
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

// checking format wip -----------------------------------
// suggestion check range month and date
function checkFormat(line) {
  if (line==="") { return false; }
  var first_word = line.split(' ')[0];
  var elems = first_word.split('-');
  if (elems.length<4) { return false; }
  if (elems[0].length==4 
      && elems[1].length==2
      && elems[2].length==2
      && isInt(elems[0])
      && isInt(elems[1])
      && isInt(elems[2])) {
    return true;
  }
  return false;
}
function isInt(elem) {
  var result = false;
  for (var i=0 ; i<elem.length ; i++) {
    result = false;
    for (var j=0 ; j<10 ; j++) {
      if (elem[i]===j.toString()){
        var result = true;
        break;
      }
    }
    if (result==false) {
      return false;
    }
  }
  return true;
}

// sort all filenames by date
function sortByDate() {;}   // will implement later

// write bullets for post lists (latest posts, archive)
function writeBullet(filename, bullet) {
  $.ajax({
    url: 'posts/'+filename,
    success: function(data) {
      var title = 'untitled';
      var elems_f = filename.split('-');
      var date = elems_f[0]+'-'+elems_f[1]+'-'+elems_f[2];
      var header = data.split('---')[1].split('\n');
      console.log(header);
      for (var i=0 ; i<header.length ; i++) {
        var elems_h = header[i].split(':');
        if (elems_h[0]==="title") {
          title = date+'\xa0\xa0'+elems_h[1];
        }
      }
      var bullet_txt = document.createTextNode(title);
      bullet.appendChild(bullet_txt);
      // add link to blog post
      // eventually split into two html elements (date, title) in the bullet
    },
    error: function() {
      var bullet_txt = document.createTextNode("Failed to load post information");   // it works ! now extract title from data
      bullet.appendChild(bullet_txt);
    }
  });
}