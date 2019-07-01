console.log('this is loaded');

exports.spotify = {
    id: process.env.SPOTIFY_ID,
    secret: process.env.SPOTIFY_SECRET,
};

exports.bands = {
    id: process.env.BANDS_ID
};

exports.movies = {
    id: process.env.MOVIES_ID
}
/* const db = require('db')
db.connect({
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS
}) */