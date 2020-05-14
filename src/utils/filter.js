import {FilterType} from "../const.js";

export const getFilmsInWatchlist = (films) => {
  return films.filter((film) => film.inWatchlist);
};

export const getFilmsInHistory = (films) => {
  return films.filter((film) => film.inHistory);
};

export const getFilmsInFavorites = (films) => {
  return films.filter((film) => film.inFavorites);
};

export const getFilmsByFilter = (films, filterType) => {

  switch (filterType) {
    case FilterType.ALL:
      return films;
    case FilterType.WATCHLIST:
      return getFilmsInWatchlist(films);
    case FilterType.HISTORY:
      return getFilmsInHistory(films);
    case FilterType.FAVORITES:
      return getFilmsInFavorites(films);
  }

  return films;
};
