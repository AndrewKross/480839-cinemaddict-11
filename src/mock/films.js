import {getRandomInt, getRandomArrayItems} from "../utils/common.js";
import {films, description, filmDirectors, filmWriters, filmActors, countryNames, ratingList} from "../const.js";

let descriptionArray = description.slice(0, -1).split(`. `);

let getRandomDesc = () => {
  let descItemsCount = getRandomInt(1, 6); // от 1 до 5 предложений
  let generatedDesc = ``;
  for (let i = 0; i < descItemsCount; i++) {
    let randomString = getRandomInt(0, descriptionArray.length);
    generatedDesc += descriptionArray[randomString] + `. `;
  }
  return generatedDesc;
};

const filmsData = films.map((it) => { // финальный массив объектов со всеми сгенерированными данными
  it.age = ratingList[getRandomInt(0, ratingList.length)];
  it.originalTitle = it.title;
  it.director = filmDirectors[getRandomInt(0, filmDirectors.length)];
  it.writers = getRandomArrayItems(filmWriters, getRandomInt(1, 3)).join(`, `);
  it.actors = getRandomArrayItems(filmActors, getRandomInt(1, 3)).join(`, `);
  it.country = countryNames[getRandomInt(0, countryNames.length)];

  it.description = getRandomDesc();
  it.inWatchlist = Math.random() > 0.5;
  it.inHistory = Math.random() > 0.5;
  it.inFavorites = Math.random() > 0.5;
  return it;
});

const getFilmsData = (count) => {
  let generatedData = [];
  for (let i = 0; i < count; i++) {
    generatedData.push(filmsData[getRandomInt(0, filmsData.length)]);
  }
  return generatedData;
};

export {getFilmsData};

