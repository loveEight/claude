<script setup>
import { RouterView } from "vue-router";
// Toast
import 'vant/es/toast/style';
// Dialog
import 'vant/es/dialog/style';
// Notify
import 'vant/es/notify/style';
// ImagePreview
import 'vant/es/image-preview/style';
</script>

<template>
  <div class="app">
    <RouterView />
  </div>
</template>

<style scoped>
html{
  padding: 0;
  margin: 0;
  background-color: #f1f1f4;
}
.app {
  width: 100vw;
  height: 100vh;
}
</style>
