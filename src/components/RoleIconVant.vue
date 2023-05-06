<template>
  <div class="ContextIconVant">
    <template v-if="!isMobile">
      <el-tooltip
        class="box-item"
        effect="dark"
        content="扮演角色"
        placement="top-start"
      >
        <van-icon
          :size="size"
          name="friends"
          :style="{ color: props.isUsed ? 'orange' : '#606266' }"
        />
      </el-tooltip>
    </template>
    <template v-else>
      <van-icon
        :size="size"
        name="friends"
        :style="{ color: props.isUsed ? 'orange' : '#606266' }"
      />
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  size: { type: String, default: "22" },
  isMobile: { type: Boolean, default: false },
  isShow: { type: Boolean, default: false },
});

//处理删除逻辑
function useRole() {
  if (!props.isShow) return;
  emits('showRole')
}

defineExpose({
  useRole,
});

const emits = defineEmits(['showRole'])

</script>

<style lang="scss" scoped>
.content {
  padding: 16px 16px 160px;
}
</style>
