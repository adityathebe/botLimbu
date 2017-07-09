const request = require('request');
const cheerio = require('cheerio');
const BOT = require("../Template/templates");

const fetch = (sender) => {
    const url = 'http://www.qfxcinemas.com/';
	let movies = [];
	let upcomingMovies = [];
    let messageData = 'On Cinema\n\n';

    request(url, (error, response, body) => {
        if(!error) {
            /*=============== CHEERIO ================*/
            let $ = cheerio.load(body);
            $(".movie").each(function(i, elem) {
                let movie = $(this).find('h4').text();
                movies.push(movie);
            });
            upcomingMovies = movies.slice(6)
            movies = movies.slice(0, 6);
            for (var movie of movies) {
                messageData += movie + '\n';
            }
            messageData += '-------------------------------------\nComing Soon\n\n';
            for (var movie of upcomingMovies) {
                messageData += movie + '\n';
            }
            
            BOT.sendTextMessage(sender, messageData);
        }
    });
}

module.exports = {
    fetch
}