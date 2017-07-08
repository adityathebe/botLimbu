const BOT = require("../Template/templates");
const request = require("request");

let url = "http://www.ekantipur.com/newsdigest/english";

const news = (sender) => {
    let news = [];
    request({url: url, json: true}, (error, response, body) => {
        if(!error)  {
            let selectedCategory = body.breaking_news;
            selectedCategory = selectedCategory.slice(0, 4);
            for (var i = 0; i < selectedCategory.length; i++) {
                news.push({
                    "title": selectedCategory[i].title,
                    "subtitle" : selectedCategory[i].summary,
                    "img_url" : selectedCategory[i].thumbnail,
                    "url" : selectedCategory[i].url 
                })
            }
        }
        request({url: url, json: true}, function (error, response, body) {
            if(!error)  {
                let selectedCategory = body.top_shared_news;
                selectedCategory = selectedCategory.slice(0, 4);
                for (var i = 0; i < selectedCategory.length; i++) {
                    news.push({
                        "title": selectedCategory[i].title,
                        "subtitle" : selectedCategory[i].summary,
                        "img_url" : selectedCategory[i].thumbnail,
                        "url" : selectedCategory[i].url 
                    })
                }

                // Remove articles whose thumbnail isn't provided
                news = news.filter( (obj) => { 
                    if(obj.img_url != '')
                        return true;
                });
                BOT.sendGenericMessage(sender, news);
            } else {
                BOT.sendTextMessage(sender, "The website's down.\nPlease try again later");  
            }
        })
    })
}

module.exports = {
    news
}