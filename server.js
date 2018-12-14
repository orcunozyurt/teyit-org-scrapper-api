const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const app     = express();
const baseURL = 'https://teyit.org'

app.get('/featured/', function(req, res){
    // The scraping magic will happen here
    request(baseURL, function(error, response, html) {
        if (!error) {

            const $ = cheerio.load(html);
            const response_arr = [];

            let featuredNews = $('div.cb-grid-feature').each((index, element) => {
                let link = $(element).children('.cb-link').attr('href');
                let article_info = $(element).children('.cb-article-meta');
                let author = $(article_info).children('.cb-byline').find('.cb-author').find('a').text();
                let title = $(article_info).find('a').text();
                let date_unparsed = $(article_info).children('.cb-byline').find('.cb-date').text();
                let date = date_unparsed.slice(0, 10) + "-" + date_unparsed.slice(10);
                var identifier = link.replace('https://teyit.org/','');
                identifier = identifier.slice(0,identifier.length-1)

                let json = {
                    title: title,
                    identifier: identifier,
                    author: author,
                    link: link,
                    date: date
                };

                response_arr.push(json);

            });

            console.log('RESPONSE',": ", response_arr);

            res.send(response_arr);
            
        }
    });
});
app.get('/fact/:blob', function(req, res){
    // The scraping magic will happen here
    blob = req.params.blob
    let url = baseURL + '/' + blob
    request(url, function(error, response, html) {
        if (!error) {

            const $ = cheerio.load(html);
            const response_arr = [];

            let header = $('.entry-title').text();
            let author = $('.cb-author').find('a').text();
            let date_unparsed = $('.cb-entry-header').find('.cb-date').text();
            let date = date_unparsed.slice(0, 10) + "-" + date_unparsed.slice(10);
            response_arr.push(date);

            console.log('RESPONSE',": ", response_arr);

            res.send(response_arr);
            //res.send("identifier is set to " + req.params.blob);
            
        }
    });
});
app.listen('8080');
console.log('API is running on http://localhost:8080');
module.exports = app;

