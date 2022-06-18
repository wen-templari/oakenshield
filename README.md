<!-- # Oakenshield
> a vue3/windicss/electron chat app for project durin -->
# Erebor
> 一个基于 Electron/Vue3/WindiCss/Go 的聊天APP
+ 桌面端: OakenShield(本仓库)
+ 服务端: [Durin](https://github.com/wen-templari/durin)


## 如何使用
### 桌面端
  + 安装文件位于 oakensheild/electron/dist_electron
  + 如果想要自己打包
    1. 安装 ```Node.js``` [地址](https://nodejs.org)
    2. 在项目oakenshield文件夹下，下载web所需依赖
      ```
      npm install
      ```
    3. 开发环境启动
      ```
      npm run electron:serve
      ```
    4. 使用vite打包web项目
      ```
      npm run build
      ```
    5. 打包electron
      ```
      npm run electron:build
      ```
    6. 打包完成的electron文件位于oakenshield/electron/dist_electron

### 服务端
+ 运行 durin/main.exe
+ 如果想要自己打包
  1. 安装 ```golang``` [地址](http://golang.org)
  2. 安装 ```redis``` [地址](https://redis.io)
  3. 将durin/src/util/redis.go中的redis地址改为你的redis地址
  ```go
  var (
	Pool        *redis.Pool
	redisServer = flag.String("redisServer", <Your Redis Adress>, "")
  )
  ```
  4. 在项目目录下运行
    ```Ï
    go run src/main.go
    ```
  5. 编译
    ```sh
    go build src/main.go
    ```


## 特点
  + 基于 Electron 开发，可跨平台
  + 聊天数据仅在本地存储（除离线消息外）
  + 图片使用阿里云OSS存储
  + 后端使用redis储存数据
  + Go 后端为未来扩展为分布式部署提供便利

## 界面介绍

  + 登入
  ![login](https://clas-bucket.oss-cn-hangzhou.aliyuncs.com/uPic/%E6%88%AA%E5%B1%8F2021-12-30%20%E4%B8%8B%E5%8D%884.54.09.png)
  + 消息发送
  ![main](https://clas-bucket.oss-cn-hangzhou.aliyuncs.com/uPic/%E6%88%AA%E5%B1%8F2021-12-30%20%E4%B8%8B%E5%8D%884.55.23.png)
  + 文件发送
  ![img ](https://clas-bucket.oss-cn-hangzhou.aliyuncs.com/uPic/截屏2021-12-30%20%E4%B8%8B%E5%8D%884.56.27.png)


## 功能具体实现
### 聊天
#### 消息传输
使用了websocket进行消息传输，后端使用gorilla/websocket包进行websocket通信
1. 前端开启websocket连接
```javascript
  start(id, token) {
    if (this.ws == null || this.ws.readyState == 3) {
      this.ws = new WebSocket("ws://localhost:23213/message?id=" + id + "&token=" + token);
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
```
2. 后端在鉴权后建立并保存websocket连接
``` go
	wsConn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	...
	client.SaveClient(id, wsConn)
```
3. 前端发送信息
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
        // 通过ipc向渲染进程发送"updateModel"事件
        mainWindow.webContents.send("updateModel", arg.from);
        });
      ```
    3. 渲染进程中
      ```js
      window.api.receive("messageSent", message => {
        // 查询数据库，更新model
        ...
      });
      ```
  2. 服务端转发消息
     1. client通过 ClientManager 的 Send Channel 将接收到的消息发送给 ClientManger
      ```go
      c.manager.Send <- message
      ```
     2. ClientManager 转发消息到对应 client 的 send Channel
      ```go
      manager.Clients[message.To].send <- message
      ```
      3. 收信 client 获取到消息后发送消息
      ```go
      message := <-c.send
      ...
      err := c.conn.WriteJSON(message)
      ```
  3. 客户端接受消息
     1.  /electron/main.js
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
#### WebSocket连接维持
通过客户端发送心跳包维持websocket连接
1. 服务端在建立连接时，为client开启一个heartbeatTimer协程，在心跳包超时时，关闭websocket连接
   ```go
    func (c *Client) heartbeatTimer() {
      fragmentCount := 600
      unregisterTime := 5000
      // 检查是否收到了心跳包
      for i := 0; i < fragmentCount; i++ {
        c.mu.Lock()
        if c.resetHeartbeatTimer {
          // 如果收到了心跳包(resetHeartbeatTimer=true)，重置计时器
          c.resetHeartbeatTimer = false
          i = 0
          c.mu.Unlock()
          continue
        }
        c.mu.Unlock()
        time.Sleep(time.Duration(unregisterTime/fragmentCount) * time.Millisecond)
      }
      c.close()
    }
    func SaveClient(id string, conn *websocket.Conn) int {
        ...
        // 开启心跳包协程
        go c.heartbeatTimer()
        ...
    }

   ```
2. 客户端发送心跳包
   客户端发送一个收件人为“heartbeat”的消息
   ```javascript
   // oakenshield/electorn/websocet.js
    start(id, token) {
      if (this.ws == null || this.ws.readyState == 3) {
        ...
          const heartbeatMessage = {
            from: id,
            to: "heartbeat",
          };
          const heartbeatMessageStr = JSON.stringify(heartbeatMessage);
          this.heartbeat(heartbeatMessageStr);
        ...
    }
    // 当websocket连接建立时，定时发送心跳包
    heartbeat(message) {
      if (this.ws.readyState == 1) {
        setTimeout(() => {
          this.ws.send(message);
          this.heartbeat(message);
        }, 2000);
      }
    }
   ```
3. 服务端接收心跳包
   ```go
    ...
    if message.To == "heartbeat" {
		  c.resetHeartbeatTimer = true
    } ...
   ```
   
#### 聊天信息
聊天信息中包括 发件人，收件人，信息类型，信息内容，时间
```go
type Message struct {
	From    string `json:"from"`
	To      string `json:"to"`
	Content string `json:"content"`
	Type    string `json:"type"`
	Time    string `json:"time"`
}
```
```Type```用于判读信息的类型，分为文本(plain)和图片(img)，若为图片类型，`Content`字段为图片的url
#### 聊天信息储存
使用了indexedDB+Dexie进行储存
+ 创建数据库
  ```js
  this.db.version(1).stores({
      contact_list: "id,name",
  });
  ```
+ 添加信息
  ```javascript
  async appendMessage(id, message) {
    ...
    //获取要添加的对象
    let contactToAppend = await this.db.contact_list.get({ id: id });
    ...
    //更新数据库
    return this.db.contact_list.where({ id: id }).modify({
      messageList: contactToAppend.messageList,
    });
  }
  ```
### 图片储存
图片由后端存到阿里云oss，并将图片地址返回给前端
图片的具体储存使用了阿里云提供的实例，并封装至`durin/src/util/oss`
前端通过 `POST` `/file` 上传图片
```go
func File(c *gin.Context) {
	file, err := c.FormFile("upload")
	...

    // 使用封装好了的方法将图片传到oss
	filePath := util.UploadImg(openedFile)

	fileDTO := model.FileDTO{
		Path: filePath,
	}
	
	//将图片接口返回
	c.JSON(200, util.NewReturnObject(0, "Success", fileDTO))
}
```

### 用户账号
用户账号中包括 ID,用户名，密码，头像
```go
type Account struct {
	Id       string `json:"id" redis:"id"`
	Name     string `json:"name" redis:"name"`
	Password string `json:"password" redis:"password"`
	Avatar   string `json:"avatar" redis:"avatar"`
}
```
用户数据以Hash的结构保存在redis中，key为id