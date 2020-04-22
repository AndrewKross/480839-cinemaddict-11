import {getRandomInt} from "../utils/common.js";

const films = [{
  title: `Inception`,
  rating: 8.8,
  year: 2010,
  duration: `2h 28min`,
  genre: `Action`,
  image: `./images/posters/Inception.jpg`,
}, {
  title: `Interstellar`,
  rating: 8.6,
  year: 2014,
  duration: `2h 49min`,
  genre: `Adventure`,
  image: `./images/posters/Interstellar.jpg`,
}, {
  title: `John Wick`,
  rating: 7.4,
  year: 2014,
  duration: `1h 41min`,
  genre: `Action`,
  image: `./images/posters/John-Wick.jpg`,
}, {
  title: `Men in Black`,
  rating: 7.3,
  year: 1997,
  duration: `1h 38min`,
  genre: `Action`,
  image: `./images/posters/Men-in-Black.jpg`,
}, {
  title: `Skyfall`,
  rating: 7.7,
  year: 2012,
  duration: `2h 23min`,
  genre: `Action`,
  image: `./images/posters/Skyfall.jpg`,
}, {
  title: `The Dark Knight`,
  rating: 9.0,
  year: 2008,
  duration: `2h 32min`,
  genre: `Action`,
  image: `./images/posters/The-Dark-Knight.jpg`,
}, {
  title: `The Matrix`,
  rating: 8.7,
  year: 1999,
  duration: `2h 16min`,
  genre: `Action`,
  image: `./images/posters/The-Matrix.jpg`,
}
];

const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

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

