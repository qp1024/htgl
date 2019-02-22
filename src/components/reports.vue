<template>
  <el-card class="box">
    <cus-bread level1="数据统计" level2="数据报表"></cus-bread>
    <div id="main" style="width: 600px;height:400px;"></div>
  </el-card>
</template>

<script>
import echarts from "echarts"
export default {
    mounted(){
        this.initEcharts();
    },
    methods:{
        async initEcharts(){
            const myChart = echarts.init(document.getElementById("main"));
            
            const res=await this.$http.get(`reports/type/1`);
            const option2=res.data.data;
            const option1={
                        title: {
                text: "数据报表"
                },
                tooltip: {
                trigger: "axis",
                axisPointer: {
                    type: "cross",
                    label: {
                    backgroundColor: "#6a7985"
                    }
                }
                },

                toolbox: {
                feature: {
                    saveAsImage: {}
                }
                },
                grid: {
                left: "3%",
                right: "4%",
                bottom: "3%",
                containLabel: true
                }
            };
        const option={...option1,...option2};
        myChart.setOption(option);
        }
    },
}
</script>

<style>

</style>
