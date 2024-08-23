const mongoose = require('mongoose');

const seasonsSchema = new mongoose.Schema({
    season: {
        type: String,
        unique: true,
        required: [true, 'Cannot create a season without season field']
    }
});

const Season = mongoose.model('Season', seasonsSchema);

module.exports = Season;