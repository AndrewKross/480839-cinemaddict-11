import FilmCardComponent from "../components/film-card.js";
import FilmsExtraComponent from "../components/films-extra.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import FilmDetailsComponent from "../components/film-details.js";
import CommentComponent from "../components/comment.js";
import NoFilmsComponent from "../components/no-films.js";
import {getFilmsDetailsData} from "../mock/film-details.js";
import {generateCommentsData} from "../mock/comments.js";
import {render, remove} from "../utils/render.js";


const EXTRA_FILMS_TITLES = [`Top rated`, `Most commented`];
const EXRTA_FILMS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const ESC_KEY = `Escape`;

const body = document.querySelector(`body`);

const renderPopup = () => {
  const filmDetailsComponent = new FilmDetailsComponent(getFilmsDetailsData(`Inception`));

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

export default class PageController {
  constructor(container) {
    this._container = container;
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(filmsData) {
    const container = this._container.getElement();
    const filmsContainer = container.querySelector(`.films-list__container`);
    const filmsList = container.querySelector(`.films-list`);

    let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    const renderFilms = (from, to) => {
      filmsData.slice(from, to).forEach((film) => {
        const filmCardComponent = new FilmCardComponent(film);
        render(filmsContainer, filmCardComponent);
        filmCardComponent.setPopupClickHandler(renderPopup);
      });
    };

    if (filmsData.length === 0) {
      render(filmsContainer, this._noFilmsComponent);
    } else {
      renderFilms(0, showingFilmsCount);
    }

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = showingFilmsCount;
      showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

      renderFilms(prevFilmsCount, showingFilmsCount);

      if (showingFilmsCount >= filmsData.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    render(filmsList, this._showMoreButtonComponent);

    EXTRA_FILMS_TITLES.forEach((it) => {
      const filmsListComponent = new FilmsExtraComponent(it);
      const extraContainer = filmsListComponent.getElement().querySelector(`.films-list__container`);
      for (let i = 0; i < EXRTA_FILMS_COUNT; i++) {
        const filmCardComponent = new FilmCardComponent(filmsData[i]); // временно рисуем первые 2 элемента
        render(extraContainer, filmCardComponent);
        filmCardComponent.setPopupClickHandler(renderPopup);
      }
      render(container, filmsListComponent);
    });
  }
}
