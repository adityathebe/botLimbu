const request = require('request');
const BOT = require("../Template/templates");

const choice = (sender) => {
    BOT.sendQuickReplies(sender, { 
        text : 'Choose one of the following',
        element : [
            {
                "content_type"  : "text",
                "title"         : 'On Cinema',
                "payload"       : 'PL_onCinema'
            },
            {
                "content_type"  : "text",
                "title"         : 'Coming Soon',
                "payload"       : 'PL_comingSoon'
            }
        ]
    }).then((msg) => {
        console.log(msg);
    },(errMsg) => {
        console.log(errMsg);
    });
};

const fetch = (sender, option) => {
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
                    subtitle : 'Releasing on: ' + upcoming[j].date,
                    img_url : upcoming[j].image,
                    url : upcoming[j].image,
                    btnTitle : 'See Poster'
                })
            }
            
            if(option === 'onCinema') {
                BOT.sendTextMessage(sender, 'On Cinema: ').then(() => {
                    return BOT.sendGenericMessage(sender, moviesPayload);
                }).then((msg) => {
                    console.log(msg);
                }).catch((errMsg) => {
                    console.log(errMsg);
                });                  
            } else if (option === 'comingSoon') {
                BOT.sendTextMessage(sender, 'Coming Soon: ').then(() => {
                    return BOT.sendGenericMessage(sender, upcomingMoviesPayload);
                }).then((msg) => {
                    console.log(msg);
                }).catch((errMsg) => {
                    console.log(errMsg);
                });
            }
        } else {
            BOT.sendTextMessage(sender, 'Sorry, could not connect to the server.\nPlease try again later');
        }
    });
}

module.exports = {
    fetch,
    choice
}