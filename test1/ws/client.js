var W3CWebSocket = require('websocket').w3cwebsocket;

// node .\client.js 100 100
var wsClient;
var args = process.argv.slice(2);
var msgCount = parseInt(args[0]);
var payloadSize = args.length > 1 ? parseInt(args[1]) : 100;
var countRecMsg = 0;
var payload = getPayload();
var startTime;
var endTime;
var IP = "localhost";

function connect() {
	
	wsClient = new W3CWebSocket('ws://'+IP+':8080/ws-connect');

  wsClient.onerror = function() {
      console.log('Connection Error');
  };

  wsClient.onopen = function() {
      	startTest();
  };

  wsClient.onclose = function() {
      console.log('echo-protocol Client Closed');
  };

  wsClient.onmessage = function(e) {
      countRecMsg++;
		
			if(countRecMsg == msgCount)
			{
				endTime = Date.now();				
				endTest();
			}
  };

	
}

function startTest() {
	startTime = Date.now();
	for(var i = 0; i < msgCount; i++) {
		sendMsg();		
	}
};


function sendMsg() {
	wsClient.send(payload);
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

