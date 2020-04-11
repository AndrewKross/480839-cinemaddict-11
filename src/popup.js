import {render} from "./main.js";
import {createFilmDetailsTemplate, createCommentsTemplate} from "./components/film-details";
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
    render(body, createFilmDetailsTemplate(getFilmsDetailsData(`Inception`))); // временно передедим выбранный фильм

    const filmDetailsSection = document.querySelector(`.film-details`);
    const closeButton = filmDetailsSection.querySelector(`.film-details__close-btn`);
    const commentsCounter = filmDetailsSection.querySelector(`.film-details__comments-count`);
    const commentsList = filmDetailsSection.querySelector(`.film-details__comments-list`);
    const COMMENTS_COUNT = 4;
    const comments = generateCommentsData(COMMENTS_COUNT);
    commentsCounter.textContent = comments.length;

    comments.forEach((comment) => {
      render(commentsList, createCommentsTemplate(comment));
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
