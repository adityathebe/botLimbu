const BOT = require("../Template/templates");
const Feed = require("rss-to-json");
const request = require('request');

const news = (sender) => {
    let url = "https://ku-gex.herokuapp.com/";
    request({url: url, json: true}, (error, response, body) => {
        if(!error)  {
            body = body.slice(0, 4);
            let payload = [];
            for (var i = 0; i < body.length; i++) {
                payload.push({
                    title: body[i].title,
                    subtitle: body[i].date,
                    url: body[i].permalink,
                    img_url: body[i].img_src
                })
            }
            BOT.sendGenericMessage(sender, payload);
        }
        else {
            BOT.sendTextMessage(sender, "Couldn't connect to the server.\nPlease try again later");  
        }
    })
}

const result = (sender) => {
    Feed.load('http://www.ku.edu.np/exam/?feed=rss2', (error, rss) => {
        if(!error) {
            let body = rss.items.slice(0, 5);
            let result = [];
            for (var i = 0; i < body.length; i++) {
                let date = new Date(body[i].created)
                result.push({
                    title: body[i].title,
                    subtitle: "Published on: " + (date.toString("MMM dd")).substring(0,15),
                    url: body[i].link,
                    img_url: "http://i.imgur.com/RPUDbs3.jpg",
                })
            }
            BOT.sendGenericMessage(sender, result);
        } else {
            BOT.sendTextMessage(sender, "Couldn't connect to the server.\nPlease try again later");  
        }
    });
}

module.exports = {
    news,
    result
}