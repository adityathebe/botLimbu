const UserModel = require('../models/user');
const BOT = require('../Template/templates');

const subscribe = (id) => {
    var newUser = new UserModel({
        fb_id: id,
    });

    UserModel.findOneAndUpdate({fb_id: newUser.fb_id}, {fb_id: newUser.fb_id}, {upsert:true}, (err, user) => {
        if (err) {
            console.log('sender: ' + id);
            console.log(err);
            BOT.sendTextMessage(id, "There was an error subscribing.");
        } else {
            console.log('User saved successfully!');
            BOT.sendTextMessage(newUser.fb_id, "You've been subscribed!")
        }
    });
}

const unsubscribe = (id) => {
    UserModel.findOneAndRemove({fb_id: id}, (err, user) => {
        if (err) {
            console.log('sender: ' + id);
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