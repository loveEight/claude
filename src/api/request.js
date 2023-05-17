import serviceAxios from "./index";
// 统一管理api
const user = {
  sendApi: "/send" ,
	loginApi: "/login",
  registerApi: '/register',
  queryLogApi: "query-chatlog",
  chatLogNewApi: "add-chatlogNew",
  chatLogDeleteApi: "delete-chatlog",
  updateTtileApi: "update-chatlogTtile",
  clearLogApi: "clear-chatlog",
  addChatLogTalkApi: "add-chatlogTalk"
}

function accountLogin(data) {
  return serviceAxios({
    url: user.loginApi,
    method: "post",
    data,
  });
};

function accountRegister(data) {
  return serviceAxios({
    url: user.registerApi,
    method: "post",
    data,
  });
};

//发送信息
function sendInfo(data) {
  return serviceAxios({
    url: user.sendApi,
    method: "post",
    ...data,
  });
};

//查询所有对话记录
function queryChatLog() {
  return serviceAxios({
    url: user.queryLogApi,
    method: "GET",
  });
};

//新增对话框
function addChatLogNew() {
  return serviceAxios({
    url: user.chatLogNewApi,
    method: "POST",
  });
};

//新增对话框
function deleteChatLog(id) {
  return serviceAxios({
    url: user.chatLogDeleteApi,
    method: "POST",
    data: { id }
  });
};
//更新对话标题
function updateChatLogTitle(data) {
  return serviceAxios({
    url: user.updateTtileApi,
    method: "POST",
    data
  });
};

//清空所有对话
function clearChatLog() {
  return serviceAxios({
    url: user.clearLogApi,
    method: "POST",
  });
};

//在一次对话中增加新的聊天记录
function addChatLogTalk(data) {
  return serviceAxios({
    url: user.addChatLogTalkApi,
    method: "POST",
    data
  });
};

export {
  sendInfo,
  accountLogin,
  accountRegister,
  queryChatLog,
  addChatLogNew,
  deleteChatLog,
  updateChatLogTitle,
  clearChatLog,
  addChatLogTalk
}

