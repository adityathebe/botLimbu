const BOT = require('../Template/templates');
const random = require('random-js')();
const request = require('request');

let nsfwurl = [
    "https://www.reddit.com/r/gonewild.json",
    "https://www.reddit.com/r/nsfw.json",
    "https://www.reddit.com/r/suicidegirls.json",
    "https://www.reddit.com/r/Hotchickswithtattoos.json",
    "https://www.reddit.com/r/BonerMaterial.json",
    "https://www.reddit.com/r/ass.json",
    "https://www.reddit.com/r/OnOff.json",
    "https://www.reddit.com/r/RealGirls.json",
    "https://www.reddit.com/r/PetiteGoneWild.json",
    "https://www.reddit.com/r/gonewildcurvy.json",
    "https://www.reddit.com/r/AsiansGoneWild.json",
    "https://www.reddit.com/r/dirtysmall.json",
    "https://www.reddit.com/r/AsianHotties.json",
    "https://www.reddit.com/r/booty_queens.json",
    "https://www.reddit.com/r/BustyPetite.json",
];

const send = (sender) => {
    let url = nsfwurl[random.integer(0, nsfwurl.length - 1)];
    request({url: url, json: true}, (error, response, body) => {
        if(!error)  {
            let ran_num = random.integer(0, body.data.children.length - 1);
            let nsfwurl = body.data.children[ran_num].data.url;
            if(nsfwurl.search(".jpg") > 1){
                let redditSource = url.replace("https://www.reddit.com/r/", "");
                redditSource = redditSource.replace(".json" ,"")
                BOT.sendImage(sender, nsfwurl).then (() => {
                    BOT.sendQuickReplies(sender, {
                        text : `Source: ${redditSource}`,
                        element : [
                            {
                                content_type : 'text',
                                title : 'Show More',
                                payload : 'PL_adult'
                            }
                        ]
                    });
                }).catch((errMsg) => {
                    console.log(errMsg);
                });
            } else {
                console.log("Nude not found. Reloading !")
                send(sender);
            }
        }
    });
};

module.exports = {
    send
}