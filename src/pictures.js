var template = document.getElementById('picture-template');
var template_picture;
var block_pictures = document.querySelector('.pictures');

document.querySelector('.filters').classList.add('hidden');

if ('content' in template){
  template_picture = template.content.querySelector('.picture');
} else{
  template_picture = template.querySelector('.picture');
}

function createPicture(data){
  var picture = template_picture.cloneNode(true);
  picture.querySelector('.picture-comments').textContent = data.comments;
  picture.querySelector('.picture-likes').textContent = data.likes;

  var img = picture.getElementsByTagName('IMG')[0];

  var picture_image = new Image();
  picture_image.onload = function(){
    clearTimeout(pictureLoadTimeout);
    img.src = picture_image.src;
    block_pictures.appendChild(picture);
  }
  picture_image.onerror = function(){
    picture.classList.add('picture-load-failure');
    block_pictures.appendChild(picture);
  }
  picture_image.src = data.url;

  pictureLoadTimeout = setTimeout(function() {
    picture_image.src = '';
    picture.classList.add('picture-load-failure');
  }, 10000);
}

window.pictures.forEach(function(picture){
  createPicture(picture);
});