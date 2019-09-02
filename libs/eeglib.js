const neurosky = require('node-neurosky');
const drone = require('./dronelib');
const PubSub = require('pubsub-js');

const NEUROSKY_CLIENT_KEYS = {
	appName: 'NodeNeuroSky',
	appKey: '0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
};


module.exports = {
	eegClient : function() {
		const BLINK_STRENGTH_THRESHOLD = 50;
		const ATTENTION_STRENGTH_THRESHOLD = 95;
		const MIN_INTERVAL_ACTION = 2000;
		const eegClient = neurosky.createClient(NEUROSKY_CLIENT_KEYS);

		var recently_takeOffOrLand = false;
		var recently_waved = false;
	
		eegClient.on('data', function(data) {
			PubSub.publish('eeg', data); //send raw data to 'eeg' topic
			if(data.blinkStrength && data.blinkStrength >= BLINK_STRENGTH_THRESHOLD && !recently_takeOffOrLand) {
				setTimeout(function(){recently_takeOffOrLand = false}, MIN_INTERVAL_ACTION);
				recently_takeOffOrLand = true;
				drone.takeOffOrLand();
			}else{
				if(data.eSense.attention && data.eSense.attention >= ATTENTION_STRENGTH_THRESHOLD && !recently_waved){
					setTimeout(function(){recently_takeOffOrLand = false}, MIN_INTERVAL_ACTION);
					recently_takeOffOrLand = true;
					drone.wave();
				}
			}
		});
	
		return eegClient;
	}
};