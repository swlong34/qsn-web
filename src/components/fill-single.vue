<template>
  <div class="qs-layout">
    <el-form v-if="show" :model="fillSingleForm" ref="fillSingleForm" label-width="100px" class="demo-dynamic">
      <el-form-item prop="title" label="标题[单行]" :rules="{
        required: true, message: '标题不能为空', trigger: 'blur'
      }">
        <el-input style="width: 68%" v-model="fillSingleForm.title"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button size="small" type="primary" @click="finishForm('fillSingleForm')">完成</el-button>
        <el-button size="small" type="danger" @click="deleteForm('fillSingleForm')">删除</el-button>
      </el-form-item>
    </el-form>

    <div v-if="!show" class="sr-show" @mouseenter="changePop" @mouseleave="popup = false">

      <div class="sr-left">
        <div class="sr-title"><span>{{qsIndex}}.&nbsp;{{fillSingleForm.title}}</span></div>
        <el-input
          type="textarea"
          :rows="1"
          v-model="ans">
        </el-input>
      </div>

      <div class="sr-btn" v-show="popup">
        <div>
          <el-button type="primary" size="mini" @click="changeEdit">编辑</el-button>
          <el-button size="mini" :disabled="qsIndex <= 1"  @click="moveUp">上移</el-button>
          <el-button size="mini" :disabled="qsIndex >= qsCount" @click="moveDown">下移</el-button>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
  export default {
    name: "fill-single",
    props: ['qsIndex','qsKey','qsCount','qsEdit','paperId', 'popStop','qsPre','qsData','qsModel', 'modelId'],
    data() {
      return {
        popup: false,
        show: true,
        ans: '',
        fillSingleForm: {
          qs_id: '',
          options: [],
          title: ''
        }
      }
    },
    created() {
      // 若为编辑状态，则需要获取题目初始信息

      // 若从模板页面跳转过来
      if(this.qsModel === 'true') {
        console.log("从模板编辑问卷，题目数据渲染")
        this.show = false
        this.$axios({
          method: 'get',
          url: '/model/qs/info/' + this.modelId + '/' + this.qsIndex,
        }).then(({data}) => {
          const {qs_id,qs_title,qs_option} = data
          this.fillSingleForm.qs_id = qs_id
          this.fillSingleForm.title = qs_title
          this.fillSingleForm.options = qs_option
        })
      }

      if (this.qsEdit === 'true') {
        console.log("编辑单行文本，题目数据渲染")
        this.show = false
        this.$axios({
          method: 'get',
          url: '/qs/info/' + this.paperId + '/' + this.qsIndex,
        }).then(({data}) => {
          const {qs_id,qs_title,qs_option} = data
          this.fillSingleForm.qs_id = qs_id
          this.fillSingleForm.title = qs_title
          this.fillSingleForm.options = qs_option
        })
      }

      // 若为预览状态
      if(this.qsPre === 'true') {
        this.show = false
        this.fillSingleForm.qs_id = this.qsData.qs_id
        this.fillSingleForm.title = this.qsData.qs_title
        this.fillSingleForm.options = this.qsData.qs_option
      }
    },
    methods: {
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
            let fs = {
              qs_id: this.qs_id,
              qs_order: this.qsIndex,   // 题目顺序
              qs_number: this.qsKey,    // 题目编号
              qs_title: this.fillSingleForm.title,
              qs_type: this.QS_TYPE.FILL_SINGLE.value,
              qs_option: this.fillSingleForm.options
            }
            this.$emit('add2Paper', fs)
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
