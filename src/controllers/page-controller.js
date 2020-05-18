import FilmsExtraComponent from "../components/films-extra.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import NoFilmsComponent from "../components/no-films.js";
import FilmController from "./film-controller.js";
import SortListComponent, {SortType} from "../components/sort.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {EXTRA_FILMS_COUNT, SHOWING_FILMS_COUNT_BY_BUTTON, SHOWING_FILMS_COUNT_ON_START} from "../const.js";

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
  constructor(container, filmsModel, api) {
    this._container = container;
    this._filmsModel = filmsModel;
    this._api = api;
    this._showedFilmsControllers = [];
    this._noFilmsComponent = new NoFilmsComponent();
    this._showMoreButtonComponent = new ShowMoreButtonComponent();
    this._sortListComponent = new SortListComponent();
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._onShowMoreButtonClick = this._onShowMoreButtonClick.bind(this);

    this._sortListComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._filmsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const container = this._container.getElement();
    const filmsContainerElement = container.querySelector(`.films-list__container`);
    const filmsData = this._filmsModel.getFilms();

    render(container, this._sortListComponent, RenderPosition.BEFORE);

    if (filmsData.length === 0) {
      render(filmsContainerElement, this._noFilmsComponent);
      return;
    }

    this._renderFilms(filmsData.slice(0, this._showingFilmsCount));
    this._renderShowMoreButton(filmsData);
    this._renderExtraFilms(filmsData);
  }

  _removeFilms() {
    this._showedFilmsControllers.forEach((filmController) => filmController.destroy());
    this._showedFilmsControllers = [];
  }

  _renderFilms(films) {
    const filmsContainerElement = this._container.getElement().querySelector(`.films-list__container`);

    const newFilms = renderFilms(filmsContainerElement, films, this._onDataChange, this._onViewChange);
    this._showedFilmsControllers = this._showedFilmsControllers.concat(newFilms);
    this._showingFilmsCount = this._showedFilmsControllers.length;
  }

  _renderShowMoreButton() {
    const container = this._container.getElement();
    const filmsListElement = container.querySelector(`.films-list`);

    remove(this._showMoreButtonComponent);

    this._showMoreButtonComponent.setClickHandler(this._onShowMoreButtonClick);

    render(filmsListElement, this._showMoreButtonComponent);
  }

  _updateFilms(count) {
    this._removeFilms();
    this._renderFilms(this._filmsModel.getFilms().slice(0, count));
    this._renderShowMoreButton();
  }

  _onDataChange(filmController, oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
    .then((loadedFilmData) => {
      const isSuccess = this._filmsModel.updateFilm(oldData.id, loadedFilmData);

      if (isSuccess) {
        filmController.render(loadedFilmData);
      }
    });
  }

  _onViewChange() {
    this._showedFilmsControllers.forEach((filmController) => filmController.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingFilmsCount);

    this._removeFilms();
    this._renderFilms(sortedFilms);
    this._renderShowMoreButton();
  }

  _onShowMoreButtonClick() {
    const prevFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;
    const filmsData = this._filmsModel.getFilms();
    const sortedFilms = getSortedFilms(filmsData, this._sortListComponent.getSortType(), prevFilmsCount, this._showingFilmsCount);

    this._renderFilms(sortedFilms);

    if (this._showingFilmsCount >= filmsData.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onFilterChange() {
    this._updateFilms(SHOWING_FILMS_COUNT_ON_START);
  }

  _renderExtraFilms(filmsData) {
    const EXTRA_FILMS_TITLES = [`Top rated`, `Most commented`];
    const container = this._container.getElement();

    EXTRA_FILMS_TITLES.forEach((it) => {
      const filmsExtraComponent = new FilmsExtraComponent(it);
      const extraContainer = filmsExtraComponent.getElement().querySelector(`.films-list__container`);
      for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
        const movieControllerExtra = new FilmController(extraContainer, this._onDataChange);
        movieControllerExtra.render(filmsData[i]);
      }
      render(container, filmsExtraComponent);
    });
  }

  hide() {
    this._container.hide();
    this._sortListComponent.hide();
  }

  show() {
    this._container.show();
    this._sortListComponent.show();
  }
}
