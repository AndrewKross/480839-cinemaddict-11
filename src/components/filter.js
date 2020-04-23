import AbstractComponent from "./abstract-component.js";


const createFilterTemplate = (filter) => {
  const {name, id, count, isActive} = filter;
  const activeClass = `main-navigation__item--active`;
  return (
    `<a href="#${id}" class="main-navigation__item ${isActive ? activeClass : ``}">${name}${count ? `<span class="main-navigation__item-count">` + count + `</span>` : ``}</a>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return createFilterTemplate(this._filter);
  }
}
