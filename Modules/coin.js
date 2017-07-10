const BOT = require("../Template/templates");
const random = require("random-js")();

const flip = (sender) => {
    if (random.integer(1, 2) === 1)    {
        BOT.sendImage(sender,"http://i.imgur.com/okWnYr2.jpg").then(() => {
        	BOT.sendButtonMessage(sender, ['Heads','Flip Again'], 'PL_flipcoin');
        });
    } else {
        BOT.sendImage(sender,"http://i.imgur.com/NNuJ4Fa.jpg").then(() => {
        	BOT.sendButtonMessage(sender, ['Tails','Flip Again'], 'PL_flipcoin');
        });
    }
}

module.exports = {
	flip
}