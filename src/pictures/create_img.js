'use strict';

var template = document.getElementById('picture-template');
var templatePicture;

if ('content' in template) {
  templatePicture = template.content.querySelector('.picture');
} else {
  templatePicture = template.querySelector('.picture');
}


module.exports = function(data) {
  var picture = templatePicture.cloneNode(true);
  picture.querySelector('.picture-comments').textContent = data.comments;
  picture.querySelector('.picture-likes').textContent = data.likes;

  var img = picture.getElementsByTagName('IMG')[0];

  var pictureImage = new Image();
  pictureImage.onload = function() {
    clearTimeout(pictureLoadTimeout);
    img.src = pictureImage.src;
  };
  pictureImage.onerror = function() {
    picture.classList.add('picture-load-failure');
  };
  pictureImage.src = data.url;

  var pictureLoadTimeout = setTimeout(function() {
    picture.classList.add('picture-load-failure');
  }, 10000);

  return picture;
};
