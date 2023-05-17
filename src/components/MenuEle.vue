<template>
  <div class="menu" :class="{ menuColl: !isShowMenu }" ref="menuRef">
    <!-- 新建聊天 -->
    <div class="newChat">
      <div class="content" @click="handleNewLog">
        <van-icon name="plus" size="15" />
        <span class="text">新建聊天</span>
      </div>
    </div>
    <!-- 聊天记录 -->
    <div class="LogList">
      <template v-for="(item, index) in logList" :key="index">
        <div
          class="chatLog"
          :class="{ logActive: currentIndex === index }"
          @click="handleClickBox(index)"
        >
          <!-- 记录标题 -->
          <div class="chatbox">
            <van-icon name="comment-o" size="16" />
            <input
              type="text"
              v-model="logTitle"
              ref="inputRef"
              v-if="isShowInput && currentIndex === index"
            />
            <span v-else>{{ item.title }}</span>
          </div>
          <!-- 记录设置 -->
          <div class="logSet" v-show="currentIndex === index">
            <div class="iconList" v-if="!isConirfmIcon">
              <van-icon
                name="edit"
                size="16"
                @click.stop="handleEidtTitle(item)"
              />
              <van-icon
                name="delete-o"
                size="16"
                @click.stop="handleDeleteLog(item, index)"
              />
            </div>
            <div class="iconList2" v-else>
              <van-icon
                name="success"
                size="16"
                @click.stop="handleConfirm(item, index)"
              />
              <van-icon name="cross" size="16" @click.stop="handleCancel" />
            </div>
          </div>
        </div>
      </template>
    </div>
    <!-- 其他设置 -->
    <div class="setting">
      <div class="content" @click="handleClearLog">
        <van-icon name="delete-o" size="16" color="#fff" />
        <span class="text" v-if="!isClearConfirm">清空对话</span>
        <span class="ask" v-else>确定吗？</span>
        <div class="iconList2" v-if="isClearConfirm">
          <van-icon name="success" size="16" @click.stop="handleConfirmClear" />
          <van-icon name="cross" size="16" @click.stop="handleCancelClear" />
        </div>
      </div>
    </div>
    <!--关闭menu -->
    <div class="showMenu">
      <menu-chang-icon-vant :is-show="isShowMenu" @control="handleControl" />
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch, computed } from "vue";
import MenuChangIconVant from "@/components/MenuChangIconVant.vue";
import useHomeStore from "@/stores/home";
import { storeToRefs } from "pinia";
import { ElLoading } from "element-plus";
const homeStore = useHomeStore();
const { chatLogList, currentLogIndex } = storeToRefs(homeStore);

//获取所有聊天记录
homeStore.queryChatLogAction();

// const currentIndex = ref(0); //当前聊天记录索引
const logList = computed(() => {
  return chatLogList.value.map((item) => ({
    id: item["_id"],
    title: item.title,
  }));
});
const currentIndex = computed(() => {
  return currentLogIndex.value;
});
// const logList = ref([
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
//   { id: 1, title: "你好啊" },
// ]); //聊天记录
const menuRef = ref() //菜单对象
const isShowInput = ref(false); //是否展示输入框
const logTitle = ref(""); //记录标题
const isConirfmIcon = ref(false); //是否展示确认修改或删除标题的按钮
const isClearConfirm = ref(false); //是否确实清空全部记录
const inputRef = ref(null); //获取输入框对象
const isShowMenu = ref(false); //是否展开管理框
let iconType = "edit"; //当前是修改标题还是删除记录

//选择聊天记录
const handleClickBox = (index) => {
  //防止重复点击
  if (currentLogIndex.value === index) return;
  //加载loading,提高用户体验
  currentLogIndex.value = index;
  // const loadingScreen = ElLoading.service({
  //   lock: true,
  //   text: "Loading",
  //   background: "rgba(0, 0, 0, 0.7)",
  // });
  // setTimeout(() => {
  //   loadingScreen.close();

  // }, 500);
  homeStore.currentLog = chatLogList.value[currentLogIndex.value];
};

//新建聊天
const handleNewLog = () => {
  chatLogList.value.unshift({
    _id: "-1",
    title: "新建聊天",
    chatLog: {
      list: [{ question: "", answer: "" }],
    },
  });
  //索引指向为0
  currentLogIndex.value = 0;
  homeStore.currentLog = chatLogList.value[currentLogIndex.value];
  //发送网络请求
  // 1、新增对话框
  // 2、获取最新聊天记录列表
  homeStore.addChatLogNewAction();
  //更新页面
};

//删除聊天
const handleDeleteLog = (item, index) => {
  isConirfmIcon.value = true;
  iconType = "delete";
};

//设置聊天标题
const handleEidtTitle = (item) => {
  iconType = "edit";
  logTitle.value = item.title;
  isShowInput.value = true;
  isConirfmIcon.value = true;
  nextTick(() => {
    if (inputRef.value) inputRef.value[0].focus();
    // if (inputRef.value) console.log(typeof inputRef.value)
  });
};
//确认修改/删除
const handleConfirm = (item, index) => {
  if (iconType === "edit") {
    //修改标题
    if(chatLogList.value[index].title === logTitle.value) {
      handleCancel();
      return
    }
    chatLogList.value[index].title = logTitle.value;
    //网络请求
    const data = { id: item.id, title: logTitle.value };
    homeStore.updateChatLogTitleAction(data);
  } else {
    //删除单个记录
    currentLogIndex.value = 0;
    chatLogList.value.splice(index, 1);
    //发送网络请求，用item.id删除
    homeStore.currentLog = chatLogList.value[currentLogIndex.value];
    homeStore.deleteChatLogNewAction(item.id);
  }
  handleCancel();
};
//取消修改/删除
const handleCancel = () => {
  if (iconType === "edit") {
    //设置标题
    isShowInput.value = false;
  }
  isConirfmIcon.value = false;
};
//清空所有记录
const handleClearLog = () => {
  isClearConfirm.value = true;
};
//确认清空
const handleConfirmClear = () => {
  //取消按钮显示
  handleCancelClear();
  if (!chatLogList.value.length) return;
  chatLogList.value = [];
  //网络请求
  homeStore.clearChatLogAction();
};
//取消清空
const handleCancelClear = () => {
  isClearConfirm.value = false;
};
//currentIndex改变时取消取消修改标题
watch(currentIndex, (neV) => {
  if (inputRef.value) handleCancel();
});

