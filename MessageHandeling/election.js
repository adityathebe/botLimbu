const BOT           = require("../Template/templates");
const electionData  = require('../data/election');
const Election      = require('../Modules/election');

let duplicateIDs = [];
let municipality;   // Array of municipalities

var isDistrict = (address) => {
    for (province of election) {
        for (district of province.districts) {
            if(address === district.name.toLowerCase()) {
                municipality = district.Municipalities;
                return true;
            }
        }
    }
};

const checkDuplicateLocation = () => {
    for (var i = 0; i < electionData.length; i++) {
        for (var j = 0; j < electionData[i].districts.length; j++) {
            for (var k = 0; k < electionData[i].districts[j].Municipalities.length; k++) {
                var muni = electionData[i].districts[j].Municipalities[k];
                if(muni.english_name.toLowerCase() === address){
                    duplicateIDs.push(muni.id);
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
                BOT.sendTextMessage(sender, 'Sorry, could not find that place')
            } else if (duplicateIDs.length === 1) {
                Election.stat(sender, address, 'byLocation'); 
            } else {
                BOT.sendTextMessage(sender, "There are " + count + " places with that name!").then(() => {
                    for (place of duplicateIDs) {
                        Election.stat(sender, place, 'byID');
                    }
                }, (errMsg) => {
                    console.log(errMsg);
                });
            }
        } else {
            var message = "";
            for (var j = 0; j < municipality.length; j++) {
                message += j+1 + ". " + municipality[j].english_name + '\n';
            }
            message += "\n\nExample: election " + municipality[0].english_name;
            BOT.sendTextMessage(sender, message);
        }
    }
};

module.exports.handle = handle;