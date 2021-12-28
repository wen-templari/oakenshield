<script setup>
</script>

<template>
  <router-view></router-view>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
/* 设置滚动条的样式 */
::-webkit-scrollbar {
  @apply w-2;
}
/* 滚动槽 */
::-webkit-scrollbar-track {
  /* @apply  */
  /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.3); */
  border-radius: 8px;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
  @apply rounded-[8px]
  border-radius: 8px;
  background: rgba(125, 125, 125, 0.8);
  /* -webkit-box-shadow: inset006pxrgba(0, 0, 0, 0.5); */
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgba(195, 195, 195, 0.8);
}
</style>
