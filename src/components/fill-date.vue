<template>
  <div class="qs-layout">
    <el-form v-if="show" :model="fillDateForm" ref="fillDateForm" label-width="100px" class="demo-dynamic">
      <el-form-item prop="title" label="标题[日期]" :rules="{
        required: true, message: '标题不能为空', trigger: 'blur'
      }">
        <el-input style="width: 68%" v-model="fillDateForm.title"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" @click="finishForm('fillDateForm')">完成</el-button>
        <el-button size="small" type="danger" @click="deleteForm('fillDateForm')">删除</el-button>
      </el-form-item>
    </el-form>

    <div v-if="!show" class="sr-show" @mouseenter="changePop" @mouseleave="popup = false">

      <div class="sr-left">
        <div class="sr-title"><span>{{qsIndex}}.&nbsp;{{fillDateForm.title}}</span></div>
        <el-date-picker
          v-model="ans"
          align="right"
          type="date"
          placeholder="选择日期"
          @change="handleChange">
        </el-date-picker>
      </div>

      <div class="sr-btn" v-show="popup">
        <div>
          <el-button type="primary" size="mini" @click="changeEdit">编辑</el-button>
          <el-button size="mini" :disabled="qsIndex <= 1" @click="moveUp">上移</el-button>
          <el-button size="mini" :disabled="qsIndex >= qsCount" @click="moveDown">下移</el-button>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: "fill-date",
    props: ['qsIndex', 'qsKey', 'qsCount','qsEdit','paperId', 'popStop','qsPre','qsData','qsModel', 'modelId'],
    data() {
      return {
        popup: false,
        show: true,
        ans: '',
        fillDateForm: {
          qs_id: '',
          options: [],
          title: ''
        }
      }
    },
    created() {

      if(this.qsModel === 'true') {
        console.log("从模板编辑问卷，题目数据渲染")
        this.show = false
        this.$axios({
          method: 'get',
          url: '/model/qs/info/' + this.modelId + '/' + this.qsIndex,
        }).then(({data}) => {
          const {qs_id,qs_title,qs_option} = data
          this.fillDateForm.qs_id = qs_id
          this.fillDateForm.title = qs_title
          this.fillDateForm.options = qs_option
        })
      }

      // 若为编辑状态，则需要获取题目初始信息
      if (this.qsEdit === 'true') {
        console.log("编辑日期框，题目数据渲染")
        this.show = false
        this.$axios({
          method: 'get',
          url: '/qs/info/' + this.paperId + '/' + this.qsIndex,
        }).then(({data}) => {
          const {qs_id,qs_title,qs_option} = data
          this.fillDateForm.qs_id = qs_id
          this.fillDateForm.title = qs_title
          this.fillDateForm.options = qs_option
        })
      }

      // 若为预览状态
      if(this.qsPre === 'true') {
        this.show = false
        this.fillDateForm.qs_id = this.qsData.qs_id
        this.fillDateForm.title = this.qsData.qs_title
        this.fillDateForm.options = this.qsData.qs_option
      }
    },
    methods: {
      handleChange() {
        this.ans = moment(this.ans).format('YYYY-MM-DD')
      },
      changePop() {
        if(this.popStop) this.popup = false
        else this.popup = true
      },
      changeEdit() {
        this.show = true
      },
      moveUp() {
        this.$emit('qsMoveUP')
      },
      moveDown() {
        this.$emit('qsMoveDown')
      },
      finishForm(formName) {
        // 检查字段是否合法
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.popup = false
            this.show = false

            // 将题目封装并传递给父组件
            let fd = {
              qs_id: this.qs_id,
              qs_order: this.qsIndex,   // 题目顺序
              qs_number: this.qsKey,    // 题目编号
              qs_title: this.fillDateForm.title,
              qs_type: this.QS_TYPE.FILL_DATE.value,
              qs_option: this.fillDateForm.options
            }
            this.$emit('add2Paper', fd)
          } else {
            return false
          }
        })

      },
      deleteForm(formName) {
        this.$emit('delForm')
      }
    }
  }
</script>

<style scoped>
  .qs-layout {
    padding: 0 30px;
  }

  .sr-show {
    display: flex;
    justify-content: space-between;
  }

  .sr-title {
    font-weight: bold;
    padding: 10px 0;
  }

  .sr-group {
    padding-left: 10px;
    margin-bottom: 5px;
  }

  .sr-option {
    padding-bottom: 5px;
  }
  .sr-left {
    width: 70%;
  }

  .sr-btn {
    width: 30%;
    flex-direction: column;
    display: flex;
    justify-content: center;
  }
</style>
