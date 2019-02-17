// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
//axios插件
import HttpServer from '@/http.js'

//封装面包屑组件，在其他组件里面可以使用,全局组件
import CusBread from '@/components/cusBread.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/css/base.css'
import moment from 'moment'

Vue.use(HttpServer);
Vue.use(ElementUI);
Vue.config.productionTip = false


// 全局自定义面包屑组件
Vue.component('cusBread',CusBread);


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
