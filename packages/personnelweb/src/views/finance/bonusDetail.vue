<template>
  <div class="member-review">
    <el-form ref="searchForm" inline :model="searchForm">
      <el-form-item label="选择门店：">
        <el-select
          clearable
          v-model="searchForm.shopid"
          filterable
          :filter-method="filterShop"
          placeholder="请选择"
          @clear="clearFormShop"
          @blur="clearFormShop">
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
      <el-form-item label="选择时间：">
        <el-date-picker
          :clearable="false"
          v-model="searchForm.billdateRange"
          type="daterange"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="员工：">
        <el-input
          clearable
          v-model="searchForm.eecodename"
          placeholder="姓名/工号"
          style="width: 120px"></el-input>
      </el-form-item>
      <el-form-item label="职务：">
        <el-select
          style="width: 100px"
          clearable
          v-model="searchForm.psid"
          filterable
          placeholder="请选择"
          @change="getPositionLevelList">
          <el-option
            v-for="item in positionList"
            :key="item.id"
            :label="item.psname"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="级别：">
        <el-select
          style="width: 100px"
          filterable
          placeholder="请选择"
          v-model.trim="searchForm.pslid">
          <el-option
            :key="item.id"
            :label="item.pslname"
            :value="item.id"
            v-for="item in positionLevelList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单号：">
        <el-input
          clearable
          v-model="searchForm.billcode"
          placeholder="单号"
          style="width: 120px"></el-input>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button @click="seachTc" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <yid-table pagination ref="table" @expand-change="getDetail">
      <yid-table-column
        label="工号"
        min-width="100"
        prop="eecode"></yid-table-column>
      <yid-table-column
        label="员工姓名"
        min-width="100"
        prop="eename"></yid-table-column>
      <yid-table-column
        label="职位"
        min-width="120"
        prop="psname"></yid-table-column>
      <yid-table-column
        label="级别"
        min-width="120"
        prop="pslname"></yid-table-column>
      <yid-table-column
        label="单号"
        min-width="150"
        prop="billcode"></yid-table-column>
      <yid-table-column label="业务类型" min-width="120" prop="btype">
        <template slot-scope="scope">
          {{ getTypeName(scope.row.btype) }}
        </template>
      </yid-table-column>
      <yid-table-column
        label="项目/商品"
        min-width="150"
        prop="sername"></yid-table-column>
      <yid-table-column label="日期" min-width="150" prop="billdate">
        <template slot-scope="scope">
          {{ $yid.util.formatDate(scope.row.billdate) }}
        </template>
      </yid-table-column>
      <yid-table-column
        label="业绩"
        min-width="100"
        prop="money"></yid-table-column>
      <yid-table-column
        label="提成"
        min-width="100"
        prop="royalty"></yid-table-column>
      <yid-table-column label="详情" width="100" type="expand" prop="billcode">
        <template slot-scope="scope">
          <yid-table :data="scope.row.descs" class="children">
            <yid-table-column
              prop="prnname"
              label="提成指标"></yid-table-column>
            <yid-table-column label="工位">
              第{{ scope.row.postion }}工位
            </yid-table-column>
            <yid-table-column prop="cost" label="扣成本"></yid-table-column>
            <yid-table-column prop="isApppoint" label="是否指定">
              <span v-if="scope.row.isApppoint == 0">否</span>
              <span v-if="scope.row.isApppoint == 1">是</span>
            </yid-table-column>
            <yid-table-column prop="paytype" label="支付方式">
              {{ getPayTypeName(scope.row.paytype) }}
            </yid-table-column>
            <yid-table-column prop="normType" label="提成方式">
              <template slot-scope="scopez">
                <span v-if="scopez.row.normType == '1'">金额</span>
                <span v-if="scopez.row.normType == '2'">比例</span>
              </template>
            </yid-table-column>
            <yid-table-column
              prop="royaltyRate"
              label="提率"></yid-table-column>
            <yid-table-column prop="money" label="业绩"></yid-table-column>
            <yid-table-column
              prop="royalty"
              label="提成金额"></yid-table-column>
          </yid-table>
        </template>
      </yid-table-column>
    </yid-table>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
