import AbstractComponent from "./abstract-component.js";
import {formatCommentDate} from "../utils/common.js";

const createCommentTemplate = (comment) => {
  const {emoji, alt, text, author, time} = comment;

  return (
    `<li class="film-details__comment">
        <span class="film-details__comment-emoji">
          <img src="${emoji}" width="55" height="55" alt="${alt}" />
        </span>
        <div>
          <p class="film-details__comment-text">${text}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${author}</span>
            <span class="film-details__comment-day">${formatCommentDate(time)}</span>
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

  setDeleteCommentHandler(handler) {
    const deleteButton = this.getElement().querySelector(`.film-details__comment-delete`);
    deleteButton.addEventListener(`click`, handler);
  }
}
