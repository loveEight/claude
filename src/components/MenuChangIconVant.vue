<template>
  <div class="mengChange" @click="handleShowMenu">
    <van-icon name="arrow" v-if="!isShow" />
    <van-icon name="arrow-left" v-else />
  </div>
</template>

<script setup>
const props = defineProps({
  isShow: { type: Boolean, default: true },
});

const emits = defineEmits(["control"]);
//展开菜单
const handleShowMenu = () => {
  emits("control", !props.isShow);
};
</script>

<style lang="less" scoped>
.mengChange {
  position: absolute;
  text-align: center;
  line-height: 30px;
  width: 30px;
  height: 30px;
  background-color: #32333e;
  top: 0;
  right: -30px;
  border-radius: 0 3px 3px 0;
  cursor: pointer;
}
@media screen and (max-width: 600px) {
  .mengChange {
    line-height: 40px;
    width: 40px;
    height: 40px;
    right: -40px;
  }
}
</style>
