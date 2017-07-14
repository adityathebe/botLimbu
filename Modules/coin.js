const BOT = require("../Template/templates");
const random = require("random-js")();

const sendCoinFlip = (sender, imgUrl, text) {
    BOT.sendImage(sender, imgUrl).then(() => {
        return BOT.sendQuickReplies(sender, {
            text : text,
            element : [
                {
                    "content_type" : "text",
                    "title" : 'Flip Again',
                    "payload" : 'PL_flipcoin'
                }
            ]
        });
    }).then((successMsg) => {
        console.log(`SUCCESS: ${successMsg}`);
    }).catch((errMsg) => {
        console.log(`ERROR: ${errMsg}`);
    });
};

const flip = (sender) => {
    if (random.integer(1, 2) === 1)    {
        sendCoinFlip(sender, 'http://i.imgur.com/okWnYr2.jpg', 'Heads');
    } else {
        sendCoinFlip(sender, 'http://i.imgur.com/NNuJ4Fa.jpg', 'Tails');
    }
};

module.exports = {
	flip
}