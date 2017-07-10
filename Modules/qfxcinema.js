const request = require('request');
const BOT = require("../Template/templates");

const fetch = (sender) => {
    const url = 'https://qfx-nepal.herokuapp.com/';
    let moviesPayload = [];
    let upcomingMoviesPayload = [];

    request({url, json:true}, (error, response, body) => {
        if(!error) {
            let movies = body.onCinema;
            let upcoming = body.upcomingMovies;
            
            for (let i = 0; i < movies.length; i++) {
                moviesPayload.push({
                    title: movies[i].title,
                    subtitle : movies[i].type,
                    img_url : movies[i].image,
                    url : movies[i].book,
                    btnTitle : 'Book Ticket'
                })
            }

            for (let j= 0; j< upcoming.length; j++) {
                upcomingMoviesPayload.push({
                    title: upcoming[j].title,
                    subtitle : 'Realeasing on: ' + upcoming[j].date,
                    img_url : upcoming[j].image,
                    url : upcoming[j].image,
                    btnTitle : 'See Poster'
                })
            }
            
            BOT.sendTextMessage(sender, 'On Cinema: ').then(() => {
                BOT.sendGenericMessage(sender, moviesPayload).then(() => {
                    BOT.sendTextMessage(sender, 'Coming Soon: ').then(() => {
                        BOT.sendGenericMessage(sender, upcomingMoviesPayload).then((msg) => {
                            console.log(msg);
                        });
                    });                    
                });
            });

        } else {
            BOT.sendTextMessage(sender, 'Sorry, could not connect to the server.\nPlease try again later');
        }
    });
}

module.exports = {
    fetch
}