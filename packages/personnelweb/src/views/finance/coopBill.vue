<template>
  <div class="coopBill">
    <el-collapse-transition>
      <div v-show="showList">
        <el-button @click="addBill" type="primary">新建单据</el-button>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="单据编码：" prop="billcode" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.billcode"
              placeholder="单据编码"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="审核人：" prop="code" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.auditBy"
              placeholder="审核人"
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item
            label="审核日期："
            prop="sTimeRange"
            label-width="100px">
            <div class="block">
              <el-date-picker
                :clearable="true"
                v-model="searchForm.auditTimeRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="单据状态：" prop="status">
            <el-select
              style="width: 100px"
              v-model="searchForm.status"
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in statusList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <br />
          <el-form-item label="门店：" label-width="100px">
            <el-select
              @clear="clearFormShop"
              @blur="clearFormShop"
              clearable
              v-model.trim="searchForm.shopid"
              filterable
              :filter-method="filterShop"
              placeholder="请选择"
              style="width: 180px">
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
          <el-form-item label="日期：" prop="rq" label-width="100px">
            <div class="block">
              <el-date-picker
                :clearable="true"
                style="width: 150px"
                v-model="searchForm.rq"
                value-format="yyyy-MM-dd"
                placeholder="日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="项目：" label-width="100px">
            <el-select
              @clear="clearFormCoop"
              @blur="clearFormCoop"
              clearable
              v-model.trim="searchForm.coopid"
              filterable
              :filter-method="filterCoop"
              placeholder="请选择"
              style="width: 220px">
              <el-option
                :key="item.id"
                :label="item.name"
                :value="item.id"
                v-for="item in filterCoopList">
                <span style="float: left">{{ item.code }}</span>
                <span style="float: right; color: #8492a6; font-size: 13px">{{
                  item.name
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
            prop="billcode"
            label="单据编码"
            width="180"></yid-table-column>
          <yid-table-column
            prop="createdBy"
            label="制单人"
            width="120"></yid-table-column>
          <yid-table-column prop="createdTime" label="制单日期" width="150">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.createdTime) }}
            </template>
          </yid-table-column>
          <yid-table-column
            prop="updatedBy"
            label="修改人"
            width="120"></yid-table-column>
          <yid-table-column prop="updatedTime" label="修改日期" width="150">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.updatedTime) }}
            </template>
          </yid-table-column>
          <yid-table-column prop="status" label="审核状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">未审核</span>
              <span v-if="scope.row.status == 2">已审核</span>
            </template>
          </yid-table-column>
          <yid-table-column
            prop="auditBy"
            label="审核人"
            width="120"></yid-table-column>
          <yid-table-column prop="auditTime" label="审核日期" width="150">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.auditTime) }}
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <el-link
                v-if="scope.row.status == '1'"
                type="primary"
                @click="editBill(scope.row)"
                >编辑</el-link
              >
              <el-link
                v-if="scope.row.status == '2'"
                type="primary"
                @click="editBill(scope.row)"
                >查看</el-link
              >
              <!--<el-link v-if="scope.row.status == '1'" type="primary" @click="deleteBill(scope.row)" style="margin-left: 15px">删除</el-link>-->
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button
          v-show="showButton"
          @click="showImportDialog"
          style="background-color: red; color: white"
          >导入</el-button
        >&nbsp;&nbsp;&nbsp;
        <el-button v-show="showButton" @click="saveBill" type="primary"
          >保存</el-button
        >
        <el-button v-show="showButtonS" @click="auditBill" type="primary"
          >审核</el-button
        >
        <el-button v-show="showButtonS" @click="deleteBill" type="primary"
          >删除</el-button
        >
        <el-form
          ref="billForm"
          :model="billForm"
          style="margin-top: 16px"
          :rules="rules"
          label-width="100px"
          label-position="right">
          <div class="container">
            <div style="width: 210px; display: inline-block">
              单据编码：{{ billForm.billcode }}
            </div>
            <div style="width: 210px; display: inline-block">
              创建人：{{ billForm.createdBy }}
            </div>
            <div style="width: 250px; display: inline-block">
              创建时间：{{ billForm.createdTime }}
            </div>
          </div>
          <div class="container">
            <div style="width: 210px; display: inline-block">
              审核状态：{{ billForm.status == '2' ? '已审核' : '未审核' }}
            </div>
            <div style="width: 210px; display: inline-block">
              审核人：{{ billForm.auditBy }}
            </div>
            <div style="width: 250px; display: inline-block">
              审核时间：{{ billForm.auditTime }}
            </div>
            <div style="width: 220px; display: inline-block">
              合计金额：{{ billForm.totalMoney }}
            </div>
          </div>
        </el-form>

        <yid-table
          v-show="showButton"
          ref="itemTable"
          style="margin-top: 15px"
          :data="billForm.details">
          <yid-table-column label="日期" min-width="120" prop="rq">
            <template slot-scope="scope">
              {{ $yid.util.formatDate(scope.row.rq) }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="门店编码"
            min-width="100"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="门店名称"
            min-width="150"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="项目名称"
            min-width="150"
            prop="coopname"></yid-table-column>
          <yid-table-column label="金额" min-width="120" prop="money">
            <template slot-scope="scope">
              <el-input
                @blur="calcMoney(scope.row)"
                v-model="scope.row.money"></el-input>
            </template>
          </yid-table-column>
          <yid-table-column
            label="扣减比例"
            min-width="80"
            prop="shoprate"></yid-table-column>
          <yid-table-column
            label="合作方业绩扣减"
            min-width="130"
            prop="smoney"></yid-table-column>
          <yid-table-column
            label="剩余业绩"
            min-width="80"
            prop="rmoney"></yid-table-column>
          <yid-table-column label="备注" min-width="120" prop="memo">
            <template slot-scope="scope">
              <el-input v-model="scope.row.memo"></el-input>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="deleteCoop(scope.$index, scope.row)"
                style="margin-left: 6px; color: red"
                >删除</el-button
              >
            </template>
          </yid-table-column>
        </yid-table>

        <yid-table
          v-show="!showButton"
          ref="showTable"
          style="margin-top: 15px"
          :data="billForm.details">
          <yid-table-column label="日期" min-width="120" prop="rq">
            <template slot-scope="scope">
              {{ $yid.util.formatDate(scope.row.rq) }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="门店编码"
            min-width="100"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="门店名称"
            min-width="150"
            prop="shopname"></yid-table-column>
          <yid-table-column
            label="项目名称"
            min-width="150"
            prop="coopname"></yid-table-column>
          <yid-table-column
            label="金额"
            min-width="80"
            prop="money"></yid-table-column>
          <yid-table-column
            label="扣减比例"
            min-width="80"
            prop="shoprate"></yid-table-column>
          <yid-table-column
            label="合作方业绩扣减"
            min-width="130"
            prop="smoney"></yid-table-column>
          <yid-table-column
            label="剩余业绩"
            min-width="80"
            prop="rmoney"></yid-table-column>
          <yid-table-column
            label="备注"
            min-width="120"
            prop="memo"></yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <yid-dialog
      :title="importDialog.title"
      :visible.sync="importDialog.visible"
      @close="importCancel"
      width="700px">
      <el-form :model="importDialog.model" label-width="120px" ref="copyForm">
        <p>批量导入合作方业绩扣减方法</p>
        <p>1、点击链接：下载合作方业绩扣减模板；</p>
        <p>2、下载完成并保存文件，然后打开文件并输入合作方业绩扣减信息；</p>
        <p>3、在下面导入修改完毕的模板文件。</p>
        <el-form-item label="下载导入模板：" align="left">
          <el-link @click="downExcelTemplate" type="primary"
            >合作方业绩扣减模板</el-link
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
          <el-button @click="saveImportCoops" type="primary">确定</el-button>
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
import * as math from 'mathjs'

export default {
  components: { ElButton },
  name: 'coopBill',
  data() {
    return {
      excelConvertUrl: '',
      myheaders: {},
      pageInfo: { page: 1, limit: 10, isDel: '0' },
      searchForm: {
        billcode: '',
        auditBy: '',
        status: '',
        auditTimeRange: [],
        shopid: '',
        rq: '',
        coopid: ''
      },
      statusList: [
        {
          value: '1',
          label: '未审核'
        },
        {
          value: '2',
          label: '已审核'
        }
      ],
      billForm: {
        id: '',
        billcode: '',
        createdBy: '',
        createdTime: '',
        status: '',
        auditBy: '',
        auditTime: '',
        totalMoney: '',
        details: []
      },
      allShopList: [],
      filterShopList: [],
      allCoopList: [],
      filterCoopList: [],
      showList: true,
      showButton: true,
      rules: {},
      importDialog: {
        title: '合作方业绩扣减导入',
        visible: false,
        coops: []
      },
      showButtonS: false
    }
  },
  mounted() {
    this.excelConvertUrl =
      $yid.config.API.BASE + 'api-finance/coopbillhead/convertSystem'
    this.getShopList()
    this.getDicCoopList()
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      reqObj.billcode = this.searchForm.billcode
      reqObj.auditBy = this.searchForm.auditBy
      reqObj.status = this.searchForm.status
      let auditTimeRange = this.searchForm.auditTimeRange
      if (auditTimeRange) {
        reqObj.auditTimeStart = this.searchForm.auditTimeRange[0]
        reqObj.auditTimeEnd = this.searchForm.auditTimeRange[1]
      } else {
        reqObj.auditTimeStart = ''
        reqObj.auditTimeEnd = ''
      }
      reqObj.shopid = this.searchForm.shopid
      reqObj.rq = this.searchForm.rq
      reqObj.coopid = this.searchForm.coopid
      return reqObj
    }
  },
  methods: {
    getData(reqParams) {
      const fetch = service.finance.coopBill.billList
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
      this.getData(this.searchFormReq)
    },
    getDataNoChangePage(reqParams) {
      const fetch = service.finance.coopBill.billList
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
      this.getDataNoChangePage(this.searchFormReq)
    },
    getShopList() {
      service.chain.shop.shopList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    getDicCoopList() {
      service.finance.diccooperate.listAll({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.filterCoopList = res.data
          this.allCoopList = Object.assign(this.filterCoopList) //保留原数据
        }
      })
    },
    clearFormShop() {
      setTimeout(() => {
        if (this.searchForm.shopid == '') {
          this.searchForm.shopid = ''
          this.filterShopList = Object.assign(this.allShopList)
        }
      }, 300)
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    clearFormCoop() {
      setTimeout(() => {
        if (this.searchForm.coopid == '') {
          this.searchForm.coopid = ''
          this.filterCoopList = Object.assign(this.allCoopList)
        }
      }, 300)
    },
    filterCoop(v) {
      this.filterCoopList = this.allCoopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.name.indexOf(v) !== -1) return true
        if (item.code.indexOf(v) !== -1) return true
      })
    },
    showImportDialog() {
      this.importDialog.visible = true
      this.importDialog.coops = []
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
      this.importDialog.coops = res.data
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
    deleteCoop(index, row) {
      this.billForm.details.splice(index, 1) //移除删除的项目
    },
    back() {
      this.searchNoChangePage()
      this.showList = true
    },
    addBill() {
      this.billForm.id = ''
      this.billForm.billcode = ''
      this.billForm.createdBy = ''
      this.billForm.createdTime = ''
      this.billForm.status = ''
      this.billForm.auditBy = ''
      this.billForm.auditTime = ''
      this.billForm.totalMoney = ''
      this.billForm.details = []
      this.showList = false
      this.showButton = true
      this.showButtonS = false
    },
    saveBill() {
      if (this.billForm.details.length == 0) {
        yid.util.error('单据明细为空')
        return
      }
      let flag = true
      this.billForm.details.forEach(d => {
        if (yid.util.isEmpty(d.money)) {
          flag = false
        }
      })
      if (!flag) {
        yid.util.error('金额不能')
        return
      }
      service.finance.coopBill.saveBill(this.billForm).then(res => {
        if (res.resp_code == '200') {
          this.billForm = res.data
          this.showButtonS = true
          yid.util.success('保存成功')
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    editBill(row) {
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.createdBy = row.createdBy
      this.billForm.createdTime = row.createdTime
      this.billForm.status = row.status
      this.billForm.auditBy = row.auditBy
      this.billForm.auditTime = row.auditTime
      this.billForm.totalMoney = row.totalMoney
      this.billForm.details = row.details
      this.showList = false
      this.showButton = row.status == '1'
      this.showButtonS = row.status == '1'
    },
    deleteBill() {
      if (!yid.util.isEmpty(this.billForm.billcode)) {
        yid.util.confirm(
          '您确定要删除[' + this.billForm.billcode + ']的单据?',
          '',
          '',
          () => {
            service.finance.coopBill.deleteBill(this.billForm).then(res => {
              if (res.resp_code == '200') {
                yid.util.success('删除成功!')
                this.showList = true
                this.search()
              } else {
                yid.util.error(res.resp_msg)
              }
            })
          }
        )
      } else {
        yid.util.error('单据保存后再进行删除!')
        return
      }
    },
    auditBill() {
      if (this.billForm.details.length == 0) {
        yid.util.error('单据明细为空')
        return
      }
      let flag = true
      this.billForm.details.forEach(d => {
        if (yid.util.isEmpty(d.money)) {
          flag = false
        }
        /*if(Number(d.money) == 0){
                         flag = false;
                     }*/
      })
      if (!flag) {
        yid.util.error('金额不能为空')
        return
      }
      service.finance.coopBill.saveBill(this.billForm).then(res => {
        if (res.resp_code == '200') {
          this.billForm = res.data

          let id = this.billForm.id
          let billcode = this.billForm.billcode
          let status = this.billForm.status
          if (!yid.util.isEmpty(billcode)) {
            yid.util.confirm(
              '您确定要审核[' + billcode + ']的单据?',
              '',
              '',
              () => {
                if (status == '2') {
                  yid.util.error('已审核的单据不能再次进行审核')
                  return
                } else {
                  //调用审核单据接口
                  service.finance.coopBill
                    .auditBill({ id: id, billcode: billcode })
                    .then(res => {
                      if (res.resp_code == '200') {
                        yid.util.success('审核成功')
                        this.showList = true
                        this.search()
                      } else {
                        yid.util.error(res.resp_msg)
                      }
                    })
                }
              }
            )
          } else {
            yid.util.error('单据保存后再进行审核!')
            return
          }
        } else {
          yid.util.error(res.resp_msg)
          return
        }
      })
    },
    downExcelTemplate() {
      download(
        yid.config.API.BASE + 'api-finance/coopbillhead/downSysTemplate',
        {}
      )
    },
    saveImportCoops() {
      if (this.importDialog.coops.length == 0) {
        yid.util.info('无导入数据')
      } else {
        service.finance.coopBill
          .saveSystem(this.importDialog.coops)
          .then(res => {
            if (res.resp_code == '200') {
              this.billForm.details = res.data
              this.importDialog.visible = false
            } else {
              yid.util.error(res.resp_msg)
            }
          })
      }
    },
    isNumber(val) {
      if (yid.validate.pNumerical3(val)) {
        return true
      } else {
        return false
      }
    },
    calcMoney(row) {
      let money = row.money
      let shoprate = row.shoprate
      if (!yid.util.isEmpty(money)) {
        if (!this.isNumber(money)) {
          yid.util.error('请输入小数点后两位以内的正数或负数!')
          row.money = ''
          row.smoney = ''
          row.rmoney = ''
          return
        }
        //计算smoney 和 rmoney
        if (yid.util.isEmpty(shoprate)) {
          yid.util.error('门店业绩扣减比率为空，请填写后再进行申请!')
          row.money = ''
          row.smoney = ''
          row.rmoney = ''
          return
        }
        let smoney = math.round(
          math.chain(money).multiply(Number(shoprate)).divide(100).done(),
          2
        )
        let rmoney = math.round(
          math.chain(money).subtract(Number(smoney)).done(),
          2
        )
        row.smoney = smoney
        row.rmoney = rmoney
        //计算合计金额
        this.getTotalMoney()
      }
    },
    getTotalMoney() {
      let totalmoney = 0
      if (this.billForm.details.length > 0) {
        this.billForm.details.forEach(d => {
          totalmoney = math.round(
            math.chain(totalmoney).add(Number(d.money)).done(),
            2
          )
        })
      }
      this.billForm.totalMoney = totalmoney
    }
  }
}
</script>

<style scoped lang="scss">
.container {
  width: 100%;
  height: 30px;
  /*overflow: auto;*/
  white-space: nowrap;
}
</style>
