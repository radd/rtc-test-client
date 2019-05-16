var request = require('request');

var id;
var interval;
var msgCount;
var timeSpan;
var delay;
var sendMsgReqCount = 0;
var nextMsg = 1;
var stopReceive;
var countRecMsg = 0;
var IP = "localhost";
//var IP = "192.168.10.2";

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
        setTimeout(function() {
          process.send(JSON.stringify({"type": "connected"}));
        },1000);

	} 
	else if (msg.type === "startTest") {
		startTest();
	}
	
	
});
	
function connect() {
	//console.log("connect");
    
	var options = {
		uri: 'http://'+IP+':8080/lp/get?next=' + nextMsg,
		method: 'GET'
	  };

	request(options, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var res = JSON.parse(body);
			
			handleResponse(res);

		}
	});
	
}

function startTest() {
	console.log("client " + id + " start test");
	
	var options = {
		uri: 'http://'+IP+':8080/lp/send',
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
                //options.json.payload = sendMsgReqCount;
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
			//
		} 
		else {
			console.log("Error send msg. " + error);
			clearInterval(interval);
		}
	});
}

var times = [];

function handleResponse(res) {

	if(!Array.isArray(res)) {
		console.log("ERROR (not array)");
		//TODO exit
		return;
	}

	for (let i = 0; i < res.length; i++) {
		const el = JSON.parse(res[i]);
		countRecMsg++;
		nextMsg++;
//console.log(countRecMsg);
		var nowTime = Date.now();
		times.push(nowTime - el.timestamp);
//console.log("id:" + id + " " + el.payload);

		if(countRecMsg == stopReceive)
		{
          
			console.log("client " + id + " end receive");
			endTest();
			break;
		}
	}

	//console.log("clien: " + id + " " + times);
	
	if(countRecMsg < stopReceive) {
		//console.log("conn id:" + id);
		
		connect();
	}
	
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


