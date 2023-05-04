<template>
  <div class="ContextIconVant">
    <van-icon
      :size="25"
      name="comment-o"
      :style="{ color: props.isUsed ? 'orange' : '#000' }"
    />
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { showToast } from "vant";
const props = defineProps({
  size: "22",
  isMobile: false,
  isShow: false,
  isUsed: false,
});

//处理删除逻辑
function useContext(list) {
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
  message = !props.isUsed ? "开启上下文关联" : "关闭上下文关联";
  showToast(message);
}

//电脑
function pcToast() {
  message = !props.isUsed ? "开启上下文关联" : "关闭上下文关联";
  const type = !props.isUsed ? "success" : "info";
  ElMessage({
    message: message,
    type: type,
  });
}

defineExpose({
  useContext,
});
</script>

<style lang="scss" scoped></style>
