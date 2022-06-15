<template>
  <div>

    <avue-crud ref="crud" :option.sync="option" :data.sync="data" :page.sync="page" @refresh-change="refresh"
               @search-change="searchChange" size="small" :search.sync="search"
               @on-load="onLoad">
      <template slot="menuLeft" slot-scope="{size}">
        <el-button type="primary" @click="handleAdd" :size="size">新增</el-button>
        <el-button @click="handleGuid" :size="size">使用文档</el-button>
      </template>

      <!--      <template slot="reportSql" slot-scope="scope">-->


      <!--        <el-tooltip class="item" slot="reference" effect="dark" :content="scope.row['reportSql']" placement="top-start">-->
      <!--          <span>{{ scope.row['reportSql'] ? scope.row['reportSql'].substr(0, 30) : '' }}</span>-->
      <!--        </el-tooltip>-->

      <!--      </template>-->

      <template slot-scope="{row,type,size}" slot="menu">
        <el-button :size="size" :type="type" @click="edit(row)"> 编辑</el-button>
        <el-button :size="size" :type="type" @click="popReportURL(row.id)"> 地址</el-button>
        <el-button style="margin-right: 10px;" :size="size" :type="type" @click="goPageOnline(row.id)">测试</el-button>
        <el-popconfirm title="确定删除吗?" @confirm="() => handleDelete(row.id)">
          <el-button slot="reference" :size="size" :type="type"> 删除</el-button>
        </el-popconfirm>


      </template>
    </avue-crud>


    <!-- 表单区域 -->
    <!--    <ReportHeadModal ref="modalForm" @closed="dialogClose" :v-model=""  ></ReportHeadModal>-->

    <!-- 提示online报表链接 -->
    <el-dialog
        title="报表访问链接"
        :visible="visible"

        @cancel="handleCancel">
      <template slot="footer">
        <el-button @click="handleCancel">关闭</el-button>
        <el-button type="primary" class="copy-this-text" :data-clipboard-text="reportUrlText" @click="onCopyUrl">复制
        </el-button>
      </template>
      <p>{{ reportUrlText }}</p>
    </el-dialog>
  </div>
</template>

<script>
import ReportHeadModal from './components/ReportHeadModal'
import Clipboard from 'clipboard'
import service from "@src/service";
import Vue from 'vue'

