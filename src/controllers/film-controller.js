import FilmDetailsComponent from "../components/film-details.js";
import FilmCardComponent from "../components/film-card.js";
import CommentsModel from "../models/comments-model";
import {render, remove, replace} from "../utils/render.js";
import {ESC_KEY, PopupMode} from "../const.js";

const body = document.querySelector(`body`);

export default class FilmController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._filmData = {};
    this._commentsData = [];
    this._popupMode = PopupMode.DEFAULT;

    this._onCommentChange = this._onCommentChange.bind(this);
  }

  render(filmData) {
    this._filmData = filmData;
    this._commentsModel = new CommentsModel();
    this._commentsModel.setComments(this._filmData.comments);
    this._commentsData = this._commentsModel.getComments();
    const oldComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCardComponent(this._filmData, this._commentsData);

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
    this._filmDetailsComponent = new FilmDetailsComponent(this._filmData, this._commentsData, this._onCommentChange);

    this._filmDetailsComponent.setCloseButtonClickHandler(() => {
      remove(this._filmDetailsComponent);
      this._popupMode = PopupMode.DEFAULT;
      this._commentsModel.setComments(this._filmData.comments);
      this._commentsData = this._commentsModel.getComments();
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

    this._filmDetailsComponent.renderComments(this._commentsData);

    document.onkeydown = (evt) => {
      if (evt.key === ESC_KEY) {
        remove(this._filmDetailsComponent);
        this._popupMode = PopupMode.DEFAULT;
      }
    };
  }

  _onCommentChange(oldData, newData) {
    if (newData === null) {
      this._commentsModel.removeComment(oldData.id);
    } else {
      this._commentsModel.updateComments(oldData.id, newData);
    }
    this._commentsData = this._commentsModel.getComments();
    this._filmDetailsComponent.renderComments(this._commentsData);
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
