import FilmDetailsComponent from "../components/film-details.js";
import FilmCardComponent from "../components/film-card.js";
import {render, remove, replace} from "../utils/render.js";
import {ESC_KEY, PopupMode} from "../const.js";

const body = document.querySelector(`body`);

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._filmData = {};
    this._popupMode = PopupMode.DEFAULT;
  }

  render(filmData) {
    this._filmData = filmData;
    const oldComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(this._filmData);

    if (this._filmDetailsComponent) {
      this._filmDetailsComponent.setNewFilmData(this._filmData);
      this._filmDetailsComponent.rerender();
    }

    this._filmCardComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._filmData, Object.assign({}, this._filmData, {
        inFavorites: !this._filmData.inFavorites
      }));
    });
    this._filmCardComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._filmData, Object.assign({}, this._filmData, {
        inWatchlist: !this._filmData.inWatchlist
      }));
    });
    this._filmCardComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, this._filmData, Object.assign({}, this._filmData, {
        inHistory: !this._filmData.inHistory
      }));
    });

    this._filmCardComponent.setPopupClickHandler(() => {
      this._onViewChange();
      this.setPopup();
      this._popupMode = PopupMode.OPENED;
    });

    if (oldComponent) {
      replace(this._filmCardComponent, oldComponent);
      return;
    }

    render(this._container, this._filmCardComponent);
  }

  setPopup() {
    this._filmDetailsComponent = new FilmDetailsComponent(this._filmData);

    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      remove(this._filmDetailsComponent);
      this._popupMode = PopupMode.DEFAULT;
    });

    this._filmDetailsComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this, this._filmData, Object.assign({}, this._filmData, {
        inFavorites: !this._filmData.inFavorites
      }));
    });

    this._filmDetailsComponent.setWatchedClickHandler(() => {
      this._onDataChange(this, this._filmData, Object.assign({}, this._filmData, {
        inHistory: !this._filmData.inHistory
      }));
    });

    this._filmDetailsComponent.setWatchlistClickHandler(() => {
      this._onDataChange(this, this._filmData, Object.assign({}, this._filmData, {
        inWatchlist: !this._filmData.inWatchlist
      }));
    });

    this._filmDetailsComponent.setEmojiChangeHandler();

    render(body, this._filmDetailsComponent);

    this._filmDetailsComponent.renderComments();

    document.onkeydown = (evt) => {
      if (evt.key === ESC_KEY) {
        remove(this._filmDetailsComponent);
        this._popupMode = PopupMode.DEFAULT;
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
    if (this._popupMode !== PopupMode.DEFAULT) {
      remove(this._filmDetailsComponent);
      this._popupMode = PopupMode.DEFAULT;
    }
  }
}
