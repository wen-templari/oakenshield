<script setup>
import LayoutBase from "@/layout/LayoutBase.vue";
import InputBase from "@/components/Input/InputBase.vue";
import { Account } from "@/services/api.js";
import router from "@/router";
import { ref } from "@vue/reactivity";
import DB from "@/utils/db";

const id = ref("");
const password = ref("");
const name = ref("");
const isIDValid = ref("");
const isPasswordValid = ref("");
const login = () => {
  Account.login({
    id: id.value,
    password: password.value,
  }).then(async res => {
    console.log(res);
    if (res.resCode == 0) {
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("name", res.data.name);
      localStorage.setItem("token", res.data.token);
      if (res.data.avatar != "") {
        localStorage.setItem("avatar", res.data.avatar);
      } else {
        localStorage.setItem("avatar", "https://erebor.oss-cn-hangzhou.aliyuncs.com/1640782786961");
      }
      DB.init(res.data.id);
      if (res.data.offlineMessage) {
        await DB.setOfflineMessage(res.data.offlineMessage);
      }
      window.api.send("startConn", {
        id: res.data.id,
        token: res.data.token,
      });
      router.push("/");
    } else if (resultCode === 1401) {
      isIDValid.value = "账号不存在";
    } else if (resultCode === 102) {
      isPasswordValid.value = "密码错误";
    }
  });
};

const registerSwitch = ref(false);
const switchRegister = b => {
  registerSwitch.value = b;
};

const register = _ => {
  Account.register({
    name: name.value,
    password: password.value,
  }).then(res => {
    console.log(res);
    if (res.resCode == 0) {
      id.value = res.data.id;
      login();
    }
  });
};
</script>
<template>
  <LayoutBase class="select-none">
    <template #side>
      <div class="flex flex-col items-center h-full border">
        <div class="h-1/4 flex flex-col justify-center">
          <div class="text-center text-3xl font-semibold tracking-wide mt-10">OakenShield</div>
          <div class="text-center text-2xl mt-6" v-if="!registerSwitch">需要登入来开始聊天</div>
          <div class="text-center text-2xl mt-6" v-if="registerSwitch">注册账号</div>
        </div>
        <form class="flex flex-col p-5 mt-15 w-full" v-if="!registerSwitch">
          <InputBase class="my-2 w-full" v-model:content="id" :passWarning="isIDValid" placeholder="ID" />
          <InputBase class="my-2 w-full" v-model:content="password" :passWarning="isPasswordValid" placeholder="密码" type="password" />
          <button class="mt-6 btn btnPrimary w-full" @click.prevent="login">登入</button>
          <div class="mt-5 flex flex-col items-center text-center">
            <div class="w-20 text-indigo-700 text-sm font-semibold cursor-pointer" @click="switchRegister(true)">没有账号?</div>
          </div>
        </form>
        <form @submit.prevent="register" class="flex flex-col p-5 mt-15 w-full" v-if="registerSwitch">
          <InputBase class="my-2 w-full" v-model:content="name" placeholder="昵称" />
          <InputBase class="my-2 w-full" v-model:content="password" placeholder="密码" type="password" />
          <button class="mt-6 btn btnPrimary w-full" type="submit">注册</button>
          <div class="mt-5 flex flex-col items-center text-center">
            <div class="w-20 text-indigo-700 text-sm font-semibold cursor-pointer" @click="switchRegister(false)">有账号了</div>
          </div>
        </form>
        <div></div>
      </div>
    </template>
    <template #main> </template>
  </LayoutBase>
</template>
