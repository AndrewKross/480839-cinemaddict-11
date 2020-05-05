import {getRandomInt, getRandomDate} from "../utils/common.js";

const emojiList = [{
  emoji: `./images/emoji/smile.png`,
  alt: `emoji-smile`,
}, {
  emoji: `./images/emoji/sleeping.png`,
  alt: `emoji-sleeping`,
}, {
  emoji: `./images/emoji/puke.png`,
  alt: `emoji-puke`,
}, {
  emoji: `./images/emoji/angry.png`,
  alt: `emoji-angry`,
}];

const commentsText = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`, `Loool`, `I love this movie!`, `Oscar to DiCaprio!`];

const commentsAuthors = [`Tim Duncan`, `John Wall`, `LeBron James`, `James Harden`, `Anthony Davis`, `Keks_The_Baller`];

const commentData = (it) => {
  it = {};
  let randomizeEmoji = getRandomInt(0, emojiList.length);
  it.emoji = emojiList[randomizeEmoji].emoji;
  it.alt = emojiList[randomizeEmoji].alt;
  it.text = commentsText[getRandomInt(0, commentsText.length)];
  it.author = commentsAuthors[getRandomInt(0, commentsAuthors.length)];
  it.time = getRandomDate(new Date(2019, 0, 0), new Date());
  return it;
};

const generateCommentsData = (count) => {
  return new Array(count).fill(``).map(commentData);
};

export {generateCommentsData};

