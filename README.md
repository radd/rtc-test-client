# Real-time communication test client

This client application is use for testing communication methods:
- HTTP Long Polling
- Server-Sent Events
- WebSocket
- WebSocket + STOMP

See [Server appliaction](https://github.com/radd/rtc-test-server)

## Outline

Test includes two scenarios:

### First scenario

First scenario tests HTTP and WebSocket protocol

Architecture:

<img src="https://radd.github.io/other/images/gps-test/scenario_1.jpg" width="400" >

### Second scenario

Second scenario tests methods:

- HTTP Long Polling
- Server-Sent Events
- WebSocket
- WebSocket with additional subprotocol STOMP

Architecture:

<img src="https://radd.github.io/other/images/gps-test/scenario_2.jpg" width="400" >

## Run test

**test1** folder refers to 1st scenario, **test2** to 2nd scenario.

Go to test1 or test2 folder, choose suitable methos and run **runTest.js**

### Scenario I

```bash
node runTest.js $1 $2 $3
```
Where:
- $1 is number of tests
- $2 is number of messages
- $3 is payload size

### Scenario II

```bash
node runTest.js $1 $2 $3 $4
```
Where:
- $1 is number of tests
- $2 is number of clients
- $3 is number of messages
- $4 is time between send next message

## Output

Test results are saved to **output.log** file

### Example for WebSocket:

```bash
--------------------- T E S T ---------------------
clientCount: 100, msgCount: 10, msgSpan: 1000
9.627700000000003
7.657590000000003
7.584609999999998
7.298040000000003
8.2348
AVG: 8.080548
```

