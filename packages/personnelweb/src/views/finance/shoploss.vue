<template>
  <div class="shoploss">
    <el-form :model="searchForm" ref="ruleForm" inline>
      <el-form-item label="月份：" prop="month">
        <el-date-picker
          :clearable="false"
          v-model="searchForm.month"
          type="month"
          value-format="yyyy-MM"
          format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="店号：" prop="month">
        <el-input
          clearable
          v-model="searchForm.shopcode"
          placeholder="门店编码"
          style="width: 150px"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button @click="getshoplossList" type="primary">查询</el-button>
        <el-button @click="showImportDialog" type="primary">导入</el-button>
      </el-form-item>
    </el-form>
    <yid-table
      ref="shoplosstable"
      style="margin-top: 15px"
      :data="shoplossDate"
      :row-class-name="$yid.util.getTableClass">
      <yid-table-column prop="year" label="年" width="80"></yid-table-column>
      <yid-table-column prop="month" label="月" width="80"></yid-table-column>
      <yid-table-column
        prop="shopcode"
        label="门店编码"
        width="100"></yid-table-column>
      <yid-table-column
        prop="shopname"
        label="门店名称"
        width="130"></yid-table-column>
      <yid-table-column prop="ks" label="亏损" width="100"></yid-table-column>
      <yid-table-column
        prop="orgjkyl"
        label="管理处借款（预留）"
        width="100"></yid-table-column>
      <yid-table-column
        prop="shopjk"
        label="分店内借款"
        width="100"></yid-table-column>
      <yid-table-column
        prop="jfxj"
        label="借风险金"
        width="100"></yid-table-column>
      <yid-table-column
        prop="gcjk"
        label="还工程公司借款"
        width="100"></yid-table-column>
      <yid-table-column
        prop="wfgz"
        label="未发工资"
        width="100"></yid-table-column>
      <yid-table-column
        prop="fzqk"
        label="房租缺口"
        width="100"></yid-table-column>
      <yid-table-column
        prop="totalks"
        label="亏损合计"
        width="100"></yid-table-column>
    </yid-table>

    <yid-dialog
      :title="importDialog.title"
      :visible.sync="importDialog.visible"
      @close="importCancel"
      width="700px">
      <el-form :model="importDialog.model" label-width="120px" ref="copyForm">
        <p>批量导入分店亏损情况表方法</p>
        <p>1、点击链接：下载分店亏损情况表模板；</p>
        <p>2、下载完成并保存文件，然后打开文件并输入分店亏损情况表信息；</p>
        <p>3、在下面导入修改完毕的模板文件。</p>
        <el-form-item label="下载导入模板：" align="left">
          <el-link @click="downExcelTemplate" type="primary"
            >分店亏损情况表模板</el-link
          >
        </el-form-item>
        <el-form-item label="选择导入文件:">
          <el-upload
            ref="uploadExcel"
            class="avatar-uploader"
            :headers="myheaders"
            :action="excelConvertUrl"
            :show-file-list="true"
            :limit="1"
            :on-exceed="handleExceed"
            :on-success="handleAvatarExcelSuccess"
            :before-upload="beforeAvatarExcelUpload">
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              支持上传 .xls
              .xlsx后缀文件，表格中一行为一条数据，一次最多可导入1000条数据。
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item>
          <el-button @click="saveImportshoplosss" type="primary"
            >确定</el-button
          >
          <el-button @click="importCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import download from '@src/library/http/download'
