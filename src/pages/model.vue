<template>
  <div class="model">

    <el-row>
      <el-col :span="20" :offset="2">

        <!--全局搜索表单-->
        <el-row style="display: flex; justify-content: left">
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <el-form-item label="标题">
              <el-input v-model="formInline.title" placeholder="请输入问卷标题"></el-input>
            </el-form-item>
            <el-form-item label="标签">
              <el-select
                multiple
                filterable
                allow-create
                default-first-option
                v-model="formInline.tags"
                placeholder="请选择问卷标签">
                <el-option
                  v-for="item in tagOpts"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="searchPaperModel(false)">搜索</el-button>
              <el-button type="info" @click="searchPaperModel(true)">重置</el-button>
            </el-form-item>
          </el-form>
        </el-row>

        <!--模板列表-->
        <el-row v-loading="loading" :gutter="20">
          <el-col v-for="(model,index) in models" :key="index" :span="8" class="model-card">
            <el-card shadow="hover" class="box-card" :body-style="{padding: '10px'}">
              <div class="box-card-top">
                <div><span><a @click="preModelPaper(model.id)">{{model.title}}</a></span></div>
                <el-button @click="createPaperFromModel(model.id)" style="float: right; padding: 3px 0" type="text">从此模板创建问卷</el-button>
              </div>
              <el-divider></el-divider>
              <div class="box-card-bottom">
                {{model.desc}}
              </div>
              <el-divider></el-divider>
              <div class="box-card-footer">
                <div>
                  <el-tag class="tag" v-for="(tag,index) in model.tags" :key="index" size="mini" type="success">{{tag}}</el-tag>
                </div>
                <div><span style="font-weight: lighter;font-size: small;">来自用户：</span><span style="font-size: small">{{model.fromUser}}</span></div>
              </div>
            </el-card>
          </el-col>
        </el-row>

      </el-col>
    </el-row>

  </div>
</template>

<script>
  export default {
    name: "model",
    data() {
      return {
        loading: true,
        tagOpts: [],
        formInline: {
          title: '',
          tags: [],
        },
        models: [/*{
          id: '',
          title: '',
          desc: '',
          tags: [],
          fromUser: ''
        }*/]
      };
    },
    created() {
      // 发送请求查询所有问卷模板
      this.$axios({
        method: 'get',
        url: '/model/list'
      }).then(({data}) => {
        this.models = data || []
        this.loading = false
      })

      // 发送查询标签请求
      this.$axios({
        method: 'get',
        url: '/model/tag/list'
      }).then(({data}) => {
        this.tagOpts = data || []
      })

    },
    methods: {
      // 搜索问卷模板
      searchPaperModel(flag) {
        if(flag) {
          this.formInline.tags = []
          this.formInline.title = ''
          // 查询所有
          this.$axios({
            method: 'get',
            url: '/model/list'
          }).then(({data}) => {
            this.models = data || []
          })
        } else {
          // 按条件查询
          this.$axios({
            method: 'post',
            url: '/model/listby',
            data: this.formInline
          }).then(({data}) => {
            this.models = data || []
          })
        }
      },

      // 从模板创建问卷
      createPaperFromModel(modelId) {
        this.$router.push({
          name: 'paper-edit',
          params: {
            modelId: modelId,
            model: 'true'
          }
        })
      },

      // 预览问卷模板
      preModelPaper(modelId) {
        // 发送请求，获取所有问卷数据
        this.$axios({
          method: 'get',
          url: '/model/info/' + modelId,
        }).then(({data}) => {
          // 构造出题目组件列表
          const {content} = data
          let qsList = []
          for (let i in content) {
            if (content[i].qs_type === this.QS_TYPE.SELECT_RADIO.value) qsList.push({
              key: content[i].qs_order,
              name: 'SelectRadio'
            })
            if (content[i].qs_type === this.QS_TYPE.SELECT_MULTI.value) qsList.push({
              key: content[i].qs_order,
              name: 'SelectMulti'
            })
            if (content[i].qs_type === this.QS_TYPE.SELECT_DROP.value) qsList.push({
              key: content[i].qs_order,
              name: 'SelectDrop'
            })
            if (content[i].qs_type === this.QS_TYPE.FILL_SINGLE.value) qsList.push({
              key: content[i].qs_order,
              name: 'FillSingle'
            })
            if (content[i].qs_type === this.QS_TYPE.FILL_MULTI.value) qsList.push({
              key: content[i].qs_order,
              name: 'FillMulti'
            })
            if (content[i].qs_type === this.QS_TYPE.FILL_DATE.value) qsList.push({
              key: content[i].qs_order,
              name: 'FillDate'
            })
            if (content[i].qs_type === this.QS_TYPE.FILL_REGION.value) qsList.push({
              key: content[i].qs_order,
              name: 'FillRegion'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_NAME.value) qsList.push({
              key: content[i].qs_order,
              name: 'NameStr'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_NUMBER.value) qsList.push({
              key: content[i].qs_order,
              name: 'Number'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_GENDER.value) qsList.push({
              key: content[i].qs_order,
              name: 'Gender'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_BIRTHDAY.value) qsList.push({
              key: content[i].qs_order,
              name: 'Birthday'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_ORIGIN.value) qsList.push({
              key: content[i].qs_order,
              name: 'Origin'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_PHONE.value) qsList.push({
              key: content[i].qs_order,
              name: 'Phone'
            })
            if (content[i].qs_type === this.QS_TYPE.SHORTCUT_EMAIL.value) qsList.push({
              key: content[i].qs_order,
              name: 'Email'
            })
          }
          this.$router.push({
            name: 'paper-view',
            params: {paperInfo: data, preQsList: qsList, pre: 'true'}
          })
        })
      }


    }
  }
</script>

<style lang="scss" scoped>

  .el-divider--horizontal {
    margin: 12px 0;
  }

  .model {
    .model-card {
      margin-bottom: 20px;

      .box-card {

        .box-card-top {
          display: flex;
          justify-content: space-between;

          span {
            cursor: pointer;

            a, a:active, a:visited {
              text-decoration: none;
              color: #333333;
            }

            a:hover {
              color: #1e649f;
            }
          }
        }

        .box-card-bottom {
          text-align: left;
          font-weight: lighter;
          font-size: 15px;
          height: 80px;
        }

        .box-card-footer {
          display: flex;
          justify-content: space-between;
          .tag {
            margin-right: 5px;
          }
        }
      }
    }
  }
</style>
