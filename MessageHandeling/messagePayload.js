const BOT           = require("../Template/templates");
const Coin          = require('../Modules/coin');
const Nude          = require('../Modules/nude');
const Entertain     = require('../Modules/entertain');
const News          = require('../Modules/news');
const QFX           = require('./Modules/qfxcinema');

const newsKeyWord = ['bbc-news','bbc-sport','cnn','hacker-news','mashable','techcrunch'];

const handle = (sender, payload) => {
    if(newsKeyWord.indexOf(payload) >= 0) {
        News.display(sender, payload);
    } else if(payload === 'PL_flipcoin') {
        Coin.flip(sender);
    } else if (payload === 'PL_adult') {
        Nude.send(sender);
    } else if (payload === 'PL_joke') {
        Entertain.sendJoke(sender);
    } else if (payload === 'PL_fact') {
        Entertain.sendFact(sender);
    } else if (payload === 'PL_onCinema') {
        QFX.fetch(sender, 'onCinema');
    } else if (payload === 'PL_comingSoon') {
        QFX.fetch(sender, 'comingSoon');
    } else {
        console.log('Unknown Payload - QuickReplies');
    }
};

module.exports = { handle }