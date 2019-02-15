// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import moment from 'moment'
Vue.prototype.$http=axios
axios.defaults.baseURL="http://localhost:8888/api/private/v1/"

Vue.use(ElementUI);
Vue.config.productionTip = false

// 全局的时间过滤器
// Vue.filter('fmtdate',(v)=>{
//  return moment(v).formdata('YYYY-MM-DD');
// });
Vue.filter('fmtdate', (v) => {
  return moment(v).format('YYYY-MM-DD');
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
