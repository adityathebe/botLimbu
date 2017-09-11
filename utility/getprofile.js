const token = process.env.FB_VERIFY_ACCESS_TOKEN;

const getProfile = (id) => {
    return new Promise((resolve, reject) => {
        const url = `https://graph.facebook.com/v2.10/${id}?access_token=${token}`;
        request({url, json: true}, (error, response, body) => {
            if (error) {
                return reject(error)
            }
            resolve(body);
        };
    });
};

module.exports = {
    getProfile
}