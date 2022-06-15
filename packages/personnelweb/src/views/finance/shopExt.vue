<template>
  <div class="salaryRewardDetail">
    <el-collapse-transition>
      <div v-show="showList">
        <el-row>
          <el-button @click="addShopExt('')" type="primary">添加</el-button>
        </el-row>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="门店编码：" prop="shopcode">
            <el-input
              v-model="searchForm.shopcode"
              clearable
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
            <el-button @click="rest" type="primary">重置</el-button>
          </el-form-item>
        </el-form>

        <yid-table
          pagination
          ref="table"
          :data="jobData"
          style="margin-top: 15px"
          :row-class-name="$yid.util.getTableClass">
          <yid-table-column
            label="门店编码"
            min-width="100"
            prop="shopcode"></yid-table-column>
          <yid-table-column
            label="门店名称"
            min-width="150"
            prop="shopname"></yid-table-column>
          <yid-table-column label="门店类型" min-width="100" prop="shopType">
            <template slot-scope="scope">
              <span v-if="scope.row.shopType == 1">美发</span>
              <span v-if="scope.row.shopType == 2">美容</span>
            </template>
          </yid-table-column>
          <yid-table-column label="门店品牌" min-width="150" prop="brandCode">
            <template slot-scope="scope">
              <span v-for="shoppro in allShopList">
                <span v-if="scope.row.shopcode == shoppro.shopcode">
                  {{ shoppro.brandName }}
                </span>
              </span>
            </template>
          </yid-table-column>
          <yid-table-column
            label="收款人姓名"
            min-width="150"
            prop="payee"></yid-table-column>
          <yid-table-column
            label="开户行"
            min-width="150"
            prop="bank"></yid-table-column>
          <yid-table-column
            label="开户账号"
            min-width="200"
            prop="bankno"></yid-table-column>
          <yid-table-column
            label="支行名称"
            min-width="150"
            prop="branchbank"></yid-table-column>
          <yid-table-column
            label="财务片区"
            min-width="150"
            prop="faname"></yid-table-column>
          <yid-table-column
            label="管理费系数"
            min-width="150"
            prop="feeRatio"></yid-table-column>
          <yid-table-column
            label="是否关店清零"
            min-width="150"
            prop="isClosed">
            <template slot-scope="scope">
              <span v-if="scope.row.isClosed == 0">未关店</span>
              <span v-if="scope.row.isClosed == 1" style="color: red"
                >已关店</span
              >
            </template>
          </yid-table-column>
          <yid-table-column
            label="关店清零日期"
            min-width="150"
            prop="closedDate">
            <template slot-scope="scope">
              {{ $yid.util.formatDate(scope.row.closedDate) }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="财务公司类型"
            min-width="150"
            prop="ftypename">
          </yid-table-column>

          <yid-table-column
            label="操作"
            min-width="150"
            prop="content"
            fixed="right">
            <template slot-scope="scope">
              <el-link type="primary" @click="editAction(scope.row)"
                >编辑</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button @click="saveJob" type="primary">保存</el-button>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="shopExtForm" :model="shopExtForm" label-width="140px">
          <el-row :gutter="24">
            <el-col :span="6">
              <el-form-item
                label="门店编码："
                prop="shopcode"
                :rules="[{ required: true, message: '门店编码为空' }]">
                <el-input
                  style="width: 150px"
                  v-model="shopExtForm.shopcode"
                  @change="getshopcode"></el-input>
              </el-form-item>
              <el-form-item label="财务片区：" prop="">
                <el-select
                  style="width: 150px"
                  value-key="pid"
                  placeholder="请选择"
                  v-model="shopExtForm.facode">
                  <el-option
                    :key="item.id"
                    :value="item.code"
                    :label="item.name"
                    v-for="item in financeAreaList" />
                </el-select>
              </el-form-item>

              <el-form-item label="收款人姓名：" prop="payee">
                <el-input
                  style="width: 150px"
                  v-model="shopExtForm.payee"></el-input>
              </el-form-item>

              <el-form-item label="收款人姓名(对公)：" prop="pubPayee">
                <el-input
                  style="width: 160px"
                  v-model="shopExtForm.pubPayee"></el-input>
              </el-form-item>

              <el-form-item label="开业日期：" prop="openDate">
                <el-date-picker
                  style="width: 180px"
                  v-model="shopExtForm.openDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="门店名称：" prop="shopname">
                {{ shopExtForm.shopname }}
              </el-form-item>

              <el-form-item label="财务公司类型：" prop="ftype">
                <ftype-select :code.sync="shopExtForm.ftype"></ftype-select>
              </el-form-item>

              <el-form-item label="开户账号：" prop="bankno">
                <el-input
                  style="width: 180px"
                  v-model="shopExtForm.bankno"
                  @change="validateNum"></el-input>
              </el-form-item>

              <el-form-item label="开户账号(对公)：" prop="pubBankno">
                <el-input
                  style="width: 160px"
                  v-model="shopExtForm.pubBankno"></el-input>
              </el-form-item>

              <el-form-item label="管理费系数：" prop="feeRatio">
                <el-input-number
                  v-model="shopExtForm.feeRatio"
                  :min="0"
                  :max="100"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="门店类型：" prop="shopType">
                <el-select
                  style="width: 150px"
                  value-key="id"
                  placeholder="请选择"
                  v-model.trim="shopExtForm.shopType"
                  disabled>
                  <el-option label="美发" value="1"></el-option>
                  <el-option label="美容" value="2"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="是否关店清零：" prop="isClosed">
                <el-select
                  style="width: 150px"
                  value-key="id"
                  placeholder="请选择"
                  v-model.trim="shopExtForm.isClosed">
                  <el-option label="未关店" value="0"></el-option>
                  <el-option label="已关店" value="1"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="开户行：" prop="bank" label-width="160px">
                <el-select
                  style="width: 150px"
                  v-model="shopExtForm.bank"
                  placeholder="请选择">
                  <el-option
                    v-for="item in bankList"
                    :key="item.id"
                    :label="item.bank"
                    :value="item.bank">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="开户行(对公)："
                prop="pubBank"
                label-width="160px">
                <el-select
                  style="width: 150px"
                  v-model="shopExtForm.pubBank"
                  placeholder="请选择">
                  <el-option
                    v-for="item in bankList"
                    :key="item.id"
                    :label="item.bank"
                    :value="item.bank">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="门店品牌："
                prop="brandName"
                :disabled="true">
                {{ shopExtForm.brandName }}
              </el-form-item>

              <el-form-item label="关店清零日期：" prop="closedDate">
                <el-date-picker
                  style="width: 180px"
                  v-model="shopExtForm.closedDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="选择日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="支行名称：" prop="branchbank">
                <el-input
                  style="width: 180px"
                  v-model="shopExtForm.branchbank"></el-input>
              </el-form-item>

              <el-form-item label="支行名称(对公)：" prop="pubBranchbank">
                <el-input
                  style="width: 160px"
                  v-model="shopExtForm.pubBranchbank"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5"> </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import ftypeSelect from './components/ftypeSelect'

export default {
  components: { ftypeSelect },
  name: 'dept',
  data() {
    return {
      activeName: 'position',
      showList: true,
      type: '1',
      searchForm: {
        shopcode: ''
      },
      shopExtForm: {
        shopid: '',
        shopcode: '',
        shponame: '',
        shopType: '',
        brandId: '',
        brandCode: '',
        brandName: '',
        payee: '',
        bank: '',
        bankno: '',
        branchbank: '',
        faid: '',
        facode: '',
        faname: '',
        isClosed: '',
        closedDate: '',
        ftype: '',
        pubPayee: '',
        pubBank: '',
        pubBankno: '',
        pubBranchbank: '',
        feeRatio: '',
        openDate: '',
        ftypename: ''
      },
      pageInfo: { page: 1, limit: 10 },
      maxCode: 0,
      allShopList: [],
      financeAreaList: [],
      jobData: [],

      bankList: [],
      jobDialog: {
        title: '',
        visible: false
      }
    }
  },
  created() {
    // this.getjobList();
  },

  mounted() {
    this.getjobList()
    this.getShopList()
    this.getFinanceAreaList()
    this.getBankList()
  },
  methods: {
    search() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchForm)
    },
    rest() {
      this.$refs['searchForm'].resetFields()
      this.searchForm.yearmonth = ''
      this.searchForm.type = ''
      this.searchForm.status = ''
      this.search()
    },
    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.shopExt.jobList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    getjobList(type) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.shopExt.jobList
      const params = this.pageInfo
      params.type = type

      this.$refs.table.reloadData({
        fetch,
        params
      })
    },

    handleClick(tab, event) {
      this.getjobList()
    },

    getshopcode() {
      let shopPobj = {}
      let shopcode = this.shopExtForm.shopcode
      shopPobj = this.allShopList.find(shopp => {
        return shopp.shopcode === shopcode
      })
      // console.log(shopPobj.shopname+":"+shopPobj.shopcode);
      if (yid.util.isEmpty(shopPobj)) {
        yid.util.error('没有店号为' + shopcode + '的门店信息，请重新输入')
        this.shopExtForm.shopcode = ''
        return
      } else {
        service.finance.shopExt
          .getShopExtShow({ shopcode: shopcode })
          .then(res => {
            if (res.resp_code == 200) {
              this.shopExtForm = res.data
            } else {
              yid.util.info(res.resp_msg)
            }
            this.shopExtForm.shopid = shopPobj.id
            this.shopExtForm.shopname = shopPobj.shopname
            this.shopExtForm.shopType = shopPobj.type
            this.shopExtForm.brandId = shopPobj.brandId
            this.shopExtForm.brandCode = shopPobj.brandCode
            this.shopExtForm.brandName = shopPobj.brandName
          })
      }

      this.$forceUpdate()
    },

    getFinanceAreaList() {
      service.finance.dicFinancialArea
        .financeAreaAll({ status: '1' })
        .then(res => {
          if (res.resp_code == 200) {
            this.financeAreaList = res.data
          }
        })
    },

    getShopList() {
      service.chain.shop.shopList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.allShopList = res.data
        }
      })
    },

    addShopExt() {
      this.shopExtForm.id = ''
      this.shopExtForm.name = ''
      this.shopExtForm.shopid = ''
      this.shopExtForm.shopcode = ''
      this.shopExtForm.shponame = ''
      this.shopExtForm.shopType = ''
      this.shopExtForm.brandid = ''
      this.shopExtForm.brandCode = ''
      this.shopExtForm.payee = ''
      this.shopExtForm.bank = ''
      this.shopExtForm.bankno = ''
      this.shopExtForm.branchbank = ''
      this.shopExtForm.faid = ''
      this.shopExtForm.facode = ''
      this.shopExtForm.faname = ''
      this.shopExtForm.isClosed = ''
      this.shopExtForm.closedDate = ''
      this.shopExtForm.ftype = ''
      this.shopExtForm.pubPayee = ''
      this.shopExtForm.pubBank = ''
      this.shopExtForm.pubBankno = ''
      this.shopExtForm.pubBranchbank = ''
      this.shopExtForm.feeRatio = '3'
      this.shopExtForm.openDate = ''
      this.showList = false
    },
    async editAction(row) {
      this.shopExtForm.id = row.id
      this.shopExtForm.name = row.name
      this.shopExtForm.shopid = row.shopid
      this.shopExtForm.shopcode = row.shopcode
      this.shopExtForm.shopname = row.shopname
      this.shopExtForm.shopType = row.shopType
      this.shopExtForm.brandId = row.brandId
      this.shopExtForm.brandCode = row.brandCode
      let brandPobj = {}
      brandPobj = this.allShopList.find(item => {
        return item.brandCode === row.brandCode
      })
      this.shopExtForm.brandName = brandPobj.brandName
      this.shopExtForm.payee = row.payee
      this.shopExtForm.bank = row.bank
      this.shopExtForm.bankno = row.bankno
      this.shopExtForm.branchbank = row.branchbank
      this.shopExtForm.faid = row.faid
      this.shopExtForm.facode = row.facode
      this.shopExtForm.faname = row.faname
      this.shopExtForm.isClosed = row.isClosed
      this.shopExtForm.closedDate = row.closedDate
      this.shopExtForm.ftype = row.ftype
      this.shopExtForm.pubPayee = row.pubPayee
      this.shopExtForm.pubBank = row.pubBank
      this.shopExtForm.pubBankno = row.pubBankno
      this.shopExtForm.pubBranchbank = row.pubBranchbank
      this.shopExtForm.feeRatio = row.feeRatio
      this.shopExtForm.openDate = row.openDate
      this.showList = false
    },

    saveJob() {
      this.$refs['shopExtForm'].validate(valid => {
        if (valid) {
          let isClosed = this.shopExtForm.isClosed
          let closeDate = this.shopExtForm.closedDate
          if (isClosed == '1' && closeDate == '') {
            yid.util.alert('请填写关店日期')
            return false
          } else if (isClosed == '0') {
            this.shopExtForm.closedDate = ''
          }
          let openDate = this.shopExtForm.openDate
          if (
            isClosed == '1' &&
            !yid.util.isEmpty(openDate) &&
            closeDate <= openDate
          ) {
            yid.util.alert('关店日期不能小于开业日期')
            return false
          }

          let financeAreapobj = {}
          financeAreapobj = this.financeAreaList.find(item => {
            return item.code === this.shopExtForm.facode
          })
          this.shopExtForm.faid = financeAreapobj.id
          this.shopExtForm.faname = financeAreapobj.name
          service.finance.shopExt.saveJob(this.shopExtForm).then(res => {
            if (res.resp_code == 200) {
              yid.util.success(res.resp_msg)
              this.back()
              this.getData(this.searchForm)
            } else {
              yid.util.error(res.resp_msg)
            }
          })
        }
      })
    },
    back() {
      this.$refs['shopExtForm'].resetFields()
      this.showList = true
    },
    getBankList() {
      service.finance.dicBank.listAll({ status: '1', isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.bankList = res.data
        }
      })
    },
    // 输入银行卡号
    validateNum() {
      this.shopExtForm.bankno = this.shopExtForm.bankno
        .replace(/\s/g, '')
        .replace(/[^\d]/g, '')
        .replace(/(\d{4})(?=\d)/g, '$1 ')
    }
  }
}
</script>

<style scoped></style>
