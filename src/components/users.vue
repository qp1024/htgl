<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索+添加 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select" clearable @click.native="clearablee()">
      <el-button slot="append" icon="el-icon-search" @click="seachBtn()"></el-button>
    </el-input>
    <el-button type="success" @click="showDialog()">添加按钮</el-button>
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
        <template slot-scope="scope">{{scope.row.create_time|fmtdate}}</template>
      </el-table-column>
      <!-- mg-status用户状态-->
      <el-table-column label="用户状态" width="140">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="page"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4,6,8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 对话框 -->
        <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input v-model="formdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="formdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
        <el-button type="primary" @click="addUsersInfo()">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      query: "",
      list: [],
      total: -1,
      pagenum: 1,
      pagesize: 2,
      dialogFormVisibleAdd:false,
      formdata:{
        username:'',
        password:'',
        email:'',
        mobile:''
      }
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    
    // 点击添加按钮出现对话框，模态框
      showDialog(){
        this.dialogFormVisibleAdd=true;
      },
      //点击清除按钮，所有信息展示
      clearablee(){
          this.getTableData();
      },
      //点击搜索按钮时查询
      seachBtn(){
          this.pagenum=1;
          this.getTableData();
      },
    //   选择每页多少行数据时触发的函数
    handleSizeChange(val){
        // pagenum当前点击的数按照新的pagenum发送请求
        this.pagenum=1;
        this.pagesize=val;
        this.getTableData();
    },
    // 点击页数触发函数
    handleCurrentChange(val){
        this.pagenum=val;
        this.getTableData();
    },
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
     },
     // 点击添加按钮实现添加功能
    async addUsersInfo(){
       const AUTH_TOKEN = localStorage.getItem("token");
      this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      this.dialogFormVisibleAdd=false;
      const res=await this.$http.post(`users?username=${this.formdata.username}&password=${this.formdata.password}&email=${this.formdata.email}&mobile=${this.formdata.mobile}`,this.formdata);
      console.log(res);
      const {data,meta:{msg,status}}=res.data;
       if(status===201){
         this.$message.success(msg);
         this.pagenum=1;
         this.getTableData();
         this.formdata={};
       }
    },
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
