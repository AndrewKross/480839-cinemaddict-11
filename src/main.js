import API from "./api/index.js";
import Provider from "./api/provider.js";
import ProfileRatingComponent from "./components/profile-rating.js";
import PageLoadingComponent from "./components/page-loading.js";
import FilmsSectionComponent from "./components/films-section.js";
import FooterStatsComponent from "./components/footer-stats.js";
import StatsComponent from "./components/stats.js";
import PageController from "./controllers/page-controller.js";
import FilterController from "./controllers/filter-controller.js";
import FilmsModel from "./models/films-model.js";
import Store from "./api/store.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {AUTHORIZATION, END_POINT, STORE_NAME} from "./const.js";

const renderAfterLoad = (response) => {
  const statsComponent = new StatsComponent(filmsModel);

  remove(pageLoadingComponent);
  filmsModel.setFilms(response);
  pageController.render();
  render(footerStats, new FooterStatsComponent(filmsModel.getAllFilms()));
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
};

const siteHeaderElement = document.querySelector(`.header`);
const siteMainElement = document.querySelector(`.main`);
const footerStats = document.querySelector(`.footer__statistics`);
const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const filmsModel = new FilmsModel();

render(siteHeaderElement, new ProfileRatingComponent());

const filterController = new FilterController(siteMainElement, filmsModel);
filterController.render();

const filmsSectionComponent = new FilmsSectionComponent();
render(siteMainElement, filmsSectionComponent);

const pageLoadingComponent = new PageLoadingComponent();
render(filmsSectionComponent.getFilmsListElement(), pageLoadingComponent);

const pageController = new PageController(filmsSectionComponent, filmsModel, apiWithProvider);

apiWithProvider.getFilms()
  .then((films) => renderAfterLoad(films))
  .catch(() => renderAfterLoad([]));

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (!apiWithProvider.syncIsNeeded) {
    return;
  }
  apiWithProvider.sync();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
    .then(() => {})
    .catch((err) => {
      throw err;
    });
});

