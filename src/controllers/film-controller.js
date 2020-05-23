import API from "../api/index.js";
import Provider from "../api/provider.js";
import Store from "../api/store.js";
import FilmDetailsComponent from "../components/film-details.js";
import FilmCardComponent from "../components/film-card.js";
import CommentsModel from "../models/comments-model";
import FilmModel from "../models/film-model.js";
import {render, remove, replace} from "../utils/render.js";
import {Keycodes, PopupMode, STORE_NAME} from "../const.js";
import {AUTHORIZATION, END_POINT} from "../const.js";

const SHAKE_ANIMATION_TIMEOUT = 600;
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
      const newFilm = FilmModel.clone(this._filmData);
      newFilm.inFavorites = !newFilm.inFavorites;
      this._onDataChange(this._filmData, newFilm);
    });
    this._filmCardComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._filmData);
      newFilm.inWatchlist = !newFilm.inWatchlist;
      this._onDataChange(this._filmData, newFilm);
    });
    this._filmCardComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._filmData);
      newFilm.inHistory = !newFilm.inHistory;
      this._onDataChange(this._filmData, newFilm);
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
    const api = new API(END_POINT, AUTHORIZATION);
    const store = new Store(STORE_NAME, window.localStorage);
    this._apiWithProvider = new Provider(api, store);
    this._commentsModel = new CommentsModel();
    this._filmDetailsComponent = new FilmDetailsComponent(this._filmData, this._onCommentChange);
    this._filmDetailsComponent.setCloseButtonClickHandler(() => this._closePopup());
    this._filmDetailsComponent.setNewCommentHandler();
    this._filmDetailsComponent.setEmojiChangeHandler();

    this._filmDetailsComponent.setFavoriteClickHandler(() => {
      const newFilm = FilmModel.clone(this._filmData);
      newFilm.inFavorites = !newFilm.inFavorites;
      this._onDataChange(this._filmData, newFilm);
    });

    this._filmDetailsComponent.setWatchedClickHandler(() => {
      const newFilm = FilmModel.clone(this._filmData);
      newFilm.inHistory = !newFilm.inHistory;
      this._onDataChange(this._filmData, newFilm);
    });

    this._filmDetailsComponent.setWatchlistClickHandler(() => {
      const newFilm = FilmModel.clone(this._filmData);
      newFilm.inWatchlist = !newFilm.inWatchlist;
      this._onDataChange(this._filmData, newFilm);
    });

    render(body, this._filmDetailsComponent);

    document.addEventListener(`keydown`, this._closePopupOnEscPress);

    this._apiWithProvider.getComments(this._filmData.id)
      .then((comments) => {
        this._commentsModel.setComments(comments);
        this._commentsData = this._commentsModel.getComments();
        this._filmDetailsComponent.renderComments(this._commentsData);
      })
      .catch(() => {
        this._filmDetailsComponent.onLoadCommentsError();
      });
  }

  getFilmData() {
    return this._filmData;
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

  _onCommentChange(oldData, newData, commentComponent) {
    if (newData === null) {
      // удаление комментария
      commentComponent.getDeleteButton().disabled = true;
      commentComponent.getDeleteButton().textContent = `Deleting...`;
      this._apiWithProvider.deleteComment(oldData.id)
      .then(() => {
        this._commentsModel.removeComment(oldData.id);
        this._commentsData = this._commentsModel.getComments();
        this._filmDetailsComponent.renderComments(this._commentsData);
        this._filmData.comments = this._filmData.comments.filter((comment) => comment !== oldData.id);
        this._onDataChange(this._filmData);
        this.render(this._filmData);
      })
      .catch(() => {
        this.shakeComment(commentComponent);
        commentComponent.getDeleteButton().disabled = false;
        commentComponent.getDeleteButton().textContent = `Delete`;
      });
    } else {
      // добавление комментария
      this._filmDetailsComponent.disableFormElements();
      this._filmDetailsComponent.getCommentInputElement().style.outline = `none`;
      this._apiWithProvider.addComment(this._filmData, newData)
      .then((loadedData) => {
        this._filmData = loadedData.movie;
        this._commentsModel.setComments(loadedData.comments);
        this._commentsData = this._commentsModel.getComments();
        this._filmDetailsComponent.renderComments(this._commentsData);
        this._onDataChange(this._filmData);
        this.render(this._filmData);
      })
      .catch(() => {
        this.shakeNewComment(commentComponent);
        this._filmDetailsComponent.getCommentInputElement().style.outline = `2px solid red`;
      })
      .then(() => {
        this._filmDetailsComponent.enableFormElements();
      });
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

  shakeNewComment() {
    this._filmDetailsComponent.getNewCommentElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      this._filmDetailsComponent.getNewCommentElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakeComment(commentComponent) {
    commentComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      commentComponent.getElement().style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
