//IMPORTS
const express = require("express");
const path = require('path');
const readline = require('readline');
const eegDevice = require('./libs/eeglib');
const drone = require('./libs/dronelib');
const sse = require('connect-sse')();
const PubSub = require('pubsub-js');
const eegClient = eegDevice.eegClient();


//CONSTANTS
const BLINK_STRENGTH_THRESHOLD = 50;  //strength treshold for a EEG blinking event 
const MEDITATION_STRENGTH_THRESHOLD = 95; //strength treshold for a EEG "high level meditation" event 
const ATTENTION_STRENGTH_THRESHOLD = 95; //strength treshold for a EEG "high level attention" event 
const MIN_INTERVAL_EVENT = 2000; //minimum interval to trigger an event (if an event occur after < MIN_INTERVAL_EVENT the event wont be propagated)
const LOGGING_ENABLED = false;


//APP VARIABLES
var recently_takeOffOrLand = false;  // to avoid double commands due to EEG crazyness
var recently_waved = false; // to avoid double commands due to EEG crazyness
var resp;  //global var for SSE response  => find a better way to handle this
var previousData;


//FUNCTIONS DECLARATION

/**
 * Start the Express app on port EXPRESS_PORT with and endpoint SSE on /liveEEGData
 */
function startExpress() {
	const EXPRESS_PORT = 8080;
	const app = express();

	//expose public folder
	app.use(express.static('public'))

	//expose Server Side Event endpoint for live EEG data stream
	app.get('/liveEEGData', sse, function (req, res) {
		resp = res; // expose response to global scope variable TODO: find a better way
	});

	app.listen(EXPRESS_PORT, function () {
		console.log("Application running at Port " + EXPRESS_PORT);
	});
}

function subscriber(msg, data) {
	if(LOGGING_ENABLED){
		console.log("RAW DATA RECEIVED:");
		console.log(msg, data);
		console.log("\n");
	}
	const dataToSend = prepareDataToSend(data);
	
	if(LOGGING_ENABLED){
		console.log("SENDING data to client:");
		console.log(JSON.stringify(dataToSend) + "\n");
	}
	if(resp) {
		resp.json(dataToSend);
		if(LOGGING_ENABLED){
			console.log("Message sent correctly to subscriber. \n");
		}	
	}else{
		if(LOGGING_ENABLED){
			console.log("There are no subscribers at the moment, skipping.\n");
		}
	}

	//*************EVENTS HERE **********************/

	if(data.blinkStrength && data.blinkStrength >= BLINK_STRENGTH_THRESHOLD && !recently_takeOffOrLand) {
		console.log("************TAKING OFF OR LANDING VIA MIND*************");
		setTimeout(function(){recently_takeOffOrLand = false}, MIN_INTERVAL_EVENT);
		recently_takeOffOrLand = true;
		drone.takeOffOrLand();
	}
	if(data.eSense && data.eSense.meditation && data.eSense.meditation >= MEDITATION_STRENGTH_THRESHOLD && !recently_waved){
		console.log("************CONGRATULATIONS HIGH LEVEL MEDITATION ACQUIRED, WAVING*************");
		setTimeout(function(){recently_waved = false}, MIN_INTERVAL_EVENT);
		recently_waved = true;
		drone.wave();
	}
	if(data.eSense && data.eSense.attention && data.eSense.attention >= ATTENTION_STRENGTH_THRESHOLD){
		console.log("************CONGRATULATIONS HIGH LEVEL ATTENTION ACQUIRED, FIRING LEDS*************");
		drone.fireLeds();
	}
}

/**
 * Parse the raw data from the EEG device and map it to a format compatible with the 
 * Rickshaw.Graph library (D3.js)
 * @param {data received from the EEG device} data 
 * 
 */
function prepareDataToSend(data) {
	const timeNow = Math.floor(new Date().getTime() / 1000);
	var dataToSend = [
		{x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0},
		{x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}, {x : timeNow, y:0}
	];
	if (data.eegPower) {
		dataToSend[0] = { x: timeNow, y: data.eegPower.delta };
		dataToSend[1] = { x: timeNow, y: data.eegPower.theta };
		dataToSend[2] = { x: timeNow, y: data.eegPower.lowAlpha };
		dataToSend[3] = { x: timeNow, y: data.eegPower.highAlpha };
		dataToSend[4] = { x: timeNow, y: data.eegPower.lowBeta };
		dataToSend[5] = { x: timeNow, y: data.eegPower.highBeta };
		dataToSend[6] = { x: timeNow, y: data.eegPower.lowGamma };
		dataToSend[7] = { x: timeNow, y: data.eegPower.highGamma };
	}
	if (data.poorSignalLevel) {
		dataToSend[8] = { x: timeNow, y: data.poorSignalLevel };
	}
	if (data.blinkStrength) { //since blinking is an "async event" (does not happen regularly every second) I copy the previous data to not mess up the graph
		dataToSend = previousData;
		dataToSend[9] = { x: timeNow, y: data.blinkStrength };
	}
	if (data.eSense) {
		dataToSend[10] = { x: timeNow, y: data.eSense.attention  };
		dataToSend[11] = { x: timeNow, y: data.eSense.meditation };
	}
	previousData = dataToSend;
	return dataToSend;
}

/**
 * Quit the app, safely (callback to event CTRL+C)
 */
function quit() {
	console.log("****************** EXITING ******************\n");
	process.stdin.pause();
	drone.land();
	process.exit(1);
}

/**
 * Init the keyboard and bind the keys to drone commands
 */
function keyboardInitAndBinding(){
	readline.emitKeypressEvents(process.stdin); //keyboard init
	if (process.stdin.isTTY) { //keybord init
		process.stdin.setRawMode(true);
	}
	process.stdin.on('keypress', (str, key) => { //keyboard binding
		if (key && key.sequence === '-') {
			drone.onOffToggle();
		}
		if (key && key.sequence === '+') {
			eegDevice.onOffToggle();
		}

		if (key && key.ctrl && key.name == 'c') {
			quit();
		}
		if (key && key.name === 'space') {
			drone.takeOffOrLand();
		}
		if (key && key.name === 'w') {
			drone.wave();
		}
		if (key && key.name === 'up') {
			drone.front();
		}
		if (key && key.name === 'down') {
			drone.back();
		}
		if (key && key.name === 'left') {
			drone.left();
		}
		if (key && key.name === 'right') {
			drone.right();
		}
		if (key && key.shift && key.name == 'up') {
			drone.up();
		}
		if (key && key.shift && key.name == 'down') {
			drone.down();
		}
		if (key && key.name === 'i') {
			drone.yaw_left();
		}
		if (key && key.name === 'o') {
			drone.yaw_right();
		}
		if (key && key.name === 'x') {
			drone.calibrate();
		}
		if (key && key.name === 'z') {
			drone.fireLeds();
		}
	});
}




//******************************  MAIN  ******************************/


if(eegDevice.isEnabled()){ //nb. drone does not require an explict connect() method
	eegClient.connect();
}
PubSub.subscribe('eeg', subscriber); //subscribe "subscriber" to eeg topic
keyboardInitAndBinding(); //init keyboard and bind drone commands to it
startExpress(); //start Express app