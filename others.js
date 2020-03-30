// others.js - general tool functions used by other modules

function generateYear(id) {
  n =  new Date();
  y = n.getFullYear();
  document.getElementById(id).innerHTML = y;
}

function givePostInfoTo(callbackSuccess, callbackFail) {
  // must check url first (depending on origin of call)
  var target_url = "posts/post_index.txt";
  var curr_url = window.location.href
  elems = curr_url.split('/');
  if (elems[elems.length-2]==="posts") {
    target_url = "post_index.txt";
  }
  $.ajax({
    url: target_url, 
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
  var path='posts/'+filename;
  $.ajax({
    url: 'posts/'+filename,
    success: function(data) {
      date = getPostDate(filename);
      title = getTitle(data);
      // [!] split returns EMPTY string if spacer at beginning/end or inbetween two spacers
      var bullet_txtNode_date = document.createTextNode(date+'\xa0\xa0\xa0\xa0');
      var bullet_link = document.createElement('a');
      var bullet_link_txtNode = document.createTextNode(title);
      bullet_link.href = 'posts/'+filename.split('.')[0]+'.html';
      bullet_link.appendChild(bullet_link_txtNode);
      bullet.appendChild(bullet_txtNode_date);  // date
      bullet.appendChild(bullet_link);      // link
      bullet.appendChild(bullet_link);
    },
    error: function() {
      var bullet_txtNode = document.createTextNode("Failed to load post information");
      bullet.appendChild(bullet_txtNode);
    }
  });
}

// extracts title from all post data
function getTitle(data) {
  var title = "untitled";
  var data_split = data.split('---');
  if (data_split.length<3) { return title;}  // check if there was a header (i.e. []---[]---[])
  var header_lines = data_split[1].split('\n');
  for (var i=0 ; i<header_lines.length ; i++) {
    header_lines[i] = header_lines[i].trim(); // remove weird space
    var elems = header_lines[i].split(':');
    if (elems.length<2) { continue; }
    if (elems[0]==="title") {
      elems_2 = elems[1].split(' '); //removes spaces (only at beginning) --> end too ?
      for (var j=0 ; j<elems_2.length ; j++) {
        if (elems_2[j]!=="") {
          title="";
          for (k=j ; k<elems_2.length ; k++) {
            title = title+elems_2[k]+' ';
          }
          break;
        }
      }
    }
  }
  return title;
}

// meant to replace fonction above
// extracts parameter from format
// ---
// param_name: param_value
// ---
function getParam(data, param_name, param_default) {
  var data_split = data.split('---');
  if (data_split.length<3) { return param_default;}  // check if there was a header (i.e. []---[]---[])
  var header_lines = data_split[1].split('\n');
  for (var i=0 ; i<header_lines.length ; i++) {
    header_lines[i] = header_lines[i].trim(); // remove weird space
    var elems = header_lines[i].split(':'); 
    if (elems.length<2) { continue; } // check if there was a ':'
    if (elems[0]===param_name) {
      // reconstruct string after the first ':' to reinclude possibles ':'
      var param = elems[1];
      for (var j=2 ; j<elems.length ; j++) {
        var param = param+":"+elems[j]; 
      }
      param = param.trim();
      if (param === "") { return param_default; }
    }
  }
  return param;
}

function getPostDate(filename) {
  var elems_f = filename.split('-');
  var date = elems_f[0]+'-'+elems_f[1]+'-'+elems_f[2];
  return date;
}

function extractTag(text) { // for example get title: _____
  ;
}


function getPostBody(data) {
  var body = '';
  var data_split = data.split('---');
  if (data_split.length<3) {  // check if there was a header (i.e. []---[]---[])
    return data;
  }
  else {
    return data_split[2];
  }
  return body;
}