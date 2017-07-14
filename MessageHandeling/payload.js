const BOT       = require("../Template/templates");
const Kantipur  = require('../Modules/kantipur');
const KU        = require('../Modules/ku');
const replies   = require('../data/replies');

const handle = (sender, payload) => {
    BOT.sendTypingOn(sender);
    switch (payload) {
        case 'GET_STARTED_PAYLOAD':
            BOT.myGenericReply(sender, replies[3]);
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
    }
};

module.exports = {
    handle
}