const moment = require('moment');

const Scraper = require('./Scraper');
const { slug, lpad } = require('../utils');

const months = {
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12',
}

class FixtureScraper extends Scraper {

    constructor(neode) {
        super();

        this.neode = neode;
    }

    scrape(url) {
        return this.scrapeFile(url)
            .then($ => {
                const output = {};

                let day = null;
                let month = null;

                $('.fixres__body').children().each((index, div) => {
                    div = $(div);

                    if ( div.hasClass('fixres__header1') ) {
                        month = div.html();
                    }
                    else if ( div.hasClass('fixres__header2') ) {
                        day = div.html();
                        output[ month + day ] = [];

                    }
                    else if ( div.hasClass('fixres__item') ) {
                        const fixture = this.getFixture(month, day, div);

                        output[ month + day ].push( fixture );
                    }
                })

                return Object.values(output)
                    .reduce((acc, val) => {
                        return acc.concat(val)
                    }, []);
            });
    }

    getFixture(month, day, el) {
        const guid = this.getGuid(el);

        const output = {
            id: guid.split('/').reverse()[0],
            guid,
            kickoff: this.getKickoff(month, day, el),

            drawOdds: this.getDrawOdds(el),

            homeTeam: {
                goals: this.getHomeGoals(el),
                odds: this.getHomeOdds(el),
                team: {
                    id: slug(this.getHomeTeam(el)),
                },
            },
            awayTeam: {
                goals: this.getAwayGoals(el),
                odds: this.getAwayOdds(el),
                team: {
                    id: slug(this.getAwayTeam(el)),
                },
            },
        }

        return output;
    }

    getKickoff(month, day, el) {
        const time = el.find('.matches__date').html().replace(/([^0-9:]+)/g, '');

        const [ MMMM, YYYY, dddd, Do, _MMMM, hhmm, ] = `${month} ${day} ${time}`.split(' ');

        return new Date(`${ YYYY }-${ months[ MMMM ] }-${lpad( Do.replace(/[^0-9]+/, '') ) }T${hhmm}:00`)
    }

    getGuid(el) {
        return el.children('a').first().attr('href')
    }

    getTeamName(el, index) {
        return el.find('.matches__item-col.matches__participant.matches__participant--side' + index).find('.swap-text__target').html();
    }

    getHomeTeam(el) {
        return this.getTeamName(el, 1);
    }

    getAwayTeam(el) {
        return this.getTeamName(el, 2);
    }

    getGoals(el, index) {
        const container = el.find('.matches__teamscores-side');
        const raw = index == 0 ? container.first().html() : container.last().html();

        return raw.replace(/([^0-9+])/g, '');
    }

    getHomeGoals(el) {
        return this.getGoals(el, 0);
    }

    getAwayGoals(el) {
        return this.getGoals(el, 1);
    }

    getHomeOdds(el) {
        return this.getOdds(el, 1);
    }

    getDrawOdds(el) {
        return this.formatOdds( el.find(`.matches__betting-col:not(.matches__betting-col--side1, .matches__betting-col--side2)`).text() );
    }

    getAwayOdds(el) {
        return this.getOdds(el, 2);
    }

    getOdds(el, index) {
        return this.formatOdds( el.find(`.matches__betting-col--side${index}`).text() );
    }


    formatOdds(odds) {
        const matches = odds.match(/([0-9]+)\/([0-9])+/);

        if ( matches ) {
            return matches[0];
        }

        return null;
    }


}

module.exports = FixtureScraper;