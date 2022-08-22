<template>
  <div>
    <!--页面头部-->
    <el-row class="edit-top">
      <el-col :span="16" :offset="2" class="e-t-title">
        <el-page-header @back="goBack" content="创建问卷"></el-page-header>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <!--问卷主编辑区-->
      <el-col :span="4" :offset="3">

        <div class="edit-head">
          <div class="eh eh-from-blank">
            <h3 align="center">从空白创建</h3>
            <div class="eh-btn" align="center">
              <el-button type="primary" @click="createFromBlank">立即创建</el-button>
            </div>
          </div>
          <div class="eh eh-from-file">
            <h3 align="center">从文件创建</h3>
            <el-upload
              ref="upload"
              align="center"
              class="upload-demo"
              :action="url"
              :on-exceed="handleExceed"
              :on-success="prePaper"
              :on-remove="handleRemove"
              :limit="1"
              :file-list="fileList">
              <el-button size="small" type="success">点击上传Word文件</el-button>
              <div class="el-upload__tip" slot="tip">只能上传.docx文件，且不超过100kb</div>
              <div class="el-upload__tip" slot="tip" style="text-align: left;color: #dd6161;padding: 0 10px;">
                .docx文件格式要求：<br>
                1.开头标题为第一行<br>
                2.从第二行开始为题目信息<br>
                3.题目标题和选项单独占一行<br>
                4.标题格式为：序号.题目描述[类型]<br>
                5.题目与题目之间有个空行<br>
              </div>
            </el-upload>
            <div class="eh-btn" align="center">
              <el-button type="primary" @click="createFromFile">立即创建</el-button>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="edit-main">
          <!--问卷标题-->
          <div class="edit-main-title">
            <span>{{paperInfo.title}}（预览）</span>
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
                :qsPre="'true'"
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
    name: "paper-pre",
    components: {
      Gender, Email, Phone, Origin, Birthday, Number, NameStr,
      FillRegion, FillDate, FillMulti, FillSingle, SelectDrop, SelectRadio, SelectMulti
    },
    data() {
      return {
        gFlag: false,
        // url: `${this.QS_TYPE.DEV_URL}${this.QS_TYPE.DEV_PORT}/file/word/upload`,
        url: `${this.QS_TYPE.PRO_URL}${this.QS_TYPE.PRO_PORT}/file/word/upload`,
        fileList: [],
        preQsList: [],
        paperInfo: {
          paper_id: '',
          qs_count: 0,  // 总题目数
          title: '',
          content: [],
          footer: '',
          start_time: '',
          end_time: ''
        }
      };
    },
    methods: {
      prePaper(res, file, fileList) {
        const {code,msg,data} = res

        if(code === 500) {
          this.$message.error(msg)
          this.gFlag = true
          return false
        }

        if(code === 200) {
          this.$message.success(msg)
        }

        // 构造出题目组件列表
        const {content} = data
        let qsList = []
        for (let i in content) {
          if (content[i].qs_type === this.QS_TYPE.SELECT_RADIO.value) qsList.push({
            key: content[i].qs_order,
            name: 'SelectRadio'
          })
          if (content[i].qs_type === this.QS_TYPE.SELECT_MULTI.value) qsList.push({
            key: content[i].qs_order,
            name: 'SelectMulti'
          })
          if (content[i].qs_type === this.QS_TYPE.SELECT_DROP.value) qsList.push({
            key: content[i].qs_order,
            name: 'SelectDrop'
          })
          if (content[i].qs_type === this.QS_TYPE.FILL_SINGLE.value) qsList.push({
            key: content[i].qs_order,
            name: 'FillSingle'
          })
          if (content[i].qs_type === this.QS_TYPE.FILL_MULTI.value) qsList.push({
            key: content[i].qs_order,
            name: 'FillMulti'
          })
          if (content[i].qs_type === this.QS_TYPE.FILL_DATE.value) qsList.push({
            key: content[i].qs_order,
            name: 'FillDate'
          })
          if (content[i].qs_type === this.QS_TYPE.FILL_REGION.value) qsList.push({
            key: content[i].qs_order,
            name: 'FillRegion'
          })
          if (content[i].qs_type === this.QS_TYPE.SHORTCUT_NAME.value) qsList.push({
            key: content[i].qs_order,
            name: 'NameStr'
          })
          if (content[i].qs_type === this.QS_TYPE.SHORTCUT_NUMBER.value) qsList.push({
            key: content[i].qs_order,
            name: 'Number'
          })
          if (content[i].qs_type === this.QS_TYPE.SHORTCUT_GENDER.value) qsList.push({
            key: content[i].qs_order,
            name: 'Gender'
          })
          if (content[i].qs_type === this.QS_TYPE.SHORTCUT_BIRTHDAY.value) qsList.push({
            key: content[i].qs_order,
            name: 'Birthday'
          })
          if (content[i].qs_type === this.QS_TYPE.SHORTCUT_ORIGIN.value) qsList.push({
            key: content[i].qs_order,
            name: 'Origin'
          })
          if (content[i].qs_type === this.QS_TYPE.SHORTCUT_PHONE.value) qsList.push({
            key: content[i].qs_order,
            name: 'Phone'
          })
          if (content[i].qs_type === this.QS_TYPE.SHORTCUT_EMAIL.value) qsList.push({
            key: content[i].qs_order,
            name: 'Email'
          })
        }

        this.preQsList = qsList
        this.paperInfo = data
      },
      createFromBlank() {
        this.$router.push({name: 'paper-edit'})
      },
      createFromFile() {

        if(this.gFlag) {
          this.$message.warning("请删除后重新上传文件")
          return false
        }

        if (this.$refs.upload.uploadFiles.length === 0) {
          this.$message.warning("请先上传文件")
          return false
        }

        this.$router.push({
          name: 'paper-edit', params: {
            pre: 'true', data: this.paperInfo
          }
        })
      },
      handleExceed() {
        this.$message.warning("一次最多只能上传一个文件")
      },
      handleRemove() {
        this.gFlag = false
        this.preQsList = ''
        this.paperInfo = ''
      },
      goBack() {
        this.$router.go(-1)
      },
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

  .edit-head {
    background: #f7f7f7;

    .eh {
      box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
      width: 100%;
      margin-bottom: 20px;

      h3 {
        margin: 0;
        padding: 10px 0;
      }
    }

    .eh-btn {
      padding: 20px 0;
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
