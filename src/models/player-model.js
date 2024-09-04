const mongoose = require('mongoose');
const APP_CONSTANTS = require('../constants');

const playerSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Cannot create a player without a first name field']
    },
    lastName: {
        type: String
    },
    team: {
        type: mongoose.Schema.ObjectId,
        ref: 'Team',
        required: [true, 'A Player must belong to a team']
    },
    jerseyNumber: {
        type: Number,
        required: [true, 'A Player must have a jersey number']
    },
    image: String,
    position: {
        type: String,
        enum:{
            values: APP_CONSTANTS.PLAYER_POSITIONS,
            message: `This is not a valid position. Please choose from ${APP_CONSTANTS.PLAYER_POSITIONS.toString()}`
        }
    },
    goals: {
        type: Number,
        default: 0
    },
    assists: {
        type: Number,
        default: 0
    },
    motm: {
        type: Number,
        default: 0
    },
    cleanSheets: {
        type: Number,
        validate: {
            validator: function(val) {
                console.log('this', this.position)
                return this.position === 'GK'
            },
            message: 'Clean sheets are only associated with Goal Keepers'
        }
    },
    yellowCards: {
        type: Number,
        default: 0
    },
    redCards: {
        type: Number,
        default: 0
    },
    matchesPlayer: {
        type: Number,
        default: 0
    }
});

playerSchema.index({
    team: 1,
    jerseyNumber: 1
}, {
    unique: true,
});


const Player = mongoose.model('Player', playerSchema);

module.exports = Player;