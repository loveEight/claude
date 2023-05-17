<template>
  <div class="login">
    <login-pannel></login-pannel>
  </div>
</template>

<script setup>
import LoginPannel from "./cpns/LoginPannel.vue";
</script>

<style lang="scss" scoped>
// position: absolute;
// top: 30%;
// left: 50%;
// transform: translate(-50%, -50%);
.login {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
