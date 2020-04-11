import {getRandomInt, getRandomDate, formatTime} from "../utils.js";

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

const commentsText = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];

const commentsAuthors = [`Tim Macoveev`, `John Doe`, `LeBron James`, `James Harden`, `Anthony Davis`];

const generateCommentsData = (count) => {
  let generatedArray = new Array(count).fill({});
  generatedArray.forEach((it) => {
    let randomizeEmoji = getRandomInt(0, emojiList.length);
    it.emoji = emojiList[randomizeEmoji].emoji;
    it.alt = emojiList[randomizeEmoji].alt;
    it.text = commentsText[getRandomInt(0, commentsText.length)];
    it.author = commentsAuthors[getRandomInt(0, commentsAuthors.length)];
    let randomDate = getRandomDate(new Date(2012, 0, 1), new Date());
    it.time = formatTime(randomDate);
  });

  return generatedArray;
};

export {generateCommentsData};

