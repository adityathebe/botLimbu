"use strict";

const token = process.env.FB_VERIFY_ACCESS_TOKEN;
const vtoken = process.env.FB_VERIFY_TOKEN;

/* ================== Modules ================== */
const express       = require("express");
const bodyParser    = require("body-parser");
const request       = require("request");
const random        = require("random-js")();

/* ================= Message samples ================== */
const BOT           = require('./Template/templates');

/* ====================== Tasks ======================= */
const Coin          = require('./Modules/coin');
const Election      = require('./Modules/election');
const Entertain     = require('./Modules/entertain')
const Kantipur      = require('./Modules/kantipur');
const KU            = require('./Modules/ku');
const News          = require('./Modules/news');
const Nude          = require('./Modules/nude');
const QFX           = require('./Modules/qfxcinema');
const Weather       = require('./Modules/weather');

/* ============ MESSAGE HANDELING ============= */
const Payload = require('./MessageHandeling/payload');
const MessagePayload = require('./MessageHandeling/messagePayload');

/* ============ Data ============= */
// const command           = require("./data/commands");
const command       = require('./data/keywords');
const replies       = require('./data/replies');
const electionData  = require('./data/election');

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

const operateElection = (sender, address) => {
    if(address == "") {
        var message = "Please add the district or municipality name after election\nExample: election panchthar, election mechi"
        BOT.sendTextMessage(sender, message);
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
            if(count === 1) {
                Election.stat(sender, address, 1);                                
            } else if (count === 0) {
                Bot.sendTextMessage(sender, 'Sorry, could not find that place')
            } else {
                BOT.sendTextMessage(sender, "There are " + count + " places with that name!").then(() => {
                    duplicate_ids.forEach((place)=> {
                        Election.stat(sender, place, 0);
                    });                    
                }, (errMsg) => {
                    console.log(errMsg);
                });
            }
        } else {
            var message = "";
            for (var j = 0; j < municipalityName.length; j++) {
                message += j+1 + ". " + municipalityName[j].english_name + '\n';
            }
            message += "\n\nExample: election " + municipalityName[0].english_name;
            BOT.sendTextMessage(sender, message);
        }
    }
};

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

            for(var j = 0 ; j < command.length ; j++)   {
                for (var k = 0; k < command[j].length; k++) {
                    if(text.search(command[j][k]) >= 0) {
                        console.log(command[j][k] + ' exists!');
                        command_exists = true;
                        commandCode = j;
                        break;    
                    }
                }
            }

            if(command_exists)  {
                switch(commandCode) {
                    case 0: // Greet
                        myGenericReply(sender, replies[0]);
                        break;
                    case 1: // Coin Flip
                        Coin.flip(sender);
                        break;
                    case 2: // Jokes
                        Entertain.sendJoke(sender);
                        break;
                    case 3: // Facts
                        Entertain.sendFact(sender);
                        break;
                    case 4: // News
                        Kantipur.news(sender);
                        break;
                    case 5: // KU News
                        KU.news(sender);
                        break;
                    case 6: // Introduction
                        myGenericReply(sender, replies[3]);
                        break;
                    case 7:
                        var aditya =   [{
                            title: "Aditya Thebe",
                            subtitle: "Coolest Person on earth",
                            img_url: "http://i.imgur.com/AI4znI6.jpg",
                            url: "http://adityathebe.com",
                            btn_title: "Check out his blog"
                        }]
                        BOT.sendGenericMessage(sender, aditya);
                        break;
                    case 8: // Good Byes
                        myGenericReply(sender, replies[1]);
                        break;
                    case 9: // My name
                        BOT.sendTextMessage(sender, "Limbu - Bot Limbu");
                        break;
                    case 10: // Compliments
                        myGenericReply(sender, replies[2]);
                        break;
                    case 11:
                        KU.result(sender);
                        break;
                    case 12:
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
                    case 13:
                        QFX.fetch(sender);
                        break;
                    case 14:
                        Nude.send(sender);
                        break;
                    case 15:
                        myGenericReply(sender, replies[4]);
                        break;
                    default:
                        BOT.sendTextMessage(sender,"Figuring it out!");
                }
            }
            else {
                /*=====================================================
                ============ HANDLE QUICK REPLIES PAYLOAD ============
                =====================================================*/
                if(event.message.quick_reply) {
                    let payload = event.message.quick_reply.payload;
                    console.log("Quick Replies Payload Received: " + payload)
                    MessagePayload.handle(sender, payload);                    
                } 

                /*===================================================
                =============== CHECK FOR WEATHER DATA ==============
                ===================================================*/
                else if (text.search('weather') >= 0) {
                    let address = (text.replace('weather', ""));
                    address = address.trim();
                    if(address !== '') {
                        Weather.forecast(sender, address);
                    } else {
                        BOT.sendTextMessage(sender, 'Please enter an address.\nExample: kathmandu weather, weather kalinchowk').then ((msg) => {
                            console.log(msg);
                        });
                    }
                }

                /*===================================================
                =============== CHECK FOR ELECTION DATA =============
                ===================================================*/
                else if (text.search("election") >= 0) {
                    let address = (text.replace('election', ""));
                    operateElection(sender, address.trim());
                }

                /*===================================================
                ================== INVALID COMMAND ==================
                ===================================================*/
                else {
                    var errorReplies = [
                        'I am not sure I understand. Try\n\n- "HELP" command',
                        'Oops, I did nOt catch that. For things I can help you with, type “help”.',
                        'Sorry, I did nOt get that. Try something like: "KU news", or type "help".'
                    ];

                    var ranNum = random.integer(0, errorReplies.length - 1);
                    BOT.sendTextMessage(sender, errorReplies[ranNum]);
                }
            }
        }

        if (event.postback) {
            Payload.handle(sender, event.postback.payload);
        }
        continue;
    }
    res.sendStatus(200)
})

function myGenericReply(sender, data) {
    let randomNumber = random.integer(0, data.length-1);
    let message = data[randomNumber];
    BOT.sendTextMessage(sender, message);
}