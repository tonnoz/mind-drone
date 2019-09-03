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
  if(key && key.name ==='i'){
	yaw_left();
  }
  if(key && key.name ==='o'){
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
	droneClient
		.after(50, function() {
			this.front(0.2);
		}).after(300, function() {
			this.stop();
		});
}

function back(){
	console.log("****************** back *********************\n");
	droneClient
		.after(50, function() {
			this.back(0.2);
		}).after(300, function() {
			this.stop();
		});
}

function left(){
	console.log("****************** left *********************\n");
	droneClient
		.after(50, function() {
			this.left(0.2);
		}).after(300, function() {
			this.stop();
		});
}

function right(){
	console.log("****************** right *********************\n");
	droneClient
		.after(50, function() {
			this.right(0.2);
		}).after(300, function() {
			this.stop();
		});
}

function up(){
	console.log("****************** up *********************\n");
	droneClient
		.after(50, function() {
			this.up(0.2);
		}).after(300, function() {
			this.stop();
		});
}

function down(){
	console.log("****************** down *********************\n");
	droneClient
		.after(50, function() {
			this.down(0.2);
		}).after(300, function() {
			this.stop();
		});
}

function yaw_left(){
	console.log("****************** yaw_left *********************\n");
	droneClient
		.after(50, function() {
			this.counterClockwise(0.2);
		}).after(300, function() {
			this.stop();
		});
}

function yaw_right(){
	console.log("****************** yaw_right *********************\n");
	droneClient
		.after(50, function() {
			this.clockwise(0.2);
		}).after(300, function() {
			this.stop();
		});
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