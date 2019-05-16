var request = require('request');
//var IP = "localhost";
var IP = "192.168.10.2";

function reset() {
	
	var options = {
		uri: 'http://'+IP+':8080/sse/reset',
		method: 'GET'
	  };

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
		}
	});
	
}

reset();