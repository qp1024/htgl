import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login.vue'
import Home from '@/components/home.vue'
import Users from '@/components/users.vue'
import Rights from '@/components/rights.vue'
import Roles from '@/components/roles.vue'

import Goods from '@/components/goods.vue'
import Goodsadd from '@/components/goodsadd.vue'

//分类参数
import Cateparams from '@/components/cateparams.vue'

// 订单管理
import Orders from '@/components/orders.vue'
//数据统计
import Reports from '@/components/reports.vue'

//商品分类
import Goodscate from '@/components/goodscate.vue'
import Message from 'element-ui'

Vue.use(Router)

const router= new Router({
  routes: [
    {
      path:'/',
      component:Login
    },
    {
      path: '/home',
      name: 'home',
      component:Home,
      children:[{
        name:'users',
        path:'/users',
        component:Users
      },{
        name:'rights',
        path:'/rights',
        component:Rights
      },{
        name:'roles',
        path:'/roles',
        component:Roles
      },{
        name:'goods',
        path:'/goods',
        component:Goods
      },{
        name:'goodsadd',
        path:'/goodsadd',
        component:Goodsadd
      },{
        name:'cateparams',
        path:'/params',
        component:Cateparams
      },{
        name:'orders',
        path:'/orders',
        component:Orders
      },{
        name:'reports',
        path:'/reports',
        component:Reports
      },{
        name:'goodscate',
        path:'/categories',
        component:Goodscate
      }
    ]
    },{
      name:'login',
      path:'/login',
      component:Login
    }
  ]
})
// 路由守卫当路由发送变化时执行这个函数
//先判断是不是login如果是login就接着执行,如果不是就判断是否有token如果有token就继续执行,没有token就就返回到登录页面
//路由守卫
router.beforeEach((to,from,next)=>{
  if(to.name=='login'){
    next();
  }else{
   const token=localStorage.getItem('token')
   if(!token){
    router.push({
      name:'home'
      })
      Message.info('请先登录');
      return;
   }
   next();
  }
});
//响应拦截器

export default router;
