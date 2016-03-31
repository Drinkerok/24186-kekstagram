/* global Resizer: true */

/**
 * @fileoverview
 * @author Igor Alexeenko (o0)
 */

'use strict';

(function() {
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
  function validateInputError(input, to_submit){
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
    div.style.top = position.top + pageYOffset + 'px';
    div.style.position = 'absolute';
    div.style.left = position.left + pageXOffset + 'px';
    div.innerHTML = text;
    document.body.appendChild(div);
  }
  // убрать все сообщения об ошибках
  function removeErrorBoxes(){
    var boxes = document.getElementsByClassName('error_box');
    while (boxes[0]){
      document.body.removeChild(boxes[0]);
    }
  }
  // Вывод ошибок
  function showValidateErrors(input, text, under_input){
    var under = under_input || true;
    var input_position = input.getBoundingClientRect();
    var error_box = {};
    if (under_input === true){
      error_box.top = input_position.top + input.offsetHeight;
    } else {
      error_box.top = input_position.top - input.offsetHeight;
    }
    
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
    var to_submit = true;
    var errors = validateInputError(form.resize_x, to_submit);
    if (errors != false) {
      showValidateErrors(form.resize_x, errors, false);
      to_submit = false;
    }
    var errors = validateInputError(form.resize_y, to_submit);
    if (errors != false) {
      showValidateErrors(form.resize_y, errors, true);
      to_submit = false;
    }
    var errors = validateInputError(form.resize_size, to_submit);
    if (errors != false) {
      showValidateErrors(form.resize_size, errors, false);
      to_submit = false;
    }

    if (!checkSumm(form)) {
      showValidateErrors(form.resize_fwd.parentNode, 'Выбранная область выходит за картинку', true);
      to_submit = false;
    }

    return to_submit;
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
    form.resize_x.oninput = form.resize_y.oninput= form.resize_size.oninput = function(e){
      form.resize_fwd.disabled = '';
    }
    form.resize_x.oninvalid = form.resize_y.oninvalid = form.resize_size.oninvalid = function(e){
      e.preventDefault();
    }
  }

  /**
   * Обработка отправки формы кадрирования. Если форма валидна, экспортирует
   * кропнутое изображение в форму добавления фильтра и показывает ее.
   * @param {Event} evt
   */
  resizeForm.onsubmit = function(evt) {
    evt.preventDefault();
    removeErrorBoxes();

    if (resizeFormIsValid(this)) {
      filterImage.src = currentResizer.exportImage().src;

      resizeForm.classList.add('invisible');
      filterForm.classList.remove('invisible');
    } else {
      resizeForm.resize_fwd.disabled = 'disabled';
    }
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

    // Класс перезаписывается, а не обновляется через classList потому что нужно
    // убрать предыдущий примененный класс. Для этого нужно или запоминать его
    // состояние или просто перезаписывать.
    filterImage.className = 'filter-image-preview ' + filterMap[selectedFilter];
  };

  cleanupResizer();
  updateBackground();
})();
