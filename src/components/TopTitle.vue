<template>
  <div class="topTitle">
    <h2 class="title" v-if="isMobile">{{ currentLog?.title }}</h2>
    <h2 class="title2">{{ "模型: GPT-3.5" }}</h2>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import useHomeStore from "@/stores/home";
import { storeToRefs } from "pinia";

const props = defineProps({
  isMobile: { type: Boolean, default: false },
});

const homestore = useHomeStore();
const { currentLog } = storeToRefs(homestore);
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
