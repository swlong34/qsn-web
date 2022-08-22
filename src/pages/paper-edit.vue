<template>
  <div style="background: #e9eef3">
    <!--页面头部-->
    <el-row class="edit-top">
      <el-col :span="16" :offset="2" class="e-t-title">
        <el-page-header @back="goBack" content="编辑问卷"></el-page-header>
      </el-col>
      <el-col :span="6">
        <!--        <router-link tag="a" target="_blank" :to="{name:'paper-view', params: {paperInfo: this.paper, preQsList: this.qsList}}">-->
        <!--          <el-button @click="preview" type="primary" size="small">-->
        <!--            <span class="e-t-btn-text"><i class="el-icon-view"></i>&nbsp;预览</span>-->
        <!--          </el-button>-->
        <!--        </router-link>-->
        <el-button @click="finishEdit" type="success" size="small">
          <span class="e-t-btn-text"><i class="el-icon-finished"></i>&nbsp;完成编辑</span>
        </el-button>
      </el-col>
    </el-row>

    <!--页面主体-->
    <el-row :gutter="20">
      <!--题目列表-->
      <el-col :span="3" :offset="2">
        <ul class="edit-left">
          <li>
            <div class="e-l-title"><span>选择题</span></div>
            <ul class="e-l-qs">
              <li><a @click="addSelectByRadio"><i class="el-icon-mouse"></i>&nbsp;单选题</a></li>
              <li><a @click="addSelectByMulti"><i class="el-icon-files"></i>&nbsp;多选题</a></li>
              <li><a @click="addSelectByDrop"><i class="el-icon-d-caret"></i>&nbsp;下拉选择</a></li>
            </ul>
          </li>
          <el-divider></el-divider>
          <li>
            <div class="e-l-title"><span>填空题</span></div>
            <ul class="e-l-qs">
              <li><a @click="addFillBySingle"><i class="el-icon-tickets"></i>&nbsp;单行填空</a></li>
              <li><a @click="addFillByMulti"><i class="el-icon-document-copy"></i>&nbsp;多行填空</a></li>
              <li><a @click="addFillByRegion"><i class="el-icon-map-location"></i>&nbsp;地区</a></li>
              <li><a @click="addFillByDate"><i class="el-icon-date"></i>&nbsp;日历</a></li>
            </ul>
          </li>
          <el-divider></el-divider>
          <li>
            <div class="e-l-title"><span>个人信息</span></div>
            <ul class="e-l-qs">
              <li><a @click="addName"><i class="el-icon-user"></i>&nbsp;姓名</a></li>
              <li><a @click="addNumber"><i class="el-icon-s-custom"></i>&nbsp;学号/工号</a></li>
              <li><a @click="addGender"><i class="el-icon-male"></i>&nbsp;性别</a></li>
              <li><a @click="addBirthday"><i class="el-icon-date"></i>&nbsp;出生日期</a></li>
              <li><a @click="addOrigin"><i class="el-icon-place"></i>&nbsp;籍贯</a></li>
              <li><a @click="addPhone"><i class="el-icon-phone-outline"></i>&nbsp;手机号</a></li>
              <li><a @click="addEmail"><i class="el-icon-message"></i>&nbsp;邮箱</a></li>
            </ul>
          </li>
        </ul>
      </el-col>

      <!--问卷主编辑区-->
      <el-col v-loading="loading" :span="13">
        <div class="edit-main">
          <!--问卷标题-->
          <div class="edit-main-title" @click="editTitle">
            <span>{{paper.title}}</span>
          </div>
          <el-divider></el-divider>

          <!--问卷内容-->
          <div class="edit-main-content">
            <!--若当前没问题显示加号-->
            <div v-if="paper.qs_count === 0" class="emc-no-qs">
              <span><i class="el-icon-plus"></i></span>
            </div>
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
                :qsIndex="index+1"
                :qsKey="qs.key"
                :qsCount="qsList.length"
                :qsEdit="$route.params.edit"
                :paperId="$route.params.paperId"
                :qsModel="$route.params.model"
                :modelId="$route.params.modelId"
                :qsPre="$route.params.pre"
                :qsData="paper.content[index]"
                ref="forms"
                @delForm="delForm(qs.key)"
                @add2Paper="addContent"
                @qsMoveUP="moveUp([index+1,qs.key])"
                @qsMoveDown="moveDown([index+1,qs.key])">
              </component>
            </div>
          </div>
          <el-divider></el-divider>

          <!--问卷结束语-->
          <div class="edit-main-footer" @click="editFooter">
            <span>{{paper.footer}}</span>
          </div>

          <!--选择问卷起止时间-->
          <div class="edit-main-time">
            <div class="block">
              <el-date-picker
                v-model="paper.start_time"
                type="datetime"
                placeholder="选择开始时间">
              </el-date-picker>
            </div>
            &nbsp;&nbsp;&nbsp;
            <span><i class="el-icon-d-arrow-right"></i></span>
            &nbsp;&nbsp;&nbsp;
            <div class="block">
              <el-date-picker
                v-model="paper.end_time"
                type="datetime"
                placeholder="选择结束时间">
              </el-date-picker>
            </div>
          </div>
        </div>
      </el-col>

      <!--问卷大纲-->
      <el-col :span="4">
        <div class="edit-right">
          <div class="e-l-title"><span>问卷大纲</span></div>
          <div class="e-l-content">
            <div class="e-l-item" v-for="(qs,index) in curQsList" :key="index">
              <div>{{qs.qs_order}}.{{qs.qs_title}}<span style="font-weight: lighter; font-size: small">[{{getQsDesc(qs.qs_type)}}]</span></div>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!--对话框-->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%">
      <span>请确认您的问卷已编辑完成</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogVisible = false">取 消</el-button>
        <el-button size="small" type="primary" @click="savePaper">保 存</el-button>
