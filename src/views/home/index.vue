<template>
  <div class="home">
    <div
      class="page"
      :style="{ paddingBottom: isMobile ? '165px' : '' }"
      :class="{ 'page-change': list.length }"
    >
      <TopTitle class="topTitle" :is-mobile="isMobile" v-show="list.length" />
      <div
        v-show="list.length"
        id="myList"
        ref="contentListRef"
        :style="{ overflowY: isForbidScroll ? 'hidden' : 'auto' }"
      >
        <div class="chatList">
          <div
            v-show="item.text"
            v-for="(item, index) in list"
            :class="item.currentType === 'user' ? 'listItemP' : 'listItemA'"
            :key="index"
          >
            <!-- <img class="listImg" src="/avatar.jpeg" alt="" v-show="item.currentType === 'user'"/>
            
          <img class="listImg" src="/logo.jpg" alt="" v-show="item.currentType === 'bot'"/> -->
            <div
              :class="
                item.currentType === 'user' ? 'problemList' : 'answerList'
              "
            >
              <!-- <openai-svg
                class="listImg2"
                :width="30"
                :height="30"
                v-show="item.currentType === 'bot'"
              />
              <user-svg
                class="listImg"
                :width="30"
                :height="30"
                v-show="item.currentType === 'user'"
              /> -->
              <img
                class="listImg"
                src="/avatar.jpeg"
                alt=""
                v-show="item.currentType === 'user'"
              />
              <img
                class="listImg"
                src="/logo1.png"
                alt=""
                v-show="item.currentType === 'bot'"
              />
              <!-- <img class="listImg"  :src="item.avatar" alt="" /> -->
              <div
                v-if="item.currentType === 'bot'"
                class="botListText"
                ref="botListRefs"
              >
                <div class="markdown-body" v-html="item.text"></div>
              </div>
              <!-- <copy-icon-ele
                  class="moreFilled"
                  :iscanel="iscancel"
                  :is-use-copy="isUseCopy"
                  :is-mobile="isMobile"
                  :index="index"
                  @copy="handleCopyEle"
                >
                </copy-icon-ele> -->
              <!-- <img v-if="item.currentType === 'bot'" class="addin" src="/loading.gif" alt="" /> -->
              <div v-else class="listText">{{ item.text }}</div>
            </div>
            <div
              class="copyPcBtn"
              v-show="item.currentType === 'bot' && !isMobile"
            >
              <copy-icon-ele-pc @copy="handleCopyEle" :index="index" />
            </div>
          </div>
          <div v-show="loading" class="listItemA">
            <div class="answerList" :style="{ paddingBottom: '16px' }">
              <img class="listImg" src="/logo1.png" alt="" />
              <div class="botListText">
                <div>_Typing…_</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-show="!list.length" class="content-box cancel-style">
        <div class="begintitle">
          <h1>Chat Bot</h1>
        </div>
        <div v-show="isMobile" class="exhibition cancel-style mobile">
          <div class="witem">
            <el-icon :style="{ fontSize: '25px' }"><MagicStick /></el-icon>
            <h3 class="title">功能</h3>
            <p>还记得用户在对话中早些时候说的话</p>
            <p>允许用户提供后续更正</p>
            <p>接受过拒绝不当请求的培训</p>
          </div>
          <div class="witem">
            <el-icon :style="{ fontSize: '25px' }"><Sunny /></el-icon>
            <h3 class="title">高效工作</h3>
            <p @click="handleHomeQuestion(2)">先有鸡蛋还是有母鸡 →</p>
            <p @click="handleHomeQuestion(5)">
              老婆和母亲同时落入湖中,先救谁? →
            </p>
            <p @click="handleHomeQuestion(8)">会有世界末日吗? →</p>
          </div>
          <div class="witem">
            <el-icon :style="{ fontSize: '25px' }"><Warning /></el-icon>
            <h3 class="title">限制</h3>
            <p>偶尔可能会生成错误的信息</p>
            <p>偶尔可能会产生有害的指令或有偏见的内容</p>
            <p>对2021年后的世界和事件的了解有限</p>
          </div>
        </div>
        <div v-show="!isMobile" class="exhibition">
          <div class="witem">
            <el-icon :style="{ fontSize: '30px' }"><MagicStick /></el-icon>
            <h3 class="title">功能</h3>
          </div>
          <div class="witem">
            <el-icon :style="{ fontSize: '30px' }"><Sunny /></el-icon>
            <h3 class="title">高效工作</h3>
          </div>

          <div class="witem">
            <el-icon :style="{ fontSize: '30px' }"><Warning /></el-icon>
            <h3 class="title">限制</h3>
          </div>
        </div>
        <div v-show="!isMobile" class="pList">
          <p
            v-for="item in pList"
            @click="handleHomeQuestion(item.qid)"
            :key="item"
          >
            {{ item.question }}
          </p>
        </div>
      </div>

      <!-- <div class="steppingstone">
      
    </div> -->
      <div class="bigBox">
        <div
          class="inputbox1"
          :style="{ maxWidth: isMobile ? '1000px' : '672px' }"
        >
          <el-input
            v-bind:readonly="loading"
            @keypress="handleEnter"
            v-model="question"
            clearable
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 8 }"
            id="message"
            placeholder="输入你的问题"
          >
          </el-input>
          <el-button type="primary" size="small" v-if="!iscancel" @click="send"
            >发送</el-button
          >
          <el-button v-else type="danger" size="small" @click="handleCancel"
            >停止</el-button
          >
        </div>
        <div class="message">
          <p>
            我是一名智能助理，我可以回答各种问题、提供服务和建议，帮助用户更高效地完成任务和解决问题。
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, watchEffect } from "vue";
//组件
import CopyIconElePc from "@/components/CopyIconElePc.vue";
import UserSvg from "@/components/svg/UserSvg.vue";
import OpenaiSvg from "@/components/svg/OpenaiSvg.vue";
import TopTitle from "@/components/TopTitle.vue";
import { ElMessage } from "element-plus";
//网络请求
import { sendInfo } from "@/api/request";
//插件
import axios from "axios";
import useClipboard from "vue-clipboard3";

