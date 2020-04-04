import {createFilmCardTemplate} from "./components/film-card.js";
import {createFilmDetailsTemplate} from "./components/film-details";
import {createFilmsExtraTemplate} from "./components/films-extra";
import {createProfileRatingTemplate} from "./components/profile-rating";
import {createShowMoreButtonTemplate} from "./components/show-more-button";
import {createSiteMenuTemplate} from "./components/site-menu";

const FILMS_COUNT = 5;
const EXTRA_FILMS_COUNT = 2;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const body = document.querySelector(`body`);
const header = document.querySelector(`.header`);
const main = document.querySelector(`.main`);

render(header, createProfileRatingTemplate());
render(main, createSiteMenuTemplate());

const films = main.querySelector(`.films`);
const filmsList = films.querySelector(`.films-list`);
const filmsListContainer = filmsList.querySelector(`.films-list__container`);

for (let i = 0; i < FILMS_COUNT; i++) {
  render(filmsListContainer, createFilmCardTemplate());
}

render(filmsList, createShowMoreButtonTemplate());
render(films, createFilmsExtraTemplate());

const filmsListExtraContainers = films.querySelectorAll(`.films-list--extra .films-list__container`);

for (let i = 0; i < EXTRA_FILMS_COUNT; i++) {
  render(filmsListExtraContainers[0], createFilmCardTemplate());
  render(filmsListExtraContainers[1], createFilmCardTemplate());
}

render(body, createFilmDetailsTemplate());

