'use strict';

var pictures;
var settings = require('./parameters');
var createPicturesPage = require('./create_page');
var fillPicturesBlock = require('./fill_pictures_block');
var enable_scroll = require('./scroll');



// Получаем картинки
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://o0.github.io/assets/json/pictures.json');

// как получили, выводим их. И открываем фильтры
xhr.onload = function() {
  pictures = JSON.parse(this.response);
  settings.setParameters(pictures);
  createPicturesPage(pictures);
  // Если при загрузке первой партии картинок, конец блока виден,
  // подгружаем еще картинки
  fillPicturesBlock(pictures);
  settings.blockFilters.classList.remove('hidden');
  enable_scroll();
};

xhr.timeout = 10000;
xhr.onerror = xhr.ontimeout = function() {
  settings.blockPictures.classList.add('pictures-failure');
};

xhr.send();
