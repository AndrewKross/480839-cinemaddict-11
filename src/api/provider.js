import FilmModel from "../models/film-model.js";

const isOnline = () => {
  return window.navigator.onLine;
};

const createStorageStructure = (items) => {
  return items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
};

export default class Provider {
  constructor(api, storage) {
    this._api = api;
    this._storage = storage;
    this._syncIsNeeded = false;
  }

  get syncIsNeeded() {
    return this._syncIsNeeded;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
      .then((films) => {
        const unitedFilms = createStorageStructure(films.map((film) => film.toRAW()));
        this._storage.setItems(unitedFilms);
        return films;
      });
    }
    const storedFilms = Object.values(this._storage.getItems());
    return Promise.resolve(FilmModel.parseFilms(storedFilms));
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._storage.setItem(newFilm.id, newFilm.toRAW());
          return newFilm;
        });
    }
    const localFilm = FilmModel.clone(Object.assign(film, {id}));
    this._storage.setItem(id, localFilm.toRAW());
    this._syncIsNeeded = true;
    return Promise.resolve(localFilm);
  }

  getComments(id) {
    return this._api.getComments(id);
  }

  addComment(filmData, commentData) {
    return this._api.addComment(filmData, commentData);
  }

  deleteComment(id) {
    return this._api.deleteComment(id);
  }

  sync() {
    if (isOnline()) {
      const storedFilms = Object.values(this._storage.getItems());

      return this._api.sync(storedFilms)
        .then((response) => {
          const updatedFilms = createStorageStructure(response.updated);
          this._storage.setItems(updatedFilms);
          this._syncIsNeeded = false;
        });
    }
    return Promise.reject(`Sync data failed`);
  }
}
