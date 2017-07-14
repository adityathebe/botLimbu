const request = require('request');
const BOT = require("../Template/templates");

const stat = (txt, place, identifier) => {
    let url;
    if(identifier === 'byLocation')     // Search by locationName
        url = "https://electionnepal.herokuapp.com/location/" + place;
    else                    // Search by locationID
        url  = "https://electionnepal.herokuapp.com/id/" + place;

    request({url: url, json: true}, (error, response, body) => {
        if(!error)  {
            var candidates = body.names;
            var tempData = "";
            var vote_counts = body.votes;
            for (var i = 0; i < candidates.length; i++) {
                tempData+= candidates[i] + ' - ' + vote_counts[i] + '\n';
            }
            BOT.sendTextMessage(txt, tempData);
        }
        else {
            BOT.sendTextMessage(txt, "Server's down.\nPlease try again later");  
        }
    });
}

module.exports = {
    stat
}