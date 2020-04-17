import {render} from "./utils.js";
import FilmDetailsComponent from "./components/film-details.js";
import CommentComponent from "./components/comment.js";
import {getFilmsDetailsData} from "./mock/film-details.js";
import {generateCommentsData} from "./mock/comments.js";

export const activatePopup = () => {
  const body = document.querySelector(`body`);
  const films = document.querySelector(`.films`);
  const filmCardPoster = films.querySelectorAll(`.film-card__poster`);
  const filmCardTitle = films.querySelectorAll(`.film-card__title`);
  const filmCardComments = films.querySelectorAll(`.film-card__comments`);
  const ESC_KEY = `Escape`;

  const renderPopup = () => {
    const filmDetailsComponent = new FilmDetailsComponent(getFilmsDetailsData(`Inception`)).getElement();
    render(body, filmDetailsComponent);

    const filmDetailsSection = document.querySelector(`.film-details`);
    const closeButton = filmDetailsSection.querySelector(`.film-details__close-btn`);
    const commentsCounter = filmDetailsSection.querySelector(`.film-details__comments-count`);
    const commentsList = filmDetailsSection.querySelector(`.film-details__comments-list`);
    const COMMENTS_COUNT = 4;
    const comments = generateCommentsData(COMMENTS_COUNT);
    commentsCounter.textContent = comments.length;

    comments.forEach((comment) => {
      render(commentsList, new CommentComponent(comment).getElement());
    });

    closeButton.onclick = () => {
      filmDetailsSection.remove();
    };

    document.onkeydown = (evt) => {
      if (evt.key === ESC_KEY) {
        filmDetailsSection.remove();
      }
    };
  };

  [filmCardPoster, filmCardTitle, filmCardComments].forEach((items) => {
    items.forEach((it) => {
      it.removeEventListener(`click`, renderPopup);
      it.addEventListener(`click`, renderPopup);
    });
  });
};
