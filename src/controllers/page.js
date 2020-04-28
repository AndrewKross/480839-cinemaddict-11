import FilmsExtraComponent from "../components/films-extra.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import NoFilmsComponent from "../components/no-films.js";
import MovieController from "../controllers/movie.js";
import {render, remove} from "../utils/render.js";


const EXRTA_FILMS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;


const renderFilms = (container, filmsData, onDataChange) => {
  return filmsData.map((film) => {
    const movieController = new MovieController(container, onDataChange);
    movieController.render(film);
    return movieController;
  });
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._filmsData = [];
    this._showedFilmsCards = [];
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    this._onDataChange = this._onDataChange.bind(this);
  }

  render(filmsData) {
    this._filmsData = filmsData;

    const container = this._container.getElement();
    const filmsContainerElement = container.querySelector(`.films-list__container`);

    if (filmsData.length === 0) {
      render(filmsContainerElement, this._noFilmsComponent);
      return;
    }

    const newFilms = renderFilms(filmsContainerElement, filmsData.slice(0, this._showingFilmsCount), this._onDataChange);
    this._showedFilmsCards = this._showedFilmsCards.concat(newFilms);

    this._renderShowMoreButton(filmsData);

    this._renderExtraFilms(filmsData);
  }

  _onDataChange(oldData, newData) {
    const index = this._filmsData.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._filmsData = [].concat(this._filmsData.slice(0, index), newData, this._filmsData.slice(index + 1));

    this._showedFilmsCards[index].render(this._filmsData[index]);
  }

  _renderShowMoreButton(filmsData) {
    const container = this._container.getElement();
    const filmsListElement = container.querySelector(`.films-list`);
    const filmsContainerElement = container.querySelector(`.films-list__container`);
    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;

      const newFilms = renderFilms(filmsContainerElement, filmsData.slice(prevFilmsCount, this._showingFilmsCount), this._onDataChange);
      this._showedFilmsCards = this._showedFilmsCards.concat(newFilms);

      if (this._showingFilmsCount >= filmsData.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    render(filmsListElement, this._showMoreButtonComponent);
  }

  _renderExtraFilms(filmsData) {
    const EXTRA_FILMS_TITLES = [`Top rated`, `Most commented`];
    const container = this._container.getElement();

    EXTRA_FILMS_TITLES.forEach((it) => {
      const filmsExtraComponent = new FilmsExtraComponent(it);
      const extraContainer = filmsExtraComponent.getElement().querySelector(`.films-list__container`);
      for (let i = 0; i < EXRTA_FILMS_COUNT; i++) {
        const movieControllerExtra = new MovieController(extraContainer, this._onDataChange);
        movieControllerExtra.render(filmsData[i]);
      }
      render(container, filmsExtraComponent);
    });
  }
}
