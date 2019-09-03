const express = require("express");
const path = require('path');
const eegDevice = require('./libs/eeglib');
const sse = require('connect-sse')();
const PubSub = require('pubsub-js');
var resp;
var EEG_ENABLED = false
const eegClient = eegDevice.eegClient();





if(EEG_ENABLED){
	eegClient.connect();
}
startExpress();




var mySubscriber = function (msg, data) {
	console.log("RAW DATA RECEIVED:");
	console.log(msg, data);
	console.log("\n");

	const dataToSend = prepareDataToSend(data);
	
	console.log("SENDING data to client:");
	console.log(JSON.stringify(dataToSend) + "\n");

	if(resp) {
		resp.json(dataToSend);
		console.log("Message sent correctly to subscriber. \n");
	}else{
		console.log("There are no subscribers at the moment, skipping.\n");
	}
};

PubSub.subscribe('eeg', mySubscriber);


function prepareDataToSend(data) {
	const timeNow = Math.floor(new Date().getTime() / 1000);
	const dataToSend = [
		{x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0},
		{x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}
	];
	if (data.eegPower) {
		dataToSend[0] = { x: timeNow, y: data.eegPower.delta / 10000 };
		dataToSend[1] = { x: timeNow, y: data.eegPower.theta / 10000 };
		dataToSend[2] = { x: timeNow, y: data.eegPower.lowAlpha / 10000 };
		dataToSend[3] = { x: timeNow, y: data.eegPower.highAlpha / 10000 };
		dataToSend[4] = { x: timeNow, y: data.eegPower.lowBeta / 10000 };
		dataToSend[5] = { x: timeNow, y: data.eegPower.highBeta / 10000 };
		dataToSend[6] = { x: timeNow, y: data.eegPower.lowGamma / 10000 };
		dataToSend[7] = { x: timeNow, y: data.eegPower.highGamma / 10000 };
	}
	if (data.poorSignalLevel) {
		dataToSend[8] = { x: timeNow, y: data.poorSignalLevel * 10 };
	}
	if (data.blinkStrength) {
		dataToSend[9] = { x: timeNow, y: data.blinkStrength * 10 };
	}
	if (data.eSense) {
		dataToSend[10] = { x: timeNow, y: data.eSense.attention * 10 };
		dataToSend[11] = { x: timeNow, y: data.eSense.meditation * 10 };
	}
	return dataToSend;
}


//*********EXPRESS INIT **********/

function startExpress() {
	const EXPRESS_PORT = 8080;
	const app = express();
	// app.use(express.static(path.join(__dirname,'public')));

	//expose public folder
	app.use(express.static('public'))

	//expose S.S.E. endpoint for live EEG data stream
	app.get('/liveEEGData', sse, function (req, res) {
		resp = res; // expose response to global scope
	});

	app.listen(EXPRESS_PORT, function () {
		console.log("Application running at Port " + EXPRESS_PORT);
	});
}