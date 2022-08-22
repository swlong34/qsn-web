<template>
  <div class="qs-layout">
    <el-form v-if="show" :model="selectRadioForm" ref="selectRadioForm" label-width="100px" class="demo-dynamic">
      <el-form-item prop="title" label="标题[单选]" :rules="{
        required: true, message: '标题不能为空', trigger: 'blur'
      }">
        <el-input style="width: 68%" v-model="selectRadioForm.title"></el-input>
      </el-form-item>
      <el-form-item
        v-for="(option, index) in selectRadioForm.options"
        :label="'选项' + (index + 1)"
        :key="option.key"
        :prop="'options[' + index + ']'"
        :rules="{
          required: true, message: '选项不能为空', trigger: 'blur'
        }"
      >
        <el-input style="width: 50%" size="small" v-model="selectRadioForm.options[index]"></el-input>
        &nbsp;&nbsp;
        <el-button size="small" @click="removeOption(option)"><i style="font-weight: bolder;" class="el-icon-minus"></i>
        </el-button>
        <el-button size="small" @click="addOption"><i style="font-weight: bolder;" class="el-icon-plus"></i></el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="small" type="primary" @click="finishForm('selectRadioForm')">完成</el-button>
        <el-button size="small" type="danger" @click="deleteForm('selectRadioForm')">删除</el-button>
      </el-form-item>
    </el-form>
    <div v-if="!show" class="sr-show" @mouseenter="changePop" @mouseleave="popup = false">

      <div class="sr-left">
        <div class="sr-title"><span>{{qsIndex}}.&nbsp;{{selectRadioForm.title}}</span></div>
        <el-radio-group class="sr-group" v-model="ans">
          <div class="sr-option" v-for="(option,index) in selectRadioForm.options">
            <el-radio :key="index" :label="option">
              {{option}}
            </el-radio>
          </div>
        </el-radio-group>
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
    name: "select-radio",
    props: ['qsIndex', 'qsKey', 'qsCount', 'qsEdit', 'paperId', 'popStop','qsData','qsPre','qsModel', 'modelId'],
    data() {
      return {
        popup: false,
        show: true,
        ans: '',
        selectRadioForm: {
          qs_id: '',
          options: ['',''],
          title: ''
        }
      };
    },
    created() {
      console.log('--------子组件select-radio created')
      // 若从模板页面跳转过来
      if(this.qsModel === 'true') {
        console.log("从模板编辑问卷，题目数据渲染")
        this.show = false
        this.$axios({
          method: 'get',
          url: '/model/qs/info/' + this.modelId + '/' + this.qsIndex,
        }).then(({data}) => {
          const {qs_id,qs_title,qs_option} = data
          this.selectRadioForm.qs_id = qs_id
          this.selectRadioForm.title = qs_title
          this.selectRadioForm.options = qs_option
        })
      }

      // 若为编辑状态，则需要获取题目初始信息
      if (this.qsEdit === 'true') {
        console.log("编辑问卷，题目数据渲染")
        this.show = false
        this.$axios({
          method: 'get',
          url: '/qs/info/' + this.paperId + '/' + this.qsIndex,
        }).then(({data}) => {
          const {qs_id,qs_title,qs_option} = data
          this.selectRadioForm.qs_id = qs_id
          this.selectRadioForm.title = qs_title
          this.selectRadioForm.options = qs_option
        })
      }

      // 若为预览状态
      if(this.qsPre === 'true') {
        this.show = false
        this.selectRadioForm.qs_id = this.qsData.qs_id
        this.selectRadioForm.title = this.qsData.qs_title
        this.selectRadioForm.options = this.qsData.qs_option
      }
    },
    methods: {
      /*切换弹出状态*/
      changePop() {
        if(this.popStop) this.popup = false
        else this.popup = true
      },
      /*切换编辑状态*/
      changeEdit() {
        this.show = true
      },
      /*上移*/
      moveUp() {
        this.$emit('qsMoveUP')
      },
      /*下移*/
      moveDown() {
        this.$emit('qsMoveDown')
      },

      /*完成编辑*/
      finishForm(formName) {

        // 检查字段是否合法
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.popup = false
            this.show = false

            // 将题目封装并传递给父组件
            let sr = {
              qs_id: this.qs_id,
              qs_order: this.qsIndex,   // 题目顺序
              qs_number: this.qsKey,    // 题目编号
              qs_title: this.selectRadioForm.title,
              qs_type: this.QS_TYPE.SELECT_RADIO.value,
              qs_option: this.selectRadioForm.options
            }
            this.$emit('add2Paper', sr)
          } else {
            return false
          }
        })
      },

      /*删除当前题目*/
      deleteForm() {
        this.$emit('delForm')
      },

      /*移除选项*/
      removeOption(item) {
        let index = this.selectRadioForm.options.indexOf(item)
        let total = this.selectRadioForm.options.length
        if (total > 2) {
          this.selectRadioForm.options.splice(index, 1)
        } else {
          this.$message({
            message: '单选题至少有两个选项',
            type: 'warning'
          });
        }
      },
      /*添加选项*/
      addOption() {
        this.selectRadioForm.options.push('');
      }
    }
  }
</script>

<style lang="scss" scoped>
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
