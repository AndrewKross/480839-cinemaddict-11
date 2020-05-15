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

export const sortObject = (list) => {
  let sortable = [];
  for (let key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key)) {
      sortable.push([key, list[key]]);
    }
  }
  // [["you",100],["me",75],["foo",116],["bar",15]]

  sortable.sort(function (a, b) {
    if (a[1] > b[1]) {
      return -1;
    } else {
      if (a[1] > b[1]) {
        return 1;
      } else {
        return 0;
      }
    }
  });
  // [["bar",15],["me",75],["you",100],["foo",116]]

  let orderedList = {};
  for (let idx in sortable) {
    if (Object.prototype.hasOwnProperty.call(sortable, idx)) {
      orderedList[sortable[idx][0]] = sortable[idx][1];
    }
  }

  return orderedList;
};
