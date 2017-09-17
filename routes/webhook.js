const token = process.env.FB_VERIFY_ACCESS_TOKEN;
const vtoken = process.env.FB_VERIFY_TOKEN;
const bot_fb_id = process.env.FB_BOT_ID;

/* ================== Modules ================== */
const express       = require('express');
const bodyParser    = require('body-parser');
const request       = require('request');
const random        = require('random-js')();
let router          = express.Router();

/* ================= Utilities ================== */
const callAPI = require('../utility/api');
const getProfile = require('../utility/getprofile');

/* ================= Message samples ================== */
const BOT = require('../Template/templates');

/* ============ MESSAGE HANDELING ============= */
const handleintent          = require('../MessageHandeling/intents');
const handlePayload         = require('../MessageHandeling/payload');
const handleMessagePayload  = require('../MessageHandeling/messagePayload');

router.get("/", (req, res) => {
    req.query["hub.verify_token"] === vtoken ? res.send(req.query["hub.challenge"]) : res.send("No Access");
});

router.post("/", (req, res) => {
    let messaging_events = req.body.entry[0].messaging;
    for (let i = 0; i < messaging_events.length; i++)   {
        let event = req.body.entry[0].messaging[i];
        let sender = event.sender.id;
        let commandCode;
        
        if (event.postback) {
            handlePayload(sender, event.postback.payload);
        } else if (event.message && event.message.text && sender != bot_fb_id) {
            let text = (event.message.text).toLowerCase().trim();
            
            getProfile(sender).then((data) => {
                let sender_name = typeof(data.first_name) === 'undefined' ? data.name : data.first_name;
                console.log(`Message received from ${sender_name}`);
            }, (err) => {
                console.log(err);
            });

            BOT.sendTypingOn(sender);
            if (event.message.quick_reply) {
                /* =========== HANDLE QUICK REPLIES PAYLOAD ============ */
                handleMessagePayload(sender, event.message.quick_reply.payload); 
            } else {
                callAPI(text).then((ai_data) => { 
                    if(ai_data.action) {
                        BOT.sendTextMessage(sender, ai_data.speech).catch((err) => {
                            console.log(JSON.stringify(err));
                        });
                    } else {
                        handleintent(sender, ai_data);
                    }
                }, (err) => {
                    BOT.sendTextMessage(sender, 'Maintainance mode ...').catch((err) => {
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