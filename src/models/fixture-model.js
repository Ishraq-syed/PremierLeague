const mongoose = require('mongoose');
const Team = require('./team-model');

const goalDetailsSchema = new mongoose.Schema({
    minuteScored: {
        type: Number,
    }, 
    scorer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Player'
    },
    assister: {
        type: mongoose.Schema.ObjectId,
        ref: 'Player'
    },
    isPenalty: Boolean,
    isOwnGoal: Boolean,
}, {
    id: false,
    _id: false
});

const squadSchema = new mongoose.Schema({
    playing11:[{
        type: mongoose.Schema.ObjectId,
        ref: 'Player' 
    }],
    subs: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Player'
    }]
},
{
    id: false,
    _id: false
});

const changesSchema = new mongoose.Schema({
        playerIn: {
            type: mongoose.Schema.ObjectId,
            ref: 'Player'
        },
        playerOut: {
            type: mongoose.Schema.ObjectId,
            ref: 'Player'
        }
},
{
    id: false,
    _id: false
});

const cardsSchema = new mongoose.Schema({
    receiver: {
        type: mongoose.Schema.ObjectId,
        ref: 'Player'
    },
    minuteReceived: {
        type: Number
    }
},
{
    id: false,
    _id: false
});

const ratingsSchema = new mongoose.Schema({
    player: {
        type: mongoose.Schema.ObjectId,
        ref: 'Player'
    },
    rating: {
        type: Number
    }
},
{
    id: false,
    _id: false
});

const fixtureSchema = new mongoose.Schema({
    season: {
        type: mongoose.Schema.ObjectId,
        ref: 'Season',
        required: [true, 'A fixture must belong to a season']
    },
    date: {
        type: Date,
        required: [true, 'A fixture must have a date']
    },
    homeTeam: {
        type: mongoose.Schema.ObjectId,
        ref: 'Team',
        required: [true, 'A fixture must have a home team']
    },
    awayTeam: {
        type: mongoose.Schema.ObjectId,
        ref: 'Team',
        required: [true, 'A fixture must have an away team']
    },
    isPlayed: {
        type: Boolean,
        default: false
    },
    homeGoals: {
        type: Number,
        required: [true, 'A fixture must have home goals starting from 0']
    },
    awayGoals: {
        type: Number,
        required: [true, 'A fixture must have away goals starting from 0']
    },
    stats: {
        homeGoalStats: [goalDetailsSchema],
        awayGoalStats: [goalDetailsSchema],
        homeSquad: squadSchema,
        awaySquad: squadSchema,
        homeChanges: [changesSchema],
        awayChanges: [changesSchema],
        homeYellowCards: [cardsSchema],
        awayYellowCards: [cardsSchema],
        homeRedCards: [cardsSchema],
        awayRedCards: [cardsSchema],
        homePossesion: {
            type: Number
        },
        awayPossesion: {
            type: Number
        },
        homeShots: {
            type: Number
        },
        awayShots: {
            type: Number
        },
        homeShotsOnTarget: {
            type: Number
        },
        awayShotsOnTarget: {
            type: Number
        },
        homeCorners: {
            type: Number
        },
        awayCorners: {
            type: Number
        },
        motm: {
            type: mongoose.Schema.ObjectId,
            ref: 'Player' 
        },
        homePlayerRatings: [ratingsSchema],
        awayPlayerRatings: [ratingsSchema]
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

fixtureSchema.index([
    {
        homeTeam: 1,
    }, {
        awayTeam: 1
    }
]);

fixtureSchema.index({
    homeTeam: 1,
    awayTeam: 1
}, {
    unique: true
});

// fixtureSchema.post('save', async function() {
//         const updateHomeTeamStats = { 
//                                 $inc: 
//                                     {
//                                         matchesWon: this.homeGoals > this.awayGoals ? 1 : 0,
//                                         matchesLost: this.homeGoals < this.awayGoals ? 1 : 0,
//                                         matchesDrawn: this.homeGoals === this.awayGoals ? 1 : 0,
//                                         goalsFor: this.homeGoals,
//                                         goalsAgainst: this.awayGoals,
//                                     } 
//                                 }
//         await Team.findByIdAndUpdate(this.homeTeam, updateHomeTeamStats);

//         const updateAwayTeamStats = { 
//             $inc: 
//                 {
//                     matchesWon: this.homeGoals < this.awayGoals ? 1 : 0,
//                     matchesLost: this.homeGoals > this.awayGoals ? 1 : 0,
//                     matchesDrawn: this.homeGoals === this.awayGoals ? 1 : 0,
//                     goalsFor: this.awayGoals,
//                     goalsAgainst: this.homeGoals,
//                 } 
//             }
//         await Team.findByIdAndUpdate(this.awayTeam, updateAwayTeamStats);

// })

fixtureSchema.pre(/^find/, function(next) {
    this.populate([{
        path: 'homeTeam',
        select: 'name homeStadium'
    },
    {
        path: 'awayTeam',
        select: 'name'
    }, 
    {
        path: 'stats.homeGoalStats.scorer',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.homeGoalStats.assister',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.awayGoalStats.scorer',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.awayGoalStats.assister',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.homeSquad.playing11',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.homeSquad.subs',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.awaySquad.playing11',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.awaySquad.subs',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.homeChanges.playerIn',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.homeChanges.playerOut',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.awayChanges.playerIn',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.awayChanges.playerOut',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.homeYellowCards.receiver',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.awayYellowCards.receiver',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.homeRedCards.receiver',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.awayRedCards.receiver',
        select: 'firstName lastName'  
    },
    {
        path: 'stats.motm',
        select: 'firstName lastName'
    }
]);

    next();
});

// fixtureSchema.pre('aggregate', function(next) {
//     this.populate([{
//         path: 'homeTeam',
//         select: 'name homeStadium'
//     },
//     {
//         path: 'awayTeam',
//         select: 'name'
//     }, 
//     {
//         path: 'stats.homeGoalStats.scorer',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.homeGoalStats.assister',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.awayGoalStats.scorer',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.awayGoalStats.assister',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.homeSquad.playing11',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.homeSquad.subs',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.awaySquad.playing11',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.awaySquad.subs',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.homeChanges.playerIn',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.homeChanges.playerOut',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.awayChanges.playerIn',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.awayChanges.playerOut',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.homeYellowCards.receiver',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.awayYellowCards.receiver',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.homeRedCards.receiver',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.awayRedCards.receiver',
//         select: 'firstName lastName'  
//     },
//     {
//         path: 'stats.motm',
//         select: 'firstName lastName'
//     }
// ]);

//     next();
// });

const Fixture = mongoose.model('Fixture', fixtureSchema);

module.exports = Fixture;

