// preload.js
const { contextBridge, ipcRenderer } = require("electron");
console.log("hello from preload.js");

contextBridge.exposeInMainWorld("api", {
  // send: (channel, data) => {
  //   // whitelist channels
  //   let validChannels = ["toMain"];
  //   if (validChannels.includes(channel)) {
  //     ipcRenderer.send(channel, data);
  //   }
  // },
  // receive: (channel, func) => {
  //   let validChannels = ["fromMain"];
  //   if (validChannels.includes(channel)) {
  //     // Deliberately strip event as it includes `sender`
  //     ipcRenderer.on(channel, (event, ...args) => func(...args));
  //   }
  // },
  send: (channel, data) => {
    console.log(data);
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
});
