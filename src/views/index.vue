<template>
  <div class="page" :class="{ 'page-change': list.length }">
    <div
      v-show="list.length"
      id="myList"
      ref="contentListRef"
      :style="{ overflowY: isForbidScroll ? 'hidden' : 'auto' }"
    >
      <div
        v-show="item.text"
        :class="item.currentType === 'user' ? 'problemList' : 'answerList'"
        v-for="(item, index) in list"
      >
        <img class="listImg" :src="item.avatar" alt="" />
        <div v-if="item.currentType === 'bot'" class="botTextPack">
          <div class="botListText" ref="botListRefs" v-html="item.text"></div>
          <copy-icon-ele
            class="moreFilled"
            :iscanel="iscancel"
            :is-use-copy="isUseCopy"
            :is-mobile="isMobile"
            :index="index"
            @copy="handleCopyEle"
          >
          </copy-icon-ele>
        </div>

        <div v-else class="listText">{{ item.text }}</div>
      </div>

      <div v-show="loading" class="answerList">
        <img class="listImg" src="/logo.jpg" alt="" />
        <img class="addin" src="/loading.gif" alt="" />
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
          <p @click="handleHomeQuestion(1)">
            还记得用户在对话中早些时候说的话 →
          </p>
          <p @click="handleHomeQuestion(4)">允许用户提供后续更正 →</p>
          <p @click="handleHomeQuestion(7)">接受过拒绝不当请求的培训 →</p>
        </div>
        <div class="witem">
          <el-icon :style="{ fontSize: '25px' }"><Sunny /></el-icon>
          <h3 class="title">高效工作</h3>
          <p @click="handleHomeQuestion(2)">用简单的术语解释量子计算 →</p>
          <p @click="handleHomeQuestion(5)">10岁的生日有什么创意吗？ →</p>
          <p @click="handleHomeQuestion(8)">
            如何在Javascript中提出HTTP请求？ →
          </p>
        </div>
        <div class="witem">
          <el-icon :style="{ fontSize: '25px' }"><Warning /></el-icon>
          <h3 class="title">限制</h3>
          <p @click="handleHomeQuestion(3)">偶尔可能会生成错误的信息 →</p>
          <p @click="handleHomeQuestion(6)">
            偶尔可能会产生有害的指令或有偏见的内容 →
          </p>
          <p @click="handleHomeQuestion(9)">
            对2021年后的世界和事件的了解有限 →
          </p>
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
        <p v-for="item in pList" @click="handleHomeQuestion(item.qid)">
          {{ item.question }}
        </p>
      </div>
    </div>

    <!-- <div class="steppingstone">
      
    </div> -->
    <div class="bigBox">
      <div
        class="inputbox1"
        :style="{ maxWidth: isMobile ? '1000px' : '743px' }"
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

        <el-button type="success" size="small" v-if="!iscancel" @click="send"
          >发送</el-button
        >
        <el-button v-else type="danger" size="small" @click="handleCancel"
          >终止</el-button
        >
        <div class="control">
          <div class="role-icon">
            <role-icon
              size="23"
              :is-show="!iscancel"
              :is-mobile="isMobile"
              ref="roleIconRef"
              @click="handleRole"
              @showRole="handleUseRole"
            >
            </role-icon>
          </div>
          <div class="context-icon">
            <context-icon
              :is-mobile="isMobile"
              :is-show="!iscancel"
              :is-used="isUseContext"
              size="23"
              @click="handleContext"
              ref="contextIconRef"
            >
            </context-icon>
          </div>
          <div class="copy-icon">
            <copy-icon
              v-if="isMobile"
              :is-mobile="isMobile"
              :is-used="isUseCopy"
              :is-show="!iscancel"
              size="23"
              @click="handleCopyIcon"
              ref="copyIconRef"
            ></copy-icon>
          </div>
          <div class="delete-icon">
            <delete-icon
              :is-mobile="isMobile"
              :is-show="!iscancel"
              size="23"
              @click="handleDeleteList"
              @confirm="handleConfirmD"
              ref="deleteIconRef"
            ></delete-icon>
          </div>
        </div>
      </div>
      <div class="roleList">
        <role-list
          :show="showRoleList"
          :is-mobile="isMobile"
          ref="roleListRef"
          @sendText="handleSendText"
        >
        </role-list>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
