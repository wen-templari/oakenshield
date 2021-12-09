<script setup>
import { ref } from "vue";
import { ws } from "@/socket/main.js";
// interface Message {
//   from: string;
//   to: string;
//   content: string;
//   time: string;
// }

let messages = ref([]);
let self = "tom";

// const ws = new WebSocket("ws://localhost:8080/test");
// ws.onopen = function (evt) {
//   console.log("Connection open ...");
// };
// //接收到消息时触发
// ws.onmessage = function (evt) {
//   // console.log("Received Message: " + evt.data);
//   messages.value.push(JSON.parse(evt.data));
// };
// //连接关闭时触发
// ws.onclose = function (evt) {
//   console.log("Connection closed.");
// };

const setMessage = () => {
  let message = {
    to: "tom",
    from: "cat",
    content: "hello",
    time: "1",
  };
  messages.value.push(message);
};

setMessage();
const inputMessage = ref("");
const sendMessage = () => {
  if (inputMessage.value == "") {
    return;
  }
  let message = {
    to: "cat",
    from: "tom",
    content: inputMessage.value,
    time: "",
  };
  ws.send(JSON.stringify(message));
  inputMessage.value = "";
  // console.log(messages.value);
  // messages.value.push(message);
};
</script>
<template>
  <div class="flex flex-col justify-start h-full">
    <div class="h-13 drag bg-[#f0f2f3] flex items-center justify-center">NAME</div>
    <div class="flex-grow flex flex-col p-2">
      <div
        v-for="item in messages"
        class="py-1 px-2 m-1 rounded-lg shadow-sm w-min"
        :class="[item.from == self ? 'self-end bg-blue-200' : 'bg-gray-200']"
      >
        {{ item.content }}
      </div>
    </div>
    <div class="h-15 px-2 flex items-center justify-around">
      <!-- <div>123</div> -->
      <input v-model="inputMessage" class="textInput rounded-full h-7 mr-2 w-full" type="text" />
      <button class="btn btnxs btnPrimary h-7" @click="sendMessage()">send</button>
    </div>
  </div>
</template>
