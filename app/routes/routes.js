const request = require('request');
const cheerio = require('cheerio');
const baseURL = 'https://teyit.org'


module.exports = function (app) {
    app.get('/all', function (req, res) {
        // The scraping magic will happen here
        lang = req.query.lang
        let url = baseURL
        if (lang === 'eng' || lang === 'en') {
            url = baseURL + '/' + 'eng'
        }
        request(url, function (error, response, html) {
            if (!error) {
                const $ = cheerio.load(html);
                const response_arr = [];
                let landingPage = $('div.cb-main');
                let articles = landingPage.find('.cb-article');

                if (lang === 'eng' || lang === 'en') {
                    articles = $('div.cb-grid-feature');
                }

                let featuredNews = articles.each((index, element) => {
                    var link;
                    var article_info;

                    if (lang === 'eng' || lang === 'en') {
                        link = $(element).children('.cb-link').attr('href');
                        article_info = $(element).children('.cb-article-meta');
                    } else {
                        link = $(element).find('.cb-post-title').find('a').attr('href');
                        article_info = $(element).children('.cb-meta');
                    }
                    let author = $(article_info).children('.cb-byline').find('.cb-author').find('a').text();
                    let title = $(article_info).find('h2').find('a').text();
                    let date_unparsed = $(article_info).children('.cb-byline').find('.cb-date').text();
                    let date = date_unparsed.slice(0, 10) + "-" + date_unparsed.slice(10);
                    var identifier = link.replace('https://teyit.org/', '');
                    identifier = identifier.replace('en/', '');
                    identifier = identifier.slice(0, identifier.length - 1)
                    let thumbnail = $(element).find('img').attr('src');

                    let json = {
                        thumbnail: thumbnail,
                        title: title,
                        url_slug: identifier,
                        author: author,
                        link: link,
                        date: date
                    };

                    response_arr.push(json);
                });
                res.send(response_arr);
            }
        });
    });

    app.get('/fact/:slug', function (req, res) {
        // The scraping magic will happen here
        slug = req.params.slug
        let url = baseURL + '/' + slug
        request(url, function (error, response, html) {
            if (!error) {
                let proven = null;
                const $ = cheerio.load(html);
                const image_arr = [];
                let text = ''
                let image_containers = [];

                let header = $('.entry-title').text();
                let author = $('.cb-entry-header').find('.cb-byline').find('.cb-author').find('a').text();
                let date_unparsed = $('.cb-entry-header').find('.cb-date').text();
                let date = date_unparsed.slice(0, 10) + "-" + date_unparsed.slice(10);
                let iddia_text = $('.iddia_box').find('span').text();
                if ($('.iddia_box').attr('class')) {
                    let iddia_box = $('.iddia_box').attr('class').split(' ');
                    let result = iddia_box[1];
                    if (result === 'dogru' || result === 'true') {
                        proven = true;
                    } else {
                        proven = false;
                    }
                }
                if ($('.cb-itemprop').attr('class')) {
                    text = $('.cb-itemprop').find('p').text();
                    image_containers = $('.cb-itemprop').children('.cb-alert');
                } else {
                    text = $('.cb-entry-content').find('p').text();
                    image_containers = $('.cb-entry-content').children('.cb-alert');
                }
                image_containers.each((index, element) => {
                    let imageUrl = $(element).find('img').attr('src');
                    image_arr.push(imageUrl);
                });


                let json = {
                    title: header,
                    claim: iddia_text,
                    author: author,
                    proven: proven,
                    images: image_arr,
                    date: date,
                    content: text
                };
                res.send(json);

            }
        });
    });
};