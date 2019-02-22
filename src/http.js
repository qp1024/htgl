import axios from 'axios'
import { Message } from 'element-ui';

const HttpServer={};
HttpServer.install=function(Vue){
    axios.defaults.baseURL="http://localhost:8888/api/private/v1/"

    //请求拦截器
    axios.interceptors.request.use(function(config){
        if(config.url!=="login"){
            const AUTH_TOKEN = localStorage.getItem("token"); 
            config.headers["Authorization"] = AUTH_TOKEN;
        }
        return config;
    },function (error){
        return Promise.reject(error);
    });
    //响应拦截器
    axios.interceptors.response.use(function(response){
        //处理响应数据
        const {
            meta: {
              msg,
              status
            }
          } = response.data;
          //统一处理status非200和201的情况
          if(status!==200&&status!==201){
              Message.warning(msg);
          }
          return response;
    },function(error){
        //对响应错误处理
        return Promise.reject(error);
    }
    );

    Vue.prototype.$http=axios
}
export default HttpServer;