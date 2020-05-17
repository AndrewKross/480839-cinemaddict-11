import API from "../api.js";
import FilmDetailsComponent from "../components/film-details.js";
import FilmCardComponent from "../components/film-card.js";
import CommentsModel from "../models/comments-model";
import {render, remove, replace} from "../utils/render.js";
import {Keycodes, PopupMode} from "../const.js";
import {AUTHORIZATION} from "../const.js";

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
    this._closePopupOnEscPress = this._closePopupOnEscPress.bind(this);
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
    const api = new API(AUTHORIZATION);
    this._commentsModel = new CommentsModel();

    api.getComments(this._filmData.id)
      .then((comments) => {
        const parsedComments = this._commentsModel.parseComments(comments);
        this._commentsModel.setComments(parsedComments);
        this._commentsData = this._commentsModel.getComments();

        this._filmDetailsComponent = new FilmDetailsComponent(this._filmData, this._commentsData, this._onCommentChange);

        this._filmDetailsComponent.setCloseButtonClickHandler(() => this._closePopup());
        this._filmDetailsComponent.setNewCommentHandler();

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

        document.addEventListener(`keydown`, this._closePopupOnEscPress);
      });
  }

  _closePopupOnEscPress(evt) {
    if (evt.key === Keycodes.ESC_KEY) {
      this._closePopup();
    }
  }

  _closePopup() {
    remove(this._filmDetailsComponent);
    this._popupMode = PopupMode.DEFAULT;
    this._commentsModel.setComments(this._filmData.comments);
    this._commentsData = this._commentsModel.getComments();
    document.removeEventListener(`keydown`, this._closePopupOnEscPress);
  }

  _onCommentChange(oldData, newData) {
    let isSuccess = false;
    if (newData === null) {
      isSuccess = this._commentsModel.removeComment(oldData.id);
    } else {
      isSuccess = this._commentsModel.addComment(newData);
    }

    if (isSuccess) {
      this._commentsData = this._commentsModel.getComments();
      this._filmDetailsComponent.renderComments(this._commentsData);
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
