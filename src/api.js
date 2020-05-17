import FilmModel from "./models/film-model.js";
import CommentsModel from "./models/comments-model.js";

const API = class {
  constructor(authorization) {
    this._authorization = authorization;
  }

  _getHeaders() {
    const headers = new Headers();
    headers.append(`Authorization`, this._authorization);
    return {headers};
  }

  getFilms() {
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/movies`, this._getHeaders())
    .then((response) => response.json())
      .then(FilmModel.parseFilms);
  }

  getComments(id) {
    return fetch(`https://11.ecmascript.pages.academy/cinemaddict/comments/${id}`, this._getHeaders())
    .then((response) => response.json())
      .then(CommentsModel.parseComments);
  }
};

export default API;
