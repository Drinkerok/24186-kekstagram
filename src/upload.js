/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
  var browserCookies = require('browser-cookies');

  /** @enum {string} */
  var FileType = {
    'GIF': '',
    'JPEG': '',
    'PNG': '',
    'SVG+XML': ''
  };

  /** @enum {number} */
  var Action = {
    ERROR: 0,
    UPLOADING: 1,
    CUSTOM: 2
  };

  /**
   * Регулярное выражение, проверяющее тип загружаемого файла. Составляется
   * из ключей FileType.
   * @type {RegExp}
   */
  var fileRegExp = new RegExp('^image/(' + Object.keys(FileType).join('|').replace('\+', '\\+') + ')$', 'i');

  /**
   * @type {Object.<string, string>}
   */
  var filterMap;

  /**
   * Объект, который занимается кадрированием изображения.
   * @type {Resizer}
   */
  var currentResizer;

  /**
   * Удаляет текущий объект {@link Resizer}, чтобы создать новый с другим
   * изображением.
   */
  function cleanupResizer() {
    if (currentResizer) {
      currentResizer.remove();
      currentResizer = null;
    }
  }

  /**
   * Ставит одну из трех случайных картинок на фон формы загрузки.
   */
  function updateBackground() {
    var images = [
      'img/logo-background-1.jpg',
      'img/logo-background-2.jpg',
      'img/logo-background-3.jpg'
    ];

    var backgroundElement = document.querySelector('.upload');
    var randomImageNumber = Math.round(Math.random() * (images.length - 1));
    backgroundElement.style.backgroundImage = 'url(' + images[randomImageNumber] + ')';
  }

  // Проверяем, что это число, входит в диапозон
  function validateInputError(input){
    var value = input.value;
    if ( !(!isNaN(parseFloat(value)) && isFinite(value)) ) return 'Тут не число!';
    if ( +value < +input.min ) return 'Меньше минимального допустимого значения';
    if ( +value > +input.max ) return 'Больше максимального допустимого значения';
    return false;
  }
  // создаем окошко для вывода ошибки
  function createErrorBlock(input, text, position){
    var div = document.createElement('DIV');
    div.classList.add('error_box');
    div.classList.add('error_box--' + input.id);
    div.style.width = input.offsetWidth + 'px';
    div.style.position = 'absolute';
    div.style.left = position.left + pageXOffset + 'px';
    div.innerHTML = text;
    document.body.appendChild(div);
    div.style.top = position.top + pageYOffset - div.offsetHeight + 'px';
  }
  // убрать все сообщения об ошибках
  function removeErrorBoxes(class_name){
    var error_div = document.querySelector('.' + class_name);
    if (error_div) error_div.parentNode.removeChild(error_div);
  }
  // Вывод ошибок
  function showValidateErrors(input, text){
    input.classList.add('error');
    var input_position = input.getBoundingClientRect();
    var error_box = {};
    error_box.top = input_position.top - input.offsetHeight;
    
    error_box.left = input_position.left;;

    createErrorBlock(input, text, error_box);
  }
  // Проверка координата + размер не превышают максимум
  function checkSumm(form){
    if ( (+form.resize_x.value + +form.resize_size.value > currentResizer._image.naturalWidth) ||
         (+form.resize_y.value + +form.resize_size.value > currentResizer._image.naturalHeight) )
    return false;

    return true;
  }
  /**
   * Проверяет, валидны ли данные, в форме кадрирования.
   * @return {boolean}
   */
  function resizeFormIsValid(form) {
    if (!checkSumm(form)) {
      showValidateErrors(form.resize_fwd.parentNode, 'Выбранная область выходит за картинку');
      return false;
    }
    return true;
  }

  /**
   * Форма загрузки изображения.
   * @type {HTMLFormElement}
   */
  var uploadForm = document.forms['upload-select-image'];

  /**
   * Форма кадрирования изображения.
   * @type {HTMLFormElement}
   */
  var resizeForm = document.forms['upload-resize'];

  /**
   * Форма добавления фильтра.
   * @type {HTMLFormElement}
   */
  var filterForm = document.forms['upload-filter'];

  /**
   * @type {HTMLImageElement}
   */
  var filterImage = filterForm.querySelector('.filter-image-preview');

  /**
   * @type {HTMLElement}
   */
  var uploadMessage = document.querySelector('.upload-message');

  /**
   * @param {Action} action
   * @param {string=} message
   * @return {Element}
   */
  function showMessage(action, message) {
    var isError = false;

    switch (action) {
      case Action.UPLOADING:
        message = message || 'Кексограмим&hellip;';
        break;

      case Action.ERROR:
        isError = true;
        message = message || 'Неподдерживаемый формат файла<br> <a href="' + document.location + '">Попробовать еще раз</a>.';
        break;

      case Action.FORM_ERROR:
        break
    }

    uploadMessage.querySelector('.upload-message-container').innerHTML = message;
    uploadMessage.classList.remove('invisible');
    uploadMessage.classList.toggle('upload-message-error', isError);
    return uploadMessage;
  }

  function hideMessage() {
    uploadMessage.classList.add('invisible');
  }

  /**
   * Обработчик изменения изображения в форме загрузки. Если загруженный
   * файл является изображением, считывается исходник картинки, создается
   * Resizer с загруженной картинкой, добавляется в форму кадрирования
   * и показывается форма кадрирования.
   * @param {Event} evt
   */
  uploadForm.onchange = function(evt) {
    var element = evt.target;
    if (element.id === 'upload-file') {
      // Проверка типа загружаемого файла, тип должен быть изображением
      // одного из форматов: JPEG, PNG, GIF или SVG.
      if (fileRegExp.test(element.files[0].type)) {
        var fileReader = new FileReader();

        showMessage(Action.UPLOADING);

        fileReader.onload = function() {
          cleanupResizer();

          currentResizer = new Resizer(fileReader.result);
          currentResizer.setElement(resizeForm);
          uploadMessage.classList.add('invisible');

          uploadForm.classList.add('invisible');
          
          setResizeDefault(currentResizer, resizeForm);
          setRequirements(currentResizer, resizeForm);
          resizeForm.classList.remove('invisible');

          hideMessage();

        };

        fileReader.readAsDataURL(element.files[0]);
      } else {
        // Показ сообщения об ошибке, если загружаемый файл, не является
        // поддерживаемым изображением.
        showMessage(Action.ERROR);
      }
    }
  };

  /**
   * Обработка сброса формы кадрирования. Возвращает в начальное состояние
   * и обновляет фон.
   * @param {Event} evt
   */
  resizeForm.onreset = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    resizeForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Установка ограничений и начальных значений для форма кадрирования
   */
  resizeForm.resize_x = document.getElementById('resize-x');
  resizeForm.resize_y = document.getElementById('resize-y');
  resizeForm.resize_size = document.getElementById('resize-size');
  resizeForm.resize_fwd = document.getElementById('resize-fwd');
  function setResizeDefault(resizer, form){
    form.resize_x.value = 0;
    form.resize_y.value = 0;
    form.resize_size.value = Math.min(resizer._image.naturalWidth, resizer._image.naturalHeight);
  }
  function setRequirements(resizer, form){
    form.resize_x.min = 0;
    form.resize_y.min = 0;
    form.resize_size.min = 1;

    form.resize_x.max = resizer._image.naturalWidth - 1;
    form.resize_y.max = resizer._image.naturalHeight - 1;
    form.resize_size.max = Math.min(resizer._image.naturalWidth, resizer._image.naturalHeight);

    // при изменении значений в инпутах, добавляем возможность отправки формы
    // и убираем класс ошибки
    // и убираем сообщение об ошибке
    form.resize_x.oninput = form.resize_y.oninput= form.resize_size.oninput = function(e){
      form.resize_fwd.disabled = '';
      this.classList.remove('error');
      removeErrorBoxes('error_box--' + this.id);
    }
    form.resize_x.oninvalid = form.resize_y.oninvalid = form.resize_size.oninvalid = function(e){
      e.preventDefault();
      var errors = validateInputError(this);
      if (errors != false) {
        showValidateErrors(this, errors);
      }
    }
  }

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();

    if (resizeFormIsValid(this)) {
      filterImage.src = currentResizer.exportImage().src;
      // сообщение об ошибке суммы без дополнительного класса :)
      removeErrorBoxes('error_box--');

      resizeForm.classList.add('invisible');
      // ставим фильтр
      setFilter();
      filterForm.classList.remove('invisible');
    } else {
      resizeForm.resize_fwd.disabled = 'disabled';
    }
  };

  function setFilter(){
    var filter = browserCookies.get('filter') || 'none';
    document.getElementById('upload-filter-' + filter).checked = 'checked';
  };

  /**
   * Сброс формы фильтра. Показывает форму кадрирования.
   * @param {Event} evt
   */
  filterForm.onreset = function(evt) {
    evt.preventDefault();

    filterForm.classList.add('invisible');
    resizeForm.classList.remove('invisible');
  };

  /**
   * Отправка формы фильтра. Возвращает в начальное состояние, предварительно
   * записав сохраненный фильтр в cookie.
   * @param {Event} evt
   */
  filterForm.onsubmit = function(evt) {
    evt.preventDefault();

    cleanupResizer();
    updateBackground();

    filterForm.classList.add('invisible');
    uploadForm.classList.remove('invisible');
  };

  /**
   * Обработчик изменения фильтра. Добавляет класс из filterMap соответствующий
   * выбранному значению в форме.
   */
  filterForm.onchange = function() {
    if (!filterMap) {
      // Ленивая инициализация. Объект не создается до тех пор, пока
      // не понадобится прочитать его в первый раз, а после этого запоминается
      // навсегда.
      filterMap = {
        'none': 'filter-none',
        'chrome': 'filter-chrome',
        'sepia': 'filter-sepia'
      };
    }

    var selectedFilter = [].filter.call(filterForm['upload-filter'], function(item) {
      return item.checked;
    })[0].value;

    // сохраняем в куки
    var now = new Date();
    var my_birthsday = new Date(0, 8, 6);
    if (now.getMonth() > my_birthsday.getMonth() && now.getDate() > my_birthsday.getDate()){
      my_birthsday.setFullYear(now.getFullYear());
    } else {
      my_birthsday.setFullYear(now.getFullYear() - 1);
    }
    var days_passed = Math.floor (Math.abs(now - my_birthsday) / 1000 / 60 / 60 / 24);
    browserCookies.set('filter', selectedFilter, {
      expires: Date.now() + days_passed
    });

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  };

  cleanupResizer();
  updateBackground();
})();
