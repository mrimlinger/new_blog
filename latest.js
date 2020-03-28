// latest.js - for generation of the "Latest posts" section

// receives all post filenames checked and sorted by date
function generateLatest(filenames) {
  var nbr_disp = 5;
  var nbr_posts = filenames.length;
  console.log('nbr_posts:',filenames.length);
  if (nbr_posts==0) {
    var empty_p = document.createElement('p');
    var empty_txtNode = document.createTextNode("This blog currently has no posts.");
    empty_p.appendChild(empty_txtNode);
    document.getElementById('latest_display').appendChild(empty_p);
    return;
  }
  if (nbr_posts<nbr_disp) {
    nbr_disp = nbr_posts;
  }
  var list = document.createElement('ul');
  var headers = new Array()
  for (var i=0 ; i<nbr_disp ; i++) {
    var bullet = document.createElement('li');
    list.appendChild(bullet);
    //
    writeBullet(filenames[i],bullet);
    //
    console.log("created listing ", i);
  }
  document.getElementById('latest_display').appendChild(list);
  console.log("generateLatest() is done");
}

function generateLatestFail() {
  var error_p = document.createElement('p');
  var error_txtNode = document.createTextNode("Error loading content. Try refreshing the page.");
  error_p.appendChild(error_txtNode);
  document.getElementById('latest_display').appendChild(error_p);
  return;
}





