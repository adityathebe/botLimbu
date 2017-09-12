const UserModel = require('../models/user');
const BOT = require('../Template/templates');

const {getProfile} = require('./getprofile');

const subscribe = (id) => {
    getProfile(id).then((data) => {
        var newUser = {}
        newUser.fb_id = id;
        if(data.name) {
            newUser.name = data.name;
        } else {
            newUser.name = `${data.first_name} ${data.last_name}`
        }

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