const BOT       = require("../Template/templates");
const KU        = require('../Modules/ku');
const sendKantipurNews  = require('../Modules/kantipur');

const {subscribe}   = require('../utility/subscription');
const {unsubscribe} = require('../utility/subscription');

const PAYLOAD_OPTIONS = {
    'GET_STARTED_PAYLOAD' : (sender) => { 
        BOT.getUserData(sender).then((data) => {
            BOT.sendTextMessage(sender, `Hi ${data.first_name}. ${replies[3]}`);
        }, (errMsg) => {
            BOT.sendTextMessage(sender, `Hi there. ${replies[3]}`);
        });
    },
    'PL_kantipurNews' : (sender) => sendKantipurNews(sender),
    'PL_kuNews' : (sender) => KU.news(sender),
    'PL_KuResult' : (sender) => KU.result(sender),
    'PL_subscribe' : (sender) => subscribe(sender),
    'PL_unsub' : (sender) => unsubscribe(sender),
}

const handlePayload = (sender, payload) => {
    BOT.sendTypingOn(sender);
    PAYLOAD_OPTIONS[payload](sender);
};

module.exports = handlePayload;