import FilmDetailsComponent from "../components/film-details.js";
import FilmCardComponent from "../components/film-card.js";
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
    this._filmDetailsComponent = new FilmDetailsComponent(filmData);

    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      remove(this._filmDetailsComponent);
      this._mode = Mode.DEFAULT;
    });

    this._filmDetailsComponent.setEmojiChangeHandler();

    render(body, this._filmDetailsComponent);

    const commentsCounter = this._filmDetailsComponent.getElement().querySelector(`.film-details__comments-count`);

    commentsCounter.textContent = filmData.comments.length;

    this._filmDetailsComponent.renderComments();

    document.onkeydown = (evt) => {
      if (evt.key === ESC_KEY) {
        remove(this._filmDetailsComponent);
        this._mode = Mode.DEFAULT;
      }
    };
  }

  _onCommentChange(oldData, newData) {
    const isSuccess = this._commentModel.updateComment(oldData.id, newData);

    if (newData === null) {
      this._commentModel.removeComment(oldData.id);
      this._updateTasks(this._showingTasksCount);
    }

    if (isSuccess) {
      this._filmDetailsComponent.rerender();
    }
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      remove(this._filmDetailsComponent);
      this._mode = Mode.DEFAULT;
    }
  }
}
