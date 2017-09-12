const BOT = require("../Template/templates");
const {get_distance} = require('.//utility/google-direction');

const getDistance = (sender, places) => {
    get_distance(places[0], places[1]).then((data) => {
        BOT.sendTextMessage(sender, `${data.origin} to ${data.destination}`).then((msg)=> {
            return BOT.sendTextMessage(sender, `Distance: ${data.distance}`)
        }).catch((err) => {
            console.log(err);
        });
    })
};

module.exports = {
    getDistance
}