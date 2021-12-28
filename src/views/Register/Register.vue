<script setup>
import LayoutBase from "@/layout/LayoutBase.vue";
import InputBase from "@/components/Input/InputBase.vue";
import { Account } from "@/services/api.js";
import router from "@/router";
import { ref } from "@vue/reactivity";

const id = ref("");
const password = ref("");

const login = () => {
  Account.login({
    id: id.value,
    password: password.value,
  }).then(res => {
    localStorage.setItem("id", res.data.id);
    router.push("/");
  });
};

const switchToRegister = () => {
  router.push("/register");
};
</script>
<template>
  <LayoutBase>
    <template #side>
      <div class="flex flex-col items-center h-full border">
        <div class="h-1/4 flex flex-col justify-center">
          <div class="text-center text-3xl font-semibold tracking-wide mt-10">OakenShield</div>
          <div class="text-center text-2xl mt-6">需要登入来开始聊天</div>
        </div>
        <form class="flex flex-col p-5 mt-15 w-full">
          <InputBase class="no-drag my-2 w-full" v-model:content="id" placeholder="ID" />
          <InputBase class="no-drag my-2 w-full" v-model:content="password" placeholder="密码" type="password" />
          <button class="no-drag mt-6 btn btnPrimary w-full" @click.prevent="login">登入</button>
          <div class="mt-5">
            <div class="text-center text-indigo-700 text-sm font-semibold" @click="switchToRegister">创建账号</div>
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
