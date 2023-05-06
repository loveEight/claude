<template>
  <div class="ContextIconVant">
    <template v-if="!isMobile">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="是否开启上下文"
        placement="top-start"
      >
        <van-icon
          :size="size"
          name="chat"
          :style="{ color: props.isUsed ? '#67c23a' : '#606266' }"
        />
      </el-tooltip>
    </template>
    <template v-else>
        <van-icon
          :size="size"
          name="chat"
          :style="{ color: props.isUsed ? '#67c23a' : '#606266' }"
        />
    </template>
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

<style lang="scss" scoped>

</style>
