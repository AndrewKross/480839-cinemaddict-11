import AbstractComponent from "./abstract-component.js";

const createFilterMarkup = (filter) => {
  const {name, count, checked} = filter;
  const activeClass = `main-navigation__item--active`;
  const counterMarkup = name !== `All movies` ? `<span class="main-navigation__item-count">` + count + `</span>` : ``;
  return (
    `<a href="#${name}" id="${name}" class="main-navigation__item ${checked ? activeClass : ``}">${name}${counterMarkup}</a>`
  );
};

const createFilterTemplate = (filters) => {
  const filtersMarkup = filters.map((filter) => {
    return createFilterMarkup(filter);
  }).join(`\n`);
  return (
    `<div class="main-navigation__items">
        ${filtersMarkup}
      </div>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }

  setFilterChangeHandler(handler) {
    this.getElement().querySelectorAll(`.main-navigation__item`).forEach((filter) => {
      filter.addEventListener(`click`, (evt) => handler(evt.target.id));
    });
  }
}
