const wsAddr = "ws://localhost:8080/test";

const ws = new WebSocket(wsAddr);

ws.onopen = function (evt) {
  console.log("Connection open ...");
};
//接收到消息时触发
ws.onmessage = function (evt) {
  console.log("Received Message: " + evt);
  // messages.value.push(JSON.parse(evt.data));
};
//连接关闭时触发
ws.onclose = function (evt) {
  console.log("Connection closed.");
};

const websocket = {
  ws,
};

export { ws };
