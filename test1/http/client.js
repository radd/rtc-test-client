var request = require('request');

// node .\client.js 100 100
var args = process.argv.slice(2);
var msgCount = parseInt(args[0]);
var payloadSize = args.length > 1 ? parseInt(args[1]) : 100;
var countRecMsg = 0;
var startTime;
var endTime;
var IP = "localhost";

var options = {
  uri: 'http://'+IP+':8080/http/send',
  method: 'POST',
  body: getPayload()
};


function startTest() {
	startTime = Date.now();
	for(var i = 0; i < msgCount; i++) {
		sendMsg();		
	}
};


function sendMsg() {
		
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			countRecMsg++;
			
			if(countRecMsg==msgCount)
			{		
				endTime = Date.now();
				endTest();
			}
		}
	});
}


function getPayload() {
	var data = '';
	for (var i=0; i < payloadSize; i++) {
		data += "A";
	}
	return data;
}


function endTest() {
	//console.log("End test");
	
	var diff = endTime - startTime;
	console.log(diff);
	
	process.exit(0);
}


startTest();



