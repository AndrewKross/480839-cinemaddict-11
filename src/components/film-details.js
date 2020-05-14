import AbstractSmartComponent from "./abstract-smart-component.js";
import {render, remove} from "../utils/render.js";
import CommentComponent from "../components/comment.js";
import {Keycodes} from "../const.js";

const createFilmDetailsTemplate = (filmData, emoji) => {
  const {image, age, title, originalTitle, rating, director, writers,
    actors, release, duration, country, genres, description,
    inWatchlist, inFavorites, inHistory} = filmData;
  const emojiMarkup = emoji ? `<img src="images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}"></img>` : ``;
  const genresMarkup = genres.map((genre) => {
    return `<span class="film-details__genre">${genre}</span>`;
  }).join(`\n`);
  const isChecked = (prop) => prop ? `checked` : ``;

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${image}" alt="">
    
              <p class="film-details__age">${age}+</p>
            </div>
    
            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: ${originalTitle}</p>
                </div>
    
                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>
    
              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${release}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genres</td>
                  <td class="film-details__cell">
                  ${genresMarkup}</td>
                </tr>
              </table>
    
              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>
    
          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isChecked(inWatchlist)}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>
    
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isChecked(inHistory)}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>
    
            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isChecked(inFavorites)}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>
    
        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${filmData.comments.length}</span></h3>
    
            <ul class="film-details__comments-list">
              
            </ul>
    
            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label">${emojiMarkup}</div>
    
              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>
    
              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>
    
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetails extends AbstractSmartComponent {
  constructor(filmData, commentsData, onCommentChange) {
    super();
    this._filmData = filmData;
    this._commentsData = commentsData;
    this._onCommentChange = onCommentChange;
    this._showedCommentsComponents = [];
    this._emoji = null;
    this._closeButtonHandler = null;
    this._favoriteClickHandler = null;
    this._watchlistClickHandler = null;
    this._watchedClickHandler = null;
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._filmData, this._emoji);
  }

  renderComments(newCommentsData) {
    this._commentsData = newCommentsData;
    this._removeAllComments();
    this._setCommentsCount(this._commentsData);
    this._commentsData.forEach((comment) => {
      const commentComponent = new CommentComponent(comment);
      this._showedCommentsComponents.push(commentComponent);
      commentComponent.setDeleteCommentHandler((evt) => {
        evt.preventDefault();
        this._onCommentChange(comment, null);
      });
      render(this._getCommentsListElement(), commentComponent);
    });
  }

  _setCommentsCount(value) {
    this.getElement().querySelector(`.film-details__comments-count`).textContent = value.length;
  }

  getComments() {
    return this._commentsData;
  }

  _removeAllComments() {
    this._showedCommentsComponents.forEach((component) => remove(component));
    this._showedCommentsComponents = [];
  }

  _getCommentsListElement() {
    return this.getElement().querySelector(`.film-details__comments-list`);
  }

  _getCommentInputElement() {
    return this.getElement().querySelector(`.film-details__comment-input`);
  }

  setNewFilmData(newFilmData) {
    this._filmData = newFilmData;
  }

  setNewCommentHandler() {
    const commentInput = this._getCommentInputElement();
    commentInput.addEventListener(`input`, () => {
      this._newCommentTextValue = commentInput.value;
    });
    commentInput.addEventListener(`keydown`, (evt) => {
      if (evt.ctrlKey && evt.key === Keycodes.ENTER_KEY) {
        this._onCommentChange(null, {
          comment: commentInput.value,
          date: new Date(),
          emotion: this._emoji,
          author: `Неавторизованный киноман`,
        });
        commentInput.value = ``;
        this._newCommentTextValue = ``;
      }
    });
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeButtonHandler);
    this.setEmojiChangeHandler();
    this.setWatchlistClickHandler(this._watchlistClickHandler);
    this.setWatchedClickHandler(this._watchedClickHandler);
    this.setFavoriteClickHandler(this._favoriteClickHandler);
    this.setNewCommentHandler();
  }

  rerender() {
    super.rerender();
    this.renderComments(this._commentsData);
    this._getCommentInputElement().value = this._newCommentTextValue;
  }

  setEmoji(emoji) {
    this._emoji = emoji;
  }

  setEmojiChangeHandler() {
    this.getElement().querySelectorAll(`.film-details__emoji-item`).forEach((it) => {
      it.addEventListener(`change`, (evt) => {
        this.setEmoji(evt.target.value);
        this.rerender();
      });
    });
  }

  setCloseButtonClickHandler(cb) {
    this.getElement().querySelector(`.film-details__close-btn`)
    .addEventListener(`click`, cb);
    this._closeButtonHandler = cb;
  }

  setWatchlistClickHandler(cb) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`)
    .addEventListener(`click`, cb);
    this._watchlistClickHandler = cb;
  }

  setWatchedClickHandler(cb) {
    this.getElement().querySelector(`.film-details__control-label--watched`)
    .addEventListener(`click`, cb);
    this._watchedClickHandler = cb;
  }

  setFavoriteClickHandler(cb) {
    this.getElement().querySelector(`.film-details__control-label--favorite`)
    .addEventListener(`click`, cb);
    this._favoriteClickHandler = cb;
  }
}
