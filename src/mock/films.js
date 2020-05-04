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

const getFilmsData = (count) => {
  let generatedData = new Array(count).fill(``).map(() => {
    return Object.assign({}, films[getRandomInt(0, films.length)], {
      age: ratingList[getRandomInt(0, ratingList.length)],
      originalTitle: films[getRandomInt(0, films.length)].title,
      director: filmDirectors[getRandomInt(0, filmDirectors.length)],
      actors: getRandomArrayItems(filmActors, getRandomInt(1, 3)).join(`, `),
      writers: getRandomArrayItems(filmWriters, getRandomInt(1, 3)).join(`, `),
      country: countryNames[getRandomInt(0, countryNames.length)],
      rating: getRandomInt(30, 100) / 10,
      description: getRandomDesc(),
      inWatchlist: Math.random() > 0.5,
      inHistory: Math.random() > 0.5,
      inFavorites: Math.random() > 0.5,
    });
  });
  return generatedData;
};

export {getFilmsData};

