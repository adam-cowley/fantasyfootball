const neode = require('./neode');

// neode.schema.install()
//     .then(() => console.log('schema installed'))
//     .catch(e => console.log(e.errors[0]))

// const { slug } = require('./utils');

console.log(neode)

const FixtureScraper = require('./scrapers/FixtureScraper');

const scraper = new FixtureScraper(neode);

scraper.scrape( __dirname + '/../resources/skysports-premier-league-fixtures.html' )
    .then(res => {
        return Promise.all(res.map(row => {
            return neode.merge('Fixture', row);
        }));
    })

    .then(res => {
        console.log('Fixtures scraped', res.length);
    })


    .catch(e => console.log(e))
    .then(() => {
        neode.close();
    });