const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const osc = require('osc');
let string = "random text";
const fs = require('fs');


var udpPort = new osc.UDPPort({
  // This is the port we're listening on.
  localAddress: "127.0.0.1",
  localPort: 7401,

  // This is where sclang is listening for OSC messages.
  remoteAddress: "127.0.0.1",
  remotePort: 7400,
  metadata: true
});

var udpPort2 = new osc.UDPPort({
  // This is the port we're listening on.
  localAddress: "127.0.0.1",
  localPort: 7402,

  // This is where sclang is listening for OSC messages.
  remoteAddress: "127.0.0.1",
  remotePort: 7407,
  metadata: true
});

var udpPort3 = new osc.UDPPort({
  // This is the port we're listening on.
  localAddress: "127.0.0.1",
  localPort: 8495,

  // This is where sclang is listening for OSC messages.
  remoteAddress: "127.0.0.1",
  remotePort: 7500,
  metadata: true
});

var udpPort4 = new osc.UDPPort({
  // This is the port we're listening on.
  localAddress: "127.0.0.1",
  localPort: 8499,

  // This is where sclang is listening for OSC messages.
  remoteAddress: "127.0.0.1",
  remotePort: 7600,
  metadata: true
});

udpPort.open();
udpPort2.open();
udpPort3.open();
udpPort4.open();

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('a user connected');
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    udpPort.send({
      address: "/jsmessage",
      args: [
          {
              type: "s",
              value: msg
          }
      ]
  });
  });
  });

  io.on('connection', (socket) => {
    socket.on('retry', (msg) => {
      console.log('message: ' + msg);
      udpPort.send({
        address: "/retry",
        args: [
            {
                type: "s",
                value: msg
            }
        ]
    });
    });
    });

    io.on('connection', (socket) => {
      socket.on('finish', (msg) => {
        let appendpoem = '\n-----------------\n' + msg;
        fs.appendFile('poems.txt', appendpoem, function (err) {
          if (err) throw err;
          console.log('Saved!');
        });
        console.log('message: ' + msg);
        udpPort3.send({
          address: "/totouch",
          args: [
              {
                  type: "s",
                  value: msg
              }
          ]
      });
      udpPort4.send({
        address: "/trigger",
        args: [
            {
                type: "f",
                value: 1
            }
        ]
    });
      });
      });
    
      io.on('connection', (socket) => {
        socket.on('keyword', (srch) => {
          console.log('message: ' + srch);
          udpPort4.send({
            address: "/sounds",
            args: [
                {
                    type: "s",
                    value: srch
                }
            ]
        });
      });
    });

  udpPort.on('message', function (oscMsg) {
    console.log("An OSC message just arrived!", oscMsg);
    let string = oscMsg.args[0].value;
    console.log(string);
    io.emit('chat message', string);
  });

  udpPort2.on('message', function (oscMsg2) {
    console.log("An OSC message just arrived!", oscMsg2);
    let string2 = oscMsg2.args[0].value;
    console.log(string2);
    io.emit('chat message', string2);
  });



