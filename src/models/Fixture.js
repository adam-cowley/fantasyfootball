module.exports = {
    guid: {
        type: 'string',
        primary: true,
    },
    kickoff: {
        type: 'datetime',
        indexed: true,
    },
    homeTeam: {
        type: 'relationship',
        relationship: 'HOME_TEAM',
        direction: 'out',
        target: 'Team',
        alias: 'team',
        properties: {
            goals: 'integer',
            odds: 'string',
        },
    },
    awayTeam: {
        type: 'relationship',
        relationship: 'AWAY_TEAM',
        direction: 'out',
        target: 'Team',
        alias: 'team',
        properties: {
            goals: 'integer',
            odds: 'string',
        },

    },
}