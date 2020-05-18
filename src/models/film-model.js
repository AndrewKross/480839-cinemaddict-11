export default class FilmModel {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`];
    this.genres = data[`film_info`][`genre`];
    this.image = data[`film_info`][`poster`];
    this.age = data[`film_info`][`age_rating`];
    this.originalTitle = data[`film_info`][`alternative_title`];
    this.director = data[`film_info`][`director`];
    this.actors = data[`film_info`][`actors`];
    this.writers = data[`film_info`][`writers`];
    this.country = data[`film_info`][`release`][`release_country`];
    this.rating = data[`film_info`][`total_rating`];
    this.release = new Date(data[`film_info`][`release`][`date`]);
    this.duration = data[`film_info`][`runtime`];
    this.description = data[`film_info`][`description`];
    this.inWatchlist = Boolean(data[`user_details`][`watchlist`]);
    this.inHistory = Boolean(data[`user_details`][`already_watched`]);
    this.watchingDate = new Date(data[`user_details`][`watching_date`]);
    this.inFavorites = Boolean(data[`user_details`][`favorite`]);
    this.comments = data[`comments`];
  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }

  toRAW() {
    return {
      "id": this.id,
      "film_info": {
        "title": this.title,
        "genre": this.genres,
        "poster": this.image,
        "age_rating": this.age,
        "alternative_title": this.originalTitle,
        "director": this.director,
        "actors": this.actors,
        "writers": this.writers,
        "release": {
          "release_country": this.country,
          "date": this.release.toISOString()
        },
        "total_rating": this.rating,
        "runtime": this.duration,
        "description": this.description,
      },
      "user_details": {
        "watchlist": this.inWatchlist,
        "already_watched": this.inHistory,
        "watching_date": this.watchingDate ? this.watchingDate.toISOString() : null,
        "favorite": this.inFavorites
      },
      "comments": this.comments
    };
  }

  static clone(data) {
    return new FilmModel(data.toRAW());
  }
}
