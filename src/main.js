import {createFilmCardTemplate} from "./components/film-card.js";
import {createFilmsExtraTemplate} from "./components/films-extra";
import {createProfileRatingTemplate} from "./components/profile-rating";
import {createShowMoreButtonTemplate} from "./components/show-more-button";
import {createSiteMenuTemplate, createFilterMarkup} from "./components/site-menu";
import {getFilmsData} from "./mock/films.js";
import {activatePopup} from "./popup.js";
import {generateFilters} from "./mock/filters.js";

const FILMS_COUNT = 20;
const EXTRA_FILMS_COUNT = 2;
const SHOWING_FILMS_COUNT_ON_START = 5;
const SHOWING_FILMS_COUNT_BY_BUTTON = 5;
const filmsData = getFilmsData(FILMS_COUNT);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);
const footerStats = document.querySelector(`.footer__statistics`);
const filters = generateFilters();

render(header, createProfileRatingTemplate());
render(main, createSiteMenuTemplate());

const mainNavContainer = main.querySelector(`.main-navigation__items`);

filters.forEach((filter) => { // пока что генерируем счетчики для фильтров тут, т.к. данные фильмов (filmsData) генерируются тут, а не в моках
  filter.inWatchlist = filmsData.reduce((count, it) => it.inWatchlist ? count++ : count);
  filter.inHistory = filmsData.reduce((count, it) => it.inHistory ? count++ : count);
  filter.inFavorites = filmsData.reduce((count, it) => it.inFavorites ? count++ : count);
  render(mainNavContainer, createFilterMarkup(filter));
});

const films = main.querySelector(`.films`);
const filmsList = films.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

let showingFilmsCount = SHOWING_FILMS_COUNT_ON_START;

filmsData.slice(0, showingFilmsCount).forEach((film) => {
  render(filmsListContainer, createFilmCardTemplate(film));
});

render(filmsList, createShowMoreButtonTemplate());
render(films, createFilmsExtraTemplate());

const filmsListExtraContainers = films.querySelectorAll(`.films-list--extra .films-list__container`);

for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
  render(filmsListExtraContainers[0], createFilmCardTemplate(getFilmsData(1)[0]));
  render(filmsListExtraContainers[1], createFilmCardTemplate(getFilmsData(1)[0]));
}

const loadMoreButton = filmsList.querySelector(`.films-list__show-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevFilmsCount = showingFilmsCount;
  showingFilmsCount = showingFilmsCount + SHOWING_FILMS_COUNT_BY_BUTTON;

  filmsData.slice(prevFilmsCount, showingFilmsCount)
    .forEach((film) => render(filmsListContainer, createFilmCardTemplate(film)));

  activatePopup(); // временно для попапа

  if (showingFilmsCount >= filmsData.length) {
    loadMoreButton.remove();
  }
});

render(footerStats, `<p>${FILMS_COUNT} movies inside</p>`);

activatePopup(); // временно для попапа


export {render};

