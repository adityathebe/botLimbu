const apiai = require('apiai');
// const app = apiai(process.env.APIAI);
const app = apiai('5224b6598e8b45858b9babb233c4f0f6');

const callAPI = (query) => {
    return new Promise((resolve, reject) => {
        app.textRequest(query, {
            sessionId: '123456789'
        }).on('response', (response) => {
            let reply;
            try {                    
                reply = {
                    speech : response.result.fulfillment.messages[0].speech,
                    action : response.result.action,
                    intent : response.result.metadata.intentName,
                    incomplete : response.result.actionIncomplete,
                    parameters : response.result.parameters,
                };
            } catch(err) {
                reject(err);
            }
            resolve(reply)
        }).on('error', (error) => {
            reject(error);
        }).end();      
    });
};

module.exports = callAPI;