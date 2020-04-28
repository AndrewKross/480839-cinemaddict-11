import FilmDetailsComponent from "../components/film-details.js";
import FilmCardComponent from "../components/film-card.js";
import CommentComponent from "../components/comment.js";
import {generateCommentsData} from "../mock/comments.js";
import {render, remove, replace} from "../utils/render.js";


const ESC_KEY = `Escape`;
const body = document.querySelector(`body`);

const setPopup = (filmData) => {
  const filmDetailsComponent = new FilmDetailsComponent(filmData);

  filmDetailsComponent.setCloseButtonClickHandler(() => {
    remove(filmDetailsComponent);
  });

  render(body, filmDetailsComponent);

  const commentsCounter = filmDetailsComponent.getElement().querySelector(`.film-details__comments-count`);
  const commentsList = filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
  const COMMENTS_COUNT = 4;
  const comments = generateCommentsData(COMMENTS_COUNT);

  commentsCounter.textContent = comments.length;

  comments.forEach((comment) => {
    render(commentsList, new CommentComponent(comment));
  });

  document.onkeydown = (evt) => {
    if (evt.key === ESC_KEY) {
      remove(filmDetailsComponent);
    }
  };
};

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;
    this._onDataChange = onDataChange;
  }

  render(filmData) {
    const oldComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardComponent(filmData);
    this._filmCardComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(filmData, Object.assign({}, filmData, {
        inFavorites: !filmData.inFavorites
      }));
    });
    this._filmCardComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(filmData, Object.assign({}, filmData, {
        inWatchlist: !filmData.inWatchlist
      }));
    });
    this._filmCardComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(filmData, Object.assign({}, filmData, {
        inHistory: !filmData.inHistory
      }));
    });
    this._filmCardComponent.setPopupClickHandler(() => setPopup(filmData));

    if (oldComponent) {
      replace(this._filmCardComponent, oldComponent);
      return;
    }

    render(this._container, this._filmCardComponent);
  }
}
