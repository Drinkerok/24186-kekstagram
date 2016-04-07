var template = document.getElementById('picture-template');
var template_picture;
var block_pictures = document.querySelector('.pictures');
var block_filters = document.querySelector('.filters');
var filters = document.querySelectorAll('.filters-item');
var pictures;
var active_filter = 'filter-popular';

block_filters.classList.add('hidden');

if ('content' in template){
  template_picture = template.content.querySelector('.picture');
} else{
  template_picture = template.querySelector('.picture');
}

// создаем блок picture по шаблону
function createPicture(data){
  var picture = template_picture.cloneNode(true);
  picture.querySelector('.picture-comments').textContent = data.comments;
  picture.querySelector('.picture-likes').textContent = data.likes;

  var img = picture.getElementsByTagName('IMG')[0];

  var picture_image = new Image();
  picture_image.onload = function(){
    clearTimeout(pictureLoadTimeout);
    img.src = picture_image.src;
  }
  picture_image.onerror = function(){
    picture.classList.add('picture-load-failure');
  }
  picture_image.src = data.url;

  var pictureLoadTimeout = setTimeout(function() {
    picture.classList.add('picture-load-failure');
  }, 10000);

  block_pictures.appendChild(picture);
}

// сортировка картинок
function sortPictures(arr, sorting){
  var sorted_pictures = arr.slice();
  switch (sorting){
    case 'filter-popular':
      break;
    case 'filter-new':
      sorted_pictures.sort(function(a,b){
        return (b.date > a.date) ? 1 : -1;
      });
      break;
    case 'filter-discussed':
      sorted_pictures.sort(function(a,b){
        return b.comments - a.comments;
      });
      break;
  }
  return sorted_pictures;
}

// Получаем картинки
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://o0.github.io/assets/json/pictures.json');

// как получили, выводим их. И открываем фильтры
xhr.onload = function(){
  pictures = JSON.parse(this.response);
  pictures.forEach(function(picture){
    createPicture(picture);
  });
  block_filters.classList.remove('hidden');
}

xhr.timeout = 10000;
xhr.onerror = xhr.ontimeout = function(){
  block_pictures.classList.add('pictures-failure');
}

xhr.send();

// обработчик на клик по фильтру
for (var i=0; i<filters.length; i++){
  filters[i].onclick = function(){
    var filter_name = this.getAttribute('for');
    // если выбран активный фильтр, то ничего не делать
    if (filter_name !== active_filter){
      active_filter = filter_name;
      // сортируем
      var sorted_pictures = sortPictures(pictures, filter_name);
      // удаляем старые картинки
      block_pictures.innerHTML = '';
      // выводим картинки
      sorted_pictures.forEach(function(picture){
        createPicture(picture);
      });
    }
  }
}