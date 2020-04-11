function getRandomInt(min, max) { // максимум не включается, минимум включается
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

export {getRandomInt};

