const mongoose = require('mongoose');

const UserModel = require('../models/user');
const BOT = require('../Template/templates.js');

const subscribe = (id) => {
    var newUser = new User({
        fb_id: id,
    });

    UserModel.findOneAndUpdate({fb_id: newUser.fb_id}, {fb_id: newUser.fb_id}, {upsert:true}, (err, user) => {
        if (err) {
            BOT.sendTextMessage(id, "There wan error subscribing you for daily articles");
        } else {
            console.log('User saved successfully!');
            BOT.sendTextMessage(newUser.fb_id, "You've been subscribed!")
        }
    });
}

const unsubscribe = (id) => {
  // call the built-in save method to save to the database
    UserModel.findOneAndRemove({fb_id: id}, function(err, user) {
        if (err) {
            BOT.sendTextMessage(id, "There wan error unsubscribing you for daily articles");
        } else {
            console.log('User deleted successfully!');
            BOT.sendTextMessage(id, "You've been unsubscribed!")
        }
    });
}

module.exports = {
    subscribe, unsubscribe
}