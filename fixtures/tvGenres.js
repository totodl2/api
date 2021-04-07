const entries = [{ tvId: 42, genreId: 1 }, { tvId: 42, genreId: 2 }];

module.exports = entries.map(data => ({ model: 'TvGenre', data }));
