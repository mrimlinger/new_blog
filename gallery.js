function generateGallery(titles, links) {
  var display = document.getElementById('gallery_display');
  var album_list = document.createElement('ul');
  // check
  for (var i=0 ; i<titles.length ; i++) {
    console.log(titles[i]);
    console.log(links[i]);
    var bullet = document.createElement('li');
    var bullet_link = document.createElement('a');
    var bullet_txtNode = document.createTextNode(titles[i]);
    bullet_link.href = links[i];
    bullet_link.appendChild(bullet_txtNode);
    bullet.appendChild(bullet_link);
    album_list.appendChild(bullet);
  }
  display.appendChild(album_list);
}

function generateGalleryFail() {
  var error_p = document.createElement('p');
  var error_txtNode = document.createTextNode("Error loading content. Try refreshing the page.");
  error_p.appendChild(error_txtNode);
  document.getElementById('gallery_display').appendChild(error_p);
  return;
}

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

function giveGalleryInfoTo(callbackSuccess, callbackFail) {
  $.ajax({
    url: "gallery/gallery_index.txt", 
    success: function(data) {
      var blocks = data.split('---');
      var titles = new Array();
      var links = new Array();
      var cnt = 0;
      if (blocks.length < 3) { callbackSuccess(titles, links)}
      for (var i=1 ; i<blocks.length-1 ; i++, cnt++) {
        titles[cnt] = getParam("---"+blocks[i]+"---", "title", "untitled");
        links[cnt] = getParam("---"+blocks[i]+"---", "link", false);
      }
      // [!] doesn't check for errors, just returns false if not found
      // should check here, display if no link ?????
      callbackSuccess(titles, links);
    },
    error: function() {
      callbackFail(); // if request fails, display error msg
    }
  });
}

function checkFormatGallery() {
  return true;
}