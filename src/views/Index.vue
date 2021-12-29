<script setup>
import { ref, computed ,onBeforeUnmount} from "vue";
import UserCard from "@/components/UserCard/UserCard.vue";
import LayoutBase from "@/layout/LayoutBase.vue";
import DBWrapper from "@/utils/db";
import router from "@/router";
import DateFormat from "@/utils/dateFormat.js";
import { Account } from "@/services/api.js";
import { useRoute } from "vue-router";
const route = useRoute();

// get contact list at load
// fresh contact list on modelUpdate & messageReceived event

const id = localStorage.getItem("id");
const name = localStorage.getItem("name");
const token = localStorage.getItem("token");
const avatar = ref(localStorage.getItem("avatar"));
console.log(avatar.value)
window.api.send("startConn", {
  id: id,
  token: token,
});
const contactList = ref([]);
const currentContact = ref({});

const getContactList = async () => {
  let res = await DBWrapper.getContactList();
  contactList.value = res;
  if (currentContact.value.id != null) {
    currentContact.value = res.find(c => c.id == currentContact.value.id);
  }
};
getContactList();

// search to add new contact
const searchInput = ref();
const searchList = ref([]);
const listToRender = computed(() => {
  let res;
  if (searchList.value.length > 0) {
    res = searchList.value;
  } else {
    res = contactList.value;
  }
  for (let i in res) {
    if (res[i].messageList) {
      res[i].lastMessage = res[i].messageList[res[i].messageList.length - 1] || {};
    }
  }
  return res;
});
const searchInputHandler = e => {
  searchList.value = [];
  if (searchInput.value.length > 0) {
    Account.get(searchInput.value).then(res => {
      console.log(res)
      if (res.data !=null) {
        searchList.value.push(res.data);
      }
    });
    searchInput.value = "";
  }
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
    searchList.value = [];
    await DBWrapper.addContact(currentContact.value);
    await getContactList();
  }
};
const updateAvatar = event => {
  let file = event.target.files[0];
  let param = new FormData();
  param.append("upload", file);
  Account.updateAvatar(id, param).then(res => {
    localStorage.setItem("avatar", res.data.path);
    avatar.value = res.data.path;
  });
};
window.api.receive("updateModel", key => {
  getContactList();
});
const logout = () => {
  window.api.send("logout");
  localStorage.clear();
  router.push("/login");
};

onBeforeUnmount(() => {
  window.api.removeAllListeners();
});
</script>
<template>
  <LayoutBase>
    <template #side>
      <div class="flex flex-col h-full overflow-auto">
        <div class="flex mx-2 mt-1">
          <input
            class="rounded-lg border-transparent h-8 textInput materialInput p-3 text-sm w-full"
            type="text"
            placeholder="搜索"
            name=""
            id=""
            v-model="searchInput"
            @focusout="searchInputHandler"
          />
        </div>
        <div class="mt-3 px-2 overflow-auto">
          <UserCard
            @click="setCurrentContact(item)"
            v-for="item in listToRender"
            key="item.id "
            :id="item.id"
            :name="item.name"
            :avatar="item.avatar"
            :lastMessage="item.lastMessage"
            :active="item.id == selectedItem"
          ></UserCard>
        </div>
      </div>
      <div class="flex-shrink-0 flex items-end justify-between pb-3 px-4">
        <div class="flex items-end p-1">
          <label class="relative textLink text-xs self-end cursor-pointer rounded-xl">
            <img class="h-10 w-10 mb-0.5 rounded-full" :src="avatar" />

            <input id="file-upload" type="file" class="sr-only" accept="image/*" @change="updateAvatar" />
          </label>
          <span class="font-semibold ml-1">{{ name }}</span>
          <span class="ml-1 textDescription">({{ id }})</span>
        </div>
        <button class="text-center text-sm font-semibold rounded px-1 p-0.5 mb-0.5 hover:(bg-gray-400/40 )" @click="logout">登出</button>
      </div>
    </template>
    <template #main>
      <router-view></router-view>
    </template>
  </LayoutBase>
</template>
