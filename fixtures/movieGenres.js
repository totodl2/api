const entries = [{ movieId: 1, genreId: 1 }, { movieId: 1, genreId: 2 }];

module.exports = entries.map(data => ({ model: 'MovieGenre', data }));
