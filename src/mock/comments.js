import {getRandomInt, getRandomDate} from "../utils/common.js";

const emojiList = [{
  emotion: `smile`,
}, {
  emotion: `sleeping`,
}, {
  emotion: `puke`,
}, {
  emotion: `angry`,
}];

const commentsText = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`, `Loool`, `I love this movie!`, `Oscar to DiCaprio!`];

const commentsAuthors = [`Tim Duncan`, `John Wall`, `LeBron James`, `James Harden`, `Anthony Davis`, `Keks_The_Baller`];

const commentData = (it) => {
  it = {};
  let randomizeEmoji = getRandomInt(0, emojiList.length);

  it.id = String(new Date() + Math.random());
  it.emotion = emojiList[randomizeEmoji].emotion;
  it.alt = emojiList[randomizeEmoji].alt;
  it.comment = commentsText[getRandomInt(0, commentsText.length)];
  it.author = commentsAuthors[getRandomInt(0, commentsAuthors.length)];
  it.time = getRandomDate(new Date(2019, 0, 0), new Date());

  return it;
};

const generateCommentsData = (count) => {
  return new Array(count).fill(``).map(commentData);
};

export {generateCommentsData};

