$(document).ready(function () {

  const cropInstance = [];

  var lock = false;

  const callback = function (id, value) {
    console.log("cropbox moved in from image# " + id);
    if (!lock) {
      lock = true;
      cropInstance.forEach(function (cropper, index) {
        if (index !== id) {
          console.log("moving cropbox " + index);
          // cropper.moveTo(value.x, value.y);
          cropper.resizeTo(value.width, value.height);
          cropper.moveTo(value.x, value.y);
        }
        if (cropInstance.length - 1 === index) lock = false;
      })
    }
  };

  let images = $(".large-image");

  for (let i = 0; i < images.length; i++) {
    let cropper = new Croppr(images[i], {
      startSize: [100, 100, 'px'],
      returnMode: "raw",
      onCropEnd: function (value) {
        console.log(value.x, value.y, value.width, value.height);

        let top = value.y;
        let right = value.x + value.width;
        let bottom = value.y + value.height;
        let left = value.x;
        
        let $clip = $('#clip');
        $clip.css('position', 'absolute');
        $clip.css('top', -1 * top);
        $clip.css('left', -1 * left);
        let rect = 'rect(' + top + 'px, ' + right + 'px, ' + bottom + 'px, ' + left + 'px)';
        console.log(rect);
        $clip.css('clip', rect);

        callback(i, value)

      }
    });
    cropInstance.push(cropper);
  }

});
