<template>
  <div class="page" :class="{ 'page-change': list.length }">
    <div
      id="myList"
      ref="contentListRef"
      :style="{ paddingBottom: list.length !== 0 ? '103px' : 0 }"
    >
      <div
        v-show="item.text"
        :class="item.currentType === 'user' ? 'problemList' : 'answerList'"
        v-for="(item, index) in list"
      >
        <img class="listImg" :src="item.avatar" alt="" />
        <div v-if="item.currentType === 'bot'" class="botTextPack">
          <div v-html="item.text" class="botListText" ref="botListRefs"></div>
          <el-popover
            v-if="item.currentType === 'bot' && !iscancel"
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
        </div>

        <div v-else class="listText">{{ item.text }}</div>
      </div>

      <div v-show="loading" class="answerList">
        <img class="listImg" src="/logo.jpg" alt="" />
        <img class="addin" src="/loading.gif" alt="" />
      </div>

      <el-button
        type="danger"
        @click="handleCancel"
        class="clear-btn"
        v-show="iscancel"
        >停止答复</el-button
      >
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
          @focus="setScreen"
          v-model="question"
          clearable
          type="textarea"
          :autosize="{ minRows:1, maxRows: 2 }"
          id="message"
          placeholder="输入你的问题"
        >
        </el-input>
        <el-button
          type="success"
          size="small"
          :loading="iscancel"
          icon="Promotion"
          @click="send"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import axios from "axios";
import MarkdownIt from "markdown-it";
import hljs from "highlight.js";
import { ElMessage } from "element-plus";
import resetSizeFun from '@/util/fontSize'
import useClipboard from "vue-clipboard3";

//重置微信页字体大小
resetSizeFun()

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

//监听变化修改样式
onMounted(() => {
  //处理头像问题
  isMobileFun();
  window.addEventListener("resize", () => {
    isMobileFun();
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
  //判断是否回复
  const message = question.value;
  if (loading.value || iscancel.value) {
    ElMessage({
      showClose: true,
      message: "请停止答复，后提出问题",
      center: true,
      type: "error",
    });
    return;
  }
  if (message == "") {
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
    const md = new MarkdownIt({
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return (
              '<pre class="hljs"><code>' +
              hljs.highlight(lang, str, true).value +
              "</code></pre>"
            );
          } catch (__) {}
        }
        return (
          '<pre class="hljs"><code>' +
          md.utils.escapeHtml(str.replace(/[\r\n]+/g, "\n")) +
          "</code></pre>"
        );
      },
    });

    list.value.push({
      text: "",
      currentType: "bot",
      avatar: "/logo.jpg",
    });

    const obj = { message };
    if (parentMessageId.value) obj.parentMessageId = parentMessageId.value;
    axios({
      url: " https://ui4wpz.laf.dev/send", //  https://jyf6wk.laf.dev/test-send
      method: "post",
      data: obj,
      signal: controller.value.signal,
      responseType: "text",

      onDownloadProgress: function (progressEvent) {
        const xhr = progressEvent.event.target;
        let { responseText } = xhr;
        if (responseText.indexOf("error") != -1)
          responseText = responseText + "请求过于频繁，稍后再试";
        // console.log('responseText', responseText ,typeof responseText)
        const parts = responseText.split("--!");
        parentMessageId.value = parts[1];
        list.value[list.value.length - 1].text = md.render(parts[0]);
        loading.value = false;
        setScreen();
      },
    })
      .then(() => {
        controller.value = new AbortController();
        iscancel.value = false;
      })
      .catch(function (thrown) {
        iscancel.value = false;
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
}

//判断是否滚动到顶部或底部
function setScreen() {
  console.log(screen.height);
  nextTick(() => {
    const height = contentListRef.value.clientHeight;
    setTimeout(() => {
      const isOut = height >= screen.height - 102 - 20;
      isOut
        ? window.scrollTo(0, document.body.scrollHeight)
        : window.scrollTo(0, 0);
    }, 0);
  });
}

const { toClipboard } = useClipboard();
//复制文本内容
function handleCopyText(index) {
  // const text = list.value[index].text
  //   .replace(/(<([^>]+)>)/gi, "")
  //   .replace(/(\r\n|\n|\r)/gm, "");

  console.log("index", index);
  const currentIndex = index - 1 === 0 ? 0 : (index - 1) / 2;
  nextTick(() => {
    // console.log(botListRefs.value)
    // console.log(botListRefs.value[index - 1 ])
    // console.log(botListRefs.value[index - 1].innerText)
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

//处理首页问题点击
function handleHomeQuestion(qid) {
  console.log(qid);
  const questionObj = pList.find((item) => item.qid === qid);
  console.log(questionObj);
  const currQuestion = questionObj.question.replace("→", "").trim();
  question.value = currQuestion;
  send();
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
  overflow-y: visible !important;
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
  margin: 0 auto;
  overflow-x: hidden;
  overflow-y: auto;
  padding-bottom: 103px;
  background-color: #f1f1f4;

  .clear-btn {
    position: absolute;
    bottom: 68px;
    left: 50%;
    transform: translate(-50%, 0);
    z-index: 100;
  }
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
}

:global(.el-popover.el-popper) {
  min-width: 60px !important;
}
:global(.el-popover) {
  --el-popover-padding: 0 !important;
}
.moreFilled {
  display: inline-block;
  position: absolute;
  right: -13px;
  bottom: 10px;
  cursor: pointer;
  transform: rotate(90deg);
}

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
}
.botListText {
  display: flex;
  justify-content: center;
  flex-direction: column;
  font-size: 15px;
  margin-left: 11px;
  padding: 8px 0 8px 10px;
  line-height: 25px;
  background-color: white;
  border-radius: 5px;
  white-space: pre-line;
  background-color: #fff;
}

//清除结果

.bigBox {
  display: flex;
  align-items: center;
  position: fixed;
  padding-top: 8px;
  padding-bottom: 20px;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #f1f1f4;;
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
      ::-webkit-scrollbar {
        display: none;
      }
    }
    :deep(.el-textarea__inner:focus) {
      color: #000;
      font-size: 16px;
      border: 1px solid #000;
    }
    :deep(.el-icon) {
      font-size: 22px;
    }
    .el-button {
      margin-left: 14px;
    }
    :deep(.el-button--small) {
      padding: 16px 16px;
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
  top: 50%;
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

/* 禁用样式 */
</style>
