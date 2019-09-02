const request = require('request');

const options = {
  url: '',
  headers: {
   
  },
  method: 'POST'
};

function callback(error, response, body) {
	console.log(JSON.stringify(body));
}

request(options, callback);