import { isEmpty } from '../../library/helper/validate'
export default {
  name: 'shoploss',
  data() {
    return {
      excelConvertUrl: '',
      myheaders: {},
      activeName: 'shoploss',
      pageInfo: { page: 1, limit: 10 },
      searchForm: {
        month: '',
        shopcode: ''
      },
      shoplossDate: [],
      importDialog: {
        title: '分店亏损情况表导入',
        visible: false,
        shoplosss: []
      }
    }
  },
  mounted() {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    if (Number(month) < 10) {
      month = '0' + month
    }
    let date1 = year + '-' + month
    this.searchForm.month = date1
    this.excelConvertUrl =
      $yid.config.API.BASE + 'api-finance/shopmonthloss/convertSystem'
    this.getshoplossList()
  },
  methods: {
    getshoplossList() {
      if (isEmpty(this.searchForm.month)) {
        yid.util.error('查询条件[年月]不能为空')
        return
      }
      this.shoplossDate = []
      if (this.searchForm.month instanceof Date)
        this.searchForm.month = this.searchForm.month.formatDate('yyyy-MM')

      //获取年月的值
      let years = this.searchForm.month.substr(0, 4)
      let month = this.searchForm.month.substr(5, 2)
      service.finance.shoploss
        .listAll({
          isDel: '0',
          year: Number(years),
          month: Number(month),
          shopcode: this.searchForm.shopcode
        })
        .then(res => {
          if (res.resp_code == 200) {
            this.shoplossDate = res.data
          }
        })
    },
    showImportDialog() {
      this.importDialog.visible = true
      this.importDialog.shoplosss = []
      this.myheaders['authorization'] =
        'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
      this.$refs.uploadExcel.clearFiles()
    },
    importCancel() {
      this.importDialog.visible = false
    },
    handleExceed(files, fileList) {
      yid.util.error('只能导入一个文件，请先删除之前选择的文件')
      return
    },
    handleAvatarExcelSuccess(res) {
      this.importDialog.shoplosss = res.data
    },
    beforeAvatarExcelUpload(file) {
      const isJPG =
        file.type.indexOf('sheet') != -1 || file.type.indexOf('excel') != -1
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isJPG) {
        yid.util.error('上传excel只能是 xls/xlsx 格式!')
      }
      if (!isLt2M) {
        yid.util.error('上传excel大小不能超过 10MB!')
      }

      return isJPG && isLt2M
    },
    downExcelTemplate() {
      //动态生成导入模版
      download(
        yid.config.API.BASE + 'api-finance/shopmonthloss/downSysTemplate',
        {}
      )
    },
    saveImportshoplosss() {
      if (
        this.importDialog.shoplosss == null ||
        this.importDialog.shoplosss.length == 0
      ) {
        yid.util.error(
          '无导入数据或数据格式有误,请使用下载的模版编辑正确的数据导入'
        )
        return
      }
      let flag = true
      let msg = '存在格式有误的列'
      this.importDialog.shoplosss.forEach(loss => {
        if (!yid.util.isEmpty(loss.ks)) {
          if (!yid.validate.pNumerical2(loss.ks)) {
            msg = msg + '[亏损],'
            flag = false
          }
        }
        if (!yid.util.isEmpty(loss.orgjkyl)) {
          if (!yid.validate.pNumerical2(loss.orgjkyl)) {
            msg = msg + '[管理处借款（预留）],'
            flag = false
          }
        }
        if (!yid.util.isEmpty(loss.shopjk)) {
          if (!yid.validate.pNumerical2(loss.shopjk)) {
            msg = msg + '[分店内借款],'
            flag = false
          }
        }
        if (!yid.util.isEmpty(loss.jfxj)) {
          if (!yid.validate.pNumerical2(loss.jfxj)) {
            msg = msg + '[借风险金],'
            flag = false
          }
        }
        if (!yid.util.isEmpty(loss.gcjk)) {
          if (!yid.validate.pNumerical2(loss.gcjk)) {
            msg = msg + '[还工程公司借款],'
            flag = false
          }
        }
        if (!yid.util.isEmpty(loss.wfgz)) {
          if (!yid.validate.pNumerical2(loss.wfgz)) {
            msg = msg + '[未发工资],'
            flag = false
          }
        }
        if (!yid.util.isEmpty(loss.fzqk)) {
          if (!yid.validate.pNumerical2(loss.fzqk)) {
            msg = msg + '[房租缺口],'
            flag = false
          }
        }
        if (!yid.util.isEmpty(loss.totalks)) {
          if (!yid.validate.pNumerical2(loss.totalks)) {
            msg = msg + '[亏损合计],'
            flag = false
          }
        }
      })

      if (!flag) {
        if (!yid.util.isEmpty(msg)) {
          msg = msg.substr(0, msg.length - 1) + '请修改后重新上传进行导入!'
        }
        yid.util.error(msg)
        return
      }
      service.finance.shoploss
        .saveSystem(this.importDialog.shoplosss)
        .then(res => {
          if (res.resp_code == '200') {
            this.getshoplossList()
            this.importCancel()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
    }
  }
}
</script>

<style scoped lang="scss"></style>
