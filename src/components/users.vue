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
        <el-table
        :data="formdata"
        style="width: 100%">
        <el-table-column
            prop="date"
            label="日期"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="姓名"
            width="180">
        </el-table-column>
        <el-table-column
            prop="address"
            label="地址">
        </el-table-column>
        </el-table>
        <!-- 分页 -->
    </el-card>
</template>

<script>
export default {
    data(){
        return {
            query:'',
            formdata:{

            }
        }
    }
}
</script>

<style>
.box{
    height: 100%;
}
.input-with-select{
    width: 350px;
}
</style>
