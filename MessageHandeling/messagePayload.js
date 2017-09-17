const BOT       = require("../Template/templates");
const Coin          = require('../Modules/coin');
const Entertain     = require('../Modules/entertain');
const QFX           = require('../Modules/qfxcinema');

const PAYLOAD_OPTIONS = {
    'PL_flipcoin' : (sender) => Coin.flip(sender),
    'PL_joke' : (sender) => Entertain.sendJoke(sender),
    'PL_fact' : (sender) => Entertain.sendFact(sender),
    'PL_quote' : (sender) => Entertain.sendQuote(sender),
    'PL_onCinema' : (sender) => QFX.fetch(sender, 'onCinema'),
    'PL_comingSoon' : (sender) => QFX.fetch(sender, 'comingSoon'),
}

const handleMessagePayload = (sender, payload) => {
    BOT.sendTypingOn(sender);
    typeof(payload) !== 'undefined' ? PAYLOAD_OPTIONS[payload](sender) : console.log('Unknown Payload - QuickReplies');
};

module.exports = handleMessagePayload;