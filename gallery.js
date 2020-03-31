function giveGalleryInfoTo(callbackSuccess, callbackFail) {
  $.ajax({
    url: "gallery/gallery_index.txt", 
    success: function(data) {
      var blocks = data.split('---');
      var albums = new Array();
      global.loaded = true;
      global.albums = albums;
      if (blocks.length < 3) {
        console.log("nbr albums:", global[0]); 
        callbackSuccess();
        return;
      }
      var cnt = 0;
      for (var i=1 ; i<blocks.length-1 ; i++, cnt++) {
        var title = getParam("---"+blocks[i]+"---", "title", "untitled");
        var acronym = getParam("---"+blocks[i]+"---", "acronym", "untitled");
        var nbr_pics = parseInt(getParam("---"+blocks[i]+"---", "nbr_pics", "0"));
        var path = getParam("---"+blocks[i]+"---", "path", "");
        var album = new Album(title, acronym, nbr_pics, path);
        albums[cnt] = album;
      }
      global.nbr_albums = cnt;
      console.log("nbr albums:", global.nbr_albums);
      callbackSuccess();
    },
    error: function() {
      callbackFail(); // if request fails, display error msg
    }
  });
}

function generateGallery() {
  var display = document.getElementById('gallery_display');
  // create display for album list
  var album_display = document.createElement('div');
  album_display.id = "album_display";
  display.appendChild(album_display);
  // no album to display
  if (global.nbr_albums==0) { 
    console.log("no albums to display msg");
    var empty_p = document.createElement('p');
    var empty_txtNode = document.createTextNode("The gallery currently has no album to display.")
    empty_p.appendChild(empty_txtNode);
    album_display.appendChild(empty_p);
    return;
  }
  // create album list
  var album_list = document.createElement('ul');
  for (var i=0 ; i<global.nbr_albums ; i++) {
    console.log(global.albums[i].title);
    console.log(global.albums[i].path);
    var bullet = document.createElement('li');
    var bullet_a = document.createElement('a');
    var bullet_txtNode = document.createTextNode(global.albums[i].title);
    bullet_a.appendChild(bullet_txtNode);
    bullet_a.href="#"+global.albums[i].acronym+"/1";
    bullet.appendChild(bullet_a);
    bullet.id = global.albums[i].acronym;   // to later retrieve and modify bullet of selected album
    album_list.appendChild(bullet);
  }
  album_display.appendChild(album_list);
  // create display for photo frame 
  var pic_display = document.createElement('div');
  pic_display.id = "pic_display";
  display.appendChild(pic_display);
  // display appropriate pic in photo frame
  setPic();
  // display left right arrows
  var arrows = document.createElement('div'); 
  arrows.id = "arrows";
  var next = document.createElement('button');
  var prev = document.createElement('button');
  var next_txtNode = document.createTextNode("Next");
  var prev_txtNode = document.createTextNode("Prev");
  next.appendChild(next_txtNode);
  prev.appendChild(prev_txtNode);
  next.setAttribute('onclick','nextPic();','id','next_b');
  prev.setAttribute('onclick','prevPic();','id','prev_b');
  arrows.appendChild(prev);
  arrows.appendChild(next);
  pic_display.appendChild(arrows)
}

function generateGalleryFail() {
  var error_p = document.createElement('p');
  var error_txtNode = document.createTextNode("Error loading content. Try refreshing the page.");
  error_p.appendChild(error_txtNode);
  document.getElementById('gallery_display').appendChild(error_p);
  return;
}

// doesn't take any arguments as it directly looks at # in url
function setPic() {
  $(document).ready();
  console.log("hash has changed (or initial)");
  if (global.loaded==false || global.nbr_pics==0) { //gallery info unloaded or loaded but empty
    return;                            // [!?] since no div "pic_display" loaded
  }
  // process new hash
  var hash = window.location.hash;
  if (hash.trim()==="") { // no hash -> latest album as default
    var acr = global.albums[0].acronym;
    var pic_index = 1;
  }
  else { // extract acronym and pic_index from #
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
  // get numeral index of selected album
  var new_album_index = 0; // if invalid acr display latest
  for (var i=0 ; i<global.nbr_albums ; i++) {
    if (acr===global.albums[i].acronym) {
      new_album_index = i;
      break;
    }
  }
  if (new_album_index!=global.album_index) {
    console.log("change album from",global.albums[global.album_index].acronym,"to",global.albums[new_album_index].acronym);
    global.album_index = new_album_index; // change current album
    // may have to change title and some stuff
    // 
  }
  global.pic_index = pic_index;   // what if image index is too high or negative? -> ADD CHECK
  // if incorrect acr in url, change it ? No bcs will trigger ecusive call of setPic
  displayPic();
}

function displayPic() {
  var display = document.getElementById('pic_display');
  // remove previous pic
  var pic = document.getElementById('pic');
  if (pic != null) {
    display.removeChild(pic);
  }
  // get and display new pic
  // pic_index and album_index can only be modified initially and by setPic
  var album_index = global.album_index;
  var acr = global.albums[album_index].acronym;
  var index = global.pic_index.toString(10);
  var up = 3-index.length;
  for (var i=0 ; i<up ; i++) {
    index = "0"+index;
  }
  pic = document.createElement('img');
  pic.id = "pic"; // important to later retrieve and delete it
  pic.src = "gallery/"+acr+"/"+acr+"_"+index+".jpg";
  pic.alt = "name";       // give better description

  display.insertBefore(pic, display.firstChild); // avoid switching order
}

// just changes the URL under reasonnable conditions
// doesn't change global (done by setPic)
function nextPic() {
  console.log("going next");
  pic_index = global.pic_index;
  album_index = global.album_index;
  if (pic_index<global.albums[album_index].nbr_pics) {
    window.location.hash = "#"+global.albums[album_index].acronym
                            +"/"+(pic_index+1);
  }
}

function prevPic() {
  console.log("going prev");
  pic_index = global.pic_index;
  album_index = global.album_index;
  if (pic_index>1) {
    window.location.hash = "#"+global.albums[album_index].acronym
                            +"/"+(pic_index-1);
  }
}

//----------------------------------------------------------
// Objects

function Album(title, acronym, nbr_pics, path) {
  this.title = title;
  this.acronym = acronym;
  this.nbr_pics = nbr_pics;
  this.path = path;
}

function AlbumIndex() {
  this.albums = null;            // array of Album objects
  this.nbr_albums = 0;           // int
  this.loaded = false;           // bool
  this.album_index = 0;          // int
  this.pic_index = 1;            // int
}