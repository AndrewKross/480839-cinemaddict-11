import {getRandomInt} from "../utils/common.js";
import AbstractComponent from "./abstract-component.js";


const createFilmCardTemplate = (filmData) => {
  const {title, rating, release, duration, genres, image, description, inWatchlist, inHistory, inFavorites} = filmData;
  const commentsCount = getRandomInt(0, 6);
  const year = release.slice(-4);
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
        <span class="film-card__genre">${genres[0]}</span>
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

export default class FilmCard extends AbstractComponent {
  constructor(filmData) {
    super();
    this._filmData = filmData;
  }

  getTemplate() {
    return createFilmCardTemplate(this._filmData);
  }

  setPopupClickHandler(cb) {
    const filmCardPoster = this.getElement().querySelector(`.film-card__poster`);
    const filmCardTitle = this.getElement().querySelector(`.film-card__title`);
    const filmCardComments = this.getElement().querySelector(`.film-card__comments`);

    [filmCardPoster, filmCardTitle, filmCardComments].forEach((it) => {
      it.addEventListener(`click`, cb);
    });
  }

  setWatchlistClickHandler(cb) {
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`)
    .addEventListener(`click`, cb);
  }

  setWatchedClickHandler(cb) {
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`)
    .addEventListener(`click`, cb);
  }

  setFavoriteClickHandler(cb) {
    this.getElement().querySelector(`.film-card__controls-item--favorite`)
    .addEventListener(`click`, cb);
  }
}
