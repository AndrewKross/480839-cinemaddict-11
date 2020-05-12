import AbstractComponent from "./abstract-component.js";

const createFooterStatsTemplate = (filmsData) => {
  return (
    `<p>${filmsData.length} movies inside</p>`
  );
};

export default class FooterStats extends AbstractComponent {
  constructor(filmsData) {
    super();
    this._filmsData = filmsData;
  }

  getTemplate() {
    return createFooterStatsTemplate(this._filmsData);
  }
}
