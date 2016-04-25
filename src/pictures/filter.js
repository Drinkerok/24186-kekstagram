'use strict';

var active_filter = 'filter-popular';
var settings = require('./parameters');
var createPage = require('./create_page');

// обработчик на клик по фильтру
settings.blockFilters.addEventListener('click', function(e) {
  if (!e.target.classList.contains('filters-item')) return false;

  var label = e.target;
  var filter_name = label.getAttribute('for');
  // если выбран активный фильтр, то ничего не делать
  if (filter_name !== active_filter) {
    active_filter = filter_name;
    // сортируем
    settings.sortedPictures = sortPictures(settings.pictures, filter_name);
    // удаляем старые картинки
    settings.renderedPictures.forEach(function(picture){
      picture.remove();
    });
    settings.renderedPictures = [];
    // начинаем с первой картинки
    settings.pictures_settings.page = 0;
    // выводим картинки
    createPage.createPicturesPage(settings.sortedPictures);
  }
});


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
