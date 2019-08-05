const cheerio = require('cheerio');
const request = require('request');

const scrape = (url) =>  {
    return new Promise((resolve, reject) => {
        request(url, function (error, response, html) {
            if ( error ) {
                return reject(error);
            }

            const $ = cheerio.load(html);
            return resolve($);
        });
    });
}

const scrapeFile = (filename) => {
    const contents = require('fs').readFileSync(filename, 'utf8');
    return Promise.resolve(cheerio.load(contents));
}


class Scraper {
    scrapeUrl(url) {
        return scrape(url);
    }

    scrapeFile(filename) {
        return scrapeFile(filename);
    }
}


module.exports = Scraper;