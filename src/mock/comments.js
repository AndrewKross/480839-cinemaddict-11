import {getRandomInt, getRandomDate} from "../utils/common.js";
import {emojiList, commentsText, commentsAuthors} from "../const.js";

const commentData = (it) => {
  it = {};
  let randomizeEmoji = getRandomInt(0, emojiList.length);

  it.id = String(new Date() + Math.random());
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

