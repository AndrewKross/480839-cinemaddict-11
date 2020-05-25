import FilmsExtraComponent from "../components/films-extra.js";
import ShowMoreButtonComponent from "../components/show-more-button.js";
import NoFilmsComponent from "../components/no-films.js";
import FilmController from "./film-controller.js";
import SortListComponent from "../components/sort.js";
import {render, remove, RenderPosition} from "../utils/render.js";
import {getTopRatedFilms, getMostCommentedFilms} from "../utils/common.js";
import {SHOWING_FILMS_COUNT_BY_BUTTON, SHOWING_FILMS_COUNT_ON_START, SortType} from "../const.js";

const EXTRA_FILMS_TITLES = {
  topRated: `Top rated`,
  mostCommented: `Most commented`
};

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
    case SortType.DATE: {
      sortedFilms = showingFilms.sort((a, b) => b.release - a.release);
      break;
    }
    case SortType.RATING: {
      sortedFilms = showingFilms.sort((a, b) => b.rating - a.rating);
      break;
    }
    case SortType.DEFAULT: {
      sortedFilms = showingFilms.sort((a, b) => a.id - b.id);
      break;
    }
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
    if (filmsData.length > 5) {
      this._renderShowMoreButton();
    }
    this._renderExtraFilms();
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
    const updatedFilmsData = this._filmsModel.getFilms();
    this._renderFilms(updatedFilmsData.slice(0, count));
    if (this._showMoreButtonComponent) {
      remove(this._showMoreButtonComponent);
    }

    if (updatedFilmsData.length > 5) {
      this._renderShowMoreButton();
    }
  }

  _updateFilm(oldData, newData) {
    const isSuccess = this._filmsModel.updateFilm(oldData.id, newData);

    if (isSuccess) {
      [...this._showedFilmsControllers,
        ...this._topRatedFilmsControllers,
        ...this._mostCommentedFilmsControllers]
      .forEach((controller) => {
        if (controller.getFilmData().id === oldData.id) {
          controller.render(newData);
        }
      });
    }
  }

  _onDataChange(oldData, newData) {
    if (newData) {
      this._api.updateFilm(oldData.id, newData)
      .then((loadedFilmData) => {
        this._updateFilm(oldData, loadedFilmData);
      });
    } else {
      this._updateFilm(oldData, oldData);
      this._renderExtraFilms();
    }
  }

  _onViewChange() {
    [...this._showedFilmsControllers,
      ...this._topRatedFilmsControllers,
      ...this._mostCommentedFilmsControllers]
    .forEach((filmController) => filmController.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

    const sortedFilms = getSortedFilms(this._filmsModel.getFilms(), sortType, 0, this._showingFilmsCount);

    this._removeFilms();
    this._renderFilms(sortedFilms);
    if (sortedFilms > 5) {
      this._renderShowMoreButton();
    }
  }

  _onShowMoreButtonClick() {
    const prevFilmsCount = this._showingFilmsCount;
    this._showingFilmsCount += SHOWING_FILMS_COUNT_BY_BUTTON;
    const filmsData = this._filmsModel.getFilms();
    const sortedFilms = getSortedFilms(filmsData, this._sortListComponent.getSortType(),
        prevFilmsCount, this._showingFilmsCount);

    this._renderFilms(sortedFilms);

    if (this._showingFilmsCount >= filmsData.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _onFilterChange() {
    this._updateFilms(SHOWING_FILMS_COUNT_ON_START);
    this._sortListComponent.returnToDefault();
  }

  _renderExtraFilms() {
    if (this._topRatedFilmsComponent && this._mostCommentedFilmsComponent) {
      remove(this._topRatedFilmsComponent);
      remove(this._mostCommentedFilmsComponent);
    }

    this._topRatedFilmsComponent = new FilmsExtraComponent(EXTRA_FILMS_TITLES.topRated);
    this._mostCommentedFilmsComponent = new FilmsExtraComponent(EXTRA_FILMS_TITLES.mostCommented);
    const container = this._container.getElement();
    const filmsData = this._filmsModel.getAllFilms();

    this._topRatedFilmsControllers = renderFilms(this._topRatedFilmsComponent.getFilmsListContainer(),
        getTopRatedFilms(filmsData), this._onDataChange, this._onViewChange);

    this._mostCommentedFilmsControllers = renderFilms(this._mostCommentedFilmsComponent.getFilmsListContainer(),
        getMostCommentedFilms(filmsData), this._onDataChange, this._onViewChange);

    render(container, this._topRatedFilmsComponent);
    render(container, this._mostCommentedFilmsComponent);
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
