<template>
<el-card class="box">
    <cus-bread level1="权限管理" level2="角色列表"></cus-bread>
    <el-button class="btn">添加角色</el-button>
    <!-- 表格 -->
    <el-table height="350px" :data="roles" style="width: 100%">
         <el-table-column type="expand" width="80">
             <template slot-scope="scope">
           <!-- 行列布局 -->
            <el-row class="level1" width="80" v-for="(item1) in scope.row.children" :key="item1.id">

            <el-col :span="4" >
                <el-tag closable type="success" @close="deleRights(scope.row,item1)">{{item1.authName}}</el-tag>
                <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col :span="20">
                <el-row class="level2" v-for="(item2,i) in item1.children" :key="item2.id">
                    <el-col :span="4">
                        <el-tag type="info" closable @close="deleRights(scope.row,item2)">{{item2.authName}} </el-tag>
                        <i class="el-icon-arrow-right"></i>    
                    </el-col>
                    <el-col :span="20">
                        <el-tag type="success" closable v-for="(item3,i) in item2.children" :key="item3.id" @close="deleRights(scope.row,item3)">
                            {{item3.authName}}
                        </el-tag>
                    </el-col>
                </el-row>
            </el-col>
            </el-row>

            <el-row v-if="scope.row.children.length===0">
                <el-col>
                    <span>没有权限</span>
                </el-col>
            </el-row>
        </template>
         </el-table-column>

         <!-- 表格 -->
        <el-table-column type="index" label="#" width="180"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="300"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述" width="150"></el-table-column>
      
      <!-- 操作 -->
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
          <el-button @click="showDiaRole(scope.row)" type="success" icon="el-icon-check" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisible">
        <el-tree
        ref="treeDom"
        :data="treeList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkedRole"
        :props="defaultProps">
        </el-tree>
        <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRights()">确 定</el-button>
           </div>
    </el-dialog>
</el-card>
</template>

<script>
export default {
    data(){
        return {
            roles:[],
            dialogFormVisible:false,
            // 点击对号分配树形权限的功能
            // expandRole:[],
            checkedRole:[],
            treeList:[],
            defaultProps:{
                label:'authName',
                children:"children"
            },
            currRoleId:-1,
        }
    },
    created(){
        this.getRoles();
    },
    methods:{
        // 点击对号时出现对话框，把当前的值赋值形成列表，type类型值: list或tree,list列表显示权限, tree 树状显示权限,参数是url参数:type,获取权限列表之后，把当前角色有的权限被点击
        async showDiaRole(role){
            this.currRoleId=role.id;
            this.dialogFormVisible=true;
            const res=await this.$http.get(`rights/tree`);
            const {meta:{msg,status},data}=res.data;
            // console.log(res);
            if(status==200){
                this.treeList=data;
                //checkedRole是值为id的数组，新建一个数组把id传给这个数组然后把数组赋值给checkedRole
                const temp=[];
                role.children.forEach(item1=>{
                    item1.children.forEach(item2=>{
                        item2.children.forEach(item3=>{
                            temp.push(item3.id);
                        });
                    });
                });
                this.checkedRole=temp;
            }
        },
        //点击对号出现对话框之后再点击确定，完成修改功能，点击对号之后已经获取了role里面的数据，所以下面的role是有值的 文档上的角色授权roles/:roleId/rights，post rids	权限 ID 列表	以 , 分割的权限 ID 列表，就相当于实现了一个修改权限的功能
        async setRights(){
            // 权限idelement里面tree提供的方法
            const arr1=this.$refs.treeDom.getCheckedKeys();
            const arr2=this.$refs.treeDom.getHalfCheckedKeys();
            const arr=[...arr1,...arr2];
            const res=await this.$http.post(`roles/${this.currRoleId}/rights`,{
                rids:arr.join(',')
            });
           const {
                meta: { msg, status },
                data
            } = res.data;
            if (status === 200) {
                this.dialogFormVisible = false;
                this.getRoles();
            }
        },
        //取消权限,第一个参数是返回数据的每一个对象，第二个参数是每个层级的children中的每个数组，每次点击取消权限时发送一个请求，删除这个权限，从新赋值给当前的对象roles/:roleId/rights/:rightId
       async deleRights(role,rights){
           const res=await this.$http.delete(`roles/${role.id}/rights/${rights.id}`);
           const {data,meta:{status}}=res.data;
        //    console.log(res);
           if(status==200){
               //因为返回的数据是删除后的剩余数据，所以把剩余数据赋值给当前的权限，返回的数据没有角色只是数组
            role.children=data;
           }
        },
        //获取角色的信息渲染列表
       async getRoles(){
           const res=await this.$http.get('roles');
        //    console.log(res);
           const {data,meta:{status}}=res.data;
           if(status==200){
               this.roles=data;
           }
        }
    }
}
</script>

<style>
.level1,
.level2 {
  margin-bottom: 10px;
}
</style>
