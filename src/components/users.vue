<template>
  <el-card class="box">
    <!-- 面包屑 -->
    <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <cus-bread level1="用户管理" level2="用户列表"></cus-bread>
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
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @click.native="changeState(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <!-- 操作 -->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click.native="usersEdit(scope.row)" type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button @click.native="editDelete(scope.row)" type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button @click.native="showDiaSetRole(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
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


    <!-- 对话框 添加 -->
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


    <!-- 对话框- 编辑 -->
    <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
      <!-- 表单 -->
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">
          <el-input disabled v-model="formdata.username"></el-input>
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input v-model="formdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="formdata.mobile"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
        <el-button type="primary" @click.native="editUser()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 对话框 - 角色-->
    <el-dialog title="分配角色" :visible.sync="dialogFormVisibleRole">
      <el-form label-position="left" label-width="80px" :model="formdata">
        <el-form-item label="用户名">{{formdata.username}}</el-form-item>

        <el-form-item label="角色">
          <!--
            v-model 绑定表单元素
            1. type="text" input
            2. 其他表单元素(textarea等) 就是select+option
            回顾下拉框的特性
            1. 默认显示请选中->当v-model的数据值selectVal和option的请选择的value值相等, 此时显示请选择
            2. 当选择某个option时,v-model的数据的值等于选中的label的value值
          -->
          {{selectVal}}
          <el-select v-model="selectVal" placeholder="请选择角色">
            <el-option disabled label="请选择" :value="-1"></el-option>

            <!-- 5个角色此时都有了自己的value,
            value就是角色id
            [30,31,34,39,40]
            如果selectVal的值,比如30,
            -->
            <el-option
              v-for="(item,i) in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>

            <!-- 将来获取角色名数据->v-for遍历 -->
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleRole = false">取 消</el-button>
        <el-button type="primary" @click="setRole()">确 定</el-button>
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
      dialogFormVisibleEdit:false,
      dialogFormVisibleRole:false,
      selectVal:-1,
      currUserId: -1,
      roles:[],
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
    //角色权限，当点击确定按钮时，发送请求,
   async setRole(user){
     const res=await this.$http.put(`users/${this.currUserId}/role`,{rid:this.selectVal});
     this.dialogFormVisibleRole=false;
    //  console.log(res);
    },
      //点击对号小图标，出现对号弹出框，需要有用户名,用户名是从渲染列表的list数据中通过scope传过来的，出现弹框时还需要拿个角色的数据付给下拉选框的v-model
      //首先发送第一次有角色的请求把请求的数组结果遍历到下拉框中，然后再根据用户id找角色id把角色id付给v-model的值，表示当前点击对号的行的id的角色id，接下来是修改权限的功能，当选择别的id的时候再发送一个修改的请求
   async showDiaSetRole(user){
      this.dialogFormVisibleRole=true;
      this.formdata.username=user.username;
      this.currUserId=user.id;
      //获取角色名称
      const res=await this.$http.get(`roles`);
      this.roles=res.data.data;
      //通过用户id找角色id,然后给v-model的selectVal赋值
      const res2=await this.$http.get(`users/${user.id}`);
      this.selectVal=res2.data.data.rid;
    },
    //点击操作中的删除,出现确认框，如果点击确定就执行then里面的方法发送删除请求，点击取消执行catch里面的方法出现提示信息
     editDelete(user){
      this.$confirm("是否把我删掉?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async ()=>{
      const res=await this.$http.delete(`users/${user.id}`);
      const {
        meta: { msg, status }
      } = res.data;
      if(status===200){
        this.$message.success(msg);
        this.pagenum=1;
        this.getTableData();
      } 
      }).catch(()=>{
        this.$message.info("取消删除");
      })
    },
    // 点击操作中的编辑小图标时弹出对话框，第一次请求发出，把值付给v-model用数据改变值，对话框渲染出来之后修改内容之后，点击下一个确定按钮对话框消失，再发送一次修改请求看是否是带有表单的v-model如果是不需要再渲染，
    usersEdit(user){
      this.dialogFormVisibleEdit=true;
      this.formdata=user;
    },
    // 点击对话框中的确定按钮，实现修改功能,点击编辑按钮时usersEdit获取了formdata数据，所以formdata中有数据，点击确定按钮时实现修改功能
    async editUser(){
      const res=await this.$http.put(`users/${this.formdata.id}`,this.formdata);
      const {
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        // 关闭
        this.dialogFormVisibleEdit = false;
      }
    },
    //处理用户状态，点击时改变值，v-model改变的
      async changeState(user){
        const res=await this.$http.put(`users/${user.id}/state/${user.mg_state}`);
        console.log(res);
      },
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
      // console.log(res);
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
      // console.log(res);
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
