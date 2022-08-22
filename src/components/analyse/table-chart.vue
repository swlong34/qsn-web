<template>
  <div>
    <div class="emc-qs-title">
      <span class="qs-title">{{qsAnswer.qs_order}}.{{qsAnswer.qs_title}}</span>
      <span class="qs-tip" v-if="qsAnswer.qs_type === QS_TYPE.SELECT_RADIO.value">[单选题]</span>
      <span class="qs-tip" v-if="qsAnswer.qs_type === QS_TYPE.SELECT_MULTI.value">[多选题]</span>
      <span class="qs-tip" v-if="qsAnswer.qs_type === QS_TYPE.SELECT_DROP.value">[下拉选择]</span>
    </div>
    <el-table
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :data="qsAnswer.qs_option"
      max-height="250"
      border
      style="width: 100%">
      <el-table-column
        :show-overflow-tooltip="true"
        prop="option" label="选项" width="200">
      </el-table-column>
      <el-table-column
        prop="subtotal" label="小计" width="200">
      </el-table-column>
      <el-table-column label="比例">
        <template slot-scope="scope">
          <el-progress
            :text-inside="true"
            :stroke-width="20"
            :percentage="parseInt(scope.row.percentage)"
            :color="showColor(parseInt(scope.row.percentage))">
          </el-progress>
        </template>
      </el-table-column>
    </el-table>
    <div class="ems-qs-footer">
      <div><span>提交人数：{{qsAnswer.submit_person}}</span></div>
      <div>
        <el-tag size="mini" type="danger">表&nbsp;&nbsp;格</el-tag>
        <el-tag size="mini" type="primary">柱状图</el-tag>
        <el-tag size="mini" type="success">饼&nbsp;&nbsp;图</el-tag>
      </div>
    </div>
    <div class="ems-qs-chart">
      <div :id="qsAnswer.qs_order + '1'" style="height: 300px;width: 500px"></div>
      <div :id="qsAnswer.qs_order + '2'" style="height: 300px;width: 500px"></div>
    </div>

    <el-divider></el-divider>
  </div>
</template>

<script>
  import * as echarts from "echarts";

  export default {
    name: "table-chart",
    props: ['qsAnswer'],
    data() {
      return {

      }
    },
    mounted() {
      // 组装图表所需参数并传入
      let opts = this.qsAnswer.qs_option
      let label = [], data1 = [], data2 = []
      for(let i in opts) {
        label.push(opts[i].option)
        data1.push(parseInt(opts[i].subtotal))
        let ans = {
          name: opts[i].option,
          value: parseInt(opts[i].subtotal)
        }
        data2.push(ans)
      }
      this.drawBarCharts('', label, data1)
      this.drawPieCharts('', data2)
    },
    methods: {
      showColor(per) {
        if(per < 30)
          return '#F56C6C'
        else if(per < 50)
          return '#E6A23C'
        else if(per < 70)
          return '#409EFF'
        else
          return '#5CBB7A'
      },
      drawBarCharts(name,label,data) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById(this.qsAnswer.qs_order + '1'));
        // 绘制图表
        myChart.setOption({
          title: {},
          tooltip: {},
          xAxis: {
            data: label
          },
          yAxis: {},
          series: [{
            name: name,
            type: 'bar',
            data: data
          }]
        });
      },
      drawPieCharts(name,data) {
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById(this.qsAnswer.qs_order + '2'));
        // 绘制图表
        myChart.setOption({
          title: {},
          tooltip: {},
          series : [
            {
              name: name,
              type: 'pie',    // 设置图表类型为饼图
              radius: '65%',  // 饼图的半径，外半径为可视区尺寸（容器高宽中较小一项）的 55% 长度。
              data: data          // 数据数组，name 为数据项名称，value 为数据项值
            }
          ]
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .emc-qs-title {
    margin-top: 15px;
    margin-bottom: 15px;
    margin-left: 20px;

    .qs-title {
      font-size: larger;
      font-weight: bolder;
    }

    .qs-tip {
      font-size: larger;
    }
  }

  .ems-qs-footer {
    height: 30px;
    line-height: 30px;
    margin: 10px 20px;
    display: flex;
    justify-content: space-between;
  }

  .ems-qs-chart {
    margin: auto;
    width: 1000px;
    height: 300px;
    border: #99a9bf 1px solid;
    display: flex;
  }
</style>
