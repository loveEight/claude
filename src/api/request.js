import serviceAxios from "./index";
// 统一管理api
const user = {
  sendApi: "/send-claude" ,
}

//发送信息
function sendInfo(data) {
  return serviceAxios({
    url: user.sendApi,
    method: "post",
    ...data,
  });
};

export {
  sendInfo,
}

