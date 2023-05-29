<template>
  <div class="topTitle">
    <h2 class="title2">{{ "模型: Claude" }}</h2>
  </div>
</template>

<script setup>
const props = defineProps({
  isMobile: { type: Boolean, default: false },
});

</script>

<style lang="less" scoped>
.title {
  margin: 0 auto;
  max-width: 768px;
  height: 30px;
  line-height: 30px;
  padding: 0px 70px;
  text-align: center;
  color: rgb(115 115 115);
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分省略号 */
  white-space: nowrap; /* 不换行 */
}

.title2 {
  margin: 0 auto;
  max-width: 768px;
  height: 30px;
  line-height: 30px;
  padding: 0px 70px;
  text-align: center;
  color: rgb(115 115 115);
  overflow: hidden;
  text-overflow: ellipsis; /* 超出部分省略号 */
  white-space: nowrap; /* 不换行 */
  background-color: #f5f5f5;
}

@media screen and (max-width: 600px) {
  .title {
    color: #fff;
    height: 40px;
    line-height: 40px;
  }
  .title2 {
    height: 40px;
    line-height: 40px;
  }
}
</style>
