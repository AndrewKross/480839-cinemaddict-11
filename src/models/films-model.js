import {getFilmsByFilter} from "../utils/filter.js";
import {FilterType, StatsFilter} from "../const.js";
import {sortObject} from "../utils/common.js";

const MINUTES_PER_HOUR = 60;
const NEED_FILMS_FOR_RANK_FAN = 20;
const NEED_FILMS_FOR_RANK_NOVICE = 10;

export default class FilmsModel {
  constructor() {
    this._films = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilms() {
    this._films.sort((a, b) => a.id - b.id);
    return getFilmsByFilter(this._films, this._activeFilterType);
  }

  getAllFilms() {
    return this._films;
  }

  setFilms(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  updateFilm(id, film) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), film, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  getFilmsByWatched(periodName = StatsFilter.ALL_TIME) {
    const filmsInHistory = this._films.filter((film) => film.inHistory);

    if (periodName === StatsFilter.ALL_TIME) {
      return filmsInHistory;
    }

    const date = new Date();

    switch (periodName) {
      case StatsFilter.YEAR: {
        date.setFullYear(date.getFullYear() - 1);
        break;
      }
      case StatsFilter.MONTH: {
        date.setMonth(date.getMonth() - 1);
        break;
      }
      case StatsFilter.WEEK: {
        date.setDate(date.getDate() - 7);
        break;
      }
      case StatsFilter.TODAY: {
        date.setDate(date.getDate() - 1);
        break;
      }
      default: {
        return filmsInHistory;
      }
    }

    return filmsInHistory.filter((item) => {
      return item.watchingDate > date;
    });
  }

  getRank() {
    const watchedCount = this.getFilmsByWatched().length;

    if (watchedCount > NEED_FILMS_FOR_RANK_FAN) {
      return `movie buff`;
    } else if (watchedCount > NEED_FILMS_FOR_RANK_NOVICE) {
      return `fan`;
    } else if (watchedCount > 0) {
      return `novice`;
    }
    return ``;
  }

  getGenresStatistics(filter) {
    const genres = {};

    this.getFilmsByWatched(filter).forEach((film) => {
      film.genres.forEach((genre) => {
        genres[genre] = genres[genre] === undefined
          ? 1
          : genres[genre] + 1;
      });
    });

    return sortObject(genres);
  }

  getTopGenre(filter) {
    const genres = this.getGenresStatistics(filter);

    return Object
      .keys(genres)
      .reduce((topGenre, genre) => {
        if (topGenre === ``) {
          return genre;
        }

        return genres[genre] > genres[topGenre]
          ? genre
          : topGenre;
      }, ``);
  }

  getTopDuration(filter) {
    const topDuration = this.getFilmsByWatched(filter).reduce((total, film) => {
      return total + film.duration;
    }, 0);

    const hours = topDuration / MINUTES_PER_HOUR;
    const minutes = topDuration - hours * MINUTES_PER_HOUR;

    return {
      hours,
      minutes,
    };
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }
}
