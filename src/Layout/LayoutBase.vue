<template>
  <div class="flex">
    <div class="bg-[#e4e6e7] h-screen overflow-hidden w-[318px] flex flex-col">
      <slot name="side"></slot>
    </div>
    <div class="flex-grow">
      <slot name="main"></slot>
    </div>
  </div>
</template>
