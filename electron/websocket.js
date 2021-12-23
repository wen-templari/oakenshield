const WebSocket = require("ws");

class WebSocketWrap {
  constructor() {
    this.ws = null;
  }
  start(id, token) {
    this.ws = new WebSocket("ws://localhost:8080/message?id=" + id + "&token=" + token);
  }
}

module.exports = new WebSocketWrap();
