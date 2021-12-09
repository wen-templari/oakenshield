<script setup>
import InputBase from "@/components/Input/InputBase.vue";
</script>
<template>
  <div class="w-full h-13 drag"></div>
  <div class="flex flex-col items-center h-full border">
    <div class="h-1/4 flex flex-col justify-center">
      <div class="text-center text-3xl font-semibold tracking-wide mt-10">OakenShield</div>
      <div class="text-center text-2xl mt-6">Login to start</div>
    </div>
    <form class="flex flex-col p-5 mt-15 w-full">
      <InputBase class="no-drag my-2 w-full" v-model="id" placeholder="ID" />
      <InputBase class="no-drag my-2 w-full" v-model="id" placeholder="密码" />
      <button class="no-drag mt-6 btn btnPrimary w-full" @click="login">登入</button>
      <div class="mt-5">
        <div class="text-center text-indigo-700 text-sm font-semibold">创建账号</div>
      </div>
    </form>
    <div></div>
  </div>
</template>
