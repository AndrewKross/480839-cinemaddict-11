import {getRandomInt, getRandomArrayItems, getRandomDate} from "../utils/common.js";
import {generateCommentsData} from "./comments";
import moment from "moment";

const films = [{
  title: `Inception`,
  genres: [`Action`, `Adventure`, `Sci-Fi`],
  image: `./images/posters/Inception.jpg`,
}, {
  title: `Interstellar`,
  genres: [`Adventure`, `Drama`, `Sci-Fi`],
  image: `./images/posters/Interstellar.jpg`,
}, {
  title: `John Wick`,
  genres: [`Action`, `Crime`, `Thriller`],
  image: `./images/posters/John-Wick.jpg`,
}, {
  title: `Men in Black`,
  genres: [`Action`, `Adventure`, `Comedy`],
  image: `./images/posters/Men-in-Black.jpg`,
}, {
  title: `Skyfall`,
  genres: [`Action`, `Adventure`, `Thriller`],
  image: `./images/posters/Skyfall.jpg`,
}, {
  title: `The Dark Knight`,
  genres: [`Action`, `Crime`, `Drama`],
  image: `./images/posters/The-Dark-Knight.jpg`,
}, {
  title: `The Matrix`,
  genres: [`Action`, `Sci-Fi`],
  image: `./images/posters/The-Matrix.jpg`,
}];

const description = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;

const filmDirectors = [
  `Кристофер Нолан`, `Александр Роу`, `Люк Бессон`, `Роберт Земекис`, `Педро Альмодовар`, `Клинт Иствуд`, `Стивен Спилберг`, `Фрэнсис Форд Коппола`, `Дэвид Финчер`, `Серджио Леоне`, `Тим Бёртон`, `Квентин Тарантино`, `Гай Ричи`, `Питер Джексон`, `Джеймс Кэмерон`, `Альфред Хичкок`, `Кевин Смит`, `Ридли Скотт`
];

const filmWriters = [
  `Стивен Спилберг`, `Квентин Тарантино`, `Пол Сэведж`, `Мартин Скорсезе`, `Джеймс Кэмерон`, `Стивен Кинг`, `Оливер Стоун`, `Роберт Де Ниро`, `Роберт Таун`, `Альфред Хичкок`, `Ричард Линклейтер`, `Джоэл Коэн`, `Джордан Пил`, `Кевин Смит`, `Ридли Скотт`, `Даррен Аронофски`, `Бен Аффлек`, `Шейн Блэк`
];

const filmActors = [
  `Галь Гадот`, `Брэд Питт`, `Леонардо Ди Каприо`, `Кэри Грант`, `Мэрилин Монро`, `Спенсер Трейси`, `Чарльз Чаплин`, `Барбара Стэнвик`, `Мэй Уэст`, `Камерон Диас`, `Кирк Дуглас`, `Софи Лорен`,
  `Сидни Пуатье`, `Уильям Холден`, `Род Стайгер`, `Том Круз`, `Николь Кидман`, `Уилл Смит`,
  `Джонни Депп`, `Дуэйн Джонсон`, `Том Хэнкс`, `Анджелина Джоли`, `Бен Аффлек`, `Крис Хемсворт`,
  `Мэттью Макконехи`, `Мэтт Деймон`, `Скарлетт Йоханссон`, `Райан Рейнольдс`, `Ченнинг Татум`,
  `Джулия Робертс`, `Кира Найтли`, `Брэдли Купер`, `Меган Фокс`, `Шарлиз Терон`, `Дженнифер Лоуренс`, `Кристиан Бэйл`, `Хью Джекман`, `Клинт Иствуд`, `Джеймс Франко`, `Райан Гослинг`, `Эдвард Нортон`, `Дженнифер Энистон`, `Арнольд Шварценеггер`, `Джеки Чан`, `Хоакин Феникс`, `Крис Эванс`,
  `Натали Портман`, `Киану Ривз`, `Моника Беллуччи`
];

const countryNames = [
  `Австралия`, `Австрия`, `	Бразилия`, `Великобритания`, `Вьетнам`, `Германия`, `Грузия`, `Египет`, `Индия`, `Испания`, `Италия`, `Канада`, `Корея`, `Нигерия`, `Россия`, `Казахстан`, `Китай`, `Япония`, `Турция`, `США`
];

const ratingList = [
  `0`, `6`, `12`, `18`, `21`
];

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
      id: String(new Date() + Math.random()),
      age: ratingList[getRandomInt(0, ratingList.length)],
      originalTitle: films[getRandomInt(0, films.length)].title,
      director: filmDirectors[getRandomInt(0, filmDirectors.length)],
      actors: getRandomArrayItems(filmActors, getRandomInt(1, 3)).join(`, `),
      writers: getRandomArrayItems(filmWriters, getRandomInt(1, 3)).join(`, `),
      country: countryNames[getRandomInt(0, countryNames.length)],
      rating: getRandomInt(30, 100) / 10,
      release: moment(getRandomDate(new Date(1970), new Date())).format(`DD MMMM YYYY`),
      duration: getRandomInt(30, 180),
      description: getRandomDesc(),
      inWatchlist: Math.random() > 0.5,
      inHistory: Math.random() > 0.5,
      inFavorites: Math.random() > 0.5,
      comments: generateCommentsData(getRandomInt(0, 6)),
    });
  });
  return generatedData;
};

export {getFilmsData};

