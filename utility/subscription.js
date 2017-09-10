const UserModel = require('../models/user');
const BOT = require('../Template/templates');
const request = require('request');
const token = process.env.FB_VERIFY_ACCESS_TOKEN || 'EAAB6xJpFXa0BALfsNdvOqV4tBt2poTm61X2eVAZAcENC2q5aTI0TPUgGGbCCDZAxhhxBmnSXCNmeKuLE0nzeVxKe1hbOi8OAU5kud0zOpA46efhkGtFTJJh60mwZBwp7ympZA4tXoCX7PBxwzQQw415rxX2Gv34cUUaoVFFEMqvxjE9fgcwb';

const subscribe = (id) => {
    const url = `https://graph.facebook.com/v2.10/${id}?access_token=${token}`;
    request({url, json: true}, (error, response, body) => {
        var newUser = new UserModel({
            name : `${body.first_name} ${body.last_name}`,
            fb_id: id
        });

        UserModel.findOneAndUpdate({fb_id: newUser.fb_id}, newUser, {upsert:true}, (err, user) => {
            console.log(`Subscribing : ${id}`);
            if (err) {
                console.log(err);
                BOT.sendTextMessage(id, "There was an error subscribing.");
            } else {
                console.log('User saved successfully!');
                BOT.sendTextMessage(newUser.fb_id, "You've been subscribed!")
            }
        });
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