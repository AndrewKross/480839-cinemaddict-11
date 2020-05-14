import AbstractComponent from "./abstract-component.js";

const createFilmsSectionTemplate = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <div class="films-list__container">
        </div>
      </section>
    </section>`
  );
};

export default class FilmsSection extends AbstractComponent {
  getTemplate() {
    return createFilmsSectionTemplate();
  }
}
