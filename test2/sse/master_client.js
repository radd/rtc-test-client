var cp = require('child_process');

var args = process.argv.slice(2);

var clients = {
	count: parseInt(args[0]),
	msgCount: parseInt(args[1]),
	msgSpan: parseInt(args[2]),
	list: [],
	clientsConnected: 0,
	clientsFinished: 0,
	avg: []
};


function createClients() {
	//console.log("countClient: " + clients.count);
	//console.log("msgCount: " + clients.msgCount);
	//console.log("msgSpan: " + clients.msgSpan);
	
	
	for (var i = 0; i < clients.count; i++) {
		var client = cp.fork('./client.js');
		clients.list.push(client);
		
		client.send(JSON.stringify({
			"type": "connect", 
			"id": i+1,
			"timeSpan": clients.msgSpan,
			"msgCount": clients.msgCount,
			"delay": (i+1) * (clients.msgSpan / clients.count),
			"stopReceive": clients.msgCount * clients.count
		}));
		
		client.on('message', function(message) {
			var msg = JSON.parse(message);

			if (msg.type === 'connected') {
				clients.clientsConnected++;
				if (clients.clientsConnected === clients.count) {
					console.log("All clients connected");
					startTest();
				}
			}
			else if (msg.type === 'end') {
				clients.clientsFinished++;
				clients.avg.push(msg.avg);
				if (clients.clientsFinished === clients.count) {
					console.log("All clients ended");
					endTest();
				}
			}
		});
		
		
	}
};


function startTest() {
	
	for (var i = 0; i < clients.count; i++) {
		clients.list[i].send(JSON.stringify({
			"type": "startTest"
			
		}));
	}
		
};

function endTest() {
	
	var sum = 0;
	for(var i =0; i<clients.avg.length; i++) {
		
		sum += clients.avg[i];
	}
	
	var avg = sum/clients.avg.length;
				
	console.log("AVG: " + avg);

  process.exit(0);

};


createClients();