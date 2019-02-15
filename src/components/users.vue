<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索+添加 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button type="success">成功按钮</el-button>
    <!-- 表格 -->
    <!--
          id: 500
          username: "admin"
          email: "adsfad@qq.com"
          mobile: "12345678"
          create_time: 1486720211
          mg_state: true
          role_name: "主管"
    -->
    <el-table :data="list" style="width: 100%">
      <el-table-column prop="id" label="#" width="80"></el-table-column>
      <el-table-column prop="username" label="姓名" width="120"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
      <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
      <!-- create_time -->
      <el-table-column label="创建日期" width="140">
          <template slot-scope="scope">
              {{scope.row.create_time|fmtdate}}
          </template>
      </el-table-column>
      <!-- mg-status用户等级 -->
      <!-- 操作 -->
    </el-table>
    <!-- 分页 -->
    <el-pagination background layout="prev, pager, next" :total="1000"></el-pagination>
    <!-- 对话框 -->
    <!-- <el-table
        :data="list"
        style="width: 100%">
        <el-table-column prop="id" label="#" width="80"></el-table-column>
        <el-table-column prop="username" label="姓名" width="120"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="140"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="140"></el-table-column>
    </el-table>-->
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      list: [],
      total: 1,
      pagenum: 1,
      pagesize: 2
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    // 除了登录请求外其他的请求都需要授权,用户数据列表
    async getTableData() {
      const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      );
      console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.list = data.users;
        this.total = data.total;
      }
    }
  }
};
</script>

<style>
.box {
  height: 100%;
}
.input-with-select {
  width: 350px;
}
</style>
