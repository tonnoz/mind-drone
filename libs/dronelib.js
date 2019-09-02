const arDrone = require('ar-drone');
const readline = require('readline');


//drone client
const droneClient  = arDrone.createClient();
var isFlying = false;

//keyboard init
readline.emitKeypressEvents(process.stdin);
if(process.stdin.isTTY) {
	process.stdin.setRawMode(true);
}
 
//keyboard binding
process.stdin.on('keypress', (str, key) => {
  if (key && key.ctrl && key.name == 'c') {
	quit();
  }
  if(key && key.name ==='space'){
	takeOffOrLand();
  }
  if(key && key.name ==='w'){
	wave();
  }
  if(key && key.name ==='up'){
	front();
  }
  if(key && key.name ==='down'){
	back();
  }
  if(key && key.name ==='left'){
	left();
  }
  if(key && key.name ==='right'){
	right();
  }
  if (key && key.shift && key.name == 'up') {
	up();
  }
  if (key && key.shift && key.name == 'down') {
	down();
  }
  if(key && key.name ===','){
	yaw_left();
  }
  if(key && key.name ==='.'){
	yaw_right();
  }
  if(key && key.name ==='x'){
	calibrate();
  }

});

function takeOffOrLand() {
	if (!isFlying) {
		console.log("****************** taking off ******************\n");			
		droneClient.takeoff();
	} else {
		console.log("****************** landing *********************\n");
		droneClient.stop();
		droneClient.land();
	}
	isFlying = !isFlying;
}

function wave(){
	console.log("****************** waving *********************\n");
	droneClient.animate('wave', 500);
}

function calibrate(){
	console.log("****************** calibrating *********************\n");
	droneClient.calibrate(0);
}

function emergency(){
	console.log("****************** disable emergency *********************\n");
	droneClient.disableEmergency();
}

function front(){
	console.log("****************** front *********************\n");
	droneClient.front(0.1);
}

function back(){
	console.log("****************** back *********************\n");
	droneClient.back(0.1);
}

function left(){
	console.log("****************** left *********************\n");
	droneClient.left(0.1);
}

function right(){
	console.log("****************** right *********************\n");
	droneClient.right(0.1);
}

function up(){
	console.log("****************** up *********************\n");
	droneClient.up(0.1);
}

function down(){
	console.log("****************** down *********************\n");
	droneClient.down(0.1);
}


function yaw_left(){
	console.log("****************** yaw_left *********************\n");
	droneClient.counterClockwise(0.1);
}

function yaw_right(){
	console.log("****************** yaw_right *********************\n");
	droneClient.clockwise(0.1);
}

function quit(){
	console.log("****************** EXITING ******************\n");	  
	process.stdin.pause();
	isFlying = true;
	takeOffOrLand();
	process.exit(1);
}


module.exports = {
	wave: wave,
	takeOffOrLand: takeOffOrLand,
	calibrate: calibrate
};