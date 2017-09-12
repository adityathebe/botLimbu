const request = require('request');
const apiKey = process.env.MAP_API;

const get_distance = (start, end) => {
    return new Promise((resolve, reject) => {
        const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(start)}&destination=${encodeURIComponent(end)}&key=`;
        request({url: url+apiKey, json:true}, (err, response, body) => {
            if (err)
                return reject(err);
            let info = body.routes[0].legs[0];
            let direction = [];
            // for (d of info.steps) {
            //     direction.push(d.html_instructions.replace(/(<([^>]+)>)/ig,""))
            // }
            var data = {
                distance: info.distance.text,
                walking: info.duration.text,
                origin: info.start_address,
                destination: info.end_address,
                // direction: direction,
                // copyright: "Map data ©2017 Google",
            }
            resolve(data)
        })
    });    
};

module.exports = {
    get_distance
}