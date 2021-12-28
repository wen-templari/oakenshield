const WebSocket = require("ws");

class WebSocketWrap {
  constructor() {
    this.ws = null;
  }
  start(id, token) {
    if (this.ws == null || this.ws.readyState == 3) {
      this.ws = new WebSocket("ws://localhost:8080/message?id=" + id + "&token=" + token);
      this.ws.on("open", () => {
        console.log("connected");
        const heartbeatMessage = {
          from: id,
          to: "heartbeat",
        };
        const heartbeatMessageStr = JSON.stringify(heartbeatMessage);
        this.heartbeat(heartbeatMessageStr);
      });
    }
  }
  heartbeat(message) {
    setTimeout(() => {
      this.ws.send(message);
      this.heartbeat(message);
    }, 2000);
  }
  close() {
    if (this.ws.readyState == 1) {
      this.ws.close();
    }
  }
}

module.exports = new WebSocketWrap();
