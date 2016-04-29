'use strict';

var pictures;
var settings = require('./parameters');
var createPicturesPage = require('./create_page');
var fillPicturesBlock = require('./fill_pictures_block');
var enableScroll = require('./scroll');
var filter = require('./filter');
var gallery = require('./gallery');



// Получаем картинки
var xhr = new XMLHttpRequest();
xhr.open('GET', 'https://o0.github.io/assets/json/pictures.json');

// как получили, выводим их. И открываем фильтры
xhr.onload = function() {
  pictures = JSON.parse(this.response);
  settings.setParameters(pictures);
  filter(pictures);
  createPicturesPage(settings.sortedPictures);
  // Если при загрузке первой партии картинок, конец блока виден,
  // подгружаем еще картинки
  fillPicturesBlock(settings.sortedPictures);
  settings.blockFilters.classList.remove('hidden');
  enableScroll();

  // проверка url на открытие галереи
  gallery.checkUrl();
};

xhr.timeout = 10000;
xhr.onerror = xhr.ontimeout = function() {
  settings.blockPictures.classList.add('pictures-failure');
};

xhr.send();
