var request = require('request');

function reset() {
	
	var options = {
		uri: 'http://localhost:8080/sse/reset',
		method: 'GET'
	  };

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		}
	});
	
}

reset();