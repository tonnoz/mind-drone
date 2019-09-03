const arDrone = require('ar-drone');
const droneClient = arDrone.createClient();
droneClient.config('general:navdata_demo', 'FALSE'); //enable logging of navdata
droneClient.on('navdata', (data) => {  //low battery indicator on console
	if(data && data.demo && data.demo.batteryPercentage && data.demo.batteryPercentage < 31) {
		console.log("drone battery level low:" + data.demo.batteryPercentage);
	}
});


const INTERVAL_BEFORE_ACTION = 10;
const INTERVAL_AFTER_ACTION = 1500;
const ACTION_STRENGTH = 0.2; //a.k.a. pitch tilt

var isDroneEnabled = true;
var isFlying = false;



function takeOffOrLand() {
	if(!isDroneEnabled) return;
	if (!isFlying) {
		takeoff();
	} else {
		land();
	}
}

function wave() {
	if(!isDroneEnabled) return;
	console.log("****************** waving *********************\n");
	droneClient.animate('wave', 500);
}

function calibrate() {
	if(!isDroneEnabled) return;
	console.log("****************** calibrating *********************\n");
	droneClient.calibrate(0);
}

function emergency() {
	if(!isDroneEnabled) return;
	console.log("****************** disable emergency *********************\n");
	droneClient.disableEmergency();
}

function front() {
	if(!isDroneEnabled) return;
	console.log("****************** front *********************\n");
	droneClient
		.after(INTERVAL_BEFORE_ACTION, function () {
			this.front(ACTION_STRENGTH);
		}).after(INTERVAL_AFTER_ACTION, function () {
			this.stop();
		});
}

function back() {
	if(!isDroneEnabled) return;
	console.log("****************** back *********************\n");
	droneClient
		.after(INTERVAL_BEFORE_ACTION, function () {
			this.back(ACTION_STRENGTH);
		}).after(INTERVAL_AFTER_ACTION, function () {
			this.stop();
		});
}

function left() {
	if(!isDroneEnabled) return;
	console.log("****************** left *********************\n");
	droneClient
		.after(INTERVAL_BEFORE_ACTION, function () {
			this.left(ACTION_STRENGTH);
		}).after(INTERVAL_AFTER_ACTION, function () {
			this.stop();
		});
}

function right() {
	if(!isDroneEnabled) return;
	console.log("****************** right *********************\n");
	droneClient
		.after(INTERVAL_BEFORE_ACTION, function () {
			this.right(ACTION_STRENGTH);
		}).after(INTERVAL_AFTER_ACTION, function () {
			this.stop();
		});
}

function up() {
	if(!isDroneEnabled) return;
	console.log("****************** up *********************\n");
	droneClient
		.after(INTERVAL_BEFORE_ACTION, function () {
			this.up(ACTION_STRENGTH);
		}).after(INTERVAL_AFTER_ACTION, function () {
			this.stop();
		});
}

function down() {
	if(!isDroneEnabled) return;
	console.log("****************** down *********************\n");
	droneClient
		.after(INTERVAL_BEFORE_ACTION, function () {
			this.down(ACTION_STRENGTH);
		}).after(INTERVAL_AFTER_ACTION, function () {
			this.stop();
		});
}

function yaw_left() {
	if(!isDroneEnabled) return;
	console.log("****************** yaw_left *********************\n");
	droneClient
		.after(INTERVAL_BEFORE_ACTION, function () {
			this.counterClockwise(ACTION_STRENGTH);
		}).after(INTERVAL_AFTER_ACTION, function () {
			this.stop();
		});
}

function yaw_right() {
	if(!isDroneEnabled) return;
	console.log("****************** yaw_right *********************\n");
	droneClient
		.after(INTERVAL_BEFORE_ACTION, function () {
			this.clockwise(ACTION_STRENGTH);
		}).after(INTERVAL_AFTER_ACTION, function () {
			this.stop();
		});
}

function isEnabled(){
	return isDroneEnabled;
}

function enable(){
	console.log("****************** enabled drone ******************\n");
	isDroneEnabled = true;
}

function disable(){
	console.log("****************** disabled drone ******************\n");
	isDroneEnabled = false;
}

function takeoff(){
	if(!isDroneEnabled) return;
	console.log("****************** taking off ******************\n");
	droneClient.takeoff();
	isFlying = true;
}

function land(){
	if(!isDroneEnabled) return;
	console.log("****************** landing *********************\n");
	droneClient.stop();
	droneClient.land();
	isFlying = false;
}

function onOffToggle(){
	isDroneEnabled = !isDroneEnabled;
	console.log("isDroneEnabled: " + isDroneEnabled);
}

function fireLeds(){
	if(!isDroneEnabled) return;
	console.log("****************** blinking leds *********************\n");
	droneClient.animateLeds('fire', 6, 3);
}




module.exports = {
	wave: wave,
	takeOffOrLand: takeOffOrLand,
	calibrate: calibrate,
	isEnabled : isEnabled,
	disableEmergencyMode : emergency,
	enable : enable,
	disable : disable,
	yaw_left : yaw_left,
	yaw_right: yaw_right,
	altitude_down : down,
	altitude_up : up,
	left : left,
	right : right,
	front : front,
	back : back,
	land: land,
	takeoff: takeoff,
	onOffToggle : onOffToggle,
	fireLeds: fireLeds

};