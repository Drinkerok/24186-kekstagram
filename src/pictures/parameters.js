'use strict';
var LoadedPicture = require('./loadedPicture');

var PICTURES_980_PER_PAGE = 10;
var PICTURES_980_FIRST_PAGE = 11;
var PICTURES_1380_PER_PAGE = 14;
var PICTURES_1380_FIRST_PAGE = 19;

var picturesBlock = document.querySelector('.pictures');
var filtersBlock = document.querySelector('.filters');

module.exports = {
  pictures_settings: {
    'container_break_point': 1380, // контейнер 980px и 1380px
    'container': 0,                // фактическая ширина контейнера
    'page': 0,                     // номер страницы
    'page_max': 0,                 // максимальное кол-во страниц
    'per_page': 0,                 // кол-во фотографий странице
    'first_page': 0,               // кол-во фотографий на первой странице
    'offset': 0                    // разница между первой и последующими страницами
  },
  blockPictures: picturesBlock,
  blockFilters: filtersBlock,

  setParameters: function(pictures) {
    var loadedArray = [];
    // храним картинки
    this.pictures = pictures;
    this.sortedPictures = [];
    this.renderedPictures = [];
    

    this.pictures.forEach(function(picture) {
      loadedArray.push(new LoadedPicture(picture));
    });
    this.loadedPictures = loadedArray.slice();

    this.pictures_settings.container = parseInt(getComputedStyle(this.blockPictures).width, 10);
    if (this.pictures_settings.container < this.pictures_settings.container_break_point) {
      this.pictures_settings.per_page = PICTURES_980_PER_PAGE;
      this.pictures_settings.first_page = PICTURES_980_FIRST_PAGE;
    } else {
      this.pictures_settings.per_page = PICTURES_1380_PER_PAGE;
      this.pictures_settings.first_page = PICTURES_1380_FIRST_PAGE;
    }
    this.pictures_settings.page_max = (pictures.length <= this.pictures_settings.first_page) ? 0
                                  : (Math.ceil(pictures.length / this.pictures_settings.per_page) - 1);
    this.pictures_settings.offset = this.pictures_settings.first_page - this.pictures_settings.per_page;
    this.pictures_settings.page = 0;
  }
};
