const BOT       = require("../Template/templates");
const Kantipur  = require('./Modules/kantipur');
const KU        = require('./Modules/ku');
const replies   = require('./data/replies');

const myGenericReply = (sender, data) => {
    let randomNumber = random.integer(0, data.length - 1);
    let message = data[randomNumber];
    BOT.sendTextMessage(sender, message);
}

const handle = (sender, payload) => {
    BOT.sendTypingOn(sender);
    switch (payload) {
        case 'GET_STARTED_PAYLOAD':
            myGenericReply(sender, replies[3]);
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