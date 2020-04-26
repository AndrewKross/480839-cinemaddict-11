import FilmsExtraComponent from "../components/films-extra.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import NoFilmsComponent from "../components/no-films.js";
import MovieController from "../controllers/movie.js";
import {render, remove} from "../utils/render.js";


const EXTRA_FILMS_TITLES = [`Top rated`, `Most commented`];
const EXRTA_FILMS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

export default class PageController {
  constructor(container) {
    this._container = container;
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
  }

  render(filmsData) {
    const container = this._container.getElement();
    const filmsContainerElement = container.querySelector(`.films-list__container`);
    const filmsListElement = container.querySelector(`.films-list`);
    const movieController = new MovieController(filmsContainerElement);

    let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    const renderFilms = (from, to) => {
      filmsData.slice(from, to).forEach((film) => {
        movieController.render(film);
      });
    };

    if (filmsData.length === 0) {
      render(filmsContainerElement, this._noFilmsComponent);
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

    render(filmsListElement, this._showMoreButtonComponent);

    EXTRA_FILMS_TITLES.forEach((it) => {
      const filmsExtraComponent = new FilmsExtraComponent(it);
      const extraContainer = filmsExtraComponent.getElement().querySelector(`.films-list__container`);
      const movieControllerExtra = new MovieController(extraContainer);
      for (let i = 0; i < EXRTA_FILMS_COUNT; i++) {
        movieControllerExtra.render(filmsData[i]);
      }
      render(container, filmsExtraComponent);
    });
  }
}
