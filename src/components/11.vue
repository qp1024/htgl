




<template>
    <el-card class="box-card">
        <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
        <!-- 添加商品信息 -->
        <el-alert class="alert" title="添加商品信息" type="info" center show-icon></el-alert>
        <!-- 步骤条 -->
        <el-steps :active="active*1" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        </el-steps>
        <!-- 竖直选项卡 -->
        <el-form :model="form" class="form" label-position="top" label-width="80px">
         <el-tabs tab-position="left" @tab-click="changeTab()" v-model="active">
            <el-tab-pane label="基本信息" name="1">
                <el-form-item label="商品名称">
                   <el-input v-model="form.goods_name"></el-input> 
                </el-form-item>
                <el-form-item label="商品价格">
                   <el-input v-model="form.goods_price"></el-input> 
                </el-form-item>
                <el-form-item label="商品重量">
                   <el-input v-model="form.goods_重量"></el-input> 
                </el-form-item>
                <el-form-item label="商品数量">
                    <el-input v-model="form.goods_number"></el-input>
                </el-form-item>
                <el-form-item label="商品分类">
                    {{selectedOptions}}
                     <el-cascader
                        clearable
                        expand-trigger="hover"
                        :options="options"
                        :props="defaultProp"
                        v-model="selectedOptions"
                        @change="handleChange"
                        ></el-cascader> 
                </el-form-item>
            </el-tab-pane>
            <!-- //动态参数,发送请求把数据赋值 -->
            <el-tab-pane label="商品参数" name="2">
                <el-form-item :label="item1.attr_name" v-for="(item1) in arrDy" :key="item1.attr_id">
                   <el-checkbox-group v-model="item1.attr_vals">
                       <el-checkbox border :label="item2" v-for="(item2,i) in item1.attr_vals" :key="i"></el-checkbox>
                   </el-checkbox-group>
                </el-form-item>
                
            </el-tab-pane>
            <!-- //商品属性 -->
            <el-tab-pane label="商品属性" name="3">
                <el-form-item v-for="(item1,i) in arrStatic" :key="i">
                    <el-form-item :label="item1.attr_name">
                    <el-input v-model="item1.attr_vals"></el-input> 
                </el-form-item>
                </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="4">
                <el-form-item>
            <el-upload
              action="http://localhost:8888/api/private/v1/upload"
              :headers="headers"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="5">
                <el-form-item>
                    <el-button @click="addGoods()">添加商品</el-button>
                    <quill-editor class="quill" v-model="form.goods_introduce">
                    </quill-editor>
                </el-form-item>
            </el-tab-pane>
        </el-tabs>
        </el-form>
    </el-card>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import { quillEditor } from "vue-quill-editor";


export default {
    components:{
        quillEditor
    },
    data(){
        return {
            active:"1",
            form:{
                goods_name: "",
                goods_cat: "",
                goods_price: "",
                goods_number: "",
                goods_weight: "",
                goods_introduce: "",
                pics: [],
                attrs: [] 
            },
            selectedOptions:[1,3,6],
            options:[],
            defaultProp: {
                label: "cat_name",
                value: "cat_id"
            },
            arrDy:[],
            arrStatic:[],
            headers: {
                    Authorization: localStorage.getItem("token")
                },
        }
    },
    created(){
        this.getGoodsCate();
    },
    methods:{
        //添加商品
        async addGoods(){
            //处理商品分类
            this.form.goods_cat=this.selectedOptions.join(",");
            //处理attrs属性,动态的和静态的拼接
            const arr1=this.arrDy.map(item=>{
                return {attr_id:item.attr_id,attr_value:item.attr_vals};
            });
            const arr2=this.arrStatic.map(item=>{
                return {attr_id:item.attr_id,attr_value:item.attr_vals};
            });
            this.form.attrs=[...arr1,...arr2];
            const res=await this.$http.post(`goods`,this.form);
            const {data,meta:{status,msg}}=res.data;
            if(status==201){
                this.$message.success(msg);
                this.$router.push({
                    name:'goods'
                });
            }
        },


        //上传图片的功能图片点×
        handleRemove(file,fileList){
            const Index=this.form.pics.findIndex(item=>{
                //点击叉号item里面的pic值会没有,file.response.data.tmp_path会保存这个路径然后返回这个item所在的索引值,
                // console.log(item);
                // console.log(file);
                return item.pic===file.response.data.tmp_path;
            });
            this.form.pics.splice(Index,1);
        },
        //图片上传成功触发的钩子函数
        handleSuccess(response,file,fileList){
            // console.log(response.data.tmp_path);
            this.form.pics.push({
                pics:response.data.tem_path
            });
        },
        //点击第二个tab获取动态请求的数据
        handleChange(){},
        //切换选项卡
        async changeTab(){
            if(this.active==="2"||this.active==="3"){
                if(this.selectedOptions.length!==3){
                    this.$message.error('请先选择三级分类');
                    //在错误之后把之前的信息清除
                    if(this.active==='2'){
                        this.arrDy=[];
                    }else{
                        this.arrStatic=[];
                    }
                    return;
                }
                //获取静态数组
                if(this.active==="3"){
                    const res=await this.$http.get(`categories/${this.selectedOptions[2]}/attributes?sel=only`);
                    // console.log(res);
                    const {meta:{status},data}=res.data;
                    if (status === 200) {
                        this.arrStatic = data;
                        // console.log(data);
                    }
                }
                // 获取动态数组
                if(this.active==="2"){
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

   
            }
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
    }
}
</script>

<style>

</style>
