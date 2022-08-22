<template>
  <div style="background: #e9eef3">
    <!--页面头部-->
    <el-row class="edit-top">
      <el-col :span="16" :offset="2" class="e-t-title">
        <el-page-header @back="goBack" content="创建问卷"></el-page-header>
      </el-col>
    </el-row>

    <el-row>
      <!--问卷主编辑区-->
      <el-col v-loading="loading" :span="14" :offset="5">

        <div class="edit-main">
          <!--问卷标题-->
          <div class="edit-main-title">
            <span>{{paperInfo.title}}</span>
          </div>
          <el-divider></el-divider>

          <!--问卷内容-->
          <div class="edit-main-content">
            <!--遍历组件并添加到问卷-->
            <div v-for="(qs,index) in preQsList" :key="qs.key">
              <!--
              qsIndex属性：向子组件传递题目顺序
              qsKey属性：向子组件传递题目编号（唯一）
              delForm方法：接收子组件传递的删除事件
              add2Paper方法：接收子组件传递的添加题目事件
              -->
              <component
                :is="qs.name"
                :popStop="true"
                :qsIndex="index+1"
                :qsKey="qs.key"
                :qsData="paperInfo.content[index]"
                :qsPre="$route.params.pre"
                :qsCount="preQsList.length">
              </component>
            </div>
          </div>
          <el-divider></el-divider>

          <!--问卷结束语-->
          <div class="edit-main-footer">
            <span>{{paperInfo.footer}}</span>
          </div>

        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import SelectRadio from "../components/select-radio";
  import SelectMulti from "../components/select-multi";
  import SelectDrop from "../components/select-drop";
  import FillSingle from "../components/fill-single";
  import FillMulti from "../components/fill-multi";
  import FillDate from "../components/fill-date";
  import FillRegion from "../components/fill-region";
  import NameStr from "../components/shortcut/name";
  import Number from "../components/shortcut/number";
  import Birthday from "../components/shortcut/birthday";
  import Origin from "../components/shortcut/origin";
  import Phone from "../components/shortcut/phone";
  import Email from "../components/shortcut/email";
  import Gender from "../components/shortcut/gender";

  export default {
    name: "paper-view",
    components: {
      Gender, Email, Phone, Origin, Birthday, Number, NameStr,
      FillRegion, FillDate, FillMulti, FillSingle, SelectDrop, SelectRadio, SelectMulti
    },
    data() {
      return {
        loading: true,
        goBackFlag: true,
        preQsList: [],
        paperInfo: {
          paper_id: '',
          qs_count: 0,  // 总题目数
          title: '问卷标题',
          content: [],
          footer: '感谢您参与问卷调查，祝您生活愉快(●\'◡\'●)',
          start_time: '',
          end_time: ''
        }
      }
    },
    created() {

      console.log('--paper-view页面 created')
      this.paperInfo = this.$route.params.paperInfo;
      this.preQsList = this.$route.params.preQsList;
      this.paperInfo.content.sort(function (a, b) { return a.qs_order - b.qs_order; })

      console.log(this.paperInfo.content)
      console.log(this.preQsList)
      console.log('-------------------------------')
      this.loading = false
    },
    // 组件前置路由
    /*beforeRouteEnter(to, from, next) {
      next(vm => {
        if(from.name === 'paper') vm.goBackFlag = false
      })
    },*/
    methods: {
      goBack() {
          this.$router.go(-1)
      }
    }
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

  /deep/ .el-divider--horizontal {
    margin: 10px 0;
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

    .e-t-btn-text {
      i {
        font-size: 14px;
      }

      font-size: 14px;
    }
  }

  /*编辑问卷区域样式*/
  .edit-main {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    height: calc(100vh - 80px);
    overflow: auto;
    overflow-x: hidden;
    background: #f7f7f7;

    /*问卷标题区*/
    .edit-main-title {
      text-align: center;
      padding: 10px 0;

      span {
        font-weight: bolder;
        font-size: larger;
      }
    }

    /*问卷主体区*/
    .edit-main-content {
      .emc-no-qs {
        margin: auto;
        width: 400px;
        height: 40px;
        line-height: 40px;
        border: 1px dashed;
        text-align: center;

        span i {
          font-size: larger;
          font-weight: bolder;
        }
      }
    }

    /*问卷结束语*/
    .edit-main-footer {
      text-align: center;
      padding: 10px 0;
    }
  }

</style>
