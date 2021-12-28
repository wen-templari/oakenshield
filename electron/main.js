// main.js

// 控制应用生命周期和创建原生浏览器窗口的模组
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const WebSocketWrap = require("./websocket");

const NODE_ENV = process.env.NODE_ENV;

// const a = require("electron").remote.app;
let appPath = app.getAppPath();

let targetPath = path.join(appPath, "data");
// app.setPath("userData", targetPath);

let mainWindow;

function createWindow() {
  // 创建浏览器窗口
  mainWindow = new BrowserWindow({
    width: 900,
    height: 660,
    minWidth: 640,
    minHeight: 540,
    // resizable: false,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  // 加载 index.html
  mainWindow.loadURL(NODE_ENV === "development" ? "http://localhost:3000" : `file://${path.join(__dirname, "../dist/index.html")}`);
  // 打开开发工具
  if (NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }
  // mainWindow.on("resize", function () {
  //   var size = mainWindow.getSize();
  //   var width = size[0];
  //   var height = size[1];
  //   mainWindow.webContents.send("resized", height);
  //   console.log(size);
  //   console.log("width: " + width);
  //   console.log("height: " + height);
  // });
}

// establish websocket connection
const startWebsocket = (WebSocketWrap, id, token) => {
  WebSocketWrap.start(id, token);
  WebSocketWrap.ws.on("open", () => {
    // console.log("connected");
    WebSocketWrap.ws.on("message", event => {
      let eventString = event.toString();
      let message = JSON.parse(eventString);
      mainWindow.webContents.send("appendMessage", {
        key: message.from,
        message: message,
      });
      // mainWindow.webContents.send("receivedMessage", message);
      console.log("received message", message);
    });
  });
};

// 这段程序将会在 Electron 结束初始化和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
    // 打开的窗口，那么程序会重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

// close window
ipcMain.on("close", (event, arg) => {
  mainWindow.close();
});

ipcMain.on("minimize", (event, arg) => {
  mainWindow.minimize();
  console.log("minimize");
});

ipcMain.on("full", (event, arg) => {
  mainWindow.setFullScreen(!mainWindow.isFullScreen());
  console.log("full");
});

// start websocket
ipcMain.on("startConn", (event, arg) => {
  startWebsocket(WebSocketWrap, arg.id, arg.token);
});

// send message via socket
ipcMain.on("sendMessage", (event, arg) => {
  WebSocketWrap.ws.send(JSON.stringify(arg));
  mainWindow.webContents.send("messageSent", arg);
});

ipcMain.on("updateModel", (event, arg) => {
  mainWindow.webContents.send("updateModel", arg);
});

ipcMain.on("logout", (event, arg) => {
  WebSocketWrap.close();
});
