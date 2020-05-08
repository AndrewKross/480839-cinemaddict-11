import moment from "moment";
import momentDurationFormatSetup from 'moment-duration-format';
momentDurationFormatSetup(moment);


export const getRandomInt = (min, max) => { // максимум не включается, минимум включается
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

export const getRandomArrayItems = (arr, count) => {
  return new Array(count).fill(``).map(() => arr[getRandomInt(0, arr.length)]);
};

export const getRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

export const formatDuration = (duration) => {
  return moment.duration(duration, `minutes`).format(`h[h] mm[m]`);
};

export const formatCommentDate = (date) => {
  return moment(date).fromNow();
};
