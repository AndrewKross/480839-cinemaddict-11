import AbstractComponent from "./abstract-component.js";

const createProfileRatingTemplate = (filmsModel) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${filmsModel.getRank()}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class ProfileRating extends AbstractComponent {
  constructor(filmsModel) {
    super();
    this._filmsModel = filmsModel;
  }
  getTemplate() {
    return createProfileRatingTemplate(this._filmsModel);
  }
}
