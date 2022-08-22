<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style lang="scss">
  .el-message{
    margin-top: 60px !important;
  }
  html, body, #app {
    margin: 0;
    padding: 0;
    //height: 100%;
  }
</style>
