/*============================================================================*
*------------------------------- MESSAGE FORMATS -----------------------------*
*============================================================================*/

"use strict";
const request = require('request');

const token = process.env.FB_VERIFY_ACCESS_TOKEN;
const vtoken = process.env.FB_VERIFY_TOKEN;

var callSendApi = function(messageData) {
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

            if (messageId)
                console.log("Successfully sent message to : " + recipientId);
            else
                console.log("Successfully called Send API for " + recipientId);
        } else {
            console.error("Failed calling Send API", response.statusCode, response.statusMessage, body.error);
        }
    });  
}

var sendTypingOn = function(sender) {
    var messageData = {
        recipient: {
            id: sender
        },
        sender_action: "typing_on"
    };
    callSendApi(messageData);
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
    callSendApi(messageData);
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
    callSendApi(messageData)
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
                    "title": "Read More"
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
    callSendApi(messageData)
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
    callSendApi(messageData);
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
    callSendApi(messageData);
}

module.exports = {
    callSendApi,
    sendTypingOn,
    sendTextMessage,
    sendImage,
    sendGenericMessage,
    sendButtonMessage,
    sendQuickReplies
}