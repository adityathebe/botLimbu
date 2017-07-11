const axios = require('axios');
const BOT = require("../Template/templates");

const forecast = (sender, address) => {
	let encodedAddress = encodeURIComponent(address);
	let geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

	axios.get(geocodeUrl).then((response) => {
		if(response.data.status === 'ZERO_RESULTS') {
			throw new Error('Unable to find the address.');
		}
		BOT.sendTextMessage(sender, `Fetching Data: ${response.data.results[0].formatted_address}`);
		let lat = response.data.results[0].geometry.location.lat;
		let lng = response.data.results[0].geometry.location.lng;
		let weatherUrl = `http://api.apixu.com/v1/current.json?key=c481a2b7dd8c47daaa171404171505&q=${lat},${lng}`;
		return axios.get(weatherUrl);
	}).then((response) => {
		let temperature = response.data.current.temp_c;
		let apparentTemperature = response.data.current.feelslike_c;
		let summary = response.data.current.condition.text;
		let summaryImage = response.data.current.condition.icon.replace('//','');
		BOT.sendTextMessage(sender, summary).then(() => {
			return BOT.sendImage(sender, summaryImage)
		}).then(() => {
			return BOT.sendTextMessage(sender, `${temperature} °C but feels like ${apparentTemperature} °C.`).
		}).catch((errMsg) => {
			console.log(errMsg)
		})
	}).catch((error) => {
		if(error.code === 'ENOTFOUND') {
			BOT.sendTextMessage(sender, 'Unable to connect to API servers. Try Again Later');
		} else {
			BOT.sendTextMessage(sender, error.message);		
		}
	})	
}

module.exports = {
	forecast
}
