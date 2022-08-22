<template>
  <div class="qs-layout">
    <div class="sr-show" @mouseenter="changePop" @mouseleave="popup = false">

      <div>
        <div class="sr-title"><span>{{qsIndex}}.&nbsp;{{EmailForm.title}}</span></div>
        <el-input
          prefix-icon="el-icon-message"
          v-model="ans">
        </el-input>
      </div>

      <div class="sr-btn" v-show="popup">
        <div>
          <el-button size="mini" type="danger" @click="deleteForm">删除</el-button>
          <el-button size="mini" :disabled="qsIndex <= 1" @click="moveUp">上移</el-button>
          <el-button size="mini" :disabled="qsIndex >= qsCount" @click="moveDown">下移</el-button>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
  </div>
</template>

<script>
  export default {
    name: "email",
    props: ['qsIndex', 'qsKey', 'qsCount','paperId','qsEdit', 'popStop','qsModel', 'modelId'],
    data() {
      return {
        popup: false,
        ans: '',
        EmailForm: {
          qs_id: '',
          title: '您的邮箱？',
          option: []
        }
      }
    },
    created() {

      if(this.qsModel === 'true') {
        this.$axios({
          method: 'get',
          url: '/model/qs/info/' + this.modelId + '/' + this.qsIndex,
        }).then(({data}) => {
          const {qs_id} = data
          this.EmailForm.qs_id = qs_id
        })
      }

      if (this.qsEdit === 'true') {
        this.$axios({
          method: 'get',
          url: '/qs/info/' + this.paperId + '/' + this.qsIndex,
        }).then(({data}) => {
          const {qs_id} = data
          this.EmailForm.qs_id = qs_id
        })
      }
    },
    mounted() {
      let email = {
        qs_id: this.qs_id,
        qs_order: this.qsIndex,   // 题目顺序
        qs_number: this.qsKey,    // 题目编号
        qs_title: this.EmailForm.title,
        qs_type: this.QS_TYPE.SHORTCUT_EMAIL.value,
        qs_option: this.EmailForm.option
      }
      this.$emit('add2Paper', email)
    },
    methods: {
      changePop() {
        if(this.popStop) this.popup = false
        else this.popup = true
      },
      deleteForm(formName) {
        this.$emit('delForm')
      },
      moveUp() {
        this.$emit('qsMoveUP')
      },
      moveDown() {
        this.$emit('qsMoveDown')
      },
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

  .sr-btn {
    flex-direction: column;
    display: flex;
    justify-content: center;
  }
</style>
