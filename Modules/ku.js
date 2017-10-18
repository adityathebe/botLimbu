const BOT = require("../Template/templates");
const Feed = require("rss-to-json");

const news = (sender) => {
    const url = 'http://www.ku.edu.np/news/rss.php?blogId=1&profile=rss20';
    Feed.load(url, (error, rss) => {
        if (error) 
            return BOT.sendTextMessage(sender, "Couldn't connect to the server.\nPlease try again later");

        let body = rss.items.map((res) => {
            let date = new Date(res.created);
            res.created = date.toString("MMM dd").substring(0, 15);
            delete res.link;
            return res;
        }).splice(0, 4);

        let payload = [];
        body.forEach((news) => {
            payload.push({
                title: news.title,
                subtitle: news.created,
                url: news.url,
                img_url: "http://i.imgur.com/RPUDbs3.jpg"
            })
        });
        BOT.sendGenericMessage(sender, payload);
    });
}

const result = (sender) => {
    Feed.load('http://www.ku.edu.np/exam/?feed=rss2', (error, rss) => {
        if(!error) {
            let body = rss.items.slice(0, 5);
            let result = [];
            body.forEach((res) => {
                let date = new Date(res.created)
                result.push({
                    title: res.title,
                    subtitle: "Published on: " + (date.toString("MMM dd")).substring(0,15),
                    url: res.link,
                    img_url: "http://i.imgur.com/RPUDbs3.jpg",
                })
            });
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