<template>
  <div class="h-layout">


    <el-image
      class="logo"
      style="height: 50px;width: 100px"
      fit="fill"
      :src="logo">
    </el-image>

    <el-menu
      default-active="1"
      class="el-menu-demo"
      mode="horizontal"
      router
      background-color="#1e649f"
      text-color="#fff"
      active-text-color="#ffd04b">
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/model">模板中心</el-menu-item>
      <el-menu-item index="/paper">我的问卷</el-menu-item>
    </el-menu>

    <div v-if="!getUserName" class="admin">
      <span @click="$router.push('/login-register')">登录 | 注册</span>
    </div>

    <el-dropdown v-else @command="handleCommand" class="admin">
      <span class="el-dropdown-link">
        {{getUserName}}<i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
<!--        <el-dropdown-item command="a">个人中心</el-dropdown-item>-->
        <el-dropdown-item command="b">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>

<script>
  export default {
    name: "qsn-header",
    data() {
      return {
        logo: require('../../assets/logo.png'),
      }
    },
    computed: {
      getUserName() {
        return localStorage.getItem("user")
      }
    },
    methods: {
      handleCommand(com) {
        if(com==='a') this.$router.push('/myself')
        if(com==='b') {
          // 退出登录
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          location.reload()
        }
      }
    }
  }
</script>

<style lang="scss">
  .h-layout {
    display: flex;
    justify-content: space-between;
  }
  .el-header {
    padding: 0;
  }
  .logo {
    margin-top: 5px;
    margin-left: 30px;
  }
  .el-menu {
    width: 30%;
  }
  .admin {
    margin-right: 30px;
    cursor: pointer;
    span {
      font-weight: bolder;
      color: white;
    }
  }
</style>
