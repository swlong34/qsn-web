<template>
    <div class="index">
      <el-container>
        <el-header>
          <QsnHeader/>
        </el-header>
        <el-main>
          <keep-alive>
            <router-view/>
          </keep-alive>
        </el-main>
        <el-footer>
          <QsnFooter/>
        </el-footer>
      </el-container>
    </div>
</template>

<script>
    import QsnHeader from "./layout/qsn-header";
    import QsnFooter from "./layout/qsn-footer";
    export default {
        name: "index",
      components: {QsnFooter, QsnHeader}
    }
</script>

<style lang="scss">

  .index {
    /* 因为是遮罩效果所以要fixed */
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    background: rgba(7, 17, 27, .8);
    /*必须 */
    display: flex;
    /* 必须，规定元素的排列方向 */
    flex-direction: column;
    /* 必须占满屏 */
    height: 100%;
    /* 没有这个就不能滚动了 */
    overflow: auto;
  }

  .el-header {
    z-index: 2;
    position: fixed;
    top: 0;
    width: 100%;
    background-color: #1e649f;
    color: #333;
    height: 60px;
    line-height: 60px;
  }

  .el-footer {
    background-color: #545c64;
    color: #333;
    height: 60px;
    line-height: 60px;
    flex: 0;
    //margin-top: -100px;
  }

  .el-main {
    z-index: 1;
    background-color: #E9EEF3;
    color: #333;
    text-align: center;
    margin-top: 60px;
    flex: 1;
    //padding-bottom: 100px;
    //height: calc(100vh - 120px);
  }

</style>
