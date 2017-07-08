"use strict";

const token = process.env.FB_VERIFY_ACCESS_TOKEN;
const vtoken = process.env.FB_VERIFY_TOKEN;

/* ============ Modules ============= */
const express       = require("express");
const bodyParser    = require("body-parser");
const request       = require("request");
const random        = require("random-js")();

/* ============ Tasks ============= */
const BOT           = require('./Template/templates');
const Coin          = require('./Modules/coin');
const Kantipur      = require('./Modules/kantipur');
const Nude          = require('./Modules/nude');
const KU            = require('./Modules/ku');
const News          = require('./Modules/news');
const Election      = require('./Modules/election');

/* ============ Data ============= */
const jokes         = require("./data/jokes");
const facts         = require("./data/facts");
const cmd           = require("./data/commands");
const rep           = require("./data/replies");
const electionData  = require("./data/election");

/* ============ News Data ============ */
const newsKeyWord = ['bbc-news','bbc-sport','cnn','hacker-news','mashable','techcrunch'];
const newsChannel = ['BBC', 'BBC Sports', "CNN", "Hacker News", 'Mashable', 'Tech Crunch'];

const app = express();
app.set("port", (process.env.PORT || 5000));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.get("/", function (req, res) {
    res.send("Hello world, I am a chat bot");
});

app.get("/webhook/", function (req, res) {
    if (req.query["hub.verify_token"] === vtoken) {
        res.send(req.query["hub.challenge"]);
    }
    res.send("No Access");
});

app.listen(app.get("port"), function() {
    console.log("Running on port", app.get("port"));
});

