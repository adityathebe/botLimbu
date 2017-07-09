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
		let weatherUrl = `https://api.darksky.net/forecast/64b182a3079c85b7540d58dfab690775/${lat},${lng}?units=si`;
		return axios.get(weatherUrl);
	}).then((response) => {
		let temperature = response.data.currently.temperature;
		let apparentTemperature = response.data.currently.apparentTemperature;
		let summary = response.data.currently.summary;
		let extendedSummary = response.data.hourly.summary;
		BOT.sendTextMessage(sender, summary);
		BOT.sendTextMessage(sender, `It's currently ${temperature} but feels like ${apparentTemperature}.\nIt's going to be ${extendedSummary}`)
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
