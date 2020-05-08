import ProfileRatingComponent from "./components/profile-rating.js";
import FilmsSectionComponent from "./components/films-section.js";
import PageController from "./controllers/page.js";
import FilterController from "./controllers/filter.js";
import FilmsModel from "./models/films.js";
import {getFilmsData} from "./mock/films.js";
import {render} from "./utils/render.js";


const FILMS_COUNT = 20;

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStats = document.querySelector(`.footer__statistics`);
const filmsData = getFilmsData(FILMS_COUNT);
const filmsModel = new FilmsModel();
filmsModel.setFilms(filmsData);

render(siteHeaderElement, new ProfileRatingComponent());


const filmsSectionComponent = new FilmsSectionComponent();
render(siteMainElement, filmsSectionComponent);

const pageController = new PageController(filmsSectionComponent, filmsModel);
pageController.render(filmsModel);

const filterController = new FilterController(siteMainElement, filmsModel);
filterController.render();

footerStats.innerHTML = `<p>${filmsData.length} movies inside</p>`;

