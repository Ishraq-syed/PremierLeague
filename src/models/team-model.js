const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    season: {
        type: mongoose.Schema.ObjectId,
        ref: 'Season',
        required: [true, 'A team must belong to a Season']
    },
    name: {
        type: String,
        required: [true, 'Name is required to create a team']
    },
    teamLogo: {
        type: String
    },
    homeStadium: {
        type: String,
        required: [true, 'Home Stadium is required to create a team']
    },
    kits: {
        homeKit: {
            type: String,
        },
        awayKit: {
            type: String,
        },
        thirdKit: {
            type: String,
        }
    },
    manager: {
        type: String,
        required: [true, 'Manager is required to create a team']
    }
},
{
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

teamSchema.index({
    season: 1,
    name: 1
}, {
    unique: true
});

teamSchema.virtual('homeFixtures', {
    ref: 'Fixture',
    foreignField: 'homeTeam',
    localField: '_id'
});

teamSchema.virtual('awayFixtures', {
    ref: 'Fixture',
    foreignField: 'awayTeam',
    localField: '_id'
});
//Virtual properties not to be saved in DB. Just to send to client
// teamSchema.virtual('points').get(function() {
//     return (this.matchesWon * 3) + (this.matchesDrawn * 1)
// });

// teamSchema.virtual('matchesPlayed').get(function() {
//     return this.matchesWon + this.matchesDrawn + this.matchesLost;
// });

// teamSchema.pre('find', function(next) {
//     this.sort({
//         points: 1,

//     });
//     next();
// });

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;