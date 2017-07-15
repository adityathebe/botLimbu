const BOT		= require("../Template/templates");
const random 	= require("random-js")();
const jokes     = require("../data/jokes");
const facts     = require("../data/facts");
const quotes    = require("../data/quotes");

const sendQuickReply = (sender, message, title, payload) => {
	BOT.sendQuickReplies(sender, {
	    text : message,
	    element : [
	        {
	            "content_type" : "text",
	            "title" : title,
	            "payload" : payload
	        }
	    ]
    }).then((successMsg) => {
        console.log(`SUCCESS: ${successMsg}`);
    }, (errMsg) => {
        console.log(`ERROR: ${errMsg}`);
    });
};

const sendJoke = (sender) => {
	let randomNumber = random.integer(0, jokes.length - 1);
    let message = jokes[randomNumber];
    sendQuickReply(sender, message, 'Another Joke', 'PL_joke');
};

const sendFact = (sender) => {
	let randomNumber = random.integer(0, facts.length - 1);
    let message = facts[randomNumber];
    sendQuickReply(sender, message, 'Another Fact', 'PL_fact');
};

const sendQuote = (sender) => {
	let randomNumber = random.integer(0, quotes.length - 1);
    let message = quotes[randomNumber];
    sendQuickReply(sender, message, 'Another Quote', 'PL_quote');
};

module.exports = {
	sendJoke,
	sendFact,
	sendQuote
}