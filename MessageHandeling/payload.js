const BOT       = require("../Template/templates");
const Kantipur  = require('../Modules/kantipur');
const KU        = require('../Modules/ku');
const replies   = require('../data/replies');

const handle = (sender, payload) => {
    BOT.sendTypingOn(sender);
    switch (payload) {
        case 'GET_STARTED_PAYLOAD':
            BOT.getUserData(sender).then((data) => {
                return BOT.sendGenericReply(sender, 'Hi ' + data.first_name + '\n' + replies[3]);
            }).catch((errMsg) => {
                BOT.sendTextMessage(sender, errMsg);
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
    }
};

module.exports = {
    handle
}