//函数
import resetSizeFun from "@/util/fontSize";
import md from "@/util/initMarkDown";
//常量
import pList from "@/constant/questionList";

//重置微信页字体大小
resetSizeFun();
const menuRef = ref(); //菜单对象
const isForbidScroll = ref(false); //是否禁止滚动
const keyboardHeight = ref(0); //手机键盘高度
const list = ref([]); //展示列表
const question = ref(""); //问题
const parentMessageId = ref(""); //上下文id
const loading = ref(false); //是否在加载状态
const iscancel = ref(false); //取消按钮是否启动
const contentListRef = ref(); //主要内容盒子对象
const botListRefs = ref(); //回答内容盒子对象列表
//判断设备
const isMobile = ref(false);
//取消请求的对象
const controller = ref(new AbortController());

let initHeight = window.innerHeight;
//监听变化修改样式
onMounted(() => {
  //判断是否是手
  isMobileFun();
  window.addEventListener("resize", () => {
    console.log("resize");
    isMobileFun();
    handleH5Input();
  });
});

function isMobileFun() {
  if (screen.width < 768) {
    isMobile.value = true;
    // handleMenuShow();
  } else {
    isMobile.value = false;
    if (menuRef.value) menuRef.value.isShowMenu = true;
  }
}

//发送消息
async function send() {
  const message = question.value;
  //空白禁止发送
  if (message.trim() == "") {
    ElMessage({
      showClose: true,
      message: "输入你的问题",
      type: "error",
    });
    return;
  }
  nextTick(() => {
    list.value.push({
      text: message,
      currentType: "user",
      avatar: "/avatar.jpeg",
    });
    list.value.push({
      text: "",
      currentType: "bot",
      avatar: "/logo.jpg",
    });
  });
  //开启键盘定制
  setScreen();
  question.value = "";
  loading.value = true;
  iscancel.value = true;

  try {
    const obj = { message };
    obj.parentMessageId = parentMessageId.value;
    sendInfo({
      data: obj,
      signal: controller.value.signal,
      responseType: "text",
      onDownloadProgress: downloadPro,
    })
      .then(() => {})
      .catch(function (thrown) {
        iscancel.value = false;
        isForbidScroll.value = false;
        if (axios.isCancel(thrown)) {
          console.log("Request canceled", thrown.message);
        }
      })
      .finally(() => {
        sendInfolater();
      });
    // 返回 id 并保存
  } catch (error) {
    console.log(error);
    loading.value = false;
    list.value.push({
      text: "出错了，请重试！",
      avatar: "/logo.jpg",
    });
    setScreen();
    return;
  }
}

