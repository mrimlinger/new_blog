function generatePost(filename) {
  $.ajax({
    url: filename,
    success: function(data) {
      var display = document.getElementById('post_dislay');
      // title
      var post_title = document.createElement('h2');
      var post_title_txt = document.createTextNode(getPostTitle(data));
      post_title.appendChild(post_title_txt);
      display.appendChild(post_title);
      // body
      var post_body = document.createElement('p');
      raw_body_txt = getPostBody(data);
      // will need to parse and process the body
      var post_body_txtNode = document.createTextNode(raw_body_txt);
      post_body.appendChild(post_body_txtNode);
      display.appendChild(post_body);
    },
    error: function() {
      var error_p = document.createElement('p');
      var error_txtNode = document.createTextNode("Error loading content. Try refreshing the page.");
      error_p.appendChild(error_txtNode);
      document.getElementById('post').appendChild(error_p);
      return;
    }
  });
} // receives data from givePostInfoTo ?


// obtain post filename from url
function getPostFileName(url) {
  var elems = url.split('/')
  var filename = elems[elems.length-1].split('.')[0]+'.md';
  return filename;
}

// must receive ordered list of all filenames
function generatePrevNext(filenames) {
  var display = document.getElementById('pn_display');
  var curr_filename = getPostFileName(window.location.href);
  var len = filenames.length
  for (i=0 ; i<len ; i++) {
    if (curr_filename===filenames[i]) {
      if (i>0) {
        // create next button
        var next_p = document.createElement('p');
        var next_a = document.createElement('a'); 
        var link_txtNode = document.createTextNode("Next");
        next_a.href = filenames[i-1].split('.')[0]+'.html';
        next_a.appendChild(link_txtNode);
        next_p.appendChild(next_a);
        display.appendChild(next_p);
      }
      if (i<len-1) {
        // create previous button
        var prev_p = document.createElement('p');
        var prev_a = document.createElement('a'); 
        var link_txtNode = document.createTextNode("Prev");
        prev_a.href = filenames[i+1].split('.')[0]+'.html';
        prev_a.appendChild(link_txtNode);
        prev_p.appendChild(prev_a);
        display.appendChild(prev_p);
      }
    }
  }
}

function generatePrevNextFail() {;}

//var opened = window.open("");
//opened.document.write("<html><head><title>MyTitle</title></head><body>test</body></html>");