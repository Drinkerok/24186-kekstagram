function sumOfMultiplicationOfArrays(a,b){
  var sum = 0;
  for (var i=a.length;i--;){
    sum += a[i] * b[i];
  }
  return sum;
}
function sumOfArray(a){
  var sum = 0;
  for (var i=a.length;i--;){
    sum += a[i];
  }
  return sum;
}
function getMessage(a,b){
  switch (typeof(a)){
    case 'boolean':
      if (a){
        return 'Переданное GIF-изображение анимировано и содержит ' + b + ' кадров';
      } else {
        return 'Переданное GIF-изображение не анимировано';
      }
    case 'number':
      return 'Переданное SVG-изображение содержит ' + a + ' объектов и ' + (b * 4) + ' атрибутов';
    case 'object':
      if (typeof(b) == 'object'){
        return 'Общая площадь артефактов сжатия: ' + sumOfMultiplicationOfArrays(a,b) + ' пикселей';
      } else{
        return 'Количество красных точек во всех строчках изображения: ' + sumOfArray(a);
      }
    default:
      return 'Что-то пошло не так';
  }
}