//流式处理
function downloadPro(progressEvent) {
  const xhr = progressEvent.event.target;
  let { responseText } = xhr;
  const lastIndex = responseText.lastIndexOf("⭐");
  let chunk = responseText;

  if (lastIndex !== -1) {
    chunk = responseText.substring(lastIndex);
    chunk = chunk.replace("⭐", " ")
  }
  //限制接口
  console.log("chunk", chunk);

  const parts = chunk.split("--!");

  parentMessageId.value = parts[1];
  console.log('parts[0]', parts[0])
  if (parts[0].indexOf("```") !== -1) {
    list.value[list.value.length - 1].text = md.render(parts[0]);
  } else {
    list.value[list.value.length - 1].text = parts[0];
  }
  loading.value = false;
  setScreen();
}

//发送消息适配PC或phone
function handleEnter(e) {
  if (e.key === "Enter" && !isMobile.value && !e.shiftKey) {
    send();
  }
}

//取消解析
function handleCancel() {
  controller.value.abort();
  controller.value = new AbortController();
  iscancel.value = false;
  loading.value = false;
  const text = list.value[list.value.length - 1].text;
  if (text === "")
    nextTick(() => {
      list.value[list.value.length - 1].textType = "cancel";
      list.value[list.value.length - 1].text = "回复取消&nbsp;&nbsp;";
      console.log(
        "list.value[list.value.length - 1]",
        list.value[list.value.length - 1]
      );
    });
}

//判断是否滚动到顶部或底部
function setScreen(keyboardHeight = 0) {
  nextTick(() => {
    setTimeout(() => {
      
      const scrollHeight = contentListRef.value?.scrollHeight || 0;
      // const clientHeight = contentListRef.value.clientHeight;
      contentListRef.value.scrollTop = scrollHeight + keyboardHeight;
    }, 0);
  });
}

//处理首页问题点击
function handleHomeQuestion(qid) {
  const questionObj = pList.find((item) => item.qid === qid);
  const currQuestion = questionObj.question.replace("→", "").trim();
  question.value = currQuestion;
  send();
}

//移动端点击输入框内容在上处理
function handleH5Input() {
  //处理输入框点击后内容在上
  const currentHeight = window.innerHeight;
  keyboardHeight.value = initHeight - currentHeight;
  setScreen(keyboardHeight.value);
  isForbidScroll.value = keyboardHeight.value === 0 ? false : true;
}

const { toClipboard } = useClipboard();
//复制逻辑
function handleCopyEle(currentIndex) {
  console.log("currentIndex", currentIndex);
  nextTick(() => {
    const text = botListRefs.value[currentIndex].innerText
      .replace(/\n{2,}/g, "\n")
      .replace(/\n+$/, "");
    toClipboard(text).then(
      function (e) {
        ElMessage({
          showClose: true,
          message: "复制成功",
          center: true,
          type: "success",
        });
      },
      function (e) {
        console.log("copy arguments e:", e);
        alert("复制失败!");
      }
    );
  });
}

//发送信息后要做的事情
function sendInfolater() {
  //创建新的控制,方便暂停
  controller.value = new AbortController();
  iscancel.value = false;
  isForbidScroll.value = false;
}
</script>

<style scoped lang="scss">
.page {
  position: relative;
  height: 100vh;
  /* background-color: c; */
  background-color: #fff;
  /* padding-bottom: 68px; */
  overflow-y: auto;
  line-height: 1.5rem;
}

.page-change {
  background-color: #fff;
  padding-bottom: 0 !important;
  // overflow-y: visible !important;
}

.topTitle {
  color: #000;
  background-color: #f5f5f5;
}
/*
.defbut {
  position: fixed;
  right: 2px;
  bottom: 152px;
}
.btn-send {
  margin-left: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 32px;
  border-radius: 6px;
  color: rgba(0, 0, 0, 0.6);
  background: rgba(0, 0, 0, 0.1);
}
.btn-send:hover {
  cursor: pointer;
  opacity: 0.85;
}
.text {
  position: absolute;
  top: 50px;
  border: 1px solid #e5e5e5;
  height: 60px;
  padding: 10px;
  width: 90%;
} */

#myList {
  position: relative;
  /* max-width: 1000px; */
  height: calc(100vh - 148px);
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: auto;
  /* padding-bottom: 12px; */
  background-color: #ffffff;
}

