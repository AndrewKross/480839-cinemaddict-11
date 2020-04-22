import ProfileRatingComponent from "./components/profile-rating.js";
import MainNavigationComponent from "./components/main-navigation.js";
import SortListComponent from "./components/sort-list.js";
import FilmsSectionComponent from "./components/films-section.js";
import PageController from "./controllers/page-controller.js";
import FilterComponent from "./components/filter.js";
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
render(siteMainElement, new MainNavigationComponent());
render(siteMainElement, new SortListComponent());

const mainNavContainer = siteMainElement.querySelector(`.main-navigation__items`);

filters.forEach((filter) => {
  render(mainNavContainer, new FilterComponent(filter));
});

const filmsSectionComponent = new FilmsSectionComponent();
render(siteMainElement, filmsSectionComponent);

const pageController = new PageController(filmsSectionComponent);
pageController.render(filmsData);

footerStats.innerHTML = `<p>${filmsData.length} movies inside</p>`;

