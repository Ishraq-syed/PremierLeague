
const DEFAULT_TEAM_STATS = {
    matchesLost: 0,
    matchesWon: 0,
    matchesDrawn: 0,
    goalsFor: 0,
    goalsAgainst: 0
}

const teamStatsReducer = (fixtures, type) => {
  return fixtures?.reduce((acc, fixture) => {
        if (fixture.homeGoals > fixture.awayGoals) {
            if (type === 'home') {
                acc.matchesWon += 1;
            } else {
                acc.matchesLost += 1;
            }
        } else if (fixture.homeGoals < fixture.awayGoals) {
            if (type === 'home') {
                acc.matchesLost += 1;
            } else {
                acc.matchesWon += 1;
            }
        } else {
            acc.matchesDrawn += 1;
        }
        acc.goalsFor += type === 'home' ? fixture.homeGoals : fixture.awayGoals;
        acc.goalsAgainst += type === 'home' ? fixture.awayGoals : fixture.homeGoals;
        return acc;
    }, Object.assign({}, DEFAULT_TEAM_STATS));
}

exports.calculateTeamStats = (teamsRes) => {
    return teamsRes?.map(team => {
        let homeGameDetails;
        let awayGameDetails;
        if (team.homeFixtures?.length) {
            homeGameDetails = teamStatsReducer(team.homeFixtures, 'home');
        }
        if (team.awayFixtures?.length) {
            awayGameDetails = teamStatsReducer(team.awayFixtures, 'away');
       }
       const finalStats = {
            matchesLost: ((homeGameDetails?.matchesLost || 0) + (awayGameDetails?.matchesLost || 0)),
            matchesWon: ((homeGameDetails?.matchesWon || 0) + (awayGameDetails?.matchesWon || 0)),
            matchesDrawn: ((homeGameDetails?.matchesDrawn || 0) + (awayGameDetails?.matchesDrawn || 0)),
            goalsFor: ((homeGameDetails?.goalsFor || 0) + (awayGameDetails?.goalsFor || 0)),
            goalsAgainst: ((homeGameDetails?.goalsAgainst || 0) + (awayGameDetails?.goalsAgainst || 0))
       }
       return {
            ...team.toObject(),
            ...finalStats,
            points: (finalStats.matchesWon * 3) + (finalStats.matchesDrawn * 1),
            matchesPlayed: finalStats.matchesWon + finalStats.matchesDrawn + finalStats.matchesLost,
            goalDifference: finalStats.goalsFor - finalStats.goalsAgainst
       }
    });
}