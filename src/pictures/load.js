'use strict';

var pictures;
var settings = require('./parameters');
var createPage = require('./create_page');
var fillBlock = require('./fill_pictures_block');
var scroll = require('./scroll');



// Получаем картинки
var xhr = new XMLHttpRequest();
xhr.open('GET', 'http://o0.github.io/assets/json/pictures.json');

// как получили, выводим их. И открываем фильтры
xhr.onload = function() {
  pictures = JSON.parse(this.response);
  settings.setParameters(pictures);
  createPage.createPicturesPage(pictures);
  // Если при загрузке первой партии картинок, конец блока виден,
  // подгружаем еще картинки
  fillBlock.fillPicturesBlock(pictures);
  settings.blockFilters.classList.remove('hidden');
  scroll.enable_scroll();
};

xhr.timeout = 10000;
xhr.onerror = xhr.ontimeout = function() {
  block_pictures.classList.add('pictures-failure');
};

xhr.send();
