const BOT       = require("../Template/templates");
const Kantipur  = require('../Modules/kantipur');
const KU        = require('../Modules/ku');
const replies   = require('../data/replies');

const {subscribe}   = require('../utility/subscription');
const {unsubscribe}   = require('../utility/subscription');

const handle = (sender, payload) => {
    BOT.sendTypingOn(sender);
    switch (payload) {
        case 'GET_STARTED_PAYLOAD':
            BOT.getUserData(sender).then((data) => {
                BOT.sendTextMessage(sender, `Hi ${data.first_name}. ${replies[3]}`);
            }, (errMsg) => {
                console.log(errMsg);
            });
            break;

        case 'PL_kantipurNews':
            Kantipur.news(sender);
            break;

        case "PL_kuNews":
            KU.news(sender);
            break;

        case "PL_KuResult":
            KU.result(sender);
            break;

        case 'PL_subscribe':
            subscribe(sender);
            break;
    
        case 'PL_unsub':
            unsubscribe(sender);
            break;
    }
};

module.exports = {
    handle
}