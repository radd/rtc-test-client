var request = require('request');
var EventSource = require('eventsource');


var id;
var interval;
var msgCount;
var timeSpan;
var delay;
var countSendMsg = 1;
var sendMsgReqCount = 0;
var eventSource;
var stopReceive;
var countRecMsg = 0;
var IP = "localhost";


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
	
	eventSource = new EventSource('http://'+IP+':8080/sse/reg?id='+id);
	
	
	eventSource.onopen = function() {
		process.send(JSON.stringify({"type": "connected"}));
	};

	eventSource.onmessage = function(message) {
		var res = JSON.parse(message.data);
		countRecMsg++;
		
		handleResponse(res);
		
		if(countRecMsg == stopReceive)
		{
			//console.log("client " + id + " end receive");
			endTest();
		}
		
		//console.log("client " + id + " dostał od :" + res.clientID);
		//console.log(res);
	};
	
	eventSource.onerror = function(e) {
		eventSource.close();
		console.log("close eventSource");
	};
	
	
	
}

function startTest() {
	//console.log("client " + id + " start test");
	
	var options = {
		uri: 'http://'+IP+':8080/sse/send',
		method: 'POST',
		json: {
			clientID: id,
			timestamp: 0,
			payload: ""
		}
	};

	setTimeout(function() {
		
		interval = setInterval(function() {
			
			if(sendMsgReqCount < msgCount){
				sendMsg(options);
				sendMsgReqCount++;
			}
			else {
				clearInterval(interval);
			}
			
		}, timeSpan);
	}, delay);
}


function sendMsg(options) {
	//console.log("client " + id + " send msg: " + countSendMsg);
	
	options.json.timestamp = Date.now();
	
	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			if(countSendMsg==msgCount)
			{
				//clearInterval(interval);
				//console.log("Client " + id + " end send msg");
			}
			//console.log("response " + countSendMsg);
			countSendMsg++;
		} 
		else {
			console.log("Error send msg. " + error);
			clearInterval(interval);
		}
	});
}





var times = [];

function handleResponse(res) {
	
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


