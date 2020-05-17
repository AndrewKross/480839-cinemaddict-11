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
    this.inWatchlist = data[`user_details`][`watchlist`];
    this.inHistory = data[`user_details`][`already_watched`];
    this.watchingDate = new Date(data[`user_details`][`watching_date`]);
    this.inFavorites = data[`user_details`][`favorite`];
    this.comments = data[`comments`];
  }

  static parseFilm(data) {
    return new FilmModel(data);
  }

  static parseFilms(data) {
    return data.map(FilmModel.parseFilm);
  }
}
