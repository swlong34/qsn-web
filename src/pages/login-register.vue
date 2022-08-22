<template>
  <div class="lr">
    <vue-particles
      class="login-background"
      color="#97D0F2"
      :particleOpacity="0.7"
      :particlesNumber="50"
      shapeType="circle"
      :particleSize="4"
      linesColor="#97D0F2"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push">
    </vue-particles>
    <el-tabs class="lr-tab" type="border-card">
      <el-tab-pane label="登录">
        <el-form :model="loginForm" :rules="rules" ref="loginForm">
          <h2 align="center" style="padding-bottom: 15px;">高校问卷系统登录</h2>
          <el-form-item prop="account">
            <el-input type="text" v-model="loginForm.account" placeholder="用户名/学号/工号"
                      prefix-icon="el-icon-user-solid"/>
          </el-form-item>
          <el-form-item prop="password">
            <el-input type="password" v-model="loginForm.password" placeholder="密码" prefix-icon="el-icon-key"
                      show-password/>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="success" @click="login('loginForm')">登&nbsp;&nbsp;&nbsp;&nbsp;录</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="注册">
        <el-form :model="registerForm" :rules="rules" ref="registerForm">
          <h2 align="center" style="padding-bottom: 15px;">高校问卷系统注册</h2>
          <el-form-item prop="user">
            <el-input type="text" v-model="registerForm.user" placeholder="用户名" prefix-icon="el-icon-user-solid"/>
          </el-form-item>
          <el-form-item prop="pwd">
            <el-input type="password" v-model="registerForm.pwd" placeholder="密码" prefix-icon="el-icon-key"
                      show-password/>
          </el-form-item>
          <el-form-item prop="pwd2">
            <el-input type="password" v-model="registerForm.pwd2" placeholder="确认密码" prefix-icon="el-icon-key"
                      show-password/>
          </el-form-item>
          <el-form-item style="float: right">
            <el-button type="primary" @click="register('registerForm')">注&nbsp;&nbsp;&nbsp;&nbsp;册</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  export default {
    name: "login-register",
    data() {
      // 自定义校验规则
      let validatePwd = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'))
        } else {
          if (this.registerForm.pwd2 !== '') {
            this.$refs.registerForm.validateField('pwd2');
          }
          callback()
        }
      }
      let validatePwd2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'))
        } else if (value !== this.registerForm.pwd) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      }
      return {
        userToken: '',
        loginForm: {
          account: '',
          password: '',
        },
        registerForm: {
          user: '',
          pwd: '',
          pwd2: ''
        },
        rules: {
          account: [
            {required: true, message: '请输入用户名/学号/工号', trigger: 'blur'},
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
          ],
          user: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
          ],
          pwd: [
            {validator: validatePwd, trigger: 'blur'},
          ],
          pwd2: [
            {validator: validatePwd2, trigger: 'blur'},
          ],
        }
      }
    },
    methods: {
      login(FormName) {
        const _this = this
        this.$refs[FormName].validate((valid) => {
          if (valid) {
            this.$axios({
              method: 'post',
              url: '/user/login',
              data: _this.$qs.stringify(_this.loginForm),
            }).then(({token,user,id}) => {
              // 将token设置到本地存储
              if (token) {
                localStorage.setItem("token", token)
                localStorage.setItem('user', user)
                localStorage.setItem('id', id)
                this.$router.push({name: 'home'})
              }

              //TODO 跳转到首页，更新首页头部状态



            })
          } else {
            return false
          }
        })
      },
      register(FormName) {
        const _this = this
        this.$refs[FormName].validate((valid) => {
          if (valid) {
            console.log("用户名：" + this.registerForm.user + " 密码：" + this.registerForm.pwd + " 确认密码：" + this.registerForm.pwd2)
            this.$axios({
              method: 'post',
              url: '/user/register',
              data: _this.$qs.stringify((_this.registerForm))
            }).then(({data}) => {

              // TODO 跳转到登录标签，并清空注册表单

            })
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .login-background {
    background: linear-gradient(-180deg, #dcf2e6 0%, #ffffff 100%);
    width: 100%;
    height: 100%; /**宽高100%是为了图片铺满屏幕 */
    z-index: -1;
    position: absolute;
  }

  .lr-tab {
    z-index: 1;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30%;
  }
</style>
