import {getRandomInt, createElement} from "../utils.js";


const createFilmCardTemplate = (filmData) => {
  const {title, rating, year, duration, genre, image, description, inWatchlist, inHistory, inFavorites} = filmData;
  const commentsCount = getRandomInt(0, 6); // от 0 до 5
  const commentOrCommentsWord = commentsCount === 1 ? `comment` : `comments`;
  const inWatchlistActiveClass = inWatchlist ? `film-card__controls-item--active` : ``;
  const inHistoryActiveClass = inHistory ? `film-card__controls-item--active` : ``;
  const inFavoritesActiveClass = inFavorites ? `film-card__controls-item--active` : ``;
  return (
    `<article class="film-card">
      <h3 class="film-card__title">${title}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${image}" alt="" class="film-card__poster">
      <p class="film-card__description">${description}</p>
      <a class="film-card__comments">${commentsCount} ${commentOrCommentsWord}</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${inWatchlistActiveClass}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${inHistoryActiveClass}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${inFavoritesActiveClass}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard {
  constructor(filmData) {
    this._filmData = filmData;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmData);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
