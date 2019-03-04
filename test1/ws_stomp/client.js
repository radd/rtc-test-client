var Stomp = require('stompjs');

// node .\client.js 100 100
var args = process.argv.slice(2);
var msgCount = parseInt(args[0]);
var payloadSize = args.length > 1 ? parseInt(args[1]) : 100;
var countRecMsg = 0;
var payload = getPayload();
var startTime;
var endTime;
var IP = "localhost";

function connect() {
	
	wsClient = Stomp.overWS('ws://'+IP+':8080/send');

	wsClient.connect({}, function(frame) {
    //console.log('Connected');
		
		wsClient.subscribe('/topic/receive', function(message) {
			countRecMsg++;
		
			if(countRecMsg == msgCount)
			{
				endTime = Date.now();				
				endTest();
			}
    });
		
		startTest();
		
    });

	
}

function startTest() {
	startTime = Date.now();
	for(var i = 0; i < msgCount; i++) {
		sendMsg();		
	}
};


function sendMsg() {
	wsClient.send('/ws/send', {}, payload);
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

connect();

