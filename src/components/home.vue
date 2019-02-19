<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <el-row>
          <el-col :span="4">
            <img src="@/assets/logo.png" alt="图片加载失败">
          </el-col>
          <el-col :span="19" class="homeCenter">
            <h2>电商管理平台</h2>
          </el-col>
          <el-col :span="1" class="logout">
            <a @click.prevent="handleLoginout()">退出</a>
          </el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside class="aside" width="200px">
        <el-menu
          :unique-opened="true"
          :router="true"
          default-active="2"
          class="el-menu-vertical-demo"
        >
          <!-- 1 -->
          <el-submenu :index="item1.order+''" v-for="(item1) in menu" :key="item1.id">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item1.authName}}</span>
            </template>

            <el-menu-item :index="item2.path+''" v-for="(item2) in item1.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>          
        </el-menu>
      </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data(){
    return {
      menu:[]
    }
  },
  // 判断用户是否登录，如果登录了（有token）就可以进入home页面否则不能进入home页面
  beforeMount(){
    if(!localStorage.getItem('token')){
      this.$router.push({
        name:'login'
      });
      this.$message.warning('请先登录');    
    }
  },
  created(){
    this.menudata();
  },
  methods:{
    //菜单数据请求
    async menudata(){
      const res=await this.$http.get(`menus`);
      const {data,meta:{status}}=res.data;
      console.log(res);
      if(status==200){
        this.menu=data;
      }
    },
    handleLoginout(){
      localStorage.clear();
      this.$router.push({
        name:'login'
      });
      this.$message.warning("退出成功");
    }
  }
};
</script>

<style>
.homeHeader {
  background: #999c;
}
.homeCenter {
  color: #fff;
  line-height: 60px;
  text-align: center;
}
.logout {
  line-height: 60px;
}
.el-menu-vertical-demo {
  height: 100%;
}
</style>
