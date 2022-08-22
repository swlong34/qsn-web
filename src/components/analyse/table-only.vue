<template>
  <div>
    <div class="emc-qs-title">
      <span class="qs-title">{{qsAnswer.qs_order}}.{{qsAnswer.qs_title}}</span>
      <span class="qs-tip" v-if="qsAnswer.qs_type === QS_TYPE.FILL_SINGLE.value">[单行文本]</span>
      <span class="qs-tip" v-else-if="qsAnswer.qs_type === QS_TYPE.FILL_MULTI.value">[多行文本]</span>
      <span class="qs-tip" v-else-if="qsAnswer.qs_type === QS_TYPE.FILL_REGION.value">[地区题]</span>
      <span class="qs-tip" v-else-if="qsAnswer.qs_type === QS_TYPE.FILL_DATE.value">[日期题]</span>
      <span class="qs-tip" v-else>[模板题]</span>
    </div>
    <el-table
      :header-cell-style="{background:'#eef1f6',color:'#606266'}"
      :data="qsAnswer.qs_option"
      max-height="250"
      border
      style="width: 100%">
      <el-table-column
        type="index" label="数据条目" width="100">
      </el-table-column>
      <el-table-column
        :show-overflow-tooltip="true"
        prop="option" label="用户答案">
      </el-table-column>
    </el-table>
    <div class="ems-qs-footer">
      <div><span>提交人数：{{qsAnswer.submit_person}}</span></div>
      <div>
        <el-tag size="mini" type="danger">表&nbsp;&nbsp;格</el-tag>
      </div>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
  export default {
    name: "table-only",
    props: ['qsAnswer'],
    data() {
      return {

      }
    },
    methods: {

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
