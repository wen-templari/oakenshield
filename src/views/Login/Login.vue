<script setup>
import WindowButtonGroup from "@/components/WindowButtonGroup/WindowButtonGroup.vue";
import LayoutBase from "@/layout/LayoutBase.vue";
import InputBase from "@/components/Input/InputBase.vue";
import { Account } from "@/services/api.js";
import router from "@/router";
import { ref } from "@vue/reactivity";
import DB from "@/utils/db";

const id = ref("");
const password = ref("");
const name = ref("");

const login = () => {
  Account.login({
    id: id.value,
    password: password.value,
  }).then(async res => {
    console.log(res);
    localStorage.setItem("id", res.data.id);
    localStorage.setItem("name", res.data.name);
    localStorage.setItem("token", res.data.token);
    DB.init(res.data.id);
    if (res.data.offlineMessage) {
      await DB.setOfflineMessage(res.data.offlineMessage);
    }
    window.api.send("startConn", {
      id: res.data.id,
      token: res.data.token,
    });
    router.push("/");
  });
};

const register = ref(false);
const registerSwitch = b => {
  register.value = b;
};
</script>
<template>
  <WindowButtonGroup></WindowButtonGroup>
  <LayoutBase class="select-none">
    <template #side>
      <div class="w-full h-13 drag"></div>
      <div class="flex flex-col items-center h-full border">
        <div class="h-1/4 flex flex-col justify-center">
          <div class="text-center text-3xl font-semibold tracking-wide mt-10">OakenShield</div>
          <div class="text-center text-2xl mt-6" v-if="!register">需要登入来开始聊天</div>
          <div class="text-center text-2xl mt-6" v-if="register">注册账号</div>
        </div>
        <form class="flex flex-col p-5 mt-15 w-full" v-if="!register">
          <InputBase class="no-drag my-2 w-full" v-model:content="id" placeholder="ID" />
          <InputBase class="no-drag my-2 w-full" v-model:content="password" placeholder="密码" type="password" />
          <button class="no-drag mt-6 btn btnPrimary w-full" @click.prevent="login">登入</button>
          <div class="mt-5 flex flex-col items-center text-center">
            <div class="w-20 text-indigo-700 text-sm font-semibold cursor-pointer" @click="registerSwitch(true)">没有账号?</div>
          </div>
        </form>
        <form class="flex flex-col p-5 mt-15 w-full" v-if="register">
          <InputBase class="no-drag my-2 w-full" v-model:content="name" placeholder="昵称" />
          <InputBase class="no-drag my-2 w-full" v-model:content="password" placeholder="密码" type="password" />
          <button class="no-drag mt-6 btn btnPrimary w-full" @click.prevent="login">注册</button>
          <div class="mt-5 flex flex-col items-center text-center">
            <div class="w-20 text-indigo-700 text-sm font-semibold cursor-pointer" @click="registerSwitch(false)">有账号了</div>
          </div>
        </form>
        <div></div>
      </div>
    </template>
    <template #main> </template>
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
