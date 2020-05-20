import API from "../api.js";
import FilmDetailsComponent from "../components/film-details.js";
import FilmCardComponent from "../components/film-card.js";
import CommentsModel from "../models/comments-model";
import FilmModel from "../models/film-model.js";
import {render, remove, replace} from "../utils/render.js";
import {Keycodes, PopupMode} from "../const.js";
import {AUTHORIZATION, END_POINT} from "../const.js";

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
      this._onDataChange(this, this._filmData, newFilm);
    });
    this._filmCardComponent.setWatchlistClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._filmData);
      newFilm.inWatchlist = !newFilm.inWatchlist;
      this._onDataChange(this, this._filmData, newFilm);
    });
    this._filmCardComponent.setWatchedClickHandler((evt) => {
      evt.preventDefault();
      const newFilm = FilmModel.clone(this._filmData);
      newFilm.inHistory = !newFilm.inHistory;
      this._onDataChange(this, this._filmData, newFilm);
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
          const newFilm = FilmModel.clone(this._filmData);
          newFilm.inFavorites = !newFilm.inFavorites;
          this._onDataChange(this, this._filmData, newFilm);
        });

        this._filmDetailsComponent.setWatchedClickHandler(() => {
          const newFilm = FilmModel.clone(this._filmData);
          newFilm.inHistory = !newFilm.inHistory;
          this._onDataChange(this, this._filmData, newFilm);
        });

        this._filmDetailsComponent.setWatchlistClickHandler(() => {
          const newFilm = FilmModel.clone(this._filmData);
          newFilm.inWatchlist = !newFilm.inWatchlist;
          this._onDataChange(this, this._filmData, newFilm);
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
    const api = new API(END_POINT, AUTHORIZATION);

    if (newData === null) {
      api.deleteComment(oldData.id)
      .then(() => {
        this._commentsModel.removeComment(oldData.id);
        this._commentsData = this._commentsModel.getComments();
        this._filmDetailsComponent.renderComments(this._commentsData);
      });
    } else {
      api.addComment(this._filmData, newData)
      .then((loadedData) => {
        this._commentsModel.setComments(loadedData.comments);
        this._commentsData = this._commentsModel.getComments();
        this._filmDetailsComponent.renderComments(this._commentsData);
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
}
