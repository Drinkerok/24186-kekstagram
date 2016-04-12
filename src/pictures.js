'use strict';
var PICTURES_980_PER_PAGE = 10;
var PICTURES_980_FIRST_PAGE = 11;
var PICTURES_1380_PER_PAGE = 14;
var PICTURES_1380_FIRST_PAGE = 19;
var template = document.getElementById('picture-template');
var template_picture;
var block_pictures = document.querySelector('.pictures');
var block_filters = document.querySelector('.filters');
var pictures;
var pictures_settings = {
  'container_break_point': 1380, // контейнер 980px и 1380px
  'container': 0,                // фактическая ширина контейнера
  'page': 0,                     // номер страницы
  'page_max': 0,                 // максимальное кол-во страниц
  'per_page': 0,                 // кол-во фотографий странице
  'first_page': 0,               // кол-во фотографий на первой странице
  'offset': 0                    // разница между первой и последующими страницами
};
var sorted_pictures;
var active_filter = 'filter-popular';

block_filters.classList.add('hidden');

if ('content' in template) {
  template_picture = template.content.querySelector('.picture');
} else {
  template_picture = template.querySelector('.picture');
}

// параметры картинок
function setPicturesParameters() {
  pictures_settings.container = parseInt(getComputedStyle(block_pictures).width);
  if (pictures_settings.container < pictures_settings.container_break_point) {
    pictures_settings.per_page = PICTURES_980_PER_PAGE;
    pictures_settings.first_page = PICTURES_980_FIRST_PAGE;
  } else {
    pictures_settings.per_page = PICTURES_1380_PER_PAGE;
    pictures_settings.first_page = PICTURES_1380_FIRST_PAGE;
  }
  pictures_settings.page_max = (pictures.length <= pictures_settings.first_page) ? 0
                                : (Math.ceil(pictures.length / pictures_settings.per_page) - 1);
  pictures_settings.offset = pictures_settings.first_page - pictures_settings.per_page;
  pictures_settings.page = 0;
}
// создаем блок picture по шаблону
function createPicture(data) {
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

  block_pictures.appendChild(picture);
}
// отрисовка "страницы" картинок
function createPicturesPage(pictures) {
  var from = (pictures_settings.page === 0) ? 0 : pictures_settings.page * pictures_settings.per_page + pictures_settings.offset;
  var to = (pictures_settings.page === 0) ? from + pictures_settings.first_page : from + pictures_settings.per_page;
  pictures.slice(from, to).forEach(function(picture) {
    createPicture(picture);
  });
  pictures_settings.page++;
}
// заполнить блок картинками
function fillPicturesBlock(pictures){
  while (isBottomReached() && (pictures_settings.page <= pictures_settings.page_max)) {
    createPicturesPage(pictures);
  }
}
// сортировка картинок
function sortPictures(arr, sorting) {
  var sorted_pictures = arr.slice();
  switch (sorting) {
    case 'filter-popular':
      break;
    case 'filter-new':
      sorted_pictures.sort(function(a, b) {
        return (b.date > a.date) ? 1 : -1;
      });
      break;
    case 'filter-discussed':
      sorted_pictures.sort(function(a, b) {
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
xhr.onload = function() {
  pictures = JSON.parse(this.response);
  sorted_pictures = pictures;
  setPicturesParameters();
  createPicturesPage(sorted_pictures);
  // Если при загрузке первой партии картинок, конец блока виден,
  // подгружаем еще картинки
  fillPicturesBlock(sorted_pictures);
  block_filters.classList.remove('hidden');
  enable_scroll();
};

xhr.timeout = 10000;
xhr.onerror = xhr.ontimeout = function() {
  block_pictures.classList.add('pictures-failure');
};

xhr.send();

// обработчик на клик по фильтру
block_filters.addEventListener('click', function(e) {
  if (e.target.classList.contains('filters-item')) {
    var label = e.target;
    var filter_name = label.getAttribute('for');
    // если выбран активный фильтр, то ничего не делать
    if (filter_name !== active_filter) {
      active_filter = filter_name;
      // сортируем
      sorted_pictures = sortPictures(pictures, filter_name);
      // удаляем старые картинки
      block_pictures.innerHTML = '';
      // начинаем с первой картинки
      pictures_settings.page = 0;
      // выводим картинки
      createPicturesPage(sorted_pictures);
    }
  }
});



// Виден ли конец блока с картинками
function isBottomReached() {
  var block_coords = block_pictures.getBoundingClientRect();
  return (Math.floor(block_coords.bottom) <= window.innerHeight) ? true : false;
}

// добавление фотографий при скролле
var enable_scroll = function() {
  var scrollTimeout;
  window.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      if (isBottomReached() && (pictures_settings.page <= pictures_settings.page_max)) {
        createPicturesPage(sorted_pictures);
      }
    }, 100);
  });
};

window.addEventListener('resize', function() {
  if (getComputedStyle(block_pictures).width !== pictures_settings.container) {
    setPicturesParameters();
    block_pictures.innerHTML = '';
    createPicturesPage(sorted_pictures);
    fillPicturesBlock(sorted_pictures);
  }
});
