'use strict';

var template = document.getElementById('picture-template');
var template_picture;

if ('content' in template) {
  template_picture = template.content.querySelector('.picture');
} else {
  template_picture = template.querySelector('.picture');
}


module.exports = {
  createPicture : function(data, container){
    var picture = template_picture.cloneNode(true);
    picture.querySelector('.picture-comments').textContent = data.comments;
    picture.querySelector('.picture-likes').textContent = data.likes;

    var img = picture.getElementsByTagName('IMG')[0];

    var picture_image = new Image();
    picture_image.onload = function() {
      clearTimeout(pictureLoadTimeout);
      img.src = picture_image.src;
    };
    picture_image.onerror = function() {
      picture.classList.add('picture-load-failure');
    };
    picture_image.src = data.url;

    var pictureLoadTimeout = setTimeout(function() {
      picture.classList.add('picture-load-failure');
    }, 10000);

    container.appendChild(picture);
  }
}
