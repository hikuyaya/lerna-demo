<template>
  <div class="dormRate">
    <el-collapse-transition>
      <div v-show="showList">
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="">
            <el-button @click="addDormRate" type="primary">新增</el-button>
            <el-button @click="showImportDialog" type="primary">导入</el-button>
          </el-form-item>
          <br />
          <el-form-item label="门店：" prop="shopid">
            <el-select
              clearable
              v-model.trim="searchForm.shopid"
              filterable
              :filter-method="filterShop"
              placeholder="请选择门店"
              style="width: 200px">
              <el-option
                :key="item.id"
                :label="item.shopname"
                :value="item.id"
                v-for="item in filterShopList">
                <span style="float: left">{{ item.shopcode }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.shopname
                }}</span>
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table ref="table" pagination style="width: 100%; margin-top: 10px">
          <yid-table-column
            prop="shopcode"
            label="门店编码"
            width="120px"></yid-table-column>
          <yid-table-column
            prop="shopname"
            label="门店名称"
            width="250px"></yid-table-column>
          <yid-table-column
            prop="rate"
            label="宿舍扣款比率"
            width="200px"></yid-table-column>
          <yid-table-column prop="updatedTime" label="更新时间" width="350px">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.updatedTime) }}
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="editAction(scope.row)"
                >编辑</el-link
              >
              <!--<el-link type="primary" @click="deleteAction(scope.row)" style="margin-left: 15px">删除</el-link>-->
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button @click="saveAction" type="primary">保存</el-button>
        <el-form
          ref="dormRateFrom"
          :model="dormRateFrom"
          style="margin-top: 16px"
          :rules="rules"
          label-width="100px"
          label-position="right">
          <el-form-item
            label="门店编码："
            prop="shopcode"
            label-width="150px"
            :rules="[{ required: true, message: '门店编码不能为空' }]">
            <el-input
              v-model="dormRateFrom.shopcode"
              clearable
              placeholder="门店编码"
              @blur="getShopByCode"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="门店名称："
            prop="shopname"
            label-width="150px"
            :rules="[{ required: true, message: '名称名称不能为空' }]">
            <el-input
              v-model="dormRateFrom.shopname"
              placeholder="门店名称"
              disabled="disabled"
              style="width: 200px"></el-input>
          </el-form-item>
          <el-form-item
            label="宿舍扣款比率："
            prop="rate"
            label-width="150px"
            :rules="[{ required: true, message: '宿舍扣款比率不能为空' }]">
            <el-input
              @blur="checkRate"
              v-model="dormRateFrom.rate"
              placeholder="宿舍扣款比率"
              style="width: 200px"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-collapse-transition>

    <yid-dialog
      :title="importDialog.title"
      :visible.sync="importDialog.visible"
      @close="importCancel"
      width="700px">
      <el-form :model="importDialog.model" label-width="120px" ref="copyForm">
        <p>批量导入宿舍扣款比率方法</p>
        <p>1、点击链接：下载宿舍扣款比率模板；</p>
        <p>2、下载完成并保存文件，然后打开文件并输入宿舍扣款比率信息；</p>
        <p>3、在下面导入修改完毕的模板文件。</p>
        <el-form-item label="下载导入模板：" align="left">
          <el-link @click="downExcelTemplate" type="primary"
            >宿舍扣款比率模板</el-link
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
          <el-button @click="saveImportRates" type="primary">确定</el-button>
          <el-button @click="importCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import ElButton from '../../library/components/button/button'
import download from '@src/library/http/download'