//组件
import DeleteIcon from "@/components/DeleteIconVant.vue";
import ContextIcon from "@/components/ContextIconVant.vue";
import CopyIcon from "@/components/CopyIconVant.vue";
import CopyIconEle from "@/components/CopyIconEle.vue";
import RoleIcon from "@/components/RoleIconVant.vue";
import RoleList from "@/components/RoleList.vue";
import { ElMessage } from "element-plus";
//插件
import axios from "axios";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import useClipboard from "vue-clipboard3";
//函数
import resetSizeFun from "@/util/fontSize";

//重置微信页字体大小
resetSizeFun();

const roleListRef = ref(); //角色列表对象
const showRoleList = ref(false); //是否展示角色列表
const roleIconRef = ref(); // 是否使用角色的对象
const isUseCopy = ref(false); //是否启用上下文
const copyIconRef = ref(); //是否启用复制的对象
const isUseContext = ref(true); //是否启用上下文
const contextIconRef = ref(); //是否启用上下文的对象
const deleteIconRef = ref(); //删除按钮对象
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
//首页问题
const pList = [
  { qid: 1, question: "还记得用户在对话中早些时候说的话 →" },
  { qid: 2, question: "用简单的术语解释量子计算 →" },
  { qid: 3, question: "偶尔可能会生成错误的信息 →" },
  { qid: 4, question: "允许用户提供后续更正 →" },
  { qid: 5, question: "10岁的生日有什么创意吗？ →" },
  { qid: 6, question: "偶尔可能会产生有害的指令或有偏见的内容 →" },
  { qid: 7, question: "接受过拒绝不当请求的培训 →" },
  { qid: 8, question: "如何在Javascript中提出HTTP请求？ →" },
  { qid: 9, question: "对2021年后的世界和事件的了解有限 →" },
];

let initHeight = window.innerHeight;
//监听变化修改样式
onMounted(() => {
  //判断是否是手机
  isMobileFun();
  window.addEventListener("resize", () => {
    isMobileFun();
    handleH5Input();
  });
});

function isMobileFun() {
  if (screen.width < 768) {
    isMobile.value = true;
  } else {
    isMobile.value = false;
  }
}

