const neurosky = require('node-neurosky');
const PubSub = require('pubsub-js');

var eegEnabled = true;

const NEUROSKY_CLIENT_KEYS = {
	appName: 'NodeNeuroSky',
	appKey: '0fc4141b4b45c675cc8d3a765b8d71c5bde9390'
};


module.exports = {
	eegClient : function() {
		const eegClient = neurosky.createClient(NEUROSKY_CLIENT_KEYS);
	
		eegClient.on('data', function(data) {
			if(eegEnabled) {
				PubSub.publish('eeg', data); //send raw data to 'eeg' topic
			}
		});
	
		return eegClient;
	},
	isEnabled : function(){
		return eegEnabled;
	},
	enable : function(){
		eegEnabled = true;
	},
	disable: function(){
		eegEnabled = false;
	},
	onOffToggle: function(){
		eegEnabled = !eegEnabled;
		console.log("eegEnabled: " + eegEnabled);
	}
};