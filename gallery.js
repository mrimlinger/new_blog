
function test() {
  $.ajax({
    url: "gallery/",
    success: function(data) {
      console.log("folder content:\n",data);
    },
    error: function() {
      console.log("shit");
    }
  });
}