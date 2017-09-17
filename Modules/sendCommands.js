const BOT = require("../Template/templates");
const getProfile = require('../utility/getprofile');

const reply = "I am BotLimbu. You can ask me for things like\n\n" +
            "• Jokes \n" +
            "• What's on the news? \n" +
            "• What is the current weather of Kathmandu \n" + 
            "• What movies are running on QFX Movies at the moment? \n" + 
            "• Flip a coin \n" +
            "• Facts \n" +
            "• Quotes \n " +
            "• Kathmandu University result \n" +
            "• Kathmandu University news \n" +
            "And if you ever need help, just type 'COMMAND'";

const sendCommands = (sender) => {
    getProfile(sender).then((data) => {
        return BOT.sendTextMessage(sender, `Hi ${data.first_name}, ${reply}`);
    }).catch((err) => {
        console.log(errMsg);
    });
};

module.exports = sendCommands;