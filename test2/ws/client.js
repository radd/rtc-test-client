var request = require('request');
var W3CWebSocket = require('websocket').w3cwebsocket;

var wsClient;
var id;
var interval;
var msgCount;
var timeSpan;
var delay;
var countSendMsg = 1;
var sendMsgReqCount = 0;
var stopReceive;
var countRecMsg = 0;
//var IP = "localhost";
var IP = "192.168.10.2";

process.on('message', function(message) {
	var msg = JSON.parse(message);
	if (msg.type === "connect") {
		id = parseInt(msg.id);
		msgCount = parseInt(msg.msgCount);
		timeSpan = parseInt(msg.timeSpan);
		delay = parseFloat(msg.delay);
		stopReceive = parseInt(msg.stopReceive);
		
		//console.log("client: " + id);
		//console.log("msgCount: " + msgCount);
		//console.log("timeSpan: " + timeSpan);
		//console.log("delay: " + delay);

		connect();

	} 
	else if (msg.type === "startTest") {
		startTest();
	}
	
	
});

function connect() {

  wsClient = new W3CWebSocket('ws://'+IP+':8080/ws-connect');

  wsClient.onerror = function() {
      console.log('Connection Error');
  };

  wsClient.onopen = function() {
    process.send(JSON.stringify({"type": "connected"}));	
  };

  wsClient.onclose = function() {
    console.log('echo-protocol Client Closed');
  };

  wsClient.onmessage = function(message) {
    var res = JSON.parse(message.data);
    countRecMsg++;
  
    handleResponse(res);
    
    if(countRecMsg == stopReceive)
    {
      //console.log("client " + id + " end receive");
      endTest();
    }
  };


	
}

function startTest() {
	//console.log("client " + id + " start test");
	
	setTimeout(function() {
		
		interval = setInterval(function() {
			
			if(sendMsgReqCount < msgCount){
				sendMsg();
				sendMsgReqCount++;
			}
			else {
				console.log("Client " + id + " end send msg");
				clearInterval(interval);
			}
			
		}, timeSpan);
	}, delay);
}


function sendMsg() {
	//console.log("client " + id + " send msg: " + countSendMsg);

	var data = {
		clientID: id,
		timestamp: Date.now(),
		payload: ""
	}
	wsClient.send(JSON.stringify(data));

}

var times = [];

function handleResponse(res) {
	//console.log(res);
	var nowTime = Date.now();
	times.push(nowTime - res.timestamp);
	//console.log("client " + id + " " + (nowTime - res.timestamp));
}


function endTest() {
	
	var sum = 0;
	
	for(var i =0; i<times.length; i++) {
		
		sum += times[i];
	}
	
	var avg = sum/times.length;
	
	setTimeout(function() {
		process.send(JSON.stringify({
			"type": "end",
			"avg": avg
			})
		);
	}, id*10);
					
	//console.log("END AVG: " + avg);

}


