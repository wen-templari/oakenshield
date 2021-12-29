// preload.js
const { contextBridge, ipcRenderer } = require("electron");

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
  invoke: async (channel, args) => {
    return await ipcRenderer.invoke(channel, args);
  },
  send: (channel, data) => {
    ipcRenderer.send(channel, data);
  },
  receive: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => func(...args));
  },
  receiveOnce: (channel, func) => {
    ipcRenderer.once(channel, (event, ...args) => func(...args));
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  }
 });
