const BOT           = require("../Template/templates");
const electionData  = require('../data/election');
const Election      = require('../Modules/election');

let duplicateIDs = [];
let municipalities;   // Array of Municipalities

var isDistrict = (address) => {
    for (province of electionData) {
        for (district of province.districts) {
            if(address === district.name.toLowerCase()) {
                municipalities = district.Municipalities;
                return true;
            }
        }
    }
};

const checkDuplicateLocation = () => {
    for (province of electionData) {
        for (district of province.districts) {
            for (municipality of district.Municipalities) {
                if(municipality.english_name.toLowerCase() === address) {
                    duplicateIDs.push(municipality.id);
                }
            }
        }
    }
};

const handle = (sender, address) => {
    if(address === "") {
        BOT.sendTextMessage(sender, 'Please add the district or municipality name after election\nExample: election panchthar, election mechi');
    } else {
        if(!isDistrict(address)) {
            checkDuplicateLocation();
            if (duplicateIDs.length === 0) {
                BOT.sendTextMessage(sender, 'Sorry, I could not find that place')
            } else if (duplicateIDs.length === 1) {
                Election.stat(sender, address, 'byLocation'); 
            } else {
                BOT.sendTextMessage(sender, `There are ${duplicateIDs.length} places with that name!`).then(() => {
                    for (place of duplicateIDs) {
                        Election.stat(sender, place, 'byID');
                    }
                }, (errMsg) => {
                    console.log(errMsg);
                });
            }
        } else {
            var message = "";
            for (var j = 0; j < municipalities.length; j++) {
                message += j+1 + ". " + municipalities[j].english_name + '\n';
            }
            message += "\n\nExample: election " + municipalities[0].english_name;
            BOT.sendTextMessage(sender, message);
        }
    }
};

module.exports.handle = handle;