<!--        <el-button size="small" type="success" @click="saveAndPublishPaper">保存并发布</el-button>-->
      </span>
    </el-dialog>
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
  import moment from 'moment'

  export default {
    name: "paper-edit",
    components: {
      Gender, Email, Phone, Origin, Birthday, Number, NameStr,
      FillRegion, FillDate, FillMulti, FillSingle, SelectDrop, SelectRadio, SelectMulti
    },
    data() {
      return {
        loading: true,
        dialogVisible: false,
        qsList: [],   // 题目列表 key:题目编号(唯一) name:题目类型
        qs_key: 0,    // 题目编号：唯一
        paper: {
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
      // 从文件创建跳转过来
      if(this.$route.params.pre === 'true') {

        let data = this.$route.params.data

        // 将题目组件列表渲染出来
        this.createQsList(data)

        // 将原始数据渲染到问卷
        this.paper = data
        this.paper.start_time = ''
        this.paper.end_time = ''
      }

      // 从模板中心跳转过来，提前将模板问卷数据准备并渲染
      if(this.$route.params.model === 'true') {
        let modelId = this.$route.params.modelId
        // 1.发送请求，获取全部模板数据
        this.$axios({
          method: 'get',
          url: '/model/info/' + modelId
        }).then(({data}) => {

          console.log(data)
          // 2.将题目组件列表渲染出来
          this.createQsList(data)

          // 3.将原始数据渲染到问卷
          this.paper = data
          this.paper.start_time = ''
          this.paper.end_time = ''
        })
      }

      // 从编辑按钮跳转过来，需要提前准备并渲染数据
      if (this.$route.params.edit === 'true') {
        let paperId = this.$route.params.paperId
        // 1.发送请求，获取全部问卷数据
        this.$axios({
          method: 'get',
          url: '/paper/info/' + paperId,
        }).then(({data}) => {
          // 2.将题目组件列表渲染出来
          this.createQsList(data)

          // 3.将原始数据渲染到问卷
          this.paper = data
          this.paper.start_time = data.start_time
          this.paper.end_time = data.end_time
        })
          // 4.题目数据由各个题目自己渲染
      }

      this.loading = false
    },
    updated() {
      this.$route.params.edit = 'false'
      this.$route.params.model = 'false'
      this.$route.params.pre = 'false'
    },
    computed: {
      curQsList() {
        console.log(this.paper.content)
        return this.paper.content.sort((a, b) => {
          return a.qs_order - b.qs_order
        })
      }
    },
    methods: {
      // 根据题目类型数字返回描述
      getQsDesc(type) {
        const qst =  this.QS_TYPE;
        if(type === qst.SELECT_RADIO.value) return '单选题'
        else if(type === qst.SELECT_MULTI.value) return '多选题'
        else if(type === qst.SELECT_DROP.value) return '下拉选择'
        else if(type === qst.FILL_SINGLE.value) return '单行文本'
        else if(type === qst.FILL_MULTI.value) return '多行文本'
        else if(type === qst.FILL_REGION.value) return '地区文本'
        else if(type === qst.FILL_DATE.value) return '日期文本'
        else return '模板题'
      },

      // 预览
      preview() {

      },

      // 保存问卷
      savePaper() {
        this.dialogVisible = false
        this.paper.start_time = moment(this.paper.start_time).format('YYYY-MM-DD HH:mm:ss')
        this.paper.end_time = moment(this.paper.end_time).format('YYYY-MM-DD HH:mm:ss')
        console.log(this.paper)
        this.$axios({
          method: 'post',
          url: '/paper/save',
          data: this.paper
        }).then(() => {
          // 跳转到问卷列表
          this.$router.push({name: 'paper'})
        })
      },

      // 保存并发布问卷
      saveAndPublishPaper() {
        this.dialogVisible = false
      },

      // 检查某个字符串是否在字符串数组中 true:在
      needValidate(str, arr) {
        for (let a in arr)
          if (arr[a] === str) return true
        return false
      },

      // 完成编辑，提交数据
      finishEdit() {

        // 1.判断当前问卷是否为空
        if (this.qsList.length === 0) {
          this.$message.warning("您的问卷为空，无法提交")
          return false
        }

        // 2.判断所有题目是否已经编辑完毕
        const validateArray = ['SelectRadio', 'SelectMulti', 'SelectDrop', 'FillSingle', 'FillMulti', 'FillRegion', 'FillDate']
        for (let qs in this.qsList) {
          if (this.needValidate(this.qsList[qs].name, validateArray)) {
            if (this.$refs['forms'][qs].show) {
              this.$message.warning("您还有未编辑的题目，无法提交")
              return false
            }
          }
        }

        // 3.判断开始和结束时间是否设置
        if (this.paper.start_time === '' || this.paper.end_time === '' || this.paper.start_time === undefined || this.paper.end_time === undefined) {
          this.$message.warning("问卷的开始或结束时间未设置，无法提交")
          return false
        }

        // 4.显示提交框
        this.dialogVisible = true
      },

      // 返回上一页
      goBack() {
        this.$router.push('/paper')
      },

      // 添加标题
      editTitle() {
        this.$prompt('请输入标题', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputValue: this.paper.title,
          inputPattern: /\S+/,
          inputErrorMessage: '标题不能为空'
        }).then(({value}) => {
          this.paper.title = value
        }).catch(() => {

        });
      },

      // 添加/编辑题目
      addContent(data) {
        /*
        判断当前添加的题目是否存在
        注：JS增强for循环遍历的是数组的下标
        */
        for (let index in this.paper.content) {
          // 若存在，则更新当前题目信息
          if (this.paper.content[index].qs_number === data.qs_number) {
            this.paper.content[index].qs_order = data.qs_order
            this.paper.content[index].qs_title = data.qs_title
            this.paper.content[index].qs_type = data.qs_type
            this.paper.content[index].qs_option = data.qs_option
            //console.log("当前表单数据：" + JSON.stringify(this.paper.content))
            return false
          }
        }
        // 若不存在，则添加当前题目
        this.paper.content.push(data)
        //console.log("当前表单数据：" + JSON.stringify(this.paper.content))
      },

      // 添加结束语
      editFooter() {
        this.$prompt('请输入结束语', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType: 'textarea',
          inputValue: this.paper.footer,
          inputPattern: /\S+/,
          inputErrorMessage: '结束语不能为空'
        }).then(({value}) => {
          this.paper.footer = value
        }).catch(() => {

        });
      },

      // 删除题目
      delForm(key) {

        console.log('删除前')
        console.log(this.qsList)
        console.log(this.paper.content)

        // 从当前组件数组中删除题目
        for (let i in this.qsList)
          if (this.qsList[i].key === key) {
            this.qsList.splice(i, 1)
            this.paper.qs_count--
          }

        // 从当前问卷数据中删除题目
        for (let i in this.paper.content)
          if (this.paper.content[i].qs_number === key)
            this.paper.content.splice(i, 1)

        // 更新题目顺序
        let order = 0
        for (let i in this.qsList)
          for (let j in this.paper.content) {
            if (this.qsList[i].key === this.paper.content[j].qs_number)
              this.paper.content[j].qs_order = ++order
          }

        console.log('删除后')
        console.log(this.qsList)
        console.log(this.paper.content)

      },

      // 交换对象数组元素
      swapArray(o, n) {
        let key = this.qsList[o].key
        let name = this.qsList[o].name
        this.qsList[o].key = this.qsList[n].key
        this.qsList[o].name = this.qsList[n].name
        this.qsList[n].key = key
        this.qsList[n].name = name
      },

      // 上移
      moveUp(data) {
        let order = data[0]
        let number = data[1]

        // 数组下标是 题目顺序-1
        // 交换组件数组的元素位置
        this.swapArray(order - 1, order - 2)

        // 修改问卷题目顺序字段
        for (let i in this.paper.content)
          if (this.paper.content[i].qs_order === order - 1) this.paper.content[i].qs_order = order
        for (let i in this.paper.content)
          if (this.paper.content[i].qs_number === number) this.paper.content[i].qs_order = order - 1

      },

      // 下移
      moveDown(data) {
        let order = data[0]
        let number = data[1]

        // 交换组件数组的元素位置
        this.swapArray(order - 1, order)

        // 修改问卷题目顺序字段
        for (let i in this.paper.content)
          if (this.paper.content[i].qs_order === order + 1) this.paper.content[i].qs_order = order
        for (let i in this.paper.content)
          if (this.paper.content[i].qs_number === number) this.paper.content[i].qs_order = order + 1

      },

      // 构造题目组件列表
      createQsList(data) {
        for (let i in data.content) {
          if (data.content[i].qs_type === this.QS_TYPE.SELECT_RADIO.value) this.addSelectByRadio()
          else if (data.content[i].qs_type === this.QS_TYPE.SELECT_MULTI.value) this.addSelectByMulti()
          else if (data.content[i].qs_type === this.QS_TYPE.SELECT_DROP.value) this.addSelectByDrop()
          else if (data.content[i].qs_type === this.QS_TYPE.FILL_SINGLE.value) this.addFillBySingle()
          else if (data.content[i].qs_type === this.QS_TYPE.FILL_MULTI.value) this.addFillByMulti()
          else if (data.content[i].qs_type === this.QS_TYPE.FILL_REGION.value) this.addFillByRegion()
          else if (data.content[i].qs_type === this.QS_TYPE.FILL_DATE.value) this.addFillByDate()
          else if (data.content[i].qs_type === this.QS_TYPE.SHORTCUT_NAME.value) this.addName()
          else if (data.content[i].qs_type === this.QS_TYPE.SHORTCUT_NUMBER.value) this.addNumber()
          else if (data.content[i].qs_type === this.QS_TYPE.SHORTCUT_PHONE.value) this.addPhone()
          else if (data.content[i].qs_type === this.QS_TYPE.SHORTCUT_EMAIL.value) this.addEmail()
          else if (data.content[i].qs_type === this.QS_TYPE.SHORTCUT_ORIGIN.value) this.addOrigin()
          else if (data.content[i].qs_type === this.QS_TYPE.SHORTCUT_BIRTHDAY.value) this.addBirthday()
          else if (data.content[i].qs_type === this.QS_TYPE.SHORTCUT_GENDER.value) this.addGender()
        }
      },

      // 添加各种组件到问卷
      // 单选框
      addSelectByRadio() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'SelectRadio'})
      },
      // 多选框
      addSelectByMulti() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'SelectMulti'})
      },
      // 下拉框
      addSelectByDrop() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'SelectDrop'})
      },
      // 单行文本
      addFillBySingle() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'FillSingle'})
      },
      // 多行文本
      addFillByMulti() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'FillMulti'})
      },
      // 地区
      addFillByRegion() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'FillRegion'})
      },
      // 日期
      addFillByDate() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'FillDate'})
      },
      // 姓名框
      addName() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'NameStr'})
      },
      // 学号/工号框
      addNumber() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'Number'})
      },
      // 性别框
      addGender() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'Gender'})
      },
      // 出生日期框
      addBirthday() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'Birthday'})
      },
      // 籍贯框
      addOrigin() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'Origin'})
      },
      // 手机号框
      addPhone() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'Phone'})
      },
      // 电子邮件框
      addEmail() {
        this.paper.qs_count++
        this.qs_key++
        this.qsList.push({key: this.qs_key, name: 'Email'})
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

  .el-divider--horizontal {
    margin: 10px 0;
  }

  .el-page-header {
    height: 60px;
    line-height: 60px;

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

  /*题目列表样式*/
  .edit-left {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    background: #f7f7f7;
    .e-l-title {
      text-align: center;
      padding: 10px 0;

      span {
        font-weight: bolder;
      }
    }

    .e-l-qs {
      margin: 0 10px;

      li {
        border-radius: 3px;
        padding: 2px 0;

        a, a:active, a:visited {
          display: block;
          color: #333333;
          border-radius: 10px;
          padding: 2px;
        }

        a:hover {
          i {
            font-weight: bold;
          }

          font-weight: bold;
          background-color: cornflowerblue;
          color: #d3dce6;
          cursor: pointer;
        }
      }
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

    .edit-main-title:hover {
      background: #f7f7f7;
      cursor: pointer;
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
      margin-bottom: 20px;
    }

    .edit-main-footer:hover {
      background: #f7f7f7;
      cursor: pointer;
    }

    .edit-main-time {
      display: flex;
      justify-content: center;
      height: 40px;
      line-height: 40px;
      margin-top: 10px;
      margin-bottom: 50px;
    }
  }

  /*问卷大纲区域样式*/
  .edit-right {
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    height: 570px;
    overflow: auto;
    overflow-x: hidden;
    background: #f7f7f7;

    .e-l-title {
      text-align: center;
      padding: 10px 0;

      span {
        font-weight: bolder;
      }
    }

    .e-l-content {
      margin: 0 5px;

      .e-l-item {
        padding: 5px 0;
      }
    }
  }
</style>
