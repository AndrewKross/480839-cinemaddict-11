import FilmsExtraComponent from "../components/films-extra.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import NoFilmsComponent from "../components/no-films.js";
import FilmController from "../controllers/film.js";
import SortListComponent, {SortType} from "../components/sort-list.js";
import MainNavigationComponent from "../components/main-navigation.js";
import {render, remove, RenderPosition} from "../utils/render.js";


const EXRTA_FILMS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;


const renderFilms = (container, filmsData, onDataChange, onViewChange) => {
  return filmsData.map((film) => {
    const filmController = new FilmController(container, onDataChange, onViewChange);
    filmController.render(film);
    return filmController;
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
  constructor(container, filmsModel) {
    this._container = container;
    this._filmsModel = filmsModel;
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

  render() {
    const container = this._container.getElement();
    const filmsContainerElement = container.querySelector(`.films-list__container`);
    const filmsData = this._filmsModel.getFilms();

    render(container.parentElement, this._sortListComponent, RenderPosition.AFTERBEGIN);
    render(container.parentElement, this._mainNavigationComponent, RenderPosition.AFTERBEGIN);

    if (filmsData.length === 0) {
      render(filmsContainerElement, this._noFilmsComponent);
      return;
    }

    this._renderFilms(filmsData.slice(0, this._showingFilmsCount));

    this._renderShowMoreButton(filmsData);

    this._renderExtraFilms(filmsData);
  }

  _renderFilms(films) {
    const filmsContainerElement = this._container.getElement().querySelector(`.films-list__container`);

    const newFilms = renderFilms(filmsContainerElement, films, this._onDataChange, this._onViewChange);
    this._showedFilmsCards = this._showedFilmsCards.concat(newFilms);
    this._showingFilmsCount = this._showedFilmsCards.length;
  }

  _renderShowMoreButton() {
    const container = this._container.getElement();
    const filmsListElement = container.querySelector(`.films-list`);

    remove(this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(() => {
      const prevFilmsCount = this._showingFilmsCount;
      this._showingFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;
      const filmsData = this._filmsModel.getFilms();

      const sortedFilms = getSortedFilms(filmsData, this._sortListComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);

      this._renderFilms(sortedFilms);

      if (this._showingFilmsCount >= filmsData.length) {
        remove(this._showMoreButtonComponent);
      }
    });

    render(filmsListElement, this._showMoreButtonComponent);
  }

  _onDataChange(filmController, oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      filmController.render(newData);
    }
  }

  _onViewChange() {
    this._showedFilmsCards.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;
    const filmsContainerElement = this._container.getElement().querySelector(`.films-list__container`);

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingFilmsCount);

    filmsContainerElement.innerHTML = ``;
    this._showedFilmsCards = [];

    this._renderFilms(sortedFilms);

    this._renderShowMoreButton();
  }

  _renderExtraFilms(filmsData) {
    const EXTRA_FILMS_TITLES = [`Top rated`, `Most commented`];
    const container = this._container.getElement();

    EXTRA_FILMS_TITLES.forEach((it) => {
      const filmsExtraComponent = new FilmsExtraComponent(it);
      const extraContainer = filmsExtraComponent.getElement().querySelector(`.films-list__container`);
      for (let i = 0; i < EXRTA_FILMS_COUNT; i++) {
        const movieControllerExtra = new FilmController(extraContainer, this._onDataChange);
        movieControllerExtra.render(filmsData[i]);
      }
      render(container, filmsExtraComponent);
    });
  }
}
