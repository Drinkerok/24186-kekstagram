'use strict';

var DEFAULT_FILTER = 'filter-popular';
var activeFilter = localStorage.getItem('activeFilter') || DEFAULT_FILTER;
var settings = require('./parameters');
var createPicturesPage = require('./create_page');

// устанавливаем начальный активный фильтр
// если он отличается от стандартного
settings.blockFilters.querySelector('input[checked]').checked = '';
document.getElementById(activeFilter).checked = 'checked';
settings.filter = activeFilter;

// обработчик на клик по фильтру
settings.blockFilters.addEventListener('click', function(e) {
  if(!e.target.classList.contains('filters-item')) {
    return false;
  }

  var label = e.target;
  var filterName = label.getAttribute('for');
  // если выбран активный фильтр, то ничего не делать
  if (filterName === activeFilter) {
    return false;
  }

  localStorage.setItem('activeFilter', filterName);
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
  createPicturesPage(settings.sortedPictures);

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

module.exports = function() {
  settings.sortedPictures = sortPictures(settings.pictures, settings.filter);
};
