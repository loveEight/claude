<template>
  <div class="pannel">
    <h1 class="title">Chatbot</h1>
    <!-- <login-form></login-form> -->
    <!-- 帐号或手机登录 -->
    <el-tabs 
      type="border-card" 
      class="tabs" 
      stretch
      v-model="tabName"
      @tabChange="handleTabChange"
      >
      <el-tab-pane name="登录">
        <template #label>
          <span class="custom-tabs-label">
            <el-icon><UserFilled /></el-icon>
            <span>帐号登录</span>
          </span>
        </template>
        <login-account ref="accountRef"></login-account>
      </el-tab-pane>
      <el-tab-pane el-tab-pane name="注册">
        <template #label>
          <span class="custom-tabs-label">
            <!-- <el-icon><Iphone /></el-icon>
            <span>手机登录</span> -->
            <el-icon><UserFilled /></el-icon>
            <span>注册帐号</span>
          </span>
        </template>
        <login-account ref="accountRef"></login-account>
      </el-tab-pane>
    </el-tabs>

    <!-- 记住或登录密码 -->
    <div class="linkControl">
      <el-checkbox
        v-model="isRememberP"
        size="large"
        label="记住密码"
        @change="handleChangeRe"
      />
      <div class="forgetP"><el-link type="primary">忘记密码</el-link></div>
    </div>

    <div class="submit">
      <el-button type="primary" size="large" @click="handleSubmit"
        >立即{{ tabName }}</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import LoginAccount from './LoginAccount.vue'
import hyStorge from '@/util/storge'

const isRememberP = ref(false)
const tabName = ref('登录')

function handleTabChange(e) {
  console.log(e)
}

function handleChangeRe(isRemember) {
  // console.log(e)
  isRememberP.value = isRemember
  // 保留到本地缓存
  // if (!isRemember) hyStorge.localRemove('password')
  hyStorge.localSet('isSavePass', isRememberP.value)
}

const accountRef = ref()
function handleSubmit() {
  if(accountRef.value) {
    accountRef.value.vailForm()
  }
}

onMounted(() => {
  isRememberP.value = hyStorge.localGet('isSavePass')
})
</script>

<style lang="less" scoped>
.pannel {
  width: 330px;
  margin-bottom: 150px;
  h1 {
    font-size: 2em;
    font-weight: bold;
  }
  .title {
    margin: 15px 0;
    text-align: center;
  }

  .tabs > .el-tabs__content {
    padding: 32px;
    color: #6b778c;
    font-size: 32px;
    font-weight: 600;
  }
  .tabs .custom-tabs-label .el-icon {
    vertical-align: middle;
  }
  .tabs .custom-tabs-label span {
    vertical-align: middle;
    margin-left: 4px;
  }

  .linkControl {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .rememberP {
      display: flex;
      align-items: center;
      .el-checkbox {
        margin-right: 8px;
      }
    }
  }

  .submit {
    margin-top: 10px;
    .el-button {
      width: 100%;
    }
  }
}
</style>
