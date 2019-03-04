//test2 - ws
const cp = require('child_process');
const fs = require('fs');
var request = require('request');

var args = process.argv.slice(2);
var testCount = args.length > 0 ? parseInt(args[0]) : 5;
var clientCount = args.length > 1 ? parseInt(args[1]) : 2;
var msgCount = args.length > 2 ? parseInt(args[2]) : 10;
var msgSpan = args.length > 3 ? parseInt(args[3]) : 100;

var currentTest = 1;
var output = [];
var avg = 0;
var isMonitoring = false;
var monitorDelay = isMonitoring ? 5000 : 0;

runNextTest();

function runNextTest() {
  if(currentTest > testCount) {
    endTest();
    return;
  }
  
  startServerMonitor(function () {
    currentTest++;

    var client = cp.execFile('node', ['./master_client.js', clientCount, msgCount, msgSpan], (error, stdout, stderr) => {
      if (error) {console.error('stderr', stderr);}
      
      var s = stdout.split('\n');
      
      for(var i = 0; i < s.length; i++) {
        
        if(s[i].indexOf('AVG:')==0) {
          var temp = s[i].replace('AVG:','');
          console.log(temp.trim());
          output.push(temp.trim());

          finishServerMonitor(runNextTest);

          break;
        }
      }   
      
    });

  });

}

function endTest() {
  var sum = 0;
  for(var i = 0; i < output.length; i++) {
    sum += parseFloat(output[i]);
  }

  avg = sum/output.length;
  console.log("AVG: " + avg);
  
  wtiteToFile();
  console.log("end test");
  
}

function startServerMonitor(callback) {
  if(!isMonitoring) {
    callback();
    return;
  }
    
  var options = {
		uri: 'http://localhost:8080/monitor/start',
		method: 'POST',
		json: {
      start: isMonitoring,
			type: "ws",
			testID: currentTest
		}
	};

  request(options, function (error, response, body) {
    setTimeout(callback, monitorDelay);
  });
  
}

function finishServerMonitor(callback) {
  setTimeout(function () {
    var options = {
      uri: 'http://localhost:8080/monitor/stop',
      method: 'GET'
    };
  
    request(options, function (error, response, body) { 

      callback();
    });

  }, monitorDelay);

}


var path = 'output.log';
var newLine = '\r\n';

function wtiteToFile() {
  fs.appendFileSync(path, '--------------------- T E S T ---------------------' + newLine);
  fs.appendFileSync(path, 'clientCount: ' + clientCount + ', msgCount: ' + msgCount + ", msgSpan: " + msgSpan + newLine);
  
  for(var i = 0; i<output.length; i++) {
    fs.appendFileSync(path, output[i]);
    fs.appendFileSync(path, newLine);
  }
  fs.appendFileSync(path, 'AVG: ' + avg + newLine );
  
  fs.appendFileSync(path, newLine);
}
