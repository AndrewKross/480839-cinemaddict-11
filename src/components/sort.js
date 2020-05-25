import AbstractComponent from "./abstract-component.js";

export const SortType = {
  RATING: `rating`,
  DATE: `date`,
  DEFAULT: `default`,
};

const createSortTemplate = () => {
  return (
    `<ul class="sort">
      <li><a href="#" data-sort-type="${SortType.DEFAULT}" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" data-sort-type="${SortType.DATE}" class="sort__button">Sort by date</a></li>
      <li><a href="#" data-sort-type="${SortType.RATING}" class="sort__button">Sort by rating</a></li>
    </ul>`
  );
};

export default class Sort extends AbstractComponent {
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  getTemplate() {
    return createSortTemplate();
  }

  getSortType() {
    return this._currentSortType;
  }

  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      evt.preventDefault();

      if (evt.target.tagName !== `A`) {
        return;
      }

      const sortType = evt.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;
      this._removeActiveClass();
      evt.target.classList.add(`sort__button--active`);
      handler(this._currentSortType);
    });
  }

  returnToDefault() {
    this._currentSortType = SortType.DEFAULT;
    this._removeActiveClass();
    this.getElement().querySelector(`.sort__button`).classList.add(`sort__button--active`);
  }

  _removeActiveClass() {
    this.getElement().querySelectorAll(`a`)
    .forEach((it) => it.classList.remove(`sort__button--active`));
  }
}
