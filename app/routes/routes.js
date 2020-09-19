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

function handleDetailPageHtmlResponse(body) {
  const $ = cheerio.load(body);

  let image_arr = [];

  let header = $("title").text();
  let author = $(".author-box").find("p").first().text();
  let isFraudImageSrc = $(".fraud-type-img").attr("src");
  let proven = isFraudImageSrc.includes("dogru");
  let date = $(".post-metadata-group").find(".ml-1").text();
  let content = $(".evidence-group").find("p").text();
  let image = $(".visual-summary-correctness").find("img").attr("src");
  image_arr.push(image);

  let json = {
    title: header,
    claim: header,
    author: author,
    proven: proven,
    images: image_arr,
    date: date,
    content: content,
  };

  console.log(json);

  return json;
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
    slug = req.params.slug;
    let url = baseURL + "/" + slug;

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
        var parsed = handleDetailPageHtmlResponse(html);
        res.send(parsed);
      })
      .catch(function (err) {
        res.send({ error: err });
      });
  });
};
