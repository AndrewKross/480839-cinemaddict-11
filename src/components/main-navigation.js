import AbstractComponent from "./abstract-component";

const mainNavigationTemplate = () => {
  return (
    `<nav class="main-navigation">
        <a href="#stats" class="main-navigation__additional">Stats</a>
     </nav>`
  );
};

export default class MainNavigation extends AbstractComponent {
  getTemplate() {
    return mainNavigationTemplate();
  }

  setStatsClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__additional`)
    .addEventListener(`click`, handler);
  }
}
