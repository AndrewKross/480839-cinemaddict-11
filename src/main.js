import FilmCardComponent from "./components/film-card.js";
import FilmsExtraComponent from "./components/films-extra.js";
import ProfileRatingComponent from "./components/profile-rating.js";
import ShowMoreButtonComponent from "./components/show-more-button.js";
import MainNavigationComponent from "./components/main-navigation.js";
import SortListComponent from "./components/sort-list.js";
import FilmsSectionComponent from "./components/films-section.js";
import FilterComponent from "./components/filter.js";
import {getFilmsData} from "./mock/films.js";
import {activatePopup} from "./popup.js";
import {generateFilters} from "./mock/filters.js";
import {render, RenderPosition} from "./utils.js";


const FILMS_COUNT = 20;
const EXTRA_FILMS_TITLES = [`Top rated`, `Most commented`];
const EXRTA_FILMS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStats = document.querySelector(`.footer__statistics`);
const filmsData = getFilmsData(FILMS_COUNT);
const filters = generateFilters();

render(siteHeaderElement, new ProfileRatingComponent().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new MainNavigationComponent().getElement());
render(siteMainElement, new SortListComponent().getElement());
render(siteMainElement, new FilmsSectionComponent().getElement());

const mainNavContainer = siteMainElement.querySelector(`.main-navigation__items`);

filters.forEach((filter) => {
  render(mainNavContainer, new FilterComponent(filter).getElement());
});

const filmsElement = siteMainElement.querySelector(`.films`);
const filmsList = filmsElement.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

filmsData.slice(0, showingFilmsCount).forEach((film) => {
  render(filmsListContainer, new FilmCardComponent(film).getElement());
});

render(filmsList, new ShowMoreButtonComponent().getElement());


EXTRA_FILMS_TITLES.forEach((it) => {
  const filmsListComponent = new FilmsExtraComponent(it);
  const extraContainer = filmsListComponent.getElement().querySelector(`.films-list__container`);
  for (let i = 0; i < EXRTA_FILMS_COUNT; i++) {
    render(extraContainer, new FilmCardComponent(filmsData[i]).getElement()); // временно рисуем первые 2 элемента
  }
  render(filmsElement, filmsListComponent.getElement());
});


const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevFilmsCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  filmsData.slice(prevFilmsCount, showingFilmsCount)
    .forEach((film) => render(filmsListContainer, new FilmCardComponent(film).getElement()));

  activatePopup(); // временно для попапа

  if (showingFilmsCount >= filmsData.length) {
    loadMoreButton.remove();
  }
});

render(footerStats, `${FILMS_COUNT} movies inside`);

activatePopup(); // временно для попапа


export {render};

