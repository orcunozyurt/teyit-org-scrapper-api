const request = require('request');
const cheerio = require('cheerio');
const baseURL = 'https://teyit.org'


module.exports = function (app) {
    app.get('/featured/', function (req, res) {
        // The scraping magic will happen here
        request(baseURL, function (error, response, html) {
            if (!error) {

                const $ = cheerio.load(html);
                const response_arr = [];

                let featuredNews = $('div.cb-grid-feature').each((index, element) => {
                    let link = $(element).children('.cb-link').attr('href');
                    let article_info = $(element).children('.cb-article-meta');
                    let author = $(article_info).children('.cb-byline').find('.cb-author').find('a').text();
                    let title = $(article_info).find('h2').find('a').text();
                    let date_unparsed = $(article_info).children('.cb-byline').find('.cb-date').text();
                    let date = date_unparsed.slice(0, 10) + "-" + date_unparsed.slice(10);
                    var identifier = link.replace('https://teyit.org/', '');
                    identifier = identifier.slice(0, identifier.length - 1)

                    let json = {
                        title: title,
                        url_slug: identifier,
                        author: author,
                        link: link,
                        date: date
                    };

                    response_arr.push(json);

                });

                console.log('RESPONSE', ": ", response_arr);

                res.send(response_arr);

            }
        });
    });

    app.get('/fact/:blob', function (req, res) {
        // The scraping magic will happen here
        blob = req.params.blob
        let url = baseURL + '/' + blob
        request(url, function (error, response, html) {
            if (!error) {

                const $ = cheerio.load(html);

                let header = $('.entry-title').text();
                let author = $('.cb-entry-header').find('.cb-byline').find('.cb-author').find('a').text();
                let date_unparsed = $('.cb-entry-header').find('.cb-date').text();
                let date = date_unparsed.slice(0, 10) + "-" + date_unparsed.slice(10);
                let iddia_box = $('.iddia_box').attr('class').split(' ');
                let iddia_text = $('.iddia_box').find('span').text();
                let result = iddia_box[1];
                let text = $('.cb-itemprop').find('p').text();

                let json = {
                    title: header,
                    claim: iddia_text,
                    author: author,
                    result: result,
                    date: date,
                    content: text
                };

                console.log('RESPONSE', ": ", json);

                res.send(json);
                //res.send("identifier is set to " + req.params.blob);

            }
        });
    });
};