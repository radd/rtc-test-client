//test2 - sse
const cp = require('child_process');
const fs = require('fs');

var args = process.argv.slice(2);
var testCount = args.length > 0 ? parseInt(args[0]) : 5;
var clientCount = args.length > 1 ? parseInt(args[1]) : 2;
var msgCount = args.length > 2 ? parseInt(args[2]) : 10;
var msgSpan = args.length > 3 ? parseInt(args[3]) : 100;

var currentTest = 1;
var output = [];
var avg = 0;


resetServer(runNextTest);

function runNextTest() {
  if(currentTest > testCount) {
    endTest();
    return;
  }
  
  currentTest++;
  var a = 1;
  var client = cp.execFile('node', ['./master_client.js', clientCount, msgCount, msgSpan], (error, stdout, stderr) => {
    if (error) {console.error('stderr', stderr);}
    
    var s = stdout.split('\n');
    
    for(var i = 0; i < s.length; i++) {
      
      if(s[i].indexOf('AVG:')==0) {
        var temp = s[i].replace('AVG:','');
        console.log(temp.trim());
        output.push(temp.trim());
        resetServer(runNextTest);
        break;
      }
    }   
    
  });

}


function resetServer(callback) {
  cp.execFile('node', ['./reset.js'], (error, stdout, stderr) => {
    if (error) {console.error('stderr', stderr);}
    callback();
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
