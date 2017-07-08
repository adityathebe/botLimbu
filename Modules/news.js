const newsAPI = process.env.News_API;

const BOT = require("../Template/templates");
const request = require('request');

const display = (sender, newsSource) => {
    let url = `https://newsapi.org/v1/articles?source=${newsSource}&sortBy=top&apiKey=${newsAPI}`;
    console.log(url);
    request({url: url, json: true}, (error, response, body) => {
        if(!error) {
            let articles = body.articles;
            articles = articles.slice(0, 5);
            let payload = [];
            for (var i = 0; i < articles.length; i++) {
                payload.push({
                    title   : articles[i].title,
                    subtitle : articles[i].description,
                    img_url : articles[i].urlToImage,
                    url     : articles[i].url
                })
            }
            BOT.sendGenericMessage(sender, payload);
        }
    });
}

module.exports = {
    display
}