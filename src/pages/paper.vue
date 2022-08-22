<template>
  <div>
    <el-row :gutter="20">

      <!--左侧导航区域-->
      <el-col :span="6" class="left-all">
        <div class="left-all-div">
          <el-button @click="$router.push({name: 'paper-pre'})" type="primary" style="width: 250px;height: 50px">
          <span class="left-word">
            <i class="el-icon-plus"></i>&nbsp;&nbsp;创建问卷
          </span>
          </el-button>
          <div class="left-nav">
            <ul>
              <li><a @click="searchPaperByStatus(0)"><i class="myi el-icon-tickets"></i>&nbsp;全部问卷</a></li>
              <li><a @click="searchPaperByStatus(1)"><i class="myi el-icon-document-checked"></i>&nbsp;已发布</a></li>
              <li><a @click="searchPaperByStatus(2)"><i class="myi el-icon-edit-outline"></i>&nbsp;草稿箱</a></li>
              <li><a @click="searchPaperByStatus(3)"><i class="myi el-icon-delete"></i>&nbsp;回收站</a></li>
            </ul>
          </div>
        </div>
      </el-col>

      <!--右侧问卷列表区域-->
      <el-col :span="17" class="main-all">
        <div class="main-top">
          <h2>问卷列表</h2>
          <el-input
            style="width: 300px"
            placeholder="搜索问卷"
            v-model="search_text"
            @keyup.enter.native="searchPaperByTitle(0)">
            <i slot="prefix" @click="searchPaperByTitle(0)" class="el-input__icon el-icon-search"></i>
            <i v-if="search_text!==''" slot="suffix" @click="searchPaperByTitle(1)"
               class="el-input__icon el-icon-circle-close"></i>
          </el-input>
        </div>
        <div v-loading="loading" class="main-content">
          <div v-if="papers.length === 0" align="center">
            <el-empty description="您的问卷空空如也！"></el-empty>
          </div>
          <el-card v-for="(paper,index) in paperList" :key="index" shadow="hover" class="box-card"
                   :body-style="{padding: '12px'}">
            <div class="card-top">
              <el-tooltip content="预览问卷" placement="left" effect="light">
                <span style="font-weight: 500;font-size: 17px;cursor: pointer"><a
                  @click="prePaper(paper.id)">{{paper.paperTitle}}</a></span>
              </el-tooltip>
              <span style="font-size: small">
                <span>问卷ID:{{paper.id}}</span>
                <el-divider direction="vertical"></el-divider>
                <span>答卷: {{paper.ansPapers}}</span>
                <el-divider direction="vertical"></el-divider>
                <span>创建时间：{{paper.createTime}}</span>
                <el-divider direction="vertical"></el-divider>

                <el-tag v-if="QS_TYPE.IS_PUBLIC.value===paper.paperStatus" type="success" size="mini">已发布</el-tag>
                <el-tag v-if="QS_TYPE.UN_PUBLIC.value===paper.paperStatus" type="warning" size="mini">未发布</el-tag>
                <el-tag v-if="QS_TYPE.IS_STOP.value===paper.paperStatus" type="danger" size="mini">已结束</el-tag>
              </span>
            </div>
            <el-divider></el-divider>
            <div class="card-content">
              <div>
                <el-dropdown @command="sendPaper" trigger="click">
                <span class="el-dropdown-link">
                  发送问卷<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="beforeSendPaper(paper.paperStatus, paper.id, '1')">链接</el-dropdown-item>
                    <el-dropdown-item :command="beforeSendPaper(paper.paperStatus, paper.id, '2')">二维码
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-divider direction="vertical"></el-divider>
                <el-dropdown @command="DataHandle" trigger="click">
                <span class="el-dropdown-link">
                  统计答卷<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="beforeDataHandle(paper.paperStatus, paper.id, paper.ansPapers, '1')">
                      数据统计
                    </el-dropdown-item>
                    <el-dropdown-item :command="beforeDataHandle(paper.paperStatus, paper.id, paper.ansPapers, '2')">
                      导出到Excel
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-divider direction="vertical"></el-divider>
                <el-dropdown @command="PaperHandle" trigger="click">
                <span class="el-dropdown-link">
                  操作问卷<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :command="beforePaperHandle(paper.id, '2')">创建为模板
                    </el-dropdown-item>
                    <el-dropdown-item :command="beforePaperHandle(paper.id, '1')">导出到Word
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div>
                <el-button @click="stopPaper(paper.id)" v-if="QS_TYPE.IS_PUBLIC.value===paper.paperStatus"
                           type="warning" size="mini">停止
                </el-button>
                <el-button @click="beforePublicPaper(paper.id, paper.paperStatus)" v-else
                           type="primary" size="mini">发布
                </el-button>
                <!--<el-button @click="publicPaper(paper.id)" v-if="QS_TYPE.IS_STOP.value===paper.paperStatus"
                           type="primary" size="mini">重新发布
                </el-button>-->
                <el-button @click="editPaper(paper.id, paper.paperStatus)" type="success" size="mini">编辑</el-button>
                <!--<el-button type="info" size="mini">设置</el-button>-->
                <el-button @click="deletePaper(paper.id)" type="danger" size="mini">删除</el-button>
              </div>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>

    <!--显示问卷链接的对话框-->
    <el-dialog
      title="问卷链接"
      :visible.sync="LinkDialogVisible"
      width="30%"
      append-to-body
      center>
      <div style="display: flex;justify-content: center">
        <span>{{paperLink}}</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" size="mini" id="linkBtn" :data-clipboard-text="paperLink"
                   @click="copyAndClose">复制并关闭</el-button>
      </span>
    </el-dialog>

    <!--显示问卷二维码的对话框-->
    <el-dialog
      title="问卷二维码"
      :visible.sync="QRCodeDialogVisible"
      width="30%"
      append-to-body
      center>
      <div style="display: flex;justify-content: center">
        <span id="qrCode" ref="qrCodeUrl"></span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="warning" size="mini" @click="QRCodeDialogVisible = false">关&nbsp;&nbsp;闭</el-button>
      </span>
    </el-dialog>

    <!--对话框：创建为问卷模板-->
    <el-dialog
      title="创建为问卷模板"
      :visible.sync="dialogFormVisible"
      width="45%"
      append-to-body>
      <el-form ref="modelForm" :rules="rules" :model="modelForm">
        <el-form-item label="问卷描述" prop="desc">
          <el-input
            label-width="20%"
            style="width: 80%"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10}"
            v-model="modelForm.desc">
          </el-input>
        </el-form-item>
        <el-form-item label="问卷标签" prop="tags">
          <el-select
            label-width="20%"
            style="width: 80%"
            v-model="modelForm.tags"
            multiple
            filterable
            allow-create
            default-first-option
            placeholder="请选择问卷标签">
            <el-option
              v-for="item in tagOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createPaper2Model('modelForm')">确 定</el-button>
      </div>
    </el-dialog>

    <!--显示修改截止时间的对话框-->
    <el-dialog
      title="修改截止时间"
      :visible.sync="DateDialogVisible"
      width="30%"
      append-to-body
      center>
      <div style="padding-bottom: 20px;color: #dd6161;text-align: center;"><span>您的问卷截止时间已过期，请更新截止时间再发布</span></div>
      <div style="display: flex;justify-content: center">
        <el-date-picker
          v-model="updateEndTime"
          type="datetime"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOption"
          placeholder="选择截止日期时间">
        </el-date-picker>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="success" size="small" @click="submitAndPublic">提交并发布</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
  import QRCode from 'qrcodejs2'
  import Clipboard from "clipboard"

  export default {
    name: "paper",
    components: {},
    data() {
      return {
        loading: true,
        DateDialogVisible: false,
        dialogFormVisible: false,
        LinkDialogVisible: false,
        QRCodeDialogVisible: false,
        curPaperId: '',  // 当前待修改问卷id
        paperLink: '',
        search_text: '',
        updateEndTime: '',
        pickerOption: {
          disabledDate(time) {
            return time.getTime() < Date.now()
          }
        },
        modelForm: {
          paperId: '',
          user: '',
          desc: '',
          tags: []
        },
        tagOpts: [/*{value: 'v', label: 'v'}*/],
        rules: {
          desc: [
            {required: true, message: '请输入问卷描述', trigger: 'blur'}
          ],
          tags: [
            {required: true, message: '请选择问卷标签', trigger: 'change'}
          ]
        },
        papers: [/*{
          id: '',
          paperTitle: '',
          paperStatus: '',
          createTime: '',
          startTime: '',
          endTime: '',
          ansPapers: 0
        }*/],
      }
    },
    created() {
      // 页面创建完成后就发送查询所有问卷请求
      this.$axios({
        method: 'get',
        url: '/paper/list/' + localStorage.getItem("id"),
      }).then(({data}) => {
        this.papers = data || []
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
    computed: {
      paperList() {
        return this.papers.sort((a, b) => {
          return a.paperStatus - b.paperStatus
        })
      }
    },
    methods: {
      // 将问卷创建为模板
      createPaper2Model(formName) {

        this.$refs[formName].validate((valid) => {
          if (valid) {

            console.log(this.modelForm)

            this.dialogFormVisible = false
            // 将当前问卷id和模板表单信息发送 创建模板
            this.$axios({
              method: 'post',
              url: '/model/create',
              data: this.modelForm
            }).then(() => {
              // 清空表单
              this.$refs['modelForm'].resetFields()
            })
          } else {
            return false
          }
        })

      },

      // 复制并关闭
      copyAndClose() {
        console.log("复制并关闭")
        let clipboard = new Clipboard("#linkBtn");

        clipboard.on("success", (e) => {
          this.$message.success('链接已复制')
          // 释放内存
          clipboard.destroy();
        });
        this.LinkDialogVisible = false
      },

      // 问卷链接和二维码
      sendPaper(command) {
        if (command.status === this.QS_TYPE.UN_PUBLIC.value) {
          this.$message.warning("问卷未发布，无法查看")
          return false
        }
        if (command.status === this.QS_TYPE.IS_STOP.value) {
          this.$message.warning("问卷已结束，无法查看")
          return false
        }
        this.paperLink = `${this.QS_TYPE.DEV_URL}:8080/paper/fill/${command.paperId}`
        // this.paperLink = `${this.QS_TYPE.PRO_URL}/paper/fill/${command.paperId}`
        switch (command.command) {
          case '1':
            this.LinkDialogVisible = true
            break
          case '2': {
            this.$nextTick(() => {
              document.getElementById("qrCode").innerHTML = "";
              new QRCode(this.$refs.qrCodeUrl, {
                text: this.paperLink, // 需要转换为二维码的内容
                width: 100,
                height: 100,
                colorDark: "black", //#000000为黑色
                colorLight: "white",
              });
            })
            this.QRCodeDialogVisible = true
            break
          }
        }
      },

      beforeSendPaper(status, paperId, command) {
        return {
          'paperId': paperId,
          'status': status,
          'command': command
        }
      },

      // 数据统计
      DataHandle(command) {
        if (command.status === this.QS_TYPE.UN_PUBLIC.value) {
          this.$message.warning("问卷未发布，无法查看")
          return false
        }

        if (command.ansPapers === 0) {
          this.$message.warning("目前未收集到答卷，无法查看")
          return false
        }

        switch (command.command) {
          case '1': {
            console.log("数据统计")
            this.$router.push({
              name: 'paper-analyse',
              params: {
                id: command.paperId
              }
            })
            break
          }
          case '2': {
            console.log("数据下载")
            this.$axios({
              method: 'get',
              url: '/file/excel/out/' + command.paperId,
              responseType: 'blob'
            }).then((res) => {
              let url = window.URL.createObjectURL(new Blob([res]));
              let link = document.createElement('a');
              link.style.display = 'none';
              link.href = url;
              link.download = command.paperId + "_data.xlsx"
              document.body.appendChild(link)
              link.click()
              URL.revokeObjectURL(link.href) // 释放URL 对象
              document.body.removeChild(link)
            })
            break
          }
        }
      },

      beforeDataHandle(status, paperId, ansPapers, command) {
        return {
          'status': status,
          'paperId': paperId,
          'ansPapers': ansPapers,
          'command': command
        }
      },

      // 操作问卷
      PaperHandle(command) {
        switch (command.command) {
          case '1': {
            console.log("将问卷导出到word")
            this.$axios({
              method: 'get',
              url: '/file/word/out/' + command.paperId,
              responseType: 'blob'
            }).then((res) => {
              let url = window.URL.createObjectURL(new Blob([res]));
              let link = document.createElement('a');
              link.style.display = 'none';
              link.href = url;
              link.download = command.paperId + "_model.docx"
              document.body.appendChild(link)
              link.click()
              URL.revokeObjectURL(link.href) // 释放URL 对象
              document.body.removeChild(link)
            })
            break
          }
          case '2': {
            console.log("创建为模板")
            this.dialogFormVisible = true
            this.modelForm.paperId = command.paperId
            this.modelForm.user = localStorage.getItem("user")
            break
          }
        }
      },

      beforePaperHandle(paperId, command) {
        return {
          'paperId': paperId,
          'command': command
        }
      },

      // 查找问卷
      searchPaperByStatus(flag) {
        switch (flag) {
          case 0: {
            this.$axios({
              method: 'get',
              url: '/paper/list/' + localStorage.getItem("id"),
            }).then(({data}) => {
              this.papers = data || []
            })
            break
          }
          case 1: {
            this.$axios({
              method: 'get',
              url: '/paper/list/status/' + localStorage.getItem("id"),
              params: {
                status: this.QS_TYPE.IS_PUBLIC.value
              }
            }).then(({data}) => {
              this.papers = data || []
            })
            break
          }
          case 2: {
            this.$axios({
              method: 'get',
              url: '/paper/list/status/' + localStorage.getItem("id"),
              params: {
                status: this.QS_TYPE.UN_PUBLIC.value
              }
            }).then(({data}) => {
              this.papers = data || []
            })
            break
          }
          case 3: {
            this.$axios({
              method: 'get',
              url: '/paper/list/status/' + localStorage.getItem("id"),
              params: {
                status: this.QS_TYPE.IS_STOP.value
              }
            }).then(({data}) => {
              this.papers = data || []
            })
            break
          }
        }
      },

      // 搜索问卷
      searchPaperByTitle(flag) {
        if (flag) {
          this.search_text = ''
          // 查询所有
          this.$axios({
            method: 'get',
            url: '/paper/list/' + localStorage.getItem("id"),
          }).then(({data}) => {
            this.papers = data || []
          })
        } else {
          // 按条件查询
          this.$axios({
            method: 'get',
            url: '/paper/list/title/' + localStorage.getItem("id"),
            params: {
              cond: this.search_text
            }
          }).then(({data}) => {
            this.papers = data || []
          })
        }
      },

      // 提交并发布
      submitAndPublic() {

        if (this.updateEndTime === '' || this.updateEndTime === undefined) {
          this.$message.warning("请先选择截止时间")
          return false
        }

        this.$axios({
          method: 'put',
          url: "/paper/update/end/" + this.curPaperId,
          params: {
            endTime: this.updateEndTime
          }
        }).then(() => {
          this.DateDialogVisible = false
          this.updateEndTime = ''
          this.publicPaper(this.curPaperId)
        })
      },

      // 发布问卷
      publicPaper(paperId) {
        // 后端修改问卷状态为已发布，并回显到前端
        this.$axios({
          method: 'put',
          url: '/paper/update/status/' + paperId,
          params: {
            status: this.QS_TYPE.IS_PUBLIC.value
          }
        }).then(() => {
          this.$axios({
            method: 'get',
            url: '/paper/list/' + localStorage.getItem("id"),
          }).then(({data}) => {
            this.papers = data || []
          })
        })
      },

      // 发布问卷之前
      beforePublicPaper(paperId, status) {
        this.$axios({
          method: 'get',
          url: '/paper/get/end/flag/' + paperId
        }).then(({data}) => {
          if (data === true) {
            this.DateDialogVisible = true
            this.curPaperId = paperId
          } else {
            // 否则，发布问卷
            this.publicPaper(paperId)
          }
        })
      },

      // 停止问卷
      stopPaper(paperId) {
        this.$axios({
          method: 'put',
          url: '/paper/update/status/' + paperId,
          params: {
            status: this.QS_TYPE.IS_STOP.value
          }
        }).then(() => {
          this.$axios({
            method: 'get',
            url: '/paper/list/' + localStorage.getItem("id"),
          }).then(({data}) => {
            this.papers = data || []
          })
        })
      },

      // 预览问卷
      prePaper(paperId) {
        // 发送请求，获取所有问卷数据
        this.$axios({
          method: 'get',
          url: '/paper/info/' + paperId,
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
      },

      // 编辑问卷
      editPaper(paperId, status) {
        console.log(status)

        if (status === this.QS_TYPE.IS_PUBLIC.value) {
          this.$message.warning("问卷已发布，无法编辑")
          return false
        }

        if (status === this.QS_TYPE.IS_STOP.value) {
          this.$message.warning("问卷已结束，无法编辑")
          return false
        }

        // 跳转到问卷编辑页面
        this.$router.push({
          name: 'paper-edit',
          params: {'edit': 'true', 'paperId': paperId}
        })
      },

      // 删除问卷及数据
      deletePaper(paperId) {
        this.$confirm('此操作将永久删除该问卷所有数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 发送删除请求
          this.$axios({
            method: 'delete',
            url: '/paper/del/' + paperId
          }).then(() => {
            this.$axios({
              method: 'get',
              url: '/paper/list/' + localStorage.getItem("id"),
            }).then(({data}) => {
              this.papers = data || []
            })
          })

        }).catch(() => {
          this.$message.info('已取消删除')
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-dropdown-link {
    cursor: pointer;
  }

  .left-word {
    i {
      font-weight: bolder;
    }

    font-weight: bolder;
    font-size: larger;
  }

  .left-nav {
    margin-top: 20px;

    ul {
      list-style: none;
      margin: 0 auto;
      padding: 0;
      width: 250px;

      li {
        text-align: left;
        cursor: pointer;

        a, a:visited {
          background-color: #f7f7f7; /* 背景色 */
          border: 1px #E9EEF3 solid; /* 边框 */
          color: #333333; /* 文字颜色 */
          display: block; /* 此元素将显示为块级元素，此元素前后会带有换行符 */
          line-height: 40px; /* 行高 */
          padding: 4px 50px; /* 内部填充的距离 */
          text-decoration: none; /* 不显示超链接下划线 */
          white-space: nowrap; /* 对于文本内的空白处，不会换行，文本会在在同一行上继续，直到遇到 <br> 标签为止。 */
        }
      }
    }
  }

  .left-nav ul li a:hover {
    background-color: #f0f0f0; /* 背景色 */
    font-weight: bold;
    text-decoration: none; /* 不显示超链接下划线 */
    .myi {
      font-weight: bold;
    }
  }


  .main-top {
    h2 {
      margin: 0;
      padding: 0;
    }

    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    height: 50px;
    line-height: 50px;
  }

  .el-divider--horizontal {
    margin: 12px 0;
  }

  .main-content {
    .box-card {
      margin-bottom: 15px;

      .card-top {
        display: flex;
        justify-content: space-between;
        height: 32px;
        line-height: 32px;

        a, a:active, a:visited {
          text-decoration: none;
          color: #333333;
        }

        a:hover {
          color: #1e649f;
        }
      }

      .card-content {
        display: flex;
        justify-content: space-between;
        height: 30px;
        line-height: 30px;
      }
    }
  }
</style>
