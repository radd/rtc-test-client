var request = require('request');

function reset() {
	
	var options = {
		uri: 'http://localhost:8080/lp/reset',
		method: 'GET'
	  };

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		}
	});
	
}

reset();