const filterObj = (obj) => {
  if (!(typeof obj == 'object')) {
    return
  }

  for (let key in obj) {
    if (obj.hasOwnProperty(key)
        && (obj[key] == null || obj[key] == undefined || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj
}
export default {
  name: 'ReportHeadList',
  components: {
    // ReportHeadModal,
  },
  data() {
    return {
      search: {},
      visible: false,
      editvisible: false,
      reportUrlText: '',
      data: [],
      page: {},
      option: {
        defaultSort: {
          prop: 'code',
          order: 'descending'
        },
        menu: true,
        editBtn: false,
        delBtn: false,
        searchIndex: 2,
        searchIcon: true,
        searchShow: true,
        searchShowBtn: true,
        // title: '',
        // header: false,
        highlightCurrentRow: true,
        expand: false,
        border: true,
        showSummary: false,
        dateBtn: false,
        printBtn: false,
        excelBtn: false,
        sortable: false,
        filterBtn: false,
        align: 'center',
        refreshBtn: true,
        columnBtn: false,
        addBtn: false,
        column: [
          // {
          //   label: '编码',
          //   align: 'center',
          //   prop: 'code',
          //   search: true
          // },
          {
            label: '报表名称',
            align: 'center',
            prop: 'name',
            search: true
          },


          {
            label: '数据源',
            align: 'center',
            prop: 'dbSource'
          },
          {
            label: '创建时间',
            align: 'center',
            prop: 'createdTime'
          }, {
            label: '创建人',
            align: 'center',
            prop: 'createdBy',
            search: true
          },
        ],
        dialogColumn: ['hide']
      },

    }
  },
  mounted() {
    //$store.getters["user/userInfo"].roleIds
  },
  methods: {
    async edit(row) {
      let resp = {data: {}};
      if (row.id) {
        resp = await service.report.queryById({id: row.id})
      }
      //每次手动加载 编辑对话框
      const ToastConstructor = Vue.extend(ReportHeadModal);
      const instance = new ToastConstructor();
      instance.$mount(document.createElement('div'));
      document.body.appendChild(instance.$el);
      instance.formobj = resp.data;
      instance.report = resp.data;
      if (!row.id)
        instance.$on("closed", this.dialogClose);
      instance.edit(row);
    }, refresh() {
      this.loadData({pageNo: this.page.currentPage, pageSize: this.page.pageSize})
    },
    handleAdd() {

      this.edit({});
    },
    handleGuid() {
      window.open("guid.html");
    },
    async onLoad(page, params) {
      this.page = page;
      let queryParam = {pageNo: this.page.currentPage, pageSize: this.page.pageSize, ...params, ...this.search}
      this.loadData(queryParam);
    },
    async loadData(parm) {

      if (parm.name) {
        parm.name = "," + parm.name + ","
      }
      if (parm.createdBy) {
        parm.createdBy = "," + parm.createdBy + ","
      }
      let res = await service.report.findList(filterObj({
        ...this.queryParam, ...parm,
      }));
      let data = res.data;
      this.page.total = res.count;
      this.data = data;
    },
    async searchChange(params, done) {


      this.page.pageNo = 0;
      let datap = {pageNo: this.page.currentPage, pageSize: this.page.pageSize, ...params}
      await this.loadData(datap).catch(() => done());
      done()


    },

    async initReportUrlText(id) {
      // let res = await service.report.getParamsInfo(id);
      // let textUrl = ""
      // if (res.data && res.data.length > 0) {
      //   for (let i of res.data) {
      //     textUrl += i.paramName + "=${" + i.paramName + "}&"
      //   }
      // }
      // if (textUrl.length > 0) {
      //   textUrl = textUrl.substring(0, textUrl.length - 1)
      //   this.reportUrlText = `/report/${id}&${textUrl}`
      // } else {
      this.reportUrlText = `/report/${id}`
      //  }

    },
    async goPageOnline(id) {
      //  let res = await service.report.getParamsInfo(id);
      let params = {id: id, test: true}
      // let textUrl = ""
      // if (res.data && res.data.length > 0) {
      //   for (let i of res.data) {
      //     textUrl += i.paramName + "=" + i.paramValue + "&"
      //   }
      // }
      // if (textUrl.length > 0) {
      //   textUrl = textUrl.substring(0, textUrl.length - 1)
      // }
      this.$router.push({path: '/reporttest/' + id, query: params})

    },
    popReportURL(id) {
      this.visible = true;
      this.initReportUrlText(id)
    },
    handleCancel() {
      this.visible = false
      this.reportUrlText = '';
    },
    async handleDelete(id) {
      await service.report.deleteUrl(id)

      this.refresh();
    },
    onCopyUrl() {
      var clipboard = new Clipboard('.copy-this-text')
      clipboard.on('success', () => {
        clipboard.destroy()
        this.$message.success('复制成功')
        this.handleCancel()
      })
      clipboard.on('error', () => {
        this.$message.error('该浏览器不支持自动复制')
        clipboard.destroy()
      })
    },
    dialogClose() {
      this.loadData({pageNo: this.page.currentPage, pageSize: this.page.pageSize, ...this.search})
    }
  }
}
</script>
<style scoped lang="scss">

/deep/ .avue-crud__pagination {
  position: relative;
  padding: 10px 0 0px 20px !important;
  text-align: right;
}



/deep/ .avue-form{

  position: relative;
  margin: 0 auto;
  margin-bottom: 10px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}

/deep/ .el-table__cell{
  padding: 2px 0;
}
///deep/ .el-table--small{
//  font-size: 12px !important;
//  //font-family:"宋体","黑体",Verdana, Arial, Helvetica, sans-serif !important;
//}

</style>

