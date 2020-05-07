import ProfileRatingComponent from "./components/profile-rating.js";
import FilmsSectionComponent from "./components/films-section.js";
import PageController from "./controllers/page.js";
import FilterComponent from "./components/filter.js";
import FilmsModel from "./models/films.js";
import {getFilmsData} from "./mock/films.js";
import {generateFilters} from "./mock/filters.js";
import {render} from "./utils/render.js";


const FILMS_COUNT = 20;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStats = document.querySelector(`.footer__statistics`);
const filmsData = getFilmsData(FILMS_COUNT);
const filters = generateFilters();

render(siteHeaderElement, new ProfileRatingComponent());

const filmsSectionComponent = new FilmsSectionComponent();
render(siteMainElement, filmsSectionComponent);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsData);

const pageController = new PageController(filmsSectionComponent, filmsModel);
pageController.render(filmsData);

const mainNavContainer = siteMainElement.querySelector(`.main-navigation__items`);

filters.forEach((filter) => {
  render(mainNavContainer, new FilterComponent(filter));
});

footerStats.innerHTML = `<p>${filmsData.length} movies inside</p>`;

