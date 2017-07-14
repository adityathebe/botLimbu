/*============================================================================*
*------------------------------- MESSAGE FORMATS -----------------------------*
*============================================================================*/

"use strict";
const request = require('request');
const random  = require("random-js")();

const token = process.env.FB_VERIFY_ACCESS_TOKEN;
const vtoken = process.env.FB_VERIFY_TOKEN;

const callSendApi = (messageData, callback) => {
    return new Promise( (resolve, reject) => {
        request({
            uri: 'https://graph.facebook.com/v2.6/me/messages',
            qs: { 
                access_token: token 
            },
            method: 'POST',
            json: messageData
        }, (error, response, body)=> {
            if (!error && response.statusCode == 200) {
                var recipientId = body.recipient_id;
                var messageId = body.message_id;

                if (messageId) {
                    resolve("Successfully sent message to : " + recipientId);
                } else {
                    resolve("Could not send message but successfully called Send-API for " + recipientId);
                }
            } else {
                reject(`Failed calling Send API ${response.statusCode} ${response.statusMessage} ${body.error}`);
            }
        });  
    })
}

var sendTypingOn = function(sender) {
    var messageData = {
        recipient: {
            id: sender
        },
        sender_action: "typing_on"
    };

    callSendApi(messageData).then( (msg) => {
        console.log(msg);
    });
}

var sendTextMessage = function(sender, messageText) {
    let messageData = {
        recipient: {
            id: sender,
        },
        message: {
            text: messageText,
        }
    }

    return new Promise((resolve, reject) => {
        callSendApi(messageData).then( (msg) => {
            resolve(msg);
        }, (errMsg) => {
            reject(errMsg);
        });
    })
}

var sendImage = function(sender, imgUrl) {    
    let messageData = { 
        recipient: {
            id: sender,
        },
        message : {
            attachment: {
                type: "image",
                payload:{
                    url:imgUrl,
                }
            }
        }
    }
    return new Promise((resolve, reject) => {
        callSendApi(messageData).then((msg) => {
            resolve(msg);
        }, (errMsg) => {
            reject(errMsg);
        });
    })
}

var sendGenericMessage = function(sender, data) {
    let messageContent = [];
    for (var i = 0; i < data.length; i++) {
        messageContent.push({
            "title": data[i].title,
            "subtitle": data[i].subtitle,
            "image_url": data[i].img_url,
            "buttons": [
                {
                    "type": "web_url",
                    "url": data[i].url,
                    "title": (data[i].btnTitle) ? data[i].btnTitle : 'Read More'
                }
            ],
        })
    }

    let messageData = {
        recipient: {
            id: sender,
        },
        message: {
            "attachment": {
                "type": "template",
                "payload": {
                    "template_type": "generic",
                    "elements": messageContent
                }
            }
        }
    };
    
    return new Promise((resolve, reject) => {
        callSendApi(messageData).then( (msg) => {
            resolve(msg);
        }, (errMsg) => {
            reject(errMsg);
        });
    })
}

var sendButtonMessage = function(sender, buttonMsg, payloadName) {
    var messageData =  {
        recipient: {
            id: sender
        },
        message : {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: buttonMsg[0],
                    buttons:[{
                        type: "postback",
                        title: buttonMsg[1],
                        payload: payloadName
                    }]
                }
            }
        }
    }
    return new Promise((resolve, reject) => {
        callSendApi(messageData).then( (msg) => {
            resolve(msg);
        }, (errMsg) => {
            reject(errMsg);
        });
    })
}

const sendQuickReplies = (sender, data) => {
    let messageData =   {
        recipient: {
            id: sender
        },
        message : {
            text: data.text,
            "quick_replies": data.element,
        }
    }
    return new Promise((resolve, reject) => {
        callSendApi(messageData).then( (msg) => {
            resolve(msg);
        }, (errMsg) => {
            reject(errMsg);
        });
    })
}

const myGenericReply = (sender, data) => {
    let randomNumber = random.integer(0, data.length-1);
    BOT.sendTextMessage(sender, data[randomNumber]);
}

module.exports = {
    sendTypingOn,
    sendTextMessage,
    sendImage,
    sendGenericMessage,
    sendButtonMessage,
    sendQuickReplies
}