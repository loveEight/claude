<template>
  <div class="ContextIconVant">
    <van-icon
      :size="size"
      name="column"
      :style="{ color: props.isUsed ? '#67c23a' : '#606266' }"
    />
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { showToast } from "vant";
const props = defineProps({
  size: { type: String, default: "22" },
  isMobile: { type: Boolean, default: false },
  isShow: { type: Boolean, default: false },
  isUsed: { type: Boolean, default: false },
});

//处理删除逻辑
function useCopy(list) {
  if (!props.isShow) return;
  if (props.isMobile) {
    mobileToast();
  } else {
    pcToast();
  }
}

let message = "";
//手机
function mobileToast() {
  message = !props.isUsed ? "开启内容复制" : "关闭内容复制";
  showToast(message);
}

//电脑
function pcToast() {
  message = !props.isUsed ? "开启内容复制" : "关闭内容复制";
  const type = !props.isUsed ? "success" : "info";
  ElMessage({
    message: message,
    type: type,
  });
}

defineExpose({
  useCopy,
});
</script>

<style lang="scss" scoped>
.ContextIconVant {
  margin-right: 33px;
}
</style>
