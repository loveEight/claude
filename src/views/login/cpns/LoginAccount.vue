<template>
  <div class="login-form">
    <el-form ref="ruleFormRef" :model="formRef" :rules="rules" label-width="60">
      <el-form-item label="帐号" prop="username">
        <el-input size="large" v-model="formRef.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          size="large"
          show-password
          v-model="formRef.password"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { defineComponent, nextTick, reactive, ref, defineExpose } from "vue";
import useLoginStore from "@/stores/login";
import hyStorge from "@/util/storge";
import { useRouter } from "vue-router";

export default defineComponent({
  setup() {
    const formRef = reactive({
      // name: hyStorge.localGet('username') || '',
      // password: hyStorge.localGet('password') || ''
      username: "",
      password: "",
    });

    const rules = reactive({
      name: [{ required: true, message: "请输入帐号", trigger: "blur" }],
      password: [{ required: true, message: "请输入密码", trigger: "blur" }],
    });

    //绑定表单
    const ruleFormRef = ref();

    const loginStore = useLoginStore();
    const router = useRouter();
    function vailForm() {
      if (!ruleFormRef.value) return;
      console.log("formRef", formRef);
      // ruleFormRef.value.validate((valid, fields) => {
      //   //验证通过,发起网络请求
      //   if (valid) {

      //     loginStore.accountRegisterAction(formRef).then(() => {
      //       hyStorge.localSet('username', formRef.name)
      //       const isSavePass = hyStorge.localGet('isSavePass')
      //       //有勾选就保存,无就清空
      //       if (isSavePass) {
      //         hyStorge.localSet('password', formRef.password)
      //       } else {
      //         formRef.password = ''
      //         hyStorge.localRemove('password')
      //       }
      //       router.push('/main')
      //     })
      //   } else {
      //     console.log('error submit!', fields)
      //   }
      // })
    }
    return {
      formRef,
      rules,
      ruleFormRef,
      vailForm
    };
  }
});
</script>

<style lang="less" scoped>
.login-form {
}
</style>
