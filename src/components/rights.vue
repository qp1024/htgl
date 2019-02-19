<template>
  <el-card class="box">
    <cus-bread level1="权限管理" level2="权限列表"></cus-bread>
    <!-- 列表 -->
        <el-table :data="list" style="width: 100%">
        <el-table-column prop="id" label="#" width="80"></el-table-column>
        <el-table-column prop="authName" label="权限名称" width="120"></el-table-column>
        <el-table-column prop="path" label="路径" width="140"></el-table-column>
        <el-table-column prop="level" label="层级" width="140"></el-table-column>   
        </el-table>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      list: []
    };
  },
  created() {
    this.getTableData();
  },
  methods: {
    async getTableData() {
      const res = await this.$http.get(`rights/list`);
         console.log(res);
      const {
        data,
        meta: { msg, status }
      } = res.data;
      if (status === 200) {
        this.list = data;
      }
    }
  }
};
</script>

<style>
</style>
