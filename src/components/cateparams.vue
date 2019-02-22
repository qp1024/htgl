<template>
    <el-card class="box">
        <!-- 面包屑 -->
        <cus-bread level1="商品管理" level2="分类参数"></cus-bread>
        <!-- 提示框 -->
        <el-alert class="alert" title="注意:只允许为第三级分类设置参数" type="warning" show-icon></el-alert>
        <!-- 级联 -->
        <el-form :model="form" class="form" label-position="left" label-width="120px">
            <el-form-item label="请选择商品分类">
                {{selectedOptions}}
                    <el-cascader
                    clearable
                    :show-all-levels="false"
                    expand-trigger="hover"
                    :options="options"
                    :props="defaultProp"
                    v-model="selectedOptions"
                    @change="handleChange"
                    ></el-cascader>
            </el-form-item>
        </el-form>

        <!-- tab切换卡 -->
        <el-tabs @tab-click="changeTab()" v-model="active" type="border-card">
            <el-tab-pane name="1" label="动态参数">
                <el-button disabled>设置动态参数</el-button>
                <!-- 表格 -->
                <el-table height="450px" border stripe :data="arrDy" style="width:100%" @expand-change="fn">
                    <el-table-column type="expand" width="120">
                        <template slot-scope="scope">
                            <!-- 动态tag编辑 -->
                            <el-tag
                            :key="i"
                            v-for="(item,i) in scope.row.attr_vals"
                            closable
                            :disable-transitions="false"
                            @close="handleClose(scope.row,item)">
                            {{item}}
                            </el-tag>
                            <el-input
                            class="input-new-tag"
                            v-if="inputVisible"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm(scope.row)"
                            @blur="handleInputConfirm(scope.row)"
                            >
                            </el-input>
                            <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column type="index" label="#" width="120">
                    </el-table-column>
                    <!-- 属性名称 -->
                    <el-table-column label="属性名称" prop="attr_name"></el-table-column>
                    <!-- 操作 -->
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                        <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane name="2" label="静态参数">
                <el-button disabled>设置静态参数</el-button>
                    <el-table height="350px" border stripe :data="arrStatic" style="width: 100%">
                    <el-table-column type="index" label="#" width="120"></el-table-column>

                    <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                    <el-table-column prop="attr_vals" label="属性值"></el-table-column>

                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                        <el-button plain size="mini" type="primary" icon="el-icon-edit" circle></el-button>
                        <el-button plain size="mini" type="danger" icon="el-icon-delete" circle></el-button>
                        </template>
                    </el-table-column>
                    </el-table>
            </el-tab-pane>
        </el-tabs>

    </el-card>
</template>

<script>
export default {
    data(){
        return {
            form:{},
            selectedOptions:[1,3,6],
            options:[],
            defaultProp:{
                // 三个值一个是名字一个是id另一个是下一级children里面的值
                 label: "cat_name",
                value: "cat_id"
            },
        //active选项卡当前选中的那么值active为几name值为几的显示
        active:"1",
        //动态数据
        arrDy:[],
        arrStatic:[],
        inputVisible:false,
        inputValue:"",
        
        }
    },
    created(){
        this.getGoodsCate();
        this.getDyOrState();
    },
    methods:{
        //当点击第二个表格旁边的extand点击当前的上一个移出
        fn(row,expandedRows){
            if(expandedRows.length>1){
                expandedRows.shift();
            }
        },
        //动态tag相关方法
           async handleClose(obj,item) {
                obj.attr_vals.splice(obj.attr_vals.indexOf(item), 1);
                const res=await this.$http.put(
                    `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}
                     `,
                     {
                         attr_name:obj.attr_name,
                         attr_sel:obj.attr_sel,
                         attr_vals:obj.attr_vals.join(','),
                     }
                );
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus();
                });
            },

           async handleInputConfirm(obj) {
                let inputValue = this.inputValue;
                if (inputValue) {
                obj.attr_vals.push(inputValue);
                }
                //动态添加tag
                   const res = await this.$http.put(
                `categories/${this.selectedOptions[2]}/attributes/${obj.attr_id}
                `,
                {
                    attr_name: obj.attr_name,
                    attr_sel: obj.attr_sel,
                    attr_vals: obj.attr_vals.join(",")
                }
                );
                this.inputVisible = false;
                this.inputValue = '';
            },
            
        //获取动态数据和静态数据
        async getDyOrState(){
            //首先需要判断级联中有没有选择
            if(this.selectedOptions.length!==3){
                this.$message('请先选择三级分类');
                if(this.active==="1"){
                    this.arrDy=[];
                }
                if(this.active==="2"){
                    this.arrStatic=[];
                }
                return;
            }
                  // 获取动态数组
                if(this.active==="1"){
                    const res=await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=many`);
                    // console.log(res);
                    const {meta:{status},data}=res.data;
                    if (status === 200) {
                        this.arrDy = data;
                        this.arrDy.forEach(item=>{
                            item.attr_vals=item.attr_vals.trim().length===0?[]:item.attr_vals.trim().split(",");
                        });
                        // console.log(data)
                    }
                }

                    //获取静态数组
                if(this.active==="2"){
                    const res=await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
                    // console.log(res);
                    const {meta:{status},data}=res.data;
                    if (status === 200) {
                        this.arrStatic = data;
                    }
                }
        },
        //切换选项卡时执行的函数
        changeTab(){
            this.getDyOrState();
        },
        //级联中选中的改变执行的函数
        handleChange(){
        },
          //获取三级商品分类数据
       async getGoodsCate(){
           const res=await this.$http.get(`categories?type=3`);
        //    console.log(res);
           const {data,meta:{msg,status}}=res.data;
           if(status==200){
               this.options=data;
           }
       }
    },
}
</script>

<style>

</style>
