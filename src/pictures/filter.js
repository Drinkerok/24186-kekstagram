'use strict';

var activeFilter = 'filter-popular';
var settings = require('./parameters');
var createPage = require('./create_page');

// обработчик на клик по фильтру
settings.blockFilters.addEventListener('click', function(e) {
  if(!e.target.classList.contains('filters-item')) return false;

  var label = e.target;
  var filterName = label.getAttribute('for');
  // если выбран активный фильтр, то ничего не делать
  if (filterName !== activeFilter) {
    activeFilter = filterName;
    // сортируем
    settings.sortedPictures = sortPictures(settings.pictures, filterName);
    // удаляем старые картинки
    settings.renderedPictures.forEach(function(picture) {
      picture.remove();
    });
    settings.renderedPictures = [];
    // начинаем с первой картинки
    settings.pictures_settings.page = 0;
    // выводим картинки
    createPage.createPicturesPage(settings.sortedPictures);
  }

  return false;
});


// сортировка картинок
function sortPictures(arr, sorting) {
  var sortedPictures = arr.slice();
  switch (sorting) {
    case 'filter-popular':
      break;
    case 'filter-new':
      sortedPictures.sort(function(a, b) {
        return (b.date > a.date) ? 1 : -1;
      });
      break;
    case 'filter-discussed':
      sortedPictures.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }
  return sortedPictures;
}
