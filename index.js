"use strict";

const token = process.env.FB_VERIFY_ACCESS_TOKEN;
const vtoken = process.env.FB_VERIFY_TOKEN;

/* ================== Modules ================== */
const express       = require('express');
const bodyParser    = require('body-parser');
const request       = require('request');
const random        = require('random-js')();

/* ================= Message samples ================== */
const BOT           = require('./Template/templates');

/* ====================== Tasks ======================= */
const Coin          = require('./Modules/coin');
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
const Election = require('./MessageHandeling/election');

/* ============ Data ============= */
// const command           = require("./data/commands");
const command       = require('./data/keywords');
const replies       = require('./data/replies');

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

            for(var j = 0 ; j < command.length ; j++)   {
                for (var k = 0; k < command[j].length; k++) {
                    if(text.search(command[j][k]) >= 0) {
                        console.log(`The command ${command[j][k]} exists!`);
                        command_exists = true;
                        commandCode = j;
                        break;    
                    }
                }
            }

            if(command_exists)  {
                switch(commandCode) {
                    case 0: // Greet
                        BOT.sendGenericReply(sender, replies[0]);
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
                         BOT.getUserData(sender).then((data) => {
                            return BOT.sendGenericReply(sender, 'Hi ' + data.first_name + '\n' + replies[3]);
                        }).catch((errMsg) => {
                            BOT.sendTextMessage(sender, errMsg);
                        });
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
                        BOT.sendGenericReply(sender, replies[1]);
                        break;
                    case 9: // My name
                        BOT.sendTextMessage(sender, "Limbu - Bot Limbu");
                        break;
                    case 10: // Compliments
                        BOT.sendGenericReply(sender, replies[2]);
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
                        QFX.choice(sender);
                        break;
                    case 14:
                        Nude.send(sender);
                        break;
                    case 15:
                        BOT.sendGenericReply(sender, replies[4]);
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
                    Election.handle(sender, address.trim());
                }

                /*===================================================
                ================== INVALID COMMAND ==================
                ===================================================*/
                else {
                    var errorReplies = [
                        'I am not sure I understand. Try\n\n- "HELP" command',
                        'Oops, I did not catch that. For things I can help you with, type “help”.',
                        'Sorry, I did not get that. Try something like: "KU news", or type "help".'
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
});