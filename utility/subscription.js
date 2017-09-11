const UserModel = require('../models/user');
const BOT = require('../Template/templates');
const request = require('request');

const {getProfile} = require('./getprofile');

const subscribe = (id) => {
    getProfile(id).then((data) => {
        var newUser = {
            name : `${data.name}`,
            fb_id: id
        };

        UserModel.findOneAndUpdate({fb_id: newUser.fb_id}, newUser, {upsert:true}, (err, user) => {
            console.log(`Subscribing : ${id}`);
            if (err) {
                console.log(err);
                BOT.sendTextMessage(id, "There was an error subscribing.");
            } else {
                console.log('User saved successfully!');
                BOT.sendTextMessage(id, "You've been subscribed!")
            }
        });
    }, (err) => {
        console.log('Graph API Profile Error: ' + err);
    });
}

const unsubscribe = (id) => {
    UserModel.findOneAndRemove({fb_id: id}, (err, user) => {
        if (err) {
            console.log(err);
            BOT.sendTextMessage(id, "There was an error unsubscribing.");
        } else {
            console.log('User deleted successfully!');
            BOT.sendTextMessage(id, "You've been unsubscribed!")
        }
    });
}

module.exports = {
    subscribe, unsubscribe
}