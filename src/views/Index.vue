<script setup>
import { ref, computed } from "vue";
import WindowButtonGroup from "@/components/WindowButtonGroup/WindowButtonGroup.vue";
import UserCard from "@/components/UserCard/UserCard.vue";
import Message from "@/components/Message/Message.vue";
import LayoutBase from "@/layout/LayoutBase.vue";
import DBWrapper from "@/utils/db";
import router from "@/router";
import { Account } from "@/services/api.js";
import { useRoute } from "vue-router";
const route = useRoute();

const wsAddr = "ws://localhost:8080/message";
const id = localStorage.getItem("id");
const ws = new WebSocket(wsAddr + "?id=" + id);
const contactList = ref([]);
const currentContact = ref({});

const appendMessage = async (id, msg) => {
  await DBWrapper.appendMessage(id, msg).then(res => {
    DBWrapper.getContactList();
  });
};

const getContactList = async () => {
  let res = await DBWrapper.getContactList();
  contactList.value = res;
  if (currentContact.value.id != null) {
    currentContact.value = res.find(c => c.id == currentContact.value.id);
  }
  console.log(contactList.value);
};
getContactList();

const addSwitch = ref(false);
const searchInput = ref();
const searchList = ref([]);
const listToRender = computed(() => {
  if (addSwitch.value) {
    return searchList.value;
  } else {
    return contactList.value;
  }
});
const searchInputHandler = e => {
  if (addSwitch.value) {
    Account.search(searchInput.value).then(res => {
      console.log(res);
      searchList.value.push(res.data);
    });
  }
};
const switchAdd = v => {
  if (v != null) {
    addSwitch.value = v;
  } else {
    addSwitch.value = !addSwitch.value;
  }
  searchInput.value = "";
};

const selectedItem = computed(() => {
  let fullPath = route.path;
  let tailIndex = fullPath.lastIndexOf("/");
  let pagePath = fullPath.substring(tailIndex + 1);
  return pagePath;
});

const setCurrentContact = async contact => {
  currentContact.value = contact;
  router.push("/" + contact.id);
  if (
    contactList.value.filter(contact => {
      return contact.id == currentContact.value.id;
    }).length == 0
  ) {
    await DBWrapper.addContact(currentContact.value);
    await getContactList();
  }
};
ws.onopen = evt => {
  console.log("Connection open ...");
};
ws.onmessage = evt => {
  console.log("Received Message: " + evt.data);
  let msg = JSON.parse(evt.data);
  appendMessage(msg.from, msg).then(() => {
    getContactList();
  });
  // messages.value.push(JSON.parse(evt.data));
};
ws.onclose = evt => {
  console.log("Connection closed.");
};


const sendMessage = async msg => {
  let message = {
    to: msg.to,
    from: msg.from,
    content: msg.content,
    time: new Date(),
  };
  ws.send(JSON.stringify(message));
  await appendMessage(msg.to, message);
  await getContactList();
};

const getLastMessage = msgList => {
  let lastMessage = msgList[msgList.length - 1];
  return lastMessage;
};

const logout = () => {
  localStorage.removeItem("id");
  router.push("/login");
};
</script>
<template>
  <WindowButtonGroup></WindowButtonGroup>
  <LayoutBase>
    <template #side>
      <div class="w-full h-13 flex-shrink-0 drag flex flex-row-reverse items-center"></div>
      <div class="flex flex-col h-full overflow-auto">
        <div class="flex mx-2 mt-1">
          <input
            class="rounded-lg border-transparent mr-2 h-8 textInput materialInput p-3 text-sm w-full"
            type="text"
            placeholder="搜索"
            name=""
            id=""
            v-model="searchInput"
            @focusout="searchInputHandler"
          />
          <div class="h-8 w-8 flex-shrink-0 materialInput rounded-lg cursor-pointer flex items-center justify-center">
            <div v-if="!addSwitch" @click="switchAdd">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M7.63672 14.6562H12.998V20.0176C12.998 20.5625 13.4463 21.0195 14 21.0195C14.5537 21.0195 15.002 20.5625 15.002 20.0176V14.6562H20.3633C20.9082 14.6562 21.3652 14.208 21.3652 13.6543C21.3652 13.1006 20.9082 12.6523 20.3633 12.6523H15.002V7.29102C15.002 6.74609 14.5537 6.28906 14 6.28906C13.4463 6.28906 12.998 6.74609 12.998 7.29102V12.6523H7.63672C7.0918 12.6523 6.63477 13.1006 6.63477 13.6543C6.63477 14.208 7.0918 14.6562 7.63672 14.6562Z"
                  fill="#1C1C1E"
                />
              </svg>
            </div>
            <div v-if="addSwitch" @click="switchAdd">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M8.31348 17.9346C7.94434 18.3037 7.92676 18.9629 8.32227 19.3408C8.7002 19.7363 9.36816 19.7188 9.7373 19.3496L14 15.0869L18.2627 19.3496C18.6406 19.7275 19.291 19.7363 19.6689 19.3408C20.0645 18.9629 20.0557 18.3037 19.6777 17.9258L15.415 13.6631L19.6777 9.40918C20.0557 9.02246 20.0645 8.37207 19.6689 7.99414C19.291 7.59863 18.6406 7.60742 18.2627 7.98535L14 12.248L9.7373 7.98535C9.36816 7.61621 8.7002 7.59863 8.32227 7.99414C7.92676 8.37207 7.94434 9.03125 8.31348 9.40039L12.5762 13.6631L8.31348 17.9346Z"
                  fill="#1C1C1E"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="mt-3 px-2 overflow-auto">
          <div v-if="listToRender.length == 0 && addSwitch" class="text-center textDescription">输入ID来添加对话</div>
          <UserCard
            @click="setCurrentContact(item)"
            v-for="item in listToRender"
            key="item.id "
            :name="item.name"
            :id="item.id"
            :active="item.id == selectedItem"
          ></UserCard>
        </div>
      </div>
      <div class="flex-shrink-0 flex items-center justify-between h-18 px-8">
        <div class="">{{ id }}</div>
        <button class="btnxs btnWarning text-center" @click="logout">logout</button>
      </div>
    </template>
    <template #main>
      <router-view @sendMessage="sendMessage" :ws="ws"></router-view>
      <!-- <Message
        v-if="currentContact.id != null"
        :name="currentContact.name"
        :id="currentContact.id"
        :messageList="currentContact.messageList"
        @sendMessage="sendMessage"
      ></Message> -->
    </template>
  </LayoutBase>
</template>
<style>
.drag {
  -webkit-app-region: drag;
  -webkit-user-select: none;
}
.no-drag {
  -webkit-app-region: no-drag;
}
</style>
