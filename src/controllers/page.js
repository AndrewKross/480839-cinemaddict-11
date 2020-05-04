import FilmsExtraComponent from "../components/films-extra.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import NoFilmsComponent from "../components/no-films.js";
import MovieController from "../controllers/movie.js";
import SortListComponent, {SortType} from "../components/sort-list.js";
import MainNavigationComponent from "../components/main-navigation.js";
import {render, remove, RenderPosition} from "../utils/render.js";


const EXRTA_FILMS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;


const renderFilms = (container, filmsData, onDataChange, onViewChange) => {
  return filmsData.map((film) => {
    const movieController = new MovieController(container, onDataChange, onViewChange);
    movieController.render(film);
    return movieController;
  });
};

const getSortedFilms = (films, sortType, from, to) => {
  let sortedFilms = [];
  const showingFilms = films.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilms = showingFilms.sort((a, b) => b.release.slice(-4) - a.release.slice(-4)); // временная сортировка по годам
      break;
    case SortType.RATING:
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilms = showingFilms;
      break;
  }

  return sortedFilms.slice(from, to);
};

export default class PageController {
  constructor(container) {
    this._container = container;
    this._filmsData = [];
    this._showedFilmsCards = [];
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortListComponent = new SortListComponent();
    this._mainNavigationComponent = new MainNavigationComponent();
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortListComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(filmsData) {
    const container = this._container.getElement();
    const filmsContainerElement = container.querySelector(`.films-list__container`);

    render(container.parentElement, this._sortListComponent, RenderPosition.AFTERBEGIN);
    render(container.parentElement, this._mainNavigationComponent, RenderPosition.AFTERBEGIN);

    this._filmsData = filmsData;

    if (filmsData.length === 0) {
      render(filmsContainerElement, this._noFilmsComponent);
      return;
    }

    const newFilms = renderFilms(filmsContainerElement, filmsData.slice(0, this._showingFilmsCount), this._onDataChange, this._onViewChange);
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

  _onViewChange() {
    this._showedFilmsCards.forEach((it) => it.setDefaultView());
  }

  _renderShowMoreButton() {
    const container = this._container.getElement();
    const filmsListElement = container.querySelector(`.films-list`);
    const filmsContainerElement = container.querySelector(`.films-list__container`);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;

      const sortedFilms = getSortedFilms(this._filmsData, this._sortListComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);

      const newFilms = renderFilms(filmsContainerElement, sortedFilms, this._onDataChange, this._onViewChange);
      this._showedFilmsCards = this._showedFilmsCards.concat(newFilms);

      if (this._showingFilmsCount >= this._filmsData.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    render(filmsListElement, this._showMoreButtonComponent);
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    remove(this._showMoreButtonComponent);

    const sortedFilms = getSortedFilms(this._filmsData, sortType, 0, this._showingFilmsCount);
    const filmsContainerElement = this._container.getElement().querySelector(`.films-list__container`);

    filmsContainerElement.innerHTML = ``;

    const newFilms = renderFilms(filmsContainerElement, sortedFilms, this._onDataChange, this._onViewChange);
    this._showedFilmsCards = newFilms;

    this._renderShowMoreButton();
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
