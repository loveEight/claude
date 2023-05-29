import axios from "axios";

// 创建 axios 请求实例
const serviceAxios = axios.create({
  baseURL: 'https://vcpuq4.laf.dev', // 基础请求地址
  timeout: 180000, // 请求超时设置
  withCredentials: false, // 跨域请求是否需要携带 cookie
});


// 创建请求拦截
serviceAxios.interceptors.request.use(
  (config) => {
    // 如果开启 token 认证
    // if (serverConfig.useTokenAuthorization) {
    //   config.headers["Authorization"] = localStorage.getItem("token"); // 请求头携带 token
    // }
    // 设置请求头
    // if(!config.headers["content-type"]) { // 如果没有设置请求头
    //   if(config.method === 'post') {
    //     config.headers["content-type"] = "application/x-www-form-urlencoded"; // post 请求
    //     config.data = qs.stringify(config.data); // 序列化,比如表单数据
    //   } else {
    //     config.headers["content-type"] = "application/json"; // 默认类型
    //   }
    // }
    // console.log("请求配置", config);
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);


// 创建响应拦截
serviceAxios.interceptors.response.use(
  (res) => {
    let data = res.data;
    // 处理自己的业务逻辑，比如判断 token 是否过期等等
    // 代码块
    // console.log('serviceAxios', res)
    return data;
  },
  (error) => {
    let message = "";
    if (error && error.response) {
      switch (error.response.status) {
        case 400:
          message = "参数不正确！";
          break;
        case 401:
          message = "您未登录，或者登录已经超时，请先登录！";
          break;
        default:
          message = "异常问题！";
          break;
      }
    }
    return Promise.reject(message);
  }
);
export default serviceAxios;