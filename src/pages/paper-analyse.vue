<template>
  <div>
    <!--页面头部-->
    <el-row class="edit-top">
      <el-col :span="16" :offset="2" class="e-t-title">
        <el-page-header @back="$router.go(-1)" content="统计问卷"></el-page-header>
      </el-col>
    </el-row>

    <el-row>
      <el-col v-loading="loading" :span="16" :offset="4">
        <div class="edit-main">

          <!--问卷标题-->
          <div class="edit-main-title">
            <span>{{title}}(报告)</span>
          </div>
          <el-divider></el-divider>

          <!--问卷内容-->
          <div class="edit-main-content">
            <div v-for="(ans,index) in ansList" :key="ans.key">
              <component
                :is="ans.name"
                :qsAnswer="answer[index]">
              </component>
            </div>
          </div>

          <div style="height: 60px;line-height: 60px;text-align: center;"><span>我是可是有底线的~</span></div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import TableOnly from '../components/analyse/table-only'
  import TableChart from '../components/analyse/table-chart'

  export default {
    name: "paper-analyse",
    components: {TableChart, TableOnly},
    data() {
      return {
        loading: true,
        title: '',
        answer: [],
        ansList: []
      }
    },
    created() {
      let paperId = this.$route.params.id;
      this.$axios({
        method: 'get',
        url: '/paper/get/analyse/' + paperId,
      }).then(({title,data}) => {
        console.log(title)
        console.log(data)
        this.title = title
        this.answer = data

        // 构造题目组件列表
        for(let i in data) {
          if(data[i].qs_type === this.QS_TYPE.SELECT_RADIO.value
            || data[i].qs_type === this.QS_TYPE.SELECT_MULTI.value
            || data[i].qs_type === this.QS_TYPE.SELECT_DROP.value)
            this.ansList.push({key: data[i].qs_order, name: 'TableChart'})
          else
            this.ansList.push({key: data[i].qs_order, name: 'TableOnly'})
        }

        this.loading = false
      })

    },
  }
</script>

<style lang="scss" scoped>
  .el-row {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  ul, li, a {
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
  }

  .el-divider--horizontal {
    margin: 5px 0;
  }

  .el-page-header {
    height: 60px;
    line-height: 60px;

    /*深度作用选择器*/
    /deep/ .el-page-header__content {
      font-weight: bolder;
      color: #d3dce6;
    }
  }

  /*页面头部样式*/
  .edit-top {
    height: 60px;
    line-height: 60px;
    margin-bottom: 20px;
    background: #1e649f;
    color: #d3dce6;
  }

  /*编辑问卷区域样式*/
  .edit-main {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    height: calc(100vh - 80px);
    overflow: auto;
    overflow-x: hidden;

    /*问卷标题区*/
    .edit-main-title {
      text-align: center;
      padding: 15px 0;
      span {
        font-weight: bolder;
        font-size: larger;
      }
    }

    /*问卷主体区*/
    .edit-main-content {


    }

  }

</style>
