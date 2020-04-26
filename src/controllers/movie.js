import FilmDetailsComponent from "../components/film-details.js";
import FilmCardComponent from "../components/film-card.js";
import CommentComponent from "../components/comment.js";
import {generateCommentsData} from "../mock/comments.js";
import {render, remove} from "../utils/render.js";


const ESC_KEY = `Escape`;
const body = document.querySelector(`body`);

export default class MovieController {
  constructor(container) {
    this._container = container;
  }

  render(filmData) {
    const setPopup = () => {
      const filmDetailsComponent = new FilmDetailsComponent(filmData);

      filmDetailsComponent.setCloseButtonClickHandler(() => {
        remove(filmDetailsComponent);
      });

      render(body, filmDetailsComponent);

      const commentsCounter = filmDetailsComponent.getElement().querySelector(`.film-details__comments-count`);
      const commentsList = filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
      const COMMENTS_COUNT = 4;
      const comments = generateCommentsData(COMMENTS_COUNT);

      commentsCounter.textContent = comments.length;

      comments.forEach((comment) => {
        render(commentsList, new CommentComponent(comment));
      });

      document.onkeydown = (evt) => {
        if (evt.key === ESC_KEY) {
          remove(filmDetailsComponent);
        }
      };
    };

    const filmCardComponent = new FilmCardComponent(filmData);
    filmCardComponent.setPopupClickHandler(setPopup);
    render(this._container, filmCardComponent);
  }
}