//发送消息
async function send() {
  //判断是否是编程问题
  const message = question.value
  if (message.trim() == "") {
    ElMessage({
      showClose: true,
      message: "输入你的问题",
      type: "error",
    });
    return;
  }
  list.value.push({
    text: question.value,
    currentType: "user",
    avatar: "/avatar.jpeg",
  });

  setScreen();
  question.value = "";
  loading.value = true;
  iscancel.value = true;

  try {
    // const md = new MarkdownIt({
    //   highlight: function (str, lang) {
    //     if (lang && hljs.getLanguage(lang)) {
    //       try {
    //         return (
    //           '<pre class="hljs mark-body"><code>' +
    //           hljs.highlight(lang, str, true).value +
    //           "</code></pre>"
    //         );
    //       } catch (__) {}
    //     }
    //     return (
    //       '<pre class="hljs mark-body" ><code>' +
    //       md.utils.escapeHtml(
    //         str.replace(/[\r\n]+/g, "\n").replace(/(\d)\./g, "$1、")
    //       ) +
    //       "</code></pre>"
    //     );
    //   },
    // });
    const md = new MarkdownIt({
      linkify: true,
      highlight(str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            // 得到经过highlight.js之后的html代码
            const preCode = hljs.highlight(lang, str, true).value;
            // 以换行进行分割
            const lines = preCode.split(/\n/).slice(0, -1);
            // 添加自定义行号
            let html = lines
              .map((item, index) => {
                return (
                  '<li><span class="line-num" data-line="' +
                  (index + 1) +
                  '"></span>' +
                  item +
                  "</li>"
                );
              })
              .join("");
            html = "<ol>" + html + "</ol>";
            // 添加代码语言
            if (lines.length) {
              html += '<b class="name">' + lang + "</b>";
            }
            return '<pre class="hljs"><code>' + html + "</code></pre>";
          } catch (__) {}
        }
        // 未添加代码语言，此处与上面同理
        const preCode = md.utils.escapeHtml(str);
        const lines = preCode.split(/\n/).slice(0, -1);
        let html = lines
          .map((item, index) => {
            return (
              '<li><span class="line-num" data-line="' +
              (index + 1) +
              '"></span>' +
              item +
              "</li>"
            );
          })
          .join("");
        html = "<ol>" + html + "</ol>";
        return '<pre class="hljs"><code>' + html + "</code></pre>";
      },
    });

    list.value.push({
      text: "",
      currentType: "bot",
      avatar: "/logo.jpg",
    });

    const obj = { message };
    obj.parentMessageId = contextControlParams();
    console.log("obj.parentMessageId", obj.parentMessageId);
    axios({
      url: "https://ui4wpz.laf.dev/send", //换自己的接口
      method: "post",
      data: obj,
      signal: controller.value.signal,
      responseType: "text",

      onDownloadProgress: function (progressEvent) {
        const xhr = progressEvent.event.target;
        let { responseText } = xhr;
        let text = responseText;
        if (text.indexOf("invoke cloud function got error") !== -1) {
          text = "请求过于频繁,请稍后再试&nbsp;&nbsp;";
          list.value[list.value.length - 1].text = text;
        } else {
          const parts = text.split("--!");
          parentMessageId.value = parts[1];
          list.value[list.value.length - 1].text = md.render(parts[0])
          
        }
        loading.value = false;
        setScreen();
      },
    })
      .then(() => {
        controller.value = new AbortController();
        iscancel.value = false;
        isForbidScroll.value = false;
      })
      .catch(function (thrown) {
        iscancel.value = false;
        isForbidScroll.value = false;
        if (axios.isCancel(thrown)) {
          console.log("Request canceled", thrown.message);
        }
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
    list.value[list.value.length - 1].text = "回复取消&nbsp;&nbsp;";
}

//判断是否滚动到顶部或底部
function setScreen(keyboardHeight = 0) {
  nextTick(() => {
    setTimeout(() => {
      const scrollHeight = contentListRef.value.scrollHeight;
      const clientHeight = contentListRef.value.clientHeight;
      contentListRef.value.scrollTop = scrollHeight + keyboardHeight;
    }, 0);
  });
}

//处理首页问题点击
function handleHomeQuestion(qid) {
  console.log(qid);
  const questionObj = pList.find((item) => item.qid === qid);
  console.log(questionObj);
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

//是否删除列表
function handleDeleteList() {
  deleteIconRef.value.handleDelete(list.value);
}
function handleConfirmD() {
  if (!list.value.length) {
    deleteIconRef.value.failToast();
  } else {
    list.value = [];
    parentMessageId.value = ''
    deleteIconRef.value.successToast();
  }
}

//是否启用上下文
function handleContext() {
  contextIconRef.value.useContext();
  isUseContext.value = !isUseContext.value;
}
function contextControlParams() {
  if (parentMessageId.value && isUseContext.value) {
    return parentMessageId.value;
  } else {
    return "";
  }
}

//是否启用复制
function handleCopyIcon() {
  copyIconRef.value.useCopy();
  isUseCopy.value = !isUseCopy.value;
}

const { toClipboard } = useClipboard();
//复制逻辑
function handleCopyEle(currentIndex) {
  console.log("currentIndex", currentIndex);
  nextTick(() => {
    const text = botListRefs.value[currentIndex].innerText;
    toClipboard(text).then(
      function (e) {
        ElMessage({
          showClose: true,
          message: "复制到剪贴版成功",
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

//使用角色
function handleRole() {
  roleIconRef.value.useRole();
}
function handleUseRole() {
  roleListRef.value.showList();
}
function handleSendText(text) {
  question.value = text;
}
</script>

<style scoped lang="scss">
.page {
  position: relative;
  height: 100vh;
  /* background-color: c; */
  background-color: #f1f1f4;
  padding-bottom: 68px;
  overflow-y: auto;
}

.page-change {
  padding-bottom: 0 !important;
  // overflow-y: visible !important;
}

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
}

#myList {
  position: relative;
  max-width: 1000px;
  height: calc(100vh - 89px);
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 12px;
  background-color: #f1f1f4;
}

.problemList {
  position: relative;
  padding: 12px 18px;
  font-size: 15px;
  display: flex;
  text-align: left;
  direction: ltr;
  justify-content: flex-end;
  overflow-x: auto;
  white-space: pre-wrap;

  .listImg {
    position: absolute;
    right: 18px;
    top: 1px;
  }
  .listText {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 50px;
    padding: 9px 12px 9px 9px;
    border-radius: 5px;
    background-color: rgb(149, 212, 117);
  }
}

.answerList {
  position: relative;
  padding: 5px 18px 5px 15px;
  font-size: 15px;
  display: flex;
  overflow-x: auto;
  white-space: pre-wrap;

  .clear-btn {
    position: absolute;
    bottom: 2px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 100;
  }
}

:global(.el-popover.el-popper) {
  min-width: 60px !important;
}
:global(.el-popover) {
  --el-popover-padding: 0 !important;
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

.listText {
  margin-left: 20px;
  white-space: pre-wrap;
}

.botTextPack {
  position: relative;
  .moreFilled {
    display: inline-block;
    position: absolute;
    right: -13px;
    bottom: 10px;
    cursor: pointer;
    transform: rotate(90deg);
  }
}
.botListText {
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 15px;
  margin-left: 11px;
  padding: 11px 0 9px 10px;
  line-height: 22px;
  background-color: white;
  border-radius: 5px;
  white-space: pre-line;
  background-color: #fff;
  overflow-x: auto;
}

//清除结果

.bigBox {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  padding-top: 40px;
  padding-bottom: 15px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f1f1f4;
  z-index: 100;

  .inputbox1 {
    /* margin: auto; */
    width: 90%;
    max-width: 1000px;
    margin: 0 auto;
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
      padding: 16px 16px;
      font-size: 14px;
    }
    :deep(.el-icon) {
      font-size: 22px;
    }
    .control {
      position: absolute;
      display: flex;
      height: 20px;
      top: 7px;
      .role-icon,
      .context-icon,
      .delete-icon {
        margin-right: 33px;
        cursor: pointer;
      }
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
  margin: 10px 20px;
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
  background-color: rgba(247 247 248);
  color: rgba(107 114 128);
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
    line-height: 26px;
    width: 30%;
    padding: 10px 20px;
    margin-top: 30px;
    color: rgb(107 114 128);
    background-color: rgb(247 247 248);
    border-radius: 3px;
  }
  p:hover {
    cursor: pointer;
    color: #fff;
    background-color: rgb(144, 210, 110);
  }
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
}

@media screen and (max-width: 600px) {
  .text {
    position: absolute;
    top: 30px;
    border: 1px solid #e5e5e5;
    height: 45px;
    padding: 10px;
    width: 80%;
  }

  .bigBox {
    border-top: 1px solid rgb(0, 0, 0, 0.1);
    background-color: rgb(247, 248, 250);
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
}

:deep(.github-markdown-body) {
  padding-bottom: 0 !important;
}
/* 禁用样式 */
// 添加行号样式
</style>
