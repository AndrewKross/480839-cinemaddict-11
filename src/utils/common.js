import moment from "moment";
import momentDurationFormatSetup from 'moment-duration-format';
import {EXTRA_FILMS_COUNT} from "../const";
momentDurationFormatSetup(moment);

export const getRandomInt = (min, max) => {
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
  const sortable = [];
  for (let key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key)) {
      sortable.push([key, list[key]]);
    }
  }

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

  const orderedList = {};
  for (let idx in sortable) {
    if (Object.prototype.hasOwnProperty.call(sortable, idx)) {
      orderedList[sortable[idx][0]] = sortable[idx][1];
    }
  }

  return orderedList;
};

export const getTopRatedFilms = (filmsData) => {
  return filmsData.sort((a, b) => b.rating - a.rating).filter((it, i) => i < EXTRA_FILMS_COUNT);
};

export const getMostCommentedFilms = (filmsData) => {
  return filmsData.sort((a, b) => b.comments.length - a.comments.length).filter((it, i) => i < EXTRA_FILMS_COUNT);
};