//控制是否展示菜单
const handleControl = (isShow) => {
  isShowMenu.value = isShow;
};

//第一次问问题修改对话标题
const changeTitleFirst = (data) => {
  console.log("来到这里了", data);
  //修改标题
  chatLogList.value[currentLogIndex.value].title = data.title;
  //网络请求
  homeStore.updateChatLogTitleAction(data);
};

//监听是否隐藏，解决手机点击隐藏问题
const emits = defineEmits(['allowClick'])
watch(isShowMenu, (newV) => {
  if(newV === false) {
    emits('allowClick')
  }
})

defineExpose({
  handleNewLog,
  changeTitleFirst,
  isShowMenu,
});
</script>

<style lang="less" scoped>
.menu {
  position: absolute;
  left: 0;
  top: 0;
  width: 240px;
  padding: 7px;
  height: 100vh;
  color: #fff;
  background-color: #202123;
  z-index: 9999;
  font-size: 14px;
  border-right: none;
  transition: width 0.3s ease;
  text-overflow: ellipsis; /* 超出部分省略号 */
  white-space: nowrap; /* 不换行 */
  .newChat {
    padding-bottom: 20px;
    border-bottom: 1px solid #4d4e50;

    .content {
      cursor: pointer;
      padding: 10px 15px;
      .van-icon {
        position: relative;
        left: -3px;

        margin-right: 6px;
        vertical-align: auto;
      }
      border: 1px solid #4d4e50;
      border-radius: 5px;
      &:hover {
        background-color: #28292c;
      }
    }
  }

  .LogList {
    height: 646px;
    overflow-y: auto;
    padding-right: 6px;
    border-bottom: 1px solid #4d4e50;
    overflow-x: hidden;
  }
  .chatLog {
    display: flex;
    margin-top: 10px;
    font-size: 12.5px;
    padding: 12px;
    border-radius: 8px;
    box-sizing: border-box;
    cursor: pointer;
    &:hover {
      background-color: #32333e;
      input {
        // background-color: #202123;
        background-color: #32333e !important;
      }
    }
    .chatbox {
      display: flex;
      align-items: center;
      box-sizing: border-box;
      .van-icon {
        position: relative;
        top: 1px;
        vertical-align: middle;
        margin-right: 10px;
      }
      input {
        width: 142px;
        padding-right: 35px;
        background-color: #202123;
      }
      span {
        width: 142px;
        padding-right: 15px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .logSet {
      width: 40px;
      margin-left: auto;
      .iconList {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .van-icon {
          position: relative;
          top: 3px;
          right: 11px;
          margin-right: 10px;
          color: #a3a3a3;
          &:hover {
            color: #fff;
          }
        }
      }
      .iconList2 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .van-icon {
          position: relative;
          top: 3px;
          color: #a3a3a3;
          &:hover {
            color: #fff;
          }
        }
        .van-icon:first-child {
          left: -10px;
          // margin-right: 5px;
        }
      }
    }
  }
  .logActive {
    background-color: #32333e;
    input {
      // background-color: #202123;
      background-color: #32333e !important;
    }
  }
}

//设置
.setting {
  margin-top: 5px;
  .content {
    display: flex;
    cursor: pointer;
    padding: 10px 15px;

    .ask {
      font-size: 13px;
    }
    .van-icon {
      position: relative;
      top: 2px;
      left: -3px;
      margin-right: 6px;
      vertical-align: auto;
    }
    border-radius: 8px;
    &:hover {
      background-color: #28292c;
    }
  }
  .iconList2 {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .van-icon {
      position: relative;
      top: 1px;
      left: 16px;
      color: #a3a3a3;
      &:hover {
        color: #fff;
      }
    }
    .van-icon:first-child {
      left: 12px;
      // margin-right: 5px;
    }
  }
}

/* 定义滚动条的宽度和颜色 */

.menuColl {
  width: 0;
  padding: 0;
  .LogList {
    display: none;
  }
  .newChat {
    display: none;
  }
  .setting {
    display: none;
  }
}

/* 定义滚动条的宽度和颜色 */
::-webkit-scrollbar {
  width: 5px;
  background-color: #f1f1f4;
}
/* 定义滚动条的轨道背景 */
::-webkit-scrollbar-track {
  background-color: #202123;
}
/* 定义滚动条的轨道背景 */
::-webkit-scrollbar-track:hover {
  background-color: #fff;
}
/* 定义滚动条的滑块样式 */
::-webkit-scrollbar-thumb {
  background-color: #c3c3c9;
  border-radius: 5px;
}
/* 鼠标悬浮在滚动条上时的滑块样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: #a0a0a8;
}

@media screen and (max-width: 600px) {
  .LogList {
    height: 346px !important;
  }
}
</style>
