import API from "./api.js";
import ProfileRatingComponent from "./components/profile-rating.js";
import PageLoadingComponent from "./components/page-loading.js";
import FilmsSectionComponent from "./components/films-section.js";
import FooterStatsComponent from "./components/footer-stats.js";
import StatsComponent from "./components/stats.js";
import PageController from "./controllers/page-controller.js";
import FilterController from "./controllers/filter-controller.js";
import FilmsModel from "./models/films-model.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {AUTHORIZATION} from "./const.js";

const renderAfterLoad = (response) => {
  remove(pageLoadingComponent);
  filmsModel.setFilms(response);
  pageController.render();
  render(footerStats, new FooterStatsComponent(filmsModel.getAllFilms()));
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStats = document.querySelector(`.footer__statistics`);

const api = new API(AUTHORIZATION);
const filmsModel = new FilmsModel();

render(siteHeaderElement, new ProfileRatingComponent());

const filterController = new FilterController(siteMainElement, filmsModel);
filterController.render();

const filmsSectionComponent = new FilmsSectionComponent();
render(siteMainElement, filmsSectionComponent);
const pageLoadingComponent = new PageLoadingComponent();
render(filmsSectionComponent.getFilmsListElement(), pageLoadingComponent);

const pageController = new PageController(filmsSectionComponent, filmsModel);
const statsComponent = new StatsComponent(filmsModel);
render(siteMainElement, statsComponent, RenderPosition.BEFOREEND);
statsComponent.hide();
filterController.getFilterComponent().setStatsClickHandler(() => {
  pageController.hide();
  statsComponent.show();
  statsComponent.render();
});
filterController.getFilterComponent().setFilterChangeHandler(() => {
  pageController.show();
  statsComponent.hide();
});

api.getFilms()
  .then((films) => renderAfterLoad(films))
  .catch(() => renderAfterLoad([]));

