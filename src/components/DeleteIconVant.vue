<template>
  <div class="deleteIconVant">
    <template v-if="!isMobile">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="是否删除聊天记录"
        placement="top-start"
      >
        <van-icon :size="size" name="delete" color="#606266" />
      </el-tooltip>
    </template>
    <template v-else>
      <van-icon :size="size" name="delete" color="#606266"/>
    </template>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from "element-plus";
import { showDialog } from "vant";
import { showConfirmDialog } from "vant";
import { showSuccessToast, showFailToast } from "vant";
const props = defineProps({
  size: { type: String, default: "22" },
  isMobile: { type: Boolean, default: false },
  isShow: { type: Boolean, default: false },
});

//处理删除逻辑
function handleDelete(list) {
  if (!props.isShow) return;
  if (props.isMobile) {
    showConfirmDialog({
      title: "是否清空聊天记录",
      confirmButtonColor: "#f11c27",
    })
      .then(() => {
        emits("confirm");
      })
      .catch(() => {
        // on cancel
      });
  } else {
    ElMessageBox.confirm("是否删除全部聊天记录", "警告", {
      confirmButtonText: "确认",
      cancelButtonText: "取消",
      type: "warning",
      confirmButtonClass: "confirm-btn",
    })
      .then(() => {
        emits("confirm");
      })
      .catch(() => {});
  }
}

function successToast() {
  if (props.isMobile) {
    showSuccessToast({
      message: "删除成功",
      overlay: true,
      forbidClick: true,
      duration: 700,
    });
  } else {
    ElMessage({
      type: "success",
      message: "删除成功",
    });
  }
}

function failToast() {
  if (props.isMobile) {
    showFailToast({
      message: "不存在记录",
      overlay: true,
      forbidClick: true,
      duration: 700,
    });
  } else {
    ElMessage.error("不存在记录");
  }
}

const emits = defineEmits(["confirm"]);

defineExpose({
  handleDelete,
  successToast,
  failToast,
});
</script>

<style lang="scss" scoped>
:global(.confirm-btn) {
  background-color: #f56c6c !important;
  border: 1px solid #f56c6c !important;
}
</style>
