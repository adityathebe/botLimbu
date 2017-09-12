const token = process.env.FB_VERIFY_ACCESS_TOKEN;
const vtoken = process.env.FB_VERIFY_TOKEN;
const bot_fb_id = process.env.FB_BOT_ID;

/* ================== Modules ================== */
const express       = require('express');
const bodyParser    = require('body-parser');
const request       = require('request');
const random        = require('random-js')();
var router          = express.Router();

/* ================= Utilities ================== */
const {callAPI} = require('../utility/api');
const Subscribe = require('../utility/subscription');
const {getProfile} = require('../utility/getprofile');

/* ================= Message samples ================== */
const BOT = require('../Template/templates');

/* ====================== Tasks ======================= */
const Coin          = require('../Modules/coin');
const Entertain     = require('../Modules/entertain')
const Kantipur      = require('../Modules/kantipur');
const KU            = require('../Modules/ku');
const News          = require('../Modules/news');
const Nude          = require('../Modules/nude');
const QFX           = require('../Modules/qfxcinema');
const Weather       = require('../Modules/weather');

/* ============ MESSAGE HANDELING ============= */
const Payload           = require('../MessageHandeling/payload');
const MessagePayload    = require('../MessageHandeling/messagePayload');
const Election          = require('../MessageHandeling/election');

/* ============ Data ============= */
const command = require('../data/commands');
const replies = require('../data/replies');

/* ============ News Data ============ */
const newsKeyWord = ['bbc-news','bbc-sport','cnn','hacker-news','mashable','techcrunch'];
const newsChannel = ['BBC', 'BBC Sports', "CNN", "Hacker News", 'Mashable', 'Tech Crunch'];

router.get("/", function (req, res) {
    if (req.query["hub.verify_token"] === vtoken) {
        res.send(req.query["hub.challenge"]);
    }
    res.send("No Access");
});

router.post("/", function (req, res) {
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++)   {
        let event = req.body.entry[0].messaging[i];
        let sender = event.sender.id;
        let commandCode;
        
        if (event.postback) {
            Payload.handle(sender, event.postback.payload);
        } else if (event.message && event.message.text && sender != bot_fb_id) {
            let text = (event.message.text).toLowerCase().trim();
            
            getProfile(sender).then((data) => {
                if(data.first_name)
                    console.log(`Message sent to ${data.first_name}`);
                else
                    console.log(`Message sent to ${data.name}`);
            }, (err) => {
                console.log(err);
            });

            BOT.sendTypingOn(sender);
            if (event.message.quick_reply) {
                /* =========== HANDLE QUICK REPLIES PAYLOAD ============ */
                MessagePayload.handle(sender, event.message.quick_reply.payload); 
            } else {
                callAPI(text).then((ai_data) => { 
                    if(ai_data.action) {
                        BOT.sendTextMessage(sender, ai_data.speech).then((msg) => {
                            console.log(msg);
                        }, (err) => {
                            console.log(JSON.stringify(err));
                        });
                    } else {
                        let commandCode = command.indexOf(ai_data.intent);
                        if(commandCode >= 0)  {
                            switch(commandCode) {
                                case 0: // Flip coin
                                    Coin.flip(sender);
                                    break;
                                case 1: // Jokes
                                    Entertain.sendJoke(sender);
                                    break;
                                case 2: // Quotes
                                    Entertain.sendQuote(sender);
                                    break;
                                case 3: // Facts
                                    Entertain.sendFact(sender);
                                    break;
                                case 4: // Local News
                                    Kantipur.news(sender);
                                    break;
                                case 5: // KU News
                                    KU.news(sender);
                                    break;
                                case 6: // Introduction
                                    BOT.getUserData(sender).then((data) => {
                                        BOT.sendTextMessage(sender, `Hi ${data.first_name}. ${replies[3]}`);
                                    }, (errMsg) => {
                                        console.log(errMsg);
                                    });
                                    break;
                                case 7:
                                    KU.result(sender);
                                    break;
                                case 8:
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
                                case 9:
                                    QFX.choice(sender);
                                    break;
                                case 10:
                                    Nude.send(sender);
                                    break;
                                case 11: // Weather
                                    if(!ai_data.incomplete) {
                                        let address = ai_data.parameters['geo-city'][0];
                                        address = address.trim();
                                        if(address !== '') {
                                            Weather.forecast(sender, address);
                                        } else {
                                            BOT.sendTextMessage(sender, 'Please enter an address.\nExample: kathmandu weather, weather kalinchowk').then ((msg) => {
                                                console.log(msg);
                                            });
                                        }
                                    } else {
                                        BOT.sendTextMessage(sender, ai_data.speech);
                                    }
                                    break;
                                case 12:
                                    var aditya =   [{
                                        title: "Aditya Thebe",
                                        subtitle: "Coolest Person on earth",
                                        img_url: "http://i.imgur.com/AI4znI6.jpg",
                                        url: "http://adityathebe.com",
                                        btn_title: "Check out his blog"
                                    }]
                                    BOT.sendGenericMessage(sender, aditya);
                                    break;
                                case 13:
                                    BOT.sendGenericReply(sender, replies[3])
                                    break;
                                default:
                                    BOT.sendTextMessage(sender, "Figuring it out!");
                            }
                        } else {
                            /*============== CHECK FOR ELECTION DATA ==========*/
                            if (text.search("election") >= 0) {
                                let address = (text.replace('election', ""));
                                Election.handle(sender, address.trim());
                            }

                            /*================ INVALID COMMAND =================*/
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
                }, (err) => {
                    BOT.sendTextMessage(sender, 'Maintainance mode ...').then((msg) => {
                        console.log(msg);
                    }, (err) => {
                        console.log(JSON.stringify(err));
                    });
                });
            }
        }
        continue;
    }
    res.sendStatus(200);
});

module.exports = router;