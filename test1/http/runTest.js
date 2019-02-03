//test1 - http
const cp = require('child_process');
const fs = require('fs');

var args = process.argv.slice(2);
var testCount = args.length > 0 ? parseInt(args[0]) : 5;
var msgCount = args.length > 1 ? parseInt(args[1]) : 100;
var payloadSize = args.length > 2 ? parseInt(args[2]) : 100;

var currentTest = 1;
var output = [];
var avg = 0;


runNextTest();

function runNextTest() {
  if(currentTest > testCount) {
    endTest();
    return;
  }
  
  currentTest++;
  
  var client = cp.execFile('node', ['./client.js', msgCount, payloadSize], (error, stdout, stderr) => {
    if (error) {console.error('stderr', stderr);}
    console.log(stdout.trim());
    output.push(stdout.trim());
    runNextTest();
  });

}

function endTest() {
  console.log("end test");
  
  var sum = 0;
  for(var i = 0; i < output.length; i++) {
    sum += parseInt(output[i]);
	}

	avg = sum/output.length;
  
  wtiteToFile();
}


var path = 'output.log';
var newLine = '\r\n';

function wtiteToFile() {
  fs.appendFileSync(path, '--------------------- T E S T ---------------------' + newLine);
  fs.appendFileSync(path, 'msgCount: ' + msgCount + ", payload: " + payloadSize + newLine);
  
  for(var i = 0; i<output.length; i++) {
    fs.appendFileSync(path, output[i]);
    fs.appendFileSync(path, newLine);
  }
  fs.appendFileSync(path, 'AVG: ' + avg + newLine );
  
  fs.appendFileSync(path, newLine);
}
