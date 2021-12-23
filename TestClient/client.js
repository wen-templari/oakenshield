// import WebSocket from "ws";

// const ws = new WebSocket("ws://localhost:8080");

// ws.on("open", function open() {
//   ws.send("something");
// });

// ws.on("message", function message(data) {
//   console.log("received: %s", data);
// });

const WebSocket = require("ws");

// class WebSocketWrap{

// }

let ws;
try {
  ws = new WebSocket("ws://localhost:8080/message?id=123");
  ws.on("open", function open() {
    ws.send("something");
  });

  ws.on("message", function message(data) {
    console.log("received: %s", data);
  });
} catch (error) {
  console.log(error);
}
