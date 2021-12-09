import axios from "axios";
import qs from "qs";
import Notify from "@/components/Notify";
axios.defaults.baseURL = "api/";
// axios.defaults.baseURL =
//   "http://61774500-1018390206127906.test.functioncompute.com/"; //测试

axios.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8";
axios.defaults.timeout = 10000;

axios.interceptors.request.use(
  config => {
    console.log(config);
    const token = sessionStorage.getItem("access_token");
    config.headers.authorization = "bearer " + token;
    if (config.type) {
      switch (config.type) {
        case "FORM-DATA":
          config.transformRequest = [
            data => {
              return "args=" + JSON.stringify(data);
            },
          ];
          break;
        case "FORM":
          config.headers["Content-Type"] = "application/x-www-form-urlencoded";
          config.data = qs.stringify(config.data);
          break;
        case "FORM":
          config.headers["Content-Type"] = "application/x-www-form-urlencoded";
          config.data = qs.stringify(config.data);
          break;
        default:
          break;
      }
    } else {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    if (response.data.resultCode != 0) {
      Notify("warning", response.data.resultMsg);
    }
    return response;
  },
  error => {
    const defaultNotify = {
      message: "未知错误",
      icon: "warning",
      color: "warning",
      position: "top",
      timeout: 1500,
    };
    if (error.code === "ECONNABORTED" || error.message.indexOf("timeout") !== -1 || error.message === "Network Error") {
      defaultNotify.message = "网络异常";
      Notify(defaultNotify.color, defaultNotify.message);
      return Promise.reject(error);
    }
    switch (error.response.status) {
      case 403:
        defaultNotify.message = "拒绝访问(403)";
        Notify(defaultNotify.color, defaultNotify.message);
        break;
      case 404:
        defaultNotify.message = "资源不存在(404)";
        Notify(defaultNotify.color, defaultNotify.message);
        break;
      case 408:
        defaultNotify.message = "请求超时(404)";
        Notify(defaultNotify.color, defaultNotify.message);
        break;
      case 500:
        defaultNotify.message = "服务器错误(500)";
        Notify(defaultNotify.color, defaultNotify.message);
        break;
      case 501:
        defaultNotify.message = "服务未实现(501)";
        Notify(defaultNotify.color, defaultNotify.message);
        break;
      case 502:
        defaultNotify.message = "网络错误(502)";
        Notify(defaultNotify.color, defaultNotify.message);
        break;
      case 503:
        defaultNotify.message = "服务不可用(503)";
        Notify(defaultNotify.color, defaultNotify.message);
        break;
      case 504:
        defaultNotify.message = "网络超时(504)";
        Notify(defaultNotify.color, defaultNotify.message);
        break;
      case 505:
        defaultNotify.message = "HTTP版本不受支持(505)";
        Notify(defaultNotify.color, defaultNotify.message);
        break;
      default:
        break;
    }
    return Promise.reject(error);
  }
);

export default function axiosApi(url, data, method) {
  return new Promise((resolve, reject) => {
    if (method === "get") {
      axios({
        method,
        url,
        params: data,
      })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    } else {
      axios({
        method,
        url,
        data,
      })
        .then(res => {
          resolve(res.data);
        })
        .catch(err => {
          reject(err);
        });
    }
  });
}

// {
//   post(url, data) {
//     return new Promise((resolve, reject) => {
//       axios({
//         method: "post",
//         url,
//         data: qs.stringify(data),
//       })
//         .then((res) => {
//           resolve(res.data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },

//   get(url, data) {
//     return new Promise((resolve, reject) => {
//       axios({
//         method: "get",
//         url,
//         params: data,
//       })
//         .then((res) => {
//           resolve(res.data);
//         })
//         .catch((err) => {
//           reject(err);
//         });
//     });
//   },
// };
