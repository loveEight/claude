<template>
  <div class="copyIconEle">
    <template v-if="isMobile">
      <el-popover
        v-if="!iscancel && isUseCopy"
        :placement="isMobile ? 'left' : 'right'"
        :popper-style="{ width: '50px !important' }"
        trigger="click"
      >
        <template #reference>
          <el-icon class="moreFilled"><MoreFilled /></el-icon>
        </template>
        <div class="fillConent">
          <div class="btn" id="copy-btn" @click="handleCopyText(index)">
            <el-icon><DocumentCopy /></el-icon>
            复制
          </div>
        </div>
      </el-popover>
    </template>
    <template v-else="isMobile">
      <el-popover
        v-if="!iscancel"
        :placement="isMobile ? 'left' : 'right'"
        :popper-style="{ width: '50px !important' }"
        trigger="click"
      >
        <template #reference>
          <el-icon class="moreFilled"><MoreFilled /></el-icon>
        </template>
        <div class="fillConent">
          <div class="btn" id="copy-btn" @click="handleCopyText(index)">
            <el-icon><DocumentCopy /></el-icon>
            复制
          </div>
        </div>
      </el-popover>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  iscancel: { type: Boolean, default: false },
  isUseCopy: { type: Boolean, default: false },
  isMobile: { type: Boolean, default: false },
  index: { type: Number, default: 0 },
});

//复制文本内容
function handleCopyText(index) {
  // const text = list.value[index].text
  //   .replace(/(<([^>]+)>)/gi, "")
  //   .replace(/(\r\n|\n|\r)/gm, "");

  console.log("index", index);
  const currentIndex = index - 1 === 0 ? 0 : (index - 1) / 2;
  emits("copy", currentIndex);
}

const emits = defineEmits(["copy"]);
</script>

<style lang="scss" scoped>
.fillConent {
  display: flex;
  justify-content: space-around;
  flex-direction: column;
  cursor: pointer;
  .btn {
    .el-icon {
      margin-right: 4px;
    }
    display: flex;
    padding: 5px 5px;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: #48484e;
    border-radius: 3px;
  }
  .btn:hover {
    background-color: #59595e;
  }
}
</style>