export default {
  components: { ElButton },
  name: 'dormRate',
  data() {
    return {
      excelConvertUrl: '',
      pageInfo: { page: 1, limit: 10 },
      myheaders: {},
      searchForm: {
        shopid: ''
      },
      dormRateFrom: {
        shopid: '',
        shopcode: '',
        shopname: '',
        shopType: '',
        brandId: '',
        brandCode: '',
        rate: ''
      },
      showList: true,
      rules: {},
      allShopList: [],
      filterShopList: [],
      importDialog: {
        title: '宿舍扣款比率导入',
        visible: false,
        rates: []
      }
    }
  },
  mounted() {
    this.excelConvertUrl =
      $yid.config.API.BASE + 'api-finance/dormrate/convertSystem'
    this.getShopList()
    this.search()
  },
  methods: {
    getShopList() {
      service.chain.shop.shopList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    getData(reqParams) {
      const fetch = service.finance.dormRate.list
      const params = { ...this.pageInfo, ...reqParams }
      params.isDel = '0'
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchForm)
    },
    getDataNoChangePage(reqParams) {
      const fetch = service.finance.dormRate.list
      const params = { ...this.pageInfo, ...reqParams }
      params.isDel = '0'
      this.$refs.table.reloadDataNoChangePage({
        fetch,
        params
      })
    },
    searchNoChangePage() {
      this.pageInfo.page = this.$refs.table.Pagination.internalCurrentPage
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getDataNoChangePage(this.searchForm)
    },
    getShopByCode() {
      let shopcode = this.dormRateFrom.shopcode
      if (!yid.util.isEmpty(shopcode)) {
        service.chain.shop.findShopByCode({ shopcode: shopcode }).then(res => {
          if (res.resp_code == 200) {
            if (res.data != null) {
              this.dormRateFrom.shopid = res.data.id
              this.dormRateFrom.shopcode = res.data.shopcode
              this.dormRateFrom.shopname = res.data.shopname
              this.dormRateFrom.shopType = res.data.type
              this.dormRateFrom.brandId = res.data.brandId
              this.dormRateFrom.brandCode = res.data.brandCode
              this.dormRateFrom.rate = ''
            } else {
              yid.util.error('未找到编码为[' + shopcode + ']的门店信息')
              this.dormRateFrom.shopid = ''
              this.dormRateFrom.shopcode = ''
              this.dormRateFrom.shopname = ''
              this.dormRateFrom.shopType = ''
              this.dormRateFrom.brandId = ''
              this.dormRateFrom.brandCode = ''
              this.dormRateFrom.rate = ''
            }
          }
        })
      }
    },
    showImportDialog() {
      this.importDialog.visible = true
      this.importDialog.rates = []
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
      this.importDialog.rates = res.data
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
    back() {
      this.searchNoChangePage()
      this.showList = true
    },
    addDormRate() {
      this.$refs['dormRateFrom'].resetFields()
      this.dormRateFrom.id = ''
      this.showList = false
    },
    saveAction() {
      this.$refs['dormRateFrom'].validate(valid => {
        if (valid) {
          if (!this.isNumber(this.dormRateFrom.rate)) {
            yid.util.error('请输入小数点后两位以内的正数!')
            return
          }
          if (
            Number(this.dormRateFrom.rate) >= 100 ||
            Number(this.dormRateFrom.rate) <= 0
          ) {
            yid.util.error('宿舍扣款比率必须为大于0小于100的正数')
            return
          }
          service.finance.dormRate.saveRate(this.dormRateFrom).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('保存成功')
              this.showList = true
              if (yid.util.isEmpty(this.dormRateFrom.id)) {
                this.search()
              } else {
                this.searchNoChangePage()
              }
            } else {
              yid.util.error('保存失败')
            }
          })
        }
      })
    },
    editAction(row) {
      this.dormRateFrom.id = row.id
      this.dormRateFrom.shopid = row.shopid
      this.dormRateFrom.shopcode = row.shopcode
      this.dormRateFrom.shopname = row.shopname
      this.dormRateFrom.shopType = row.shopType
      this.dormRateFrom.brandId = row.brandId
      this.dormRateFrom.brandCode = row.brandCode
      this.dormRateFrom.rate = row.rate
      this.showList = false
    },
    deleteAction(row) {
      yid.util.confirm(
        '您确定要删除[' + row.shopname + ']店的宿舍扣款比率?',
        '',
        '',
        () => {
          row.isDel = '1'
          service.finance.dormRate.save(row).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('更新成功')
              this.search()
            } else {
              yid.util.error('更新失败')
            }
          })
        }
      )
    },
    downExcelTemplate() {
      download(yid.config.API.BASE + 'api-finance/dormrate/downSysTemplate', {})
    },
    saveImportRates() {
      if (this.importDialog.rates.length == 0) {
        yid.util.info('无导入数据')
      } else {
        service.finance.dormRate
          .saveSystem(this.importDialog.rates)
          .then(res => {
            if (res.resp_code == '200') {
              this.search()
              this.importDialog.visible = false
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      }
    },
    isNumber(val) {
      if (yid.validate.pNumerical2(val)) {
        return true
      } else {
        return false
      }
    },
    checkRate() {
      let rate = this.dormRateFrom.rate
      if (!this.isNumber(rate)) {
        yid.util.error('请输入小数点后两位以内的正数!')
        this.dormRateFrom.rate = ''
        return
      }

      if (
        Number(this.dormRateFrom.rate) >= 100 ||
        Number(this.dormRateFrom.rate) <= 0
      ) {
        yid.util.error('宿舍扣款比率必须为大于0小于100的正数!')
        this.dormRateFrom.rate = ''
        return
      }
    }
  }
}
</script>

<style scoped lang="scss"></style>
