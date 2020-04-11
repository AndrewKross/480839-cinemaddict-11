const createFilterMarkup = (filter) => {
  const {name, id, count, isActive} = filter;
  const activeClass = `main-navigation__item--active`;
  return (
    `<a href="#${id}" class="main-navigation__item ${isActive ? activeClass : ``}">${name}${count ? `<span class="main-navigation__item-count">` + count + `</span>` : ``}</a>`
  );
};

const createSiteMenuTemplate = () => {
  return (
    `<nav class="main-navigation">
    <div class="main-navigation__items">  
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>
  
    <ul class="sort">
      <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button">Sort by date</a></li>
      <li><a href="#" class="sort__button">Sort by rating</a></li>
    </ul>
    
    <section class="films">
      <section class="films-list">
        <div class="films-list__container">
        </div>
      </section>
    </section>`
  );
};

export {createFilterMarkup, createSiteMenuTemplate};
