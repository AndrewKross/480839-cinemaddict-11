import {createElement} from "../utils.js";


const createFilterTemplate = (filter) => {
  const {name, id, count, isActive} = filter;
  const activeClass = `main-navigation__item--active`;
  return (
    `<a href="#${id}" class="main-navigation__item ${isActive ? activeClass : ``}">${name}${count ? `<span class="main-navigation__item-count">` + count + `</span>` : ``}</a>`
  );
};

export default class Filter {
  constructor(filter) {
    this._filter = filter;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filter);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
