<template>
  <el-card class="box">
    <cus-bread level1="商品管理" level2="商品列表"></cus-bread>
    <el-input
      placeholder="请输入内容"
      v-model="searchValue"
      class="input-with-select"
      clearable
    >
      <el-button slot="append" icon="el-icon-search" @click="handleSearch()"></el-button>
    </el-input>
    <el-button @click="showDialog()">添加按钮</el-button>
    <!-- 表格 -->
    <el-table :data="list" height="450px" border style="width: 100%">
      <el-table-column type="index" label="#" width="40"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="380"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格" width="100"></el-table-column>
      <el-table-column prop="goods_weight" label="商品重量" width="80"></el-table-column>
        <el-table-column label="创建日期">
            <template slot-scope="scope">
                {{scope.row.add_time|fmtdate}}
            </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button @click="goodsEdit(scope.row)" type="primary" icon="el-icon-edit" circle size="mini" plain></el-button>
          <el-button type="danger" icon="el-icon-delete" circle size="mini" plain></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- //分页组件 -->
    <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      searchValue: "",
      pagenum: 1,
      pagesize: 10,
      list:[],
      total:0,
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    showDialog(){
      this.$router.push({
        name:'goodsadd'
      });
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val;
      this.loadData();
    },
    handleSearch() {
      this.pagenum=1;
      this.loadData();
    },
    async loadData() {
      const { data: resData } = await this.$http.get(
        `goods?pagenum=${this.pagenum}&pagesize=${this.pagesize}`
      );
      this.total = resData.data.total;
      this.list = resData.data.goods;
    }
  }
};
</script>

<style>
.input-with-select{
  width:350px;
}
.searchArea {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
