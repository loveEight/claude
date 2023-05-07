<template>
  <div class="roleList">
    <template v-if="!isMobile">
      <div class="pcList">
        <el-dialog
          v-if="dialogFormVisible"
          v-model="dialogFormVisible"
          title="AI扮演的角色"
          :destroy-on-close="true"
        >
          <el-form :model="form">
            <el-form-item label="角色" :label-width="formLabelWidth">
              <el-select
                v-model="form.text"
                placeholder="请选择AI扮演的角色"
                no-match-text="不存在该选项"
                filterable
              >
                <!-- <template v-for="item in columns" :key="item.text">
                  <el-option :label="item.text" :value="item.value" />
                </template> -->
                <el-option-group
                  v-for="group in roleList"
                  :key="group.key"
                  :label="group.key"
                >
                  <el-option
                    v-for="item in group.options"
                    :key="item.key"
                    :label="item.key"
                    :value="item.value"
                  />
                </el-option-group>
              </el-select>
            </el-form-item>
            <el-form-item label="详情" :label-width="formLabelWidth">
              <el-input
                type="textarea"
                v-model="form.text"
                :autosize="{ minRows: 1, maxRows: 8 }"
              >
              </el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取消</el-button>
              <el-button type="primary" @click="handlePcConfirm">
                确认
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </template>
    <template v-else>
      <div class="mobileList">
        <van-popup v-model:show="showRoleList" round position="bottom">
          <van-picker
            :columns="roleList"
            :columns-field-names="customFieldName"
            @cancel="closeList"
            @confirm="handleConfirm"
            title="选择AI扮演的角色"
          >
            <!-- <template #title>
              <van-field
                v-model="searchKey"
                placeholder="请输入搜索内容"
                clearable
              />
            </template> -->
          </van-picker>
        </van-popup>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, watch, reactive } from "vue";
import roleList from "@/assets/chatmossNewCopy.json";
import roleList2 from "@/assets/chatmossNew.json";

const dialogFormVisible = ref(false);
const formLabelWidth = "140px";

const props = defineProps({
  showRoleList: { type: Boolean, default: false },
  isMobile: { type: Boolean, default: false },
});
const emits = defineEmits(["sendText"]);

const columns = roleList2.map((item) => {
  return {
    text: item.key,
    value: item.value,
  };
});

const form = reactive({
  text: "",
});
console.log(form);
const showRoleList = ref(false);
const searchKey = ref("");
const searchColumns = ref(roleList);

const customFieldName = {
      text: 'key',
      value: 'key',
      children: 'options',
};

watch(searchKey, (newV, oldV) => {
  console.log(newV);
  let key = String(newV);
  key = key.replace(/\s*/g, ""); //去除搜索内容中的空格
  const reg = new RegExp(key, "ig"); //匹配规则-i：忽略大小写，g：全局匹配
  /* 进行筛选，将筛选后的数据放入新的数组中，‘name’键可根据需要搜索的key进行调整 */
  searchColumns.value = roleList.filter((item) => item.text.match(reg) != null);
});

//手机确认
function handleConfirm({selectedOptions}) {
  const text = selectedOptions[1].value;
  emits("sendText", text);
  closeList();
}

//电脑确认
function handlePcConfirm() {
  emits("sendText", form.text);
  closeList();
}

function showList() {
  console.log("props.isMobile", props.isMobile);
  if (!props.isMobile) {
    dialogFormVisible.value = true;
    form.text = "";
  } else {
    showRoleList.value = true;
    searchKey.value = "";
  }
}

function closeList() {
  if (!props.isMobile) {
    dialogFormVisible.value = false;
    form.text = "";
  } else {
    showRoleList.value = false;
    searchKey.value = "";
  }
}

defineExpose({
  showList,
  closeList,
});
</script>

<style lang="scss" scoped>
.van-cell {
  font-size: 16px;
  width: calc(100% - 127px);
}
</style>
