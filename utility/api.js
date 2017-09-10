const apiai = require('apiai');
const app = apiai(process.env.APIAI);

const callAPI = (query) => {
    return new Promise((resolve, reject) => {
        app.textRequest(query, {
            sessionId: '123456789'
        }).on('response', (response) => {
            resolve({
                speech : response.result.fulfillment.messages[0].speech,
                action : response.result.action,
                intent : response.result.metadata.intentName,
                incomplete : response.result.actionIncomplete,
                parameters : response.result.parameters,
            });
        }).on('error', (error) => {
            reject(error);
        }).end();      
    });
};

module.exports = {
    callAPI
}