app.post("/webhook/", function (req, res) {
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++)   {
        let event = req.body.entry[0].messaging[i];
        let sender = event.sender.id;

        if (event.message && event.message.text) {
            BOT.sendTypingOn(sender);
            let text = (event.message.text).toLowerCase();
            text = (text.replace(/[^a-zA-Z ]/g, "").trim());
            let command_exists = false;
            let commandCode;
            console.log("Mesage: " + text);

            for(var k = 0 ; k < cmd.length ; k++)   {
                for(var j = 0 ; j < cmd[k].length ; j++)    {
                    if(text == cmd[k][j])   {
                        command_exists = true;
                        commandCode = k;
                        break;    
                    }                   
                }
            }

            if(event.message.quick_reply) {
                let payload = event.message.quick_reply.payload;
                console.log("Quick Replies Payload Received: " + payload)
                if(newsKeyWord.indexOf(payload) >= 0) {
                    News.display(sender, payload)
                }
            } else if(command_exists)  {
                switch(commandCode) {
                    case 0: // Greet
                        myGenericReply(sender, rep[0]);
                        break;
                    case 1: // Coin Flip
                        Coin.flip(sender);
                        break;
                    case 2: // Jokes
                        jokesOrFacts(sender, jokes);
                        break;
                    case 3: // Facts
                        jokesOrFacts(sender, facts);
                        break;
                    case 4: // News
                        Kantipur.news(sender);
                        break;
                    case 5: // KU News
                        KU.news(sender);
                        break;
                    case 6: // Introduction
                        myGenericReply(sender, rep[5]);
                        break;
                    case 7: // Swear words
                        if(Math.floor(Math.random() * 5) < 2)
                            myGenericReply(sender, rep[2]);
                        else
                            BOT.sendImage(sender, "http://i.imgur.com/lk0zVwq.jpg");
                        break;
                    case 8:
                        var aditya =   [{
                            title: "Aditya Thebe",
                            subtitle: "Coolest Person on earth",
                            img_url: "http://i.imgur.com/AI4znI6.jpg",
                            url: "http://adityathebe.com",
                            btn_title: "Check out his blog"
                        }]
                        BOT.sendGenericMessage(sender, aditya);
                        break;
                    case 9: // Good Byes
                        myGenericReply(sender, rep[3]);
                        break;
                    case 10: // My name
                        BOT.sendTextMessage(sender, "Limbu - Bot Limbu");
                        break;
                    case 11: // Compliments
                        myGenericReply(sender, rep[4]);
                        break;
                    case 12:
                        KU.result(sender);
                        break;
                    case 13:
                        let elements = [];
                        for (var m = 0; m < newsChannel.length; m++) {
                            elements.push({
                                "content_type" : "text",
                                "title" : newsChannel[m],
                                "payload" : newsKeyWord[m]
                            })
                        }
                        BOT.sendQuickReplies(sender, { 
                            text : 'Choose your News Source',
                            element : elements
                        });
                        break;
                    case 14:
                        BOT.sendButtonMessage(sender, ['Adult Content. Proceed?', 'I Agree. Show Image'], 'PL_adult');
                        break;
                    default:
                        BOT.sendTextMessage(sender,"Figuring it out!");
                }
            }
            else {
                if (text.search("election") >= 0) {
                    BOT.sendTypingOn(sender);
                    let address = (text.replace('election', ""));
                    address = address.trim();

                    /* == Check if the address is empty == */
                    if(address == "") {
                        var temp = "Please add the district or municipality name after election\nExample: election panchthar, election mechi"
                        BOT.sendTextMessage(sender, temp);
                    } else {
                        var isDistrict = false
                        var municipalityName;
                        var count = 0;
                        var duplicate_ids = []
                        
                        /* == Check if the address is a district and count the number of address == */
                        for (var x = 0; x < electionData.length; x++) {
                            for (var j = 0; j < electionData[x].districts.length; j++) {
                                var location = electionData[x].districts[j].name;
                                if(address == location.toLowerCase()) {
                                    isDistrict = true;
                                    municipalityName = electionData[x].districts[j].Municipalities;
                                }

                                // Additional Loop to check if there are two places with the same name!
                                for (var k = 0; k < electionData[x].districts[j].Municipalities.length; k++) {
                                    var muni  = electionData[x].districts[j].Municipalities[k];
                                    if(muni.english_name.toLowerCase() == address){
                                        count++;
                                        duplicate_ids.push(muni.id);
                                    }
                                }
                            }
                        }

                        if(!isDistrict) {
                            if(count == 1) {
                                Election.stat(sender, address, 1);                                
                            } else {
                                var tempMsg = "There are " + count + " places with that name!";
                                BOT.sendTextMessage(sender, tempMsg);
                                duplicate_ids.forEach((place)=> {
                                    Election.stat(sender, place, 0);
                                })
                            }
                        } else {
                            var tempData = "";
                            for (var j = 0; j < municipalityName.length; j++) {
                                tempData += j+1 + ". " + municipalityName[j].english_name + '\n';
                            }
                            tempData += "\n\nExample: election " + municipalityName[0].english_name;
                            BOT.sendTextMessage(sender, tempData);
                        }
                    }

                } else {
                    var cmd_err = ["I'm not sure I understand. Try\n\n- \"help\" command",
                                    "Oops, I didn't catch that. For things I can help you with, type \“help.\” ",
                                    "Sorry, I didn't get that. Try something like: \"KU news\", or type \"help\""]

                    var ran_num = random.integer(0,cmd_err.length);
                    BOT.sendTextMessage(sender, cmd_err[ran_num]);
                }
            }
        }

        if (event.postback) {
            let payload = event.postback.payload;
            switch (payload) {
                case "GET_STARTED_PAYLOAD":
                    myGenericReply(sender, rep[5]);
                    break;

                case "PL_flipcoin":
                    Coin.flip(sender);
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

                case "PL_adult":
                    Nude.send(sender);
                    break;
            }
        }
        continue;
    }
    res.sendStatus(200)
})

function jokesOrFacts(sender, data) {
    let randomNumber = random.integer(0, data.data.length);
    let mesage = data.data[randomNumber];
    BOT.sendTextMessage(sender, mesage);
}

function myGenericReply(sender, data) {
    let randomNumber = random.integer(0, data.length);
    let message = data[randomNumber];
    BOT.sendTextMessage(sender, message);
}