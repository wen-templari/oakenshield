<script setup>
import { ref, watch, computed, onMounted } from "vue";
import { useRoute } from "vue-router";
const route = useRoute();
import { File } from "@/services/api";
import db from "@/utils/db";
import DateFormat from "@/utils/dateFormat.js";

// const messageBox = ref(null);
// const scrollTop = messageBox.value.scrollTop;
// defineExpose({ scrollTop });
// // const setScrollTop = e => {
// //   // messageBox.value.
// // };
// onMounted(() => {
//   console.log(messageBox.value.scrollHeight);
//   messageBox.value.scrollTop = messageBox.value.scrollHeight;
//   console.log(messageBox.value.scrollTop);
//   // messageBox.value.focus();
// });
// window.scrollTo(0, document.body.scrollHeight);

const self = localStorage.getItem("id");
const avatar = ref(localStorage.getItem("avatar"));
const id = ref(route.params.id);
const contact = ref({});

const setContact = async () => {
  id.value = route.params.id;
  await db.updateContact(id.value);
  db.getContact(id.value).then(res => {
    contact.value = res;
  });
};
setContact();
watch(route, setContact);

const messageList = computed(() => {
  let res = contact.value.messageList;
  // display time when there is a gap
  let lastTime;
  for (let i in res) {
    let time = new Date(res[i].time);
    if (lastTime != null) {
      if (time - lastTime > 240000) {
        res[i].showTime = DateFormat(res[i].time);
      }
    }
    lastTime = time;
  }
  return res;
});

const inputMessage = ref("");
const sendMessage = async message => {
  await db.appendMessage(id.value, message);
  window.api.send("sendMessage", message);
  contact.value.messageList.push(message);
};
const sendPlain = () => {
  if (inputMessage.value == "") {
    return;
  }
  let message = {
    from: self,
    to: id.value,
    content: inputMessage.value,
    type: "plain",
    time: new Date(),
  };
  sendMessage(message);
  inputMessage.value = "";
};
const sendImg = event => {
  let file = event.target.files[0];
  let param = new FormData();
  param.append("upload", file);
  File.upload(param).then(res => {
    let message = {
      from: self,
      to: id.value,
      content: res.data.path,
      type: "img",
      time: new Date(),
    };
    sendMessage(message);
  });
};

const handleModelUpdate = key => {
  console.log(key)
  if (key == id.value) {
    setContact();
  }
};

window.api.receiveOnce("updateModel", handleModelUpdate);
</script>
<template>
  <div class="flex flex-col justify-start h-screen" ref="messageBox">
    <div class="h-13 flex-shrink-0 drag bg-[#f0f2f3] flex items-center justify-center">{{ contact.name }}</div>
    <div class="flex-grow flex flex-col p-2 overflow-auto" ref="messageBox">
      <div v-for="item in messageList">
        <div v-if="item.showTime" class="text-xs font-light text-gray-500 mt-2 text-center">{{ item.showTime }}</div>
        <div class="relative flex my-2" :class="[item.from == self ? 'flex-row-reverse ' : '']">
          <img class="h-9 w-9 bg-black rounded-full mx-1" :src="item.from == self ? avatar : contact.avatar" />
          <div
            v-if="item.type == 'plain'"
            class="py-1 px-2 rounded-lg shadow-sm w-min"
            :class="[item.from == self ? 'bg-blue-200' : 'bg-gray-200']"
          >
            {{ item.content }}
          </div>
          <div v-if="item.type == 'img'" class="p-3 rounded-lg shadow-sm bg-gray-200">
            <img class="w-50" :src="item.content" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="h-12 flex-shrink-0 px-2 pt-2 flex items-start justify-around">
      <input
        v-model="inputMessage"
        class="textInput rounded-full h-7 mr-1 px-3 p-0.5 text-sm w-9/10"
        type="text"
        @keypress.enter="sendPlain()"
        maxlength="40"
      />
      <label class="relative mx-2 h-7 w-9 flex items-center justify-center rounded-ful cursor-pointer">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.31543 23.1816H18.6846C20.5742 23.1816 21.5498 22.1885 21.5498 20.29V12.3096C21.5498 11.0791 21.3916 10.5166 20.627 9.73438L16.0303 5.06738C15.2832 4.31152 14.668 4.13574 13.5605 4.13574H9.31543C7.43457 4.13574 6.4502 5.12891 6.4502 7.03613V20.29C6.4502 22.1885 7.43457 23.1816 9.31543 23.1816ZM9.46484 21.4238C8.62109 21.4238 8.19922 20.9844 8.19922 20.1758V7.1416C8.19922 6.3418 8.62109 5.89355 9.47363 5.89355H13.2002V10.6748C13.2002 11.9492 13.8242 12.5645 15.0898 12.5645H19.8008V20.1758C19.8008 20.9844 19.3789 21.4238 18.5264 21.4238H9.46484ZM15.2568 11.0264C14.8877 11.0264 14.7295 10.8682 14.7295 10.5078V6.12207L19.5635 11.0264H15.2568ZM14.7734 19.6221V16.9678L14.7031 15.6055L15.3799 16.3174L16.0391 16.9941C16.1709 17.1348 16.373 17.2227 16.5576 17.2227C16.9619 17.2227 17.2607 16.9414 17.2607 16.5547C17.2607 16.3262 17.1729 16.168 17.0059 16.0186L14.5889 13.8037C14.3867 13.6191 14.2197 13.5312 14 13.5312C13.7803 13.5312 13.6133 13.6191 13.4111 13.8037L10.9941 16.0186C10.8271 16.168 10.7393 16.3262 10.7393 16.5547C10.7393 16.9414 11.0381 17.2227 11.4424 17.2227C11.627 17.2227 11.8291 17.1348 11.9609 16.9941L12.6201 16.3174L13.2969 15.6055L13.2266 16.9678V19.6221C13.2266 20.0439 13.5781 20.3691 14 20.3691C14.4219 20.3691 14.7734 20.0439 14.7734 19.6221Z"
            fill="black"
          />
        </svg>
        <input type="file" class="sr-only" accept="image/*" @change="sendImg" />
      </label>
      <button class="rounded-full bg-gray-400" @click="sendPlain()">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14 22.0039C14.5713 22.0039 14.9756 21.5996 14.9756 21.0195V10.165L14.9053 8.2666L17.1816 10.8066L19.1855 12.793C19.3613 12.9688 19.6074 13.083 19.8799 13.083C20.416 13.083 20.8203 12.6787 20.8203 12.125C20.8203 11.8701 20.7236 11.6328 20.5127 11.4219L14.7207 5.62109C14.5273 5.41895 14.2637 5.31348 14 5.31348C13.7275 5.31348 13.4639 5.41895 13.2705 5.62109L7.4873 11.4219C7.27637 11.6328 7.17969 11.8701 7.17969 12.125C7.17969 12.6787 7.5752 13.083 8.11133 13.083C8.39258 13.083 8.63867 12.9688 8.81445 12.793L10.8096 10.8066L13.0947 8.25781L13.0156 10.165V21.0195C13.0156 21.5996 13.4199 22.0039 14 22.0039Z"
            fill="white"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
