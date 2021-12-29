# Oakenshield
> a vue3/windicss/electron chat app for project durin

## objective
+ 模拟QQ聊天软件
  +	账户信息管理，包括昵称、头像、级别等
  + 通信功能实现，包括文字传输、图片传输


## todos
+ [x] presist
  + [x] structure
+ [ ] reigster?
+ [x] search user
+ [x] ~~separate data between instences~~ 
+ [x] offine message
+ [ ] login hints
+ [ ] add notifier
+ [ ] window button group
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

4 frames


1
1 2 
1 2 3
2 3 4
3 4 2
4 2 1
2 1 5
1 5 6
5 6 2
6 2 1
2 1 2
1 2 3
2 3 7
3 7 6
7 6 3
6 3 2
3 2 1
2 1 2

1 1 
2 1 2 
3 1 2 3
4 1 2 4
2 1 2 4
1 1 2 4
5 1 2 5
6 1 2 6
2 1 2 6
1 1 2 6
2 1 2 6
3 3 2 6
7 3 2 7
6 3 2 6
3 3 2 6
2 3 2 5
1 3 2 1
2 3 2 1
3 3 2 1
6 6 2 1
5 5 2 1 
1 5 2 1
2 5 2 1
3 3 2 1
4 4 2 1

1,2 tran
3.x process managment !
  x 3.5/3.6
4 process/thread
  4.1
5 thrad sync
  ...