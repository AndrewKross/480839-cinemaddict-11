import AbstractComponent from "./abstract-component.js";
import {formatCommentDate} from "../utils/common.js";

const createCommentTemplate = (commentData) => {
  const {emotion, comment, author, date} = commentData;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}" />
      </span>
      <div>
        <p class="film-details__comment-text">${comment}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${formatCommentDate(date)}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

export default class Comment extends AbstractComponent {
  constructor(comment) {
    super();
    this._comment = comment;
  }

  getTemplate() {
    return createCommentTemplate(this._comment);
  }

  getDeleteButton() {
    return this.getElement().querySelector(`.film-details__comment-delete`);
  }

  setDeleteCommentHandler(handler) {
    this.getDeleteButton().addEventListener(`click`, handler);
  }
}
