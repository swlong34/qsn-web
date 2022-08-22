<template>
  <div>
    <div class="home-title">
      <div class="ht-1"><span>专为高校设计的问卷调查系统</span></div>
      <div class="ht-2"><span>为高校工作提供多方位的服务，内置多种问卷模板，简洁美观的问卷编辑页面，完整清晰问卷回收统计功能，你值得拥有</span></div>
      <el-button type="primary" style="width: 15%;height: 50px;background: #067bef;"
                 @click="$router.push({name: 'paper'})"><span style="font-size: larger">开始体验&nbsp;&nbsp;<i
        style="font-weight: bolder" class="el-icon-right"></i></span>
      </el-button>
    </div>
    <div class="home-main">
      <el-image fit="contain" :src="img1"></el-image>
      <div class="hm-txt">
        <div class="hm-txt-1"><span>海量模板 开箱即用</span></div>
        <div class="hm-txt-2"><span>所有用户均可将自己的问卷创建为模板，供他人使用<br>所有模板免费公开，面向所有用户</span></div>
        <div>
          <el-button type="info"
                     style="justify-content:center; margin-top: 20px;width: 50%;height: 50px;background: white;color: cornflowerblue"
                     @click="$router.push({name: 'model'})"><span style="font-size: larger">浏览模板&nbsp;&nbsp;<i
            style="font-weight: bolder" class="el-icon-right"></i></span>
          </el-button>
        </div>
      </div>
    </div>
    <div class="home-main">
      <div class="hm-txt">
        <div class="hm-txt-1"><span>各种题型 任您选择</span></div>
        <div class="hm-txt-2"><span>提供选择和填空两类基本题型<br>以及多种个人信息快捷题型，无需编辑，即插即用</span></div>
      </div>
      <el-image fit="contain" :src="img3"></el-image>
    </div>
    <div class="home-main">
      <el-image :src="img2"></el-image>
      <div class="hm-txt">
        <div class="hm-txt-1"><span>操作直观 功能丰富</span></div>
        <div class="hm-txt-2"><span>可以随心管理自己的问卷<br>预览、编辑、发布、删除等功能应有尽有</span></div>
      </div>
    </div>
    <div class="home-main">
      <div class="hm-txt">
        <div class="hm-txt-1"><span>所有数据 尽收眼底</span></div>
        <div class="hm-txt-2"><span>对不同题型提供多样的统计方式<br>有适用于填空的表格和适用于选择的图表等</span></div>
      </div>
      <el-carousel height="" style="width: 50%" :interval="2000" arrow="always">
        <el-carousel-item v-for="(item,index) in imgList" :key="index">
          <el-image fit="contain" :src="item.img"></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="home-footer">
      <span class="hf-txt">平台用户数量已达到<span class="hf-num">{{userCount}}</span>人次<br>总计问卷调查数量<span class="hf-num">{{paperCount}}</span>份，真诚期待您的加入！</span>
    </div>
  </div>
</template>

<script>
  export default {
    name: "home",
    data() {
      return {
        img1: require('../assets/img1.png'),
        img2: require('../assets/img2.png'),
        img3: require('../assets/img3.png'),
        imgList: [
          {img: require('../assets/img4.png')},
          {img: require('../assets/img5.png')},
          {img: require('../assets/img6.png')},
          {img: require('../assets/img7.png')}
        ],
        userCount: '',
        paperCount: ''
      }
    },
    created() {
      // 统计注册用户数量
      this.$axios({
        method: 'get',
        url: '/user/count'
      }).then(({data}) => {
        this.userCount = data
      })

      // 统计问卷数量
      this.$axios({
        method: 'get',
        url: '/paper/count'
      }).then(({data}) => {
        this.paperCount = data
      })

    }
  }
</script>

<style lang="scss" scoped>
  .home-title {
    padding-top: 5%;

    .ht-1 {
      font-size: 50px;
      font-weight: 700;
      padding-bottom: 20px;
      color: #303133;
    }

    .ht-2 {
      font-size: 25px;
      font-weight: 500;
      color: #99a9bf;
      padding-bottom: 40px;
    }
  }

  .home-main {
    width: 100%;
    /* height: 420px;
     line-height: 420px;*/
    display: flex;
    justify-content: space-around;
    margin-top: 100px;

    .hm-txt {

      display: flex;
      flex-direction: column;
      justify-content: center;

      .hm-txt-1 {
        font-weight: 600;
        font-size: 40px;
        padding-bottom: 20px;
      }

      .hm-txt-2 {
        font-size: 20px;
        font-weight: 500;
        color: #99a9bf;
      }

    }
  }

  .home-footer {
    margin-top: 100px;
    margin-bottom: 70px;
    height: 200px;
    //background: #1e649f;
    .hf-txt {
      color: #1e649f;
      font-size: 50px;
      font-weight: 600;
    }
    .hf-num {
      padding: 0 10px;
      color: #dd6161;
      font-size: 60px;
      font-weight: 700;
    }
  }
</style>