export default {
  name: 'reviews',
  data() {
    return {
      searchForm: {
        shopid: '',
        billdateRange: [],
        eecodename: '',
        psid: '',
        pslid: '',
        billcode: ''
      },
      positionList: [],
      positionLevelList: [],
      pageInfo: { page: 1, limit: 10 },
      payTypeList: [],
      billtypeList: [
        {
          value: '1',
          label: '收银'
        },
        {
          value: '2',
          label: '套餐'
        },
        {
          value: '3',
          label: '资格卡'
        },
        {
          value: '4',
          label: '储值卡'
        },
        {
          value: '5',
          label: '外卖'
        }
      ],
      allShopList: [],
      filterShopList: []
    }
  },
  mounted() {
    this.getShopList()
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    if (Number(month) < 10) {
      month = '0' + month
    }
    let day = d.getDate()
    if (Number(day) < 10) {
      day = '0' + day
    }
    let date1 = year + '-' + month + '-' + day
    this.searchForm.billdateRange.push(date1)
    this.searchForm.billdateRange.unshift(date1)
    this.getPositionList()
    this.getPayTypeList()
    this.seachTc()
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      let billdateRange = this.searchForm.billdateRange
      if (billdateRange) {
        reqObj.billdateStart = this.searchForm.billdateRange[0]
        reqObj.billdateEnd = this.searchForm.billdateRange[1]
      } else {
        reqObj.billdateStart = ''
        reqObj.billdateEnd = ''
      }
      reqObj.eecodename = this.searchForm.eecodename
      reqObj.psid = this.searchForm.psid
      reqObj.pslid = this.searchForm.pslid
      reqObj.billcode = this.searchForm.billcode
      reqObj.shopid = this.searchForm.shopid
      return reqObj
    }
  },
  methods: {
    getPositionList() {
      service.dept.jobAll({ status: 1, bbid: 1 }).then(res => {
        this.positionList = res.data
      })
    },
    getPayTypeList() {
      service.cashier.payType.listAll({ status: 0 }).then(res => {
        this.payTypeList = res.data
      })
    },
    getData(reqParams) {
      console.log(reqParams)
      const fetch = service.pers.stream.streamList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    seachTc() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchFormReq)
    },
    exportTc() {},
    getPositionLevelList(pslid) {
      this.searchForm.pslid = null
      service.positionLevel.list({ status: '1', psid: pslid }).then(res => {
        if (res.resp_code == 200) {
          this.positionLevelList = res.data
        }
      })
    },
    getTypeName(btype) {
      let bname = ''
      this.billtypeList.forEach(res => {
        if (btype === res.value) {
          bname = res.label
        }
      })
      return bname
    },
    getPayTypeName(payType) {
      let payname = ''
      this.payTypeList.forEach(pay => {
        if (payType === pay.paycode) {
          payname = pay.payname
        }
      })
      return payname
    },
    getDetail(row, expandedRows) {
      if (expandedRows.length) {
        if (row.descs.length <= 0) {
          const param = {}
          param.pesid = row.id
          service.pers.stream.getDescById(param).then(res => {
            if (res.resp_code == 200) {
              let arr = res.data.map(item => {
                return item
              })
              row.descs.push(...arr)
              console.log('row.descs', row.descs)
            }
          })
        }
        console.log('list', this.list)
      } else {
        return
      }
    },
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
    clearFormShop() {
      setTimeout(() => {
        if (this.searchForm.shopid == '') {
          this.searchForm.shopid = ''
          this.filterShopList = Object.assign(this.allShopList)
        }
      }, 300)
    }
  }
}
</script>

<style scoped>
.children {
  font-size: 14px;
  color: #333;
  /deep/.has-gutter {
    th {
      font-weight: normal;
      color: #999;
      background-color: #dddddd;
      height: 40px;
    }
  }
}
</style>
