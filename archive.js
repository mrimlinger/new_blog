// archive.js - generates the content of the archive page

// receives all post filenames checked and sorted by date
function generateArchive(filenames) {
  var nbr_posts = filenames.length;
  var display = document.getElementById('archive_display'); // get display div (part meant to be filled)
  if (nbr_posts==0) {
    var empty_p = document.createElement('p');
    var empty_txt = document.createTextNode("This blog currently has no posts.");
    empty_p.appendChild(empty_txt);
    display.appendChild(empty_p);
    return;
  }
  current_year = filenames[0].split('-')[0];
  // add first h3 + sublist
  var year_title = document.createElement('h3');
  var year_title_txt = document.createTextNode(current_year);
  year_title.appendChild(year_title_txt);
  display.appendChild(year_title);
  // add first sublist with first bullet
  var year_list = document.createElement('ul');
  display.appendChild(year_list);
  // go through all posts
  for (var i=0 ; i<nbr_posts ; i++) {
    if (filenames[i].split('-')[0]!==current_year) {
      // add h3 + sublist
      current_year = filenames[i].split('-')[0];
      year_title = document.createElement('h3');
      year_title_txt = document.createTextNode(current_year);
      year_title.appendChild(year_title_txt);
      display.appendChild(year_title);
      year_list = document.createElement('ul');
      display.appendChild(year_list); 
    }
    // add bullet to sublist
    var bullet = document.createElement('li');
    year_list.appendChild(bullet);
    writeBullet(filenames[i],bullet);
  }
}

function generateArchiveFail() {
  var error_p = document.createElement('p');
  var error_txt = document.createTextNode("Error loading content. Try refreshing the page.");
  error_p.appendChild(error_txt);
  document.getElementById('archive_display').appendChild(error_p);
  return;
}