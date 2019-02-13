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
                <a href="">退出</a>
            </el-col>
           </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {};
</script>

<style>
.homeHeader{
    background: #999c;
}
.homeCenter{
    color: #fff;
    line-height: 60px;
    text-align: center;
}
.logout{
    line-height: 60px;
}
</style>
