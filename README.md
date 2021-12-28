# Oakenshield
> a vue3/windicss/electron chat app for project durin

## todos
+ [x] presist
  + [x] structure
+ [ ] reigster
+ [x] search user
+ [ ] separate data between instences
+ [ ] offine message
+ [ ] test chat between different client
+ [ ] file

## 发送信息
1. /src/component/message
  ```js
  const sendMessage = async () => {
    ...
    // 将消息添加到数据库
    await db.appendMessage(id.value, message);
    // 将消息通过ipc发送给主进程
    window.api.send("sendMessage", message);
    ...
  };
  ```
2. /electron/main.js
  ```js
  ipcMain.on("sendMessage", (event, arg) => {
    // 将消息通过websocket发送给服务器
    WebSocketWrap.ws.send(JSON.stringify(arg)); 
    // 通过ipc向渲染进程发送"messageSent"事件
    mainWindow.webContents.send("messageSent", arg); 
  });
  ```
3. 渲染进程中
  ```js
  window.api.receive("messageSent", message => {
    // 查询数据库，更新model
    ...
  });
  ```
## 接收信息
1. /electron/main.js
   ```js
   const startWebsocket = (WebSocketWrap, id, token) => {
    WebSocketWrap.start(id, token);
    WebSocketWrap.ws.on("open", () => {
      // 监听服务器发送的消息
      WebSocketWrap.ws.on("message", event => {
        let eventString = event.toString();
        let message = JSON.parse(eventString);
        // 将消息通过ipc发送给渲染进程
        mainWindow.webContents.send("appendMessage", {
          key: message.from,
          message: message,
        });
      });
    });
   };
   ```
2. /src/utils/db.js
   ```js
   window.api.receive("appendMessage", async data => {
    // 将消息添加到数据库
    await db.appendMessage(data.key, data.message);
    // 向主进程发送updataMessage事件
    // 解决数据库操作的异步问题
    window.api.send("updateModel", data.key);
   });
   ```
3. /electron/main.js
   ```js
   ipcMain.on("updateModel", (event, arg) => {
     // 将数据库添加操作后的updataModel事件转发给渲染进程
     mainWindow.webContents.send("updateModel", arg);
   });
   ```
4. 渲染进程中
   ```js
    window.api.receive("updateModel", key => {
      // 查询数据库，更新model
      ...
    });
   ```