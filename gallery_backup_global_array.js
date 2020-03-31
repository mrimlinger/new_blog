function generateGallery() {
  // names from global var
  var nbr = global[0];
  var titles = global[1];
  var acronyms = global[2];
  var links = global[3];
  // get gallery display
  var display = document.getElementById('gallery_display');
  // create display for album list
  var album_display = document.createElement('div');
  album_display.id = "album_display";
  display.appendChild(album_display);
  // create album list
  var album_list = document.createElement('ul');
  if (nbr==0) { // no album to display
    console.log("no albums to display msg");
    var empty_p = document.createElement('p');
    var empty_txtNode = document.createTextNode("The gallery currently has no album to display.")
    empty_p.appendChild(empty_txtNode);
    album_display.appendChild(empty_p);
    return;
  }
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
  album_display.appendChild(album_list);
  // create display for photo frame 
  var pic_display = document.createElement('div');
  pic_display.id = "pic_display";
  display.appendChild(pic_display);
  // display pic in photo frame
  setPic();
}

function generateGalleryFail() {
  var error_p = document.createElement('p');
  var error_txtNode = document.createTextNode("Error loading content. Try refreshing the page.");
  error_p.appendChild(error_txtNode);
  document.getElementById('gallery_display').appendChild(error_p);
  return;
}

function giveGalleryInfoTo(callbackSuccess, callbackFail) {
  $.ajax({
    url: "gallery/gallery_index.txt", 
    success: function(data) {
      var blocks = data.split('---');
      var titles = new Array();
      var acronyms = new Array();
      var links = new Array();
      global[0] = 0;
      global[1] = titles;
      global[2] = acronyms;
      global[3] = links;
      if (blocks.length < 3) {
        console.log("nbr albums:", global[0]); 
        callbackSuccess();
        return;
      }
      var cnt = 0;
      for (var i=1 ; i<blocks.length-1 ; i++, cnt++) {
        titles[cnt] = getParam("---"+blocks[i]+"---", "title", "untitled");
        acronyms[cnt] = getParam("---"+blocks[i]+"---", "acronym", "untitled");
        links[cnt] = getParam("---"+blocks[i]+"---", "link", false);
      }
      global[0] = cnt;
      console.log("nbr albums:", global[0]);
      // [!] doesn't check for errors, just returns false if not found
      // should check here, display if no link ?????
      callbackSuccess();
    },
    error: function() {
      callbackFail(); // if request fails, display error msg
    }
  });
}

function checkFormatGallery() { // useless ?
  return true;
}

function setPic() {
  $(document).ready(); // needed ?
  console.log("hash has changed (or initial)");
  if (global[0]==-1 || global[0]==0) { //gallery info unloaded or loaded but empty
    return;                            // [!?] since no div "pic_display" loaded
  }
  // process new hash
  var hash = window.location.hash;
  if (hash.trim()==="") { // no hash -> latest album as default
    var acr = global[2][0];
    var pic_index = 1;
  }
  else { // extract selected album info from hash
    hash = (hash.split('#')[1]).trim();
    var elems = hash.split('/');
    var acr = elems[0].trim();
    var pic_index = 1; // default if no pic_index mentioned
    if (elems.length>1) {
      var pic_index_str = elems[1].trim();
      if (!isStrInt(pic_index_str)) { pic_index = 1; }
      else { pic_index = parseInt(pic_index_str, 10); }
    }
  }
  console.log("displaying album",acr,"picture n°",pic_index);
  // get numeral index or selected album
  var album_index = 0; // if false acr display latest
  for (var i=0 ; i<global[0] ; i++) {
    if (acr===global[2][i]) {
      album_index = i;
      break;
    }
  }
  if (album_index!=global[4]) {
    console.log("change album from",global[2][global[4]],"to",global[2][album_index]);
    global[4] = album_index; // change current_album
    //load different album info (cf. medium article)
    loadAlbumInfoAndDisplay(global[3][album_index]);
  }
  else {
    ; // get pic and display
  }
}

function loadAlbumInfoAndDisplay(album_url) {
  // get links from Gphotos and display requested pic
  $.get("https://lbarman.ch").done(function(data) {console.log(data);});
  /*$.ajax({
    //type:'POST',
    url: "https://lbarman.ch",
    success: function(data) {
      console.log(data);
    },
    error: function(data) {
      console.log(data);
      console.log("error getting album info at: ",album_url);
    }
  });*/
}

function changeHash() {
  // to be called when users clicks on album list
  ;
}

//----------------------------------------------------------
// Objects

function Album(title, acronym, nbr_pics, childrens) {
  this.title = title;
  this.acronym = acronym;
  this.nbr_pics = nbr_pics;
}

function AlbumIndex() {
  this.albums = null;            // array of albums
  this.nbr_albums = 0;           // int
  this.loaded = false;           // bool
  this.current_album_index = 0;  // int
}