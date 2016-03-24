function sumOfMultiplicationOfArrays(a,b){
  return a.reduce(function(sum, current, index){
    return sum + current * b[index];
  }, 0);
}
function sumOfArray(a){
  return a.reduce(function(sum, current) {
    return sum + current;
  }, 0);
}
function getMessage(a,b){
  switch (typeof a){
    case 'boolean':
      if (a){
        return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
      } else {
        return 'Переданное GIF-изображение не анимировано';
      }
    case 'number':
      return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов';
    case 'object':
      if (typeof b === 'object'){
        return 'Общая площадь артефактов сжатия: ' + sumOfMultiplicationOfArrays(a,b) + ' пикселей';
      } else{
        return 'Количество красных точек во всех строчках изображения: ' + sumOfArray(a);
      }
    default:
      return 'Что-то пошло не так';
  }
}