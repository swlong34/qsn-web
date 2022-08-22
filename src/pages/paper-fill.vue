<template>
  <div>
    <!--页面头部-->
    <el-row class="edit-top">
      <el-image
        class="logo"
        style="height: 50px;width: 100px"
        fit="fill"
        :src="logo">
      </el-image>
      <span>填写问卷</span>
      <el-button class="btn" type="success" :disabled="flag" @click="postPaper">提交问卷</el-button>
    </el-row>

    <el-row>
      <!--问卷主编辑区-->
      <el-col v-loading="loading" :span="14" :offset="5">
        <div v-if="!submit" class="edit-main">
          <!--问卷标题-->
          <div class="edit-main-title">
            <span>{{paper.title}}</span>
          </div>
          <el-divider></el-divider>

          <!--问卷内容-->
          <div class="edit-main-content">
            <!--遍历组件并添加到问卷-->
            <div v-for="(qs,index) in qsList" :key="qs.key">
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
                :qsData="paper.content[index]"
                :qsPre="'true'"
                :qsCount="qsList.length"
                ref="qs">
              </component>
            </div>
          </div>
          <el-divider></el-divider>

          <!--问卷结束语-->
          <div class="edit-main-footer">
            <span>{{paper.footer}}</span>
          </div>
        </div>

        <div v-if="submit" class="edit-submit">
          <div class="edit-txt"><span>您的问卷已提交成功！</span></div>
          <div class="edit-btn">
            <el-button @click="$router.push('/')" type="success" style="width: 200px;height: 50px;">
            <span style="font-size: larger">返回主页&nbsp;&nbsp;<i
              style="font-weight: bolder" class="el-icon-right"></i>
            </span>
            </el-button>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Gender from "../components/shortcut/gender";
  import Email from "../components/shortcut/email";
  import Phone from "../components/shortcut/phone";
  import Origin from "../components/shortcut/origin";
  import Birthday from "../components/shortcut/birthday";
  import Number from "../components/shortcut/number";
  import NameStr from "../components/shortcut/name";
  import FillRegion from "../components/fill-region";
  import FillDate from "../components/fill-date";
  import FillMulti from "../components/fill-multi";
  import FillSingle from "../components/fill-single";
  import SelectDrop from "../components/select-drop";
  import SelectRadio from "../components/select-radio";
  import SelectMulti from "../components/select-multi";

  export default {
    name: "paper-fill",
    props: ['id'],
    components: {
      Gender, Email, Phone, Origin, Birthday, Number, NameStr,
      FillRegion, FillDate, FillMulti, FillSingle, SelectDrop, SelectRadio, SelectMulti
    },
    data() {
      return {
        submit: false,
        logo: require('../assets/logo.png'),
        loading: true,
        flag: false,
        qsList: [],
        paper: {
          paper_id: '',
          qs_count: 0,  // 总题目数
          title: '问卷标题',
          content: [],
          footer: '感谢您参与问卷调查，祝您生活愉快(●\'◡\'●)',
          start_time: '',
          end_time: ''
        },
        answer: [/*{
          qs_id: '',
          qs_type: '',
          qs_option: []
        }*/]
      }
    },
    created() {
      this.paper = ''
      this.qsList = []
      // 发送请求获取问卷信息
      this.$axios({
        method: 'get',
        url: '/paper/info/fill/' + this.id,
      }).then((res) => {
        const {code,msg,data} = res

        if(code === 500) {
          this.$message.error(msg)
          this.submit = true
          this.flag = true
        }
        else {
          // 构造出题目组件列表
          const {content} = data
          for (let i in content) {
            if (content[i].qs_type === this.QS_TYPE.SELECT_RADIO.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'SelectRadio'
            })
            if (content[i].qs_type === this.QS_TYPE.SELECT_MULTI.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'SelectMulti'
            })
            if (content[i].qs_type === this.QS_TYPE.SELECT_DROP.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'SelectDrop'
            })
            if (content[i].qs_type === this.QS_TYPE.FILL_SINGLE.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'FillSingle'
            })
            if (content[i].qs_type === this.QS_TYPE.FILL_MULTI.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'FillMulti'
            })
            if (content[i].qs_type === this.QS_TYPE.FILL_DATE.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'FillDate'
            })
            if (content[i].qs_type === this.QS_TYPE.FILL_REGION.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'FillRegion'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_NAME.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'NameStr'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_NUMBER.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'Number'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_GENDER.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'Gender'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_BIRTHDAY.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'Birthday'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_ORIGIN.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'Origin'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_PHONE.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'Phone'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_EMAIL.value) this.qsList.push({
              key: content[i].qs_order,
              name: 'Email'
            })
          }
          this.paper = data
        }
      })
      this.loading = false
    },
    methods: {
      // 验证是否填写完
      validFill() {
        for (let i in this.qsList)
          if (this.$refs['qs'][i].ans === '' || this.$refs['qs'][i].ans === undefined)
            return false
        return true
      },
      // 提交问卷答案
      postPaper() {
        if (!this.validFill()) {
          this.$message.warning("您的问卷未填完，无法提交")
          return false
        }
        // 构造答案数组
        for (let i in this.qsList) {
          let ans = {
            qs_id: this.paper.content[i].qs_id,
            qs_type: this.paper.content[i].qs_type,
            qs_option: JSON.stringify(this.$refs['qs'][i].ans)
          }
          this.answer.push(ans)
        }
        console.log(this.answer)
        // 发送请求保存问卷数据
        this.$axios({
          method: 'post',
          url: '/paper/save/answer/' + this.id,
          data: this.answer
        }).then(() => {
          this.flag = true
          this.submit = true
        })
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

  ul, li, a, h1, h2, h3 {
    margin: 0;
    padding: 0;
    list-style: none;
    text-decoration: none;
  }

  .el-divider--horizontal {
    margin: 10px 0;
  }

  /*页面头部样式*/
  .edit-top {
    height: 60px;
    line-height: 60px;
    margin-bottom: 20px;
    background: #1e649f;
    color: #d3dce6;
    text-align: center;

    .logo {
      float: left;
      margin-top: 5px;
      margin-left: 30px;
    }

    span {
      font-size: larger;
      font-weight: bolder;
    }

    .btn {
      float: right;
      margin-top: 10px;
      margin-right: 50px;
    }
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
      padding: 20px 0;

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
      padding: 20px 0;
      margin-bottom: 30px;
    }
  }

  .edit-submit {

    .edit-txt {
      text-align: center;
      margin: 100px 0;

      span {
        font-size: 40px;
        font-weight: 500;
      }
    }

    .edit-btn {
      text-align: center;
    }
  }
</style>
