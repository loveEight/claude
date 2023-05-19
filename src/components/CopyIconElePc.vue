<template>
  <div class="copyIconEle">
        <div class="fillConent">
          <div class="btn" id="copy-btn" @click="handleCopyText(index)">
            <el-icon size="22"><CopyDocument /></el-icon>
          </div>
        </div>
  </div>
</template>

<script setup>
const props = defineProps({
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
    padding: 7px 2px 7px 7px;
    justify-content: center;
    align-items: center;
    color: #9999aa;
    /* background-color: #9999aa; */
    /* border-radius: 3px; */
  }
  .btn:hover {
    color: #000;
    /* background-color: #8f8f9e; */
  }
}
</style>
