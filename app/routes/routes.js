const request = require("request");
const puppeteer = require("puppeteer");
const cheerio = require("cheerio");
const baseURL = "https://teyit.org";

function handleMainPageHtmlResponse(body) {
  const response_arr = [];

  const $ = cheerio.load(body);
  let landingPage = $(".main-page-content");
  let articlesContainer = landingPage.find(".feed-box");
  let articles = articlesContainer.find(".container");

  let featuredNews = articles.each((index, element) => {
    let link = $(element).find("a").attr("href");
    let title = $(element).find(".feed-title").text();
    let description = $(element).find(".feed-summary").text();
    let thumbnail = $(element).find("img").attr("src");
    let author = $(element).find(".feet-author").text();
    let date = $(element).find(".feed-date").text();
    let abslink = "https://teyit.org" + link;
    let identifier = link.substring(1);

    let json = {
      thumbnail: thumbnail,
      title: title,
      url_slug: identifier,
      author: author,
      link: abslink,
      date: date,
    };

    response_arr.push(json);
  });

  return response_arr;
}

module.exports = function (app) {
  app.get("/all", function (req, res) {
    // The scraping magic will happen here
    lang = req.query.lang;
    let url = baseURL;
    if (lang === "eng" || lang === "en") {
      url = baseURL + "/" + "eng";
    }

    puppeteer
      .launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      })
      .then(function (browser) {
        return browser.newPage();
      })
      .then(function (page) {
        return page
          .goto(url, {
            waitUntil: "networkidle0",
          })
          .then(function () {
            return page.content();
          });
      })
      .then(function (html) {
        var parsed = handleMainPageHtmlResponse(html);
        res.send(parsed);
      })
      .catch(function (err) {
        res.send({ error: err });
      });
  });

  app.get("/fact/:slug", function (req, res) {
    // The scraping magic will happen here
    slug = req.params.slug;
    let url = baseURL + "/" + slug;
    request(url, function (error, response, html) {
      if (!error) {
        let proven = null;
        const $ = cheerio.load(html);
        const image_arr = [];
        let text = "";
        let image_containers = [];

        let header = $(".entry-title").text();
        let author = $(".cb-entry-header")
          .find(".cb-byline")
          .find(".cb-author")
          .find("a")
          .text();
        let date_unparsed = $(".cb-entry-header").find(".cb-date").text();
        let date = date_unparsed.slice(0, 10) + "-" + date_unparsed.slice(10);
        let iddia_text = $(".iddia_box").find("span").text();
        if ($(".iddia_box").attr("class")) {
          let iddia_box = $(".iddia_box").attr("class").split(" ");
          let result = iddia_box[1];
          if (result === "dogru" || result === "true") {
            proven = true;
          } else {
            proven = false;
          }
        }
        if ($(".cb-itemprop").attr("class")) {
          text = $(".cb-itemprop").find("p").text();
          image_containers = $(".cb-itemprop").children(".cb-alert");
        } else {
          text = $(".cb-entry-content").find("p").text();
          image_containers = $(".cb-entry-content").children(".cb-alert");
        }
        image_containers.each((index, element) => {
          let imageUrl = $(element).find("img").attr("src");
          image_arr.push(imageUrl);
        });

        let json = {
          title: header,
          claim: iddia_text,
          author: author,
          proven: proven,
          images: image_arr,
          date: date,
          content: text,
        };
        res.send(json);
      }
    });
  });
};
