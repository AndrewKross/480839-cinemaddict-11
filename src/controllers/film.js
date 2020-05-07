import FilmDetailsComponent from "../components/film-details.js";
import FilmCardComponent from "../components/film-card.js";
import CommentComponent from "../components/comment.js";
import {generateCommentsData} from "../mock/comments.js";
import {render, remove, replace} from "../utils/render.js";


const ESC_KEY = `Escape`;
const body = document.querySelector(`body`);

const Mode = {
  DEFAULT: `default`,
  OPENED: `opened`,
};

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
  }

  render(filmData) {
    const oldComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCardComponent(filmData);
    this._filmCardComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, filmData, Object.assign({}, filmData, {
        inFavorites: !filmData.inFavorites
      }));
    });
    this._filmCardComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, filmData, Object.assign({}, filmData, {
        inWatchlist: !filmData.inWatchlist
      }));
    });
    this._filmCardComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, filmData, Object.assign({}, filmData, {
        inHistory: !filmData.inHistory
      }));
    });

    this._filmCardComponent.setPopupClickHandler(() => {
      this._onViewChange();
      this.setPopup(filmData);
      this._mode = Mode.OPENED;
    });

    if (oldComponent) {
      replace(this._filmCardComponent, oldComponent);
      return;
    }

    render(this._container, this._filmCardComponent);
  }

  setPopup(filmData) {
    const COMMENTS_COUNT = 4;
    const comments = generateCommentsData(COMMENTS_COUNT);
    this._filmDetailsComponent = new FilmDetailsComponent(filmData, comments);

    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      remove(this._filmDetailsComponent);
      this._mode = Mode.DEFAULT;
    });

    this._filmDetailsComponent.setEmojiChangeHandler();

    render(body, this._filmDetailsComponent);

    const commentsCounter = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-count`);
    const commentsList = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);

    commentsCounter.textContent = comments.length;

    comments.forEach((comment) => {
      render(commentsList, new CommentComponent(comment));
    });

    document.onkeydown = (evt) => {
      if (evt.key === ESC_KEY) {
        remove(this._filmDetailsComponent);
        this._mode = Mode.DEFAULT;
      }
    };
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._filmDetailsComponent);
      this._mode = Mode.DEFAULT;
    }
  }
}
