/* ============ Message samples ============= */
const BOT = require('../Template/templates');

/* ================= Tasks ================== */
const Coin          = require('../Modules/coin');
const Entertain     = require('../Modules/entertain')
const Kantipur      = require('../Modules/kantipur');
const KU            = require('../Modules/ku');
const QFX           = require('../Modules/qfxcinema');
const Weather       = require('../Modules/weather');
const sendCommands  = require('../Modules/sendCommands');

const INTENT_OPTIONS = {
    'ku-news': (sender) => KU.news(sender),
    'ku-result' : (sender) => KU.result(sender),
    'flip-coin' : (sender) => Coin.flip(sender),
    'get-movies' : (sender) => QFX.choice(sender),
    'local-news': (sender) => Kantipur.news(sender),
    'my-functions': (sender) => sendCommands(sender),
    'quote': (sender) => Entertain.sendQuote(sender),
    'tell-joke': (sender) => Entertain.sendJoke(sender),
    'tell-facts': (sender) => Entertain.sendFact(sender),
    'get-weather': (sender, ai_data) => {
            if(!ai_data.incomplete) {
                let address = ai_data.parameters['geo-city'][0];
                address = address.trim();
                if(address !== '') {
                    Weather.forecast(sender, address);
                } else {
                    BOT.sendTextMessage(sender, 'Please enter an address.\nExample: kathmandu weather, weather kalinchowk').then ((msg) => {
                        console.log(msg);
                    });
                }
            } else {
                BOT.sendTextMessage(sender, ai_data.speech);
            }
    },
    'creator': (sender) => {
        var aditya =   [{
            title: "Aditya Thebe",
            subtitle: "Coolest Person on earth",
            img_url: "http://i.imgur.com/AI4znI6.jpg",
            url: "http://adityathebe.com",
            btn_title: "Check out his blog"
        }]
        BOT.sendGenericMessage(sender, aditya);
    },
};

const handleIntent = (sender, ai_data) => {
    const intent = ai_data.intent;
    typeof(INTENT_OPTIONS[intent]) === 'undefined' ? BOT.sendTextMessage(sender, "Figuring it out!") : INTENT_OPTIONS[intent](sender, ai_data);
};

module.exports = handleIntent;