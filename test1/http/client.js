var request = require('request');

// node .\client.js 100 100
var args = process.argv.slice(2);
var msgCount = parseInt(args[0]);
var payloadSize = args.length > 1 ? parseInt(args[1]) : 100;
var countRecMsg = 0;
var startTime;
var endTime;
var IP = "localhost";
//var IP = "192.168.10.2";

startTest();


var options = {
  uri: 'http://'+IP+':8080/http/send',
  method: 'POST',
  body: getPayload(),
  headers: {
    'Cache-Control': 'no-cache'
  }
};

//request(options, function (error, response, body) {
//	console.log("start");
//});

function startTest() {
	startTime = Date.now();
	//for(var i = 0; i < msgCount; i++) {
		sendMsg();		
	//}
};


function sendMsg() {
	//console.log("send: " + (Date.now() - startTime));
	request(options, function (error, response, body) {
		//console.log("rec: " + (Date.now() - startTime));
		if (!error && response.statusCode == 200) {
			countRecMsg++;
			//console.log(Date.now() - startTime);
			//console.log(JSON.stringify(response));
			if(countRecMsg==msgCount)
			{		
				endTime = Date.now();
				endTest();
			}
			else {
				sendMsg();
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



