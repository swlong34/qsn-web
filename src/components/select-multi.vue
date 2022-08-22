<template>
  <div class="qs-layout">
    <el-form v-if="show" :model="selectMultiForm" ref="selectMultiForm" label-width="100px" class="demo-dynamic">
      <el-form-item prop="title" label="标题[多选]" :rules="{
        required: true, message: '标题不能为空', trigger: 'blur'
      }">
        <el-input style="width: 68%" v-model="selectMultiForm.title"></el-input>
      </el-form-item>
      <el-form-item
        v-for="(option, index) in selectMultiForm.options"
        :label="'选项' + (index + 1)"
        :key="option.key"
        :prop="'options[' + index + ']'"
        :rules="{
          required: true, message: '选项不能为空', trigger: 'blur'
        }"
      >
        <el-input style="width: 50%" size="small" v-model="selectMultiForm.options[index]"></el-input>
        &nbsp;&nbsp;
        <el-button size="small" @click="removeOption(option)"><i style="font-weight: bolder;" class="el-icon-minus"></i>
        </el-button>
        <el-button size="small" @click="addOption"><i style="font-weight: bolder;" class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="finishForm('selectMultiForm')">完成</el-button>
        <el-button size="small" type="danger" @click="deleteForm('selectMultiForm')">删除</el-button>
      </el-form-item>
    </el-form>
    <div v-if="!show" class="sr-show" @mouseenter="changePop" @mouseleave="popup = false">

      <div class="sr-left">
        <div class="sr-title"><span>{{qsIndex}}.&nbsp;{{selectMultiForm.title}}</span></div>
        <el-checkbox-group class="sr-group" v-model="ans">
          <div class="sr-option"  v-for="(option,index) in selectMultiForm.options" >
            <el-checkbox :key="index" :label="option">{{option}}</el-checkbox>
          </div>
        </el-checkbox-group>
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
    name: "select-multi",
    props: ['qsIndex','qsKey','qsCount','qsEdit','paperId', 'popStop','qsPre','qsData','qsModel', 'modelId'],
    data() {
      return {
        popup: false,
        show: true,
        ans: [],
        selectMultiForm: {
          qs_id: '',
          options: ['',''],
          title: ''
        }
      }
    },
    created() {

      // 若从模板页面跳转过来
      if(this.qsModel === 'true') {
        console.log("从模板编辑问卷，题目数据渲染")
        this.show = false
        this.$axios({
          method: 'get',
          url: '/model/qs/info/' + this.modelId + '/' + this.qsIndex,
        }).then(({data}) => {
          const {qs_id,qs_title,qs_option} = data
          this.selectMultiForm.qs_id = qs_id
          this.selectMultiForm.title = qs_title
          this.selectMultiForm.options = qs_option
        })
      }

      // 若为编辑状态，则需要获取题目初始信息
      if (this.qsEdit === 'true') {
        console.log("编辑多选框，题目数据渲染")
        this.show = false
        this.$axios({
          method: 'get',
          url: '/qs/info/' + this.paperId + '/' + this.qsIndex,
        }).then(({data}) => {
          const {qs_id,qs_title,qs_option} = data
          this.selectMultiForm.qs_id = qs_id
          this.selectMultiForm.title = qs_title
          this.selectMultiForm.options = qs_option
        })
      }

      // 若为预览状态
      if(this.qsPre === 'true') {
        this.show = false
        this.selectMultiForm.qs_id = this.qsData.qs_id
        this.selectMultiForm.title = this.qsData.qs_title
        this.selectMultiForm.options = this.qsData.qs_option
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
            let sm = {
              qs_id: this.qs_id,
              qs_order: this.qsIndex,   // 题目顺序
              qs_number: this.qsKey,    // 题目编号
              qs_title: this.selectMultiForm.title,
              qs_type: this.QS_TYPE.SELECT_MULTI.value,
              qs_option: this.selectMultiForm.options
            }
            this.$emit('add2Paper', sm)
          } else {
            return false
          }
        })
      },
      deleteForm(formName) {
        this.$emit('delForm')
      },
      removeOption(item) {
        let index = this.selectMultiForm.options.indexOf(item)
        let total = this.selectMultiForm.options.length
        if (total > 2) {
          this.selectMultiForm.options.splice(index, 1)
        } else {
          this.$message({
            message: '多选题至少有两个选项',
            type: 'warning'
          });
        }
      },
      addOption() {
        this.selectMultiForm.options.push('');
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
  }

  .sr-option {
    padding-bottom: 10px;
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
