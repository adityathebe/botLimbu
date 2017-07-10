const BOT = require("../Template/templates");
const random = require("random-js")();

const flip = (sender) => {
    if (random.integer(1, 2) === 1)    {
        BOT.sendImage(sender,"http://i.imgur.com/okWnYr2.jpg").then(() => {
        	BOT.sendQuickReplies(sender, {
                text : 'Heads',
                element : [
                    {
                        "content_type" : "text",
                        "title" : 'Flip Again',
                        "payload" : 'PL_flipcoin'
                    }
                ]
            });
        });
    } else {
        BOT.sendImage(sender,"http://i.imgur.com/NNuJ4Fa.jpg").then(() => {
        	BOT.sendQuickReplies(sender, {
                text : 'Tails',
                element : [
                    {
                        "content_type" : "text",
                        "title" : 'Flip Again',
                        "payload" : 'PL_flipcoin'
                    }
                ]
            });
        });
    }
}

module.exports = {
	flip
}