/* 定义滚动条的宽度和颜色 */
::-webkit-scrollbar {
  width: 5px;
  background-color: #f1f1f4;
}
/* 定义滚动条的轨道背景 */
::-webkit-scrollbar-track {
  background-color: #fff;
}
/* 定义滚动条的轨道背景 */
::-webkit-scrollbar-track:hover {
  background-color: #f2f2f2;
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

.chatList {
  /* background-color: red; */
}

.problemList {
  position: relative;
  max-width: 768px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 16px 18px;
  font-size: 15px;
  display: flex;
  /* background-color: #000; */
  /* text-align: left;
  direction: ltr;
  justify-content: flex-end; */
  overflow-x: auto;
  white-space: pre-wrap;

  .listImg {
    /* position: absolute;
    right: 18px;
    top: 1px; */
    /* width: 29px; */
    /* height: 29px; */
  }
  .listText {
    position: relative;
    padding: 7px 0px 0px 1px;
    margin-left: 20px;
    white-space: pre-wrap;
    color: #374151;
  }
}

@keyframes blink {
  to {
    visibility: hidden;
  }
}

.answerList {
  position: relative;
  box-sizing: border-box;
  padding: 16px 18px;
  /* padding-bottom: 0; */
  font-size: 15px;
  max-width: 768px;
  margin: 0 auto;
  display: flex;
  overflow-x: auto;
  white-space: pre-wrap;
  /* background-color: orange; */
  /* .clear-btn {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 100;
  } */
}

:global(.el-popover.el-popper) {
  min-width: 60px !important;
}
:global(.el-popover) {
  --el-popover-padding: 0 !important;
}

.listImg2 {
  position: relative;
  /* left: 1px; */
  top: -10px;
  margin-top: 11px;
  width: 30px;
  height: 30px;
  border-radius: 3px;
}

.listImg {
  position: relative;
  top: -10px;
  margin-top: 11px;
  width: 40px;
  height: 40px;
  border-radius: 3px;
  // border-radius: 50%;
}

.botTextPack {
  position: relative;
  .moreFilled {
    display: inline-block;
    position: absolute;
    left: -13px;
    bottom: 10px;
    cursor: pointer;
    transform: rotate(90deg);
  }
  &::after {
    /* display: inline-block; */
    position: absolute;
    left: 23px;
    bottom: 10px;
    -webkit-animation: blink 1s steps(5, start) infinite;
    animation: blink 1s steps(5, start) infinite;
    content: "▋";
    /* margin-left: 0.25rem; */
    vertical-align: baseline;
  }
}
.botListText {
  color: rgb(52, 53, 65);
  /* justify-content: center;
  flex-direction: column; */
  font-size: 15px;
  margin-left: 10px;
  padding: 7px 0 0px 10px;
  /* line-height: 22px; */
  /* background-color: white; */
  border-radius: 5px;
  white-space: pre-line;
  /* background-color: #fff; */
  overflow-x: auto;
}

//清除结果

.bigBox {
  display: flex;
  flex-direction: column;
  /* justify-content: space-between;
  align-items: center; */
  position: fixed;
  /* padding-top: 18px; */
  /* padding-bottom: 29px; */
  bottom: 0;
  left: 0;
  right: 0;
  border-top: 1px solid #e5e5e5;
  background-color: #fff;
  z-index: 100;

  .message {
    /* overflow-y: auto; */
    margin: 0 auto;

    /* height: 50px; */
    padding: 12px 16px 24px 16px;
    line-height: 50px;
    max-width: 672px;
    font-size: 12px;
    color: rgba(0, 0, 0, 0.5);
    p {
      line-height: 1;
      /* height: 20px !important; */
    }
  }
  .inputbox1 {
    /* margin: auto; */
    width: 90%;
    /* height: 70px; */
    max-width: 1000px;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    align-items: center;
    overflow: hidden;
    :deep(.el-textarea) {
      --el-input-focus-border-color: #000;
      ::-webkit-scrollbar {
        display: none;
      }
    }

    :deep(.el-textarea__inner) {
      color: #000;
      font-size: 16px;
      border: 1px solid #f1f2f3;
      /* box-sizing: content-box; */
      ::-webkit-scrollbar {
        display: none;
      }
      padding: 12px 11px;
    }
    :deep(.el-textarea__inner:focus) {
      color: #000;
      font-size: 16px;
      border: 1px solid #000;
    }
    .el-button {
      margin-left: 8px;
    }
    :deep(.el-button--small) {
      padding: 23px 25px;
      font-size: 14px;
    }
    /* :deep(.el-button--small:first-child) {
      padding: 23px 16px;
      font-size: 14px;
      background-color: #32333e;
    } */
    :deep(.el-icon) {
      font-size: 22px;
    }
  }
}

.inputbox input {
  flex-grow: 1;
  height: 44px;
  max-height: 100px;
  border: 0;
  outline: none;
  padding: 12px 15px;
  background: transparent;
  font-size: 16px;
  width: 100%;
  font-weight: bold;
  color: rgba(0, 0, 0, 0.7);
}

/* .inputbox button {
  margin-left: 15px;
  width: 56px;
  height: 82%;
  border-radius: 6px;
  border: 0;
  background: silver;
  color: #333;
  font-size: 14px;
  outline: none;
}

.inputbox button:hover {
  cursor: pointer;
  opacity: 0.8;
} */

.addin {
  margin: 1px 20px;
  width: 30px;
  height: 30px;
}

.steppingstone {
  position: relative;
  width: 100%;
  height: 80px;
  .clear-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 100;
  }
}

.begintitle {
  width: 100%;
  /* padding: 50px 50px 30px 50px; */
}
.begintitle h1 {
  /* padding: 0 33px 23px; */
  margin-bottom: 33px;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
}

.content-box {
  /* padding-top: 208px;
  margin: 0 auto;*/
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  width: 800px;
}
.exhibition {
  display: flex;
  justify-content: space-around;
}

.witem {
  text-align: center;
}
.witem p {
  margin: auto;
  padding: 10px;
  margin-top: 15px;
  font-size: 16px;
  border-radius: 5px;
  text-align: center;
  color: #1a1818;
  background-color: #f1f3f4;
}

.witem h3 {
  padding: 9px;
  font-size: 20px;
  color: #606266;
  text-align: center;
}

textarea {
  border: none;
  resize: none;
  cursor: pointer;
  outline: none;
  overflow-y: hidden;
}

.pList {
  p {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 20px;
    width: 30%;
    padding: 20px 20px;
    margin-top: 23px;
    color: #1a1818;
    background-color: #ededed;
    border-radius: 3px;
  }
  p:hover {
    cursor: pointer;
    color: #fff;
    background-color: #32333e;
  }
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

@media screen and (max-width: 600px) {
  .listImg {
    width: 30px;
    height: 30px;
  }
  .botTextPack {
    &::after {
      left: 15px;
    }
  }

  .message {
    box-sizing: border-box;
    padding: 8px 13px 12px 15px !important;
    text-align: center;
    p {
      line-height: 26px !important;
    }
  }

  /* 滚轮背景 */
  ::-webkit-scrollbar-track {
    background-color: #f2f2f2;
  }
  /* 列表正确的高度 */
  #myList {
    height: calc(100vh - 184px);
  }
  .topTitle {
    background-color: #32333e;
  }
  /* .text {
    position: absolute;
    top: 30px;
    border: 1px solid #e5e5e5;
    height: 45px;
    padding: 10px;
    width: 80%;
  } */
  .addin {
    margin: 1px 11px;
  }

  .botListText {
    margin-left: 0;
    padding-left: 12px;
  }

  .problemList {
    .listText {
      margin-left: 12px;
    }
  }

  .bigBox {
    /* padding-bottom: 15px; */
    border-top: 1px solid rgb(0, 0, 0, 0.1);
    /* background-color: rgb(247, 248, 250); */

    .controlBox {
      height: 39px !important;
    }
  }
  .control {
    top: 4px !important;
  }
  .exhibition {
    .witem {
      margin-top: 10px;
    }
    .witem p {
      margin-top: 0;
      margin: 0 15px 15px;
    }
    .witem h3 {
      margin-bottom: 0;
      margin-top: 0;
      padding: 9px;
    }
  }
  .cancel-style {
    all: unset;
  }

  .begintitle h1 {
    padding: 23px 33px 23px;
    margin-bottom: 0;
    font-size: 28px;
    font-weight: bold;
    text-align: center;
  }

  .inputbox1 {
    :deep(.el-textarea__inner) {
      padding: 8px 11px !important;
    }
    :deep(.el-button--small) {
      padding: 19px 16px !important;
    }
    :deep(.el-icon) {
      font-size: 22px;
    }
  }
}

:deep(.github-markdown-body) {
  padding-bottom: 0 !important;
}

.listItemP {
  background-color: #ffffff;
}
.listItemA {
  position: relative;
  background-color: #f7f7f8;
  border: 1px solid #e5e5e5;
  .copyPcBtn {
    display: none;
    position: absolute;
    top: 0;
    right: 20%;
    z-index: 100;
  }
}
.listItemA:hover {
  .copyPcBtn {
    display: block;
  }
}
</style>
