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
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>

            <el-menu-item index="users">
              <i class="el-icon-menu"></i>
              <span>用户列表</span>
            </el-menu-item>
          </el-submenu>

          <!-- 2 -->
          <el-submenu index="2">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>权限管理</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span>角色列表</span>
            </el-menu-item>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span>权限列表</span>
            </el-menu-item>
          </el-submenu>

          <!-- 3 -->
          <el-submenu index="3">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>商品管理</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span>商品列表</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span>分类参数</span>
            </el-menu-item>
            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span>商品分类</span>
            </el-menu-item>
          </el-submenu>

          <!-- 4 -->
          <el-submenu index="4">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>订单管理</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span>订单列表</span>
            </el-menu-item>
          </el-submenu>

          <!-- 5 -->
          <el-submenu index="5">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>数据统计</span>
            </template>

            <el-menu-item index="1-1">
              <i class="el-icon-menu"></i>
              <span>数据报表</span>
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
  // 判断用户是否登录，如果登录了（有token）就可以进入home页面否则不能进入home页面
  beforeMount(){
    if(!localStorage.getItem('token')){
      this.$router.push({
        name:'login'
      });
      this.$message.warning('请先登录');    
    }
  },
  methods:{
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
