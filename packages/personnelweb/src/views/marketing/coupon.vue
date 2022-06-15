<template>
  <div>
    <el-collapse-transition>
      <div v-show="showList">
        <el-button @click="showEditPage()" type="primary">新增</el-button>
        <el-form
          inline
          :model="searchForm"
          ref="searchForm"
          style="margin-top: 8px">
          <el-form-item label="发放渠道：" prop="isOnline">
            <el-select
              style="width: 120px"
              v-model="searchForm.isOnline"
              clearable
              placeholder="请选择">
              <el-option value="1" label="线上"></el-option>
              <el-option value="0" label="线下"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="优惠券：">
            <el-input
              clearable
              v-model="searchForm.pcodename"
              placeholder="红包名称/编码"
              style="width: 160px"></el-input>
          </el-form-item>
          <el-form-item label="品牌：">
            <el-select clearable v-model="searchForm.brandId">
              <el-option
                v-for="item in brandList"
                :label="item.name"
                :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-select
              style="width: 120px"
              v-model="searchForm.status"
              clearable
              placeholder="请选择">
              <el-option value="0" label="未发布"></el-option>
              <el-option value="1" label="已发布"></el-option>
              <el-option value="2" label="停用"></el-option>
              <el-option value="3" label="已过期"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="search()">查询</el-button>
          </el-form-item>
        </el-form>

        <yid-table pagination ref="table" style="margin-top: 10px">
          <yid-table-column label="发放渠道" min-width="80" prop="isOnline">
            <template slot-scope="scope">
              <div v-if="scope.row.isOnline == '1'">线上</div>
              <div v-if="scope.row.isOnline == '0'">线下</div>
            </template>
          </yid-table-column>
          <yid-table-column
            label="编码"
            min-width="80"
            prop="cpcode"></yid-table-column>
          <yid-table-column
            label="门店品牌"
            min-width="80"
            prop="brandName"></yid-table-column>
          <yid-table-column
            label="优惠券名称"
            min-width="80"
            prop="cpname"></yid-table-column>
          <yid-table-column label="价值" min-width="80" prop="couponType">
            <template slot-scope="scope">
              <div v-if="scope.row.couponType == '1'">
                {{ '定额' + scope.row.discount + '元' }}
              </div>
              <div v-if="scope.row.couponType == '2'">
                {{ '折扣' + scope.row.discount + '折' }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column label="有效期" min-width="200" prop="timeType">
            <template slot-scope="scope">
              <div>
                {{ getTimeTypeWord(scope.row) }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column label="门店使用" min-width="200">
            <template slot-scope="scope">
              <div v-if="scope.row.conConmoney == '1'">
                消费满{{ scope.row.minMoney }}元可用
              </div>
              <div v-if="scope.row.conIsserv != '1'">
                {{
                  scope.row.conIsserv == '2' ? '全部项目可用' : '部分项目可用'
                }}
              </div>
              <div v-if="scope.row.conIsproduct != '1'">
                {{
                  scope.row.conIsproduct == '2'
                    ? '全部产品可用'
                    : '部分产品可用'
                }}
              </div>
              <div v-if="scope.row.conIspackage != '1'">
                {{
                  scope.row.conIspackage == '2'
                    ? '全部套餐可用'
                    : '部分套餐可用'
                }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column
            label="领取量"
            min-width="80"
            prop="code"></yid-table-column>
          <yid-table-column
            label="已使用"
            min-width="80"
            prop="code"></yid-table-column>
          <yid-table-column label="状态" min-width="80" prop="status">
            <template slot-scope="scope">
              {{ getStatusWord(scope.row.status) }}
            </template>
          </yid-table-column>
          <yid-table-column
            label="修改人"
            min-width="100"
            prop="updatedBy"></yid-table-column>
          <yid-table-column
            label="修改时间"
            min-width="110"
            prop="updatedTime"></yid-table-column>
          <yid-table-column label="操作" min-width="120" prop="code">
            <template slot-scope="scope">
              <el-link type="primary" @click="showEditPage(scope.row)">
                {{
                  scope.row.status == '0' ||
                  scope.row.status == '1' ||
                  scope.row.status == '2'
                    ? '编辑'
                    : '查看'
                }}</el-link
              >
              <el-link
                type="primary"
                v-if="scope.row.status != '3'"
                @click="changeStatus(scope.row)"
                style="margin-left: 6px">
                {{
                  scope.row.status == '0' || scope.row.status == '2'
                    ? '发布'
                    : '停用'
                }}</el-link
              >
              <el-link
                style="margin-left: 6px"
                type="primary"
                @click="showRecordsDialog(scope.row)"
                >明细</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="showEdit">
        <EditCoupon ref="editEditCoupon" @onClose="closeEditPage($event)" />
      </div>
    </el-collapse-transition>

    <yid-dialog
      :title="recordsDialog.title"
      :visible.sync="recordsDialog.visible"
      @close="cancelRecordsDialog"
      width="1100px">
      <el-form inline :model="recordSearchForm" ref="recordSearchForm">
        <el-form-item label="活动名称：" prop="maname">
          <el-select
            clearable
            v-model.trim="recordSearchForm.maname"
            @clear="clearFormRecordName"
            filterable
            :filter-method="filterActivity"
            placeholder="请选择活动"
            style="width: 215px">
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.name"
              v-for="item in filterActivityList">
              <span style="float: right; color: #8492a6; font-size: 13px">{{
                item.name
              }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            clearable
            v-model="recordSearchForm.status"
            placeholder="请选择状态"
            style="width: 120px">
            <el-option label="未使用" value="1"></el-option>
            <el-option label="已使用" value="2"></el-option>
            <el-option label="已过期" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="领取日期：" prop="getDateRange">
          <el-date-picker
            :clearable="true"
            v-model="recordSearchForm.getDateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="使用日期：" prop="useDateRange">
          <el-date-picker
            :clearable="true"
            v-model="recordSearchForm.useDateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发券门店：">
          <el-select
            clearable
            v-model.trim="recordSearchForm.shopid"
            placeholder="请选择"
            style="width: 160px"
            @clear="clearFormShopList"
            filterable
            :filter-method="filterShop">
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
          <el-button type="primary" @click="searchRecords()">查询</el-button>
        </el-form-item>
      </el-form>

      <yid-table pagination ref="recordsTable" style="margin-top: 10px">
        <yid-table-column
          label="活动名称"
          min-width="80"
          prop="maname"></yid-table-column>
        <yid-table-column
          label="优惠券券码"
          min-width="80"
          prop="bcode"></yid-table-column>
        <yid-table-column label="状态" min-width="80" prop="status">
          <template slot-scope="scope">
            {{ getUseStatusName(scope.row.status) }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="领取时间"
          min-width="80"
          prop="createdTime"></yid-table-column>
        <yid-table-column
          label="会员id"
          min-width="80"
          prop="memid"></yid-table-column>
        <yid-table-column
          label="会员名"
          min-width="80"
          prop="memname"></yid-table-column>
        <yid-table-column
          label="手机号"
          min-width="80"
          prop="mobile"></yid-table-column>
        <yid-table-column
          label="发券单号"
          min-width="80"
          prop="sbillcode"></yid-table-column>
        <yid-table-column
          label="发券门店"
          min-width="80"
          prop="shopname"></yid-table-column>
        <yid-table-column
          label="消费单号"
          min-width="80"
          prop="billcode"></yid-table-column>
        <yid-table-column label="使用时间" min-width="80" prop="updatedTime">
          <template slot-scope="scope">
            {{ scope.row.status == '2' ? scope.row.updatedTime : '' }}
          </template>
        </yid-table-column>
        <yid-table-column label="使用门店" prop="useShop"></yid-table-column>
      </yid-table>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import EditCoupon from './components/editCoupon'
export default {
  name: 'coupon',
  components: {
    EditCoupon
  },
  data() {
    return {
      showList: true,
      showEdit: false,
      pageInfo: { page: 1, limit: 10 },
      searchForm: {
        pcodename: '',
        status: '',
        isOnline: '',
        brandId: null
      },
      brandList: [],
      ShopList: [],
      filterShopList: [],
      recordsDialog: {
        visible: false,
        title: '优惠券明细',
        recordsData: [],
        pageInfo: { page: 1, limit: 10 }
      },
      recordSearchForm: {
        shopid: '',
        cpcode: '',
        maname: '',
        status: '',
        getDateRange: [],
        useDateRange: []
      },
      allActivityList: [],
      filterActivityList: []
    }
  },
  mounted() {
    this.getBrandList()
    this.getData()
    this.getAllActivityList()
    service.chain.shop.shopList({ status: '1' }).then(res => {
      if (res.resp_code == 200) {
        this.ShopList = res.data
        this.filterShopList = res.data
      }
    })
  },
  methods: {
    getData(reqParams) {
      const fetch = service.chain.coupon.search
      const params = { ...this.pageInfo, ...reqParams, ...this.searchForm }
      this.$refs.table.loadData({
        fetch,
        params
      })
    },
    search() {
      this.$refs.table.clearData()
      this.pageInfo = { page: 1, limit: 10 }
      this.getData()
    },
    getStatusWord(status) {
      switch (status) {
        case '0':
          return '未发布'
        case '1':
          return '已发布'
        case '2':
          return '已停用'
        case '3':
          return '已过期'
        default:
          return '未知'
      }
    },
    changeStatus(row) {
      let tips =
        row.status == '0' || row.status == '2'
          ? '保存发布后，优惠券将不能再次编辑！'
          : '停用后，活动中有赠送该券的将停止赠送，但不影响已领取优惠券的使用，确定要停用吗？'
      yid.util.confirm(tips, '', '', () => {
        let reqParam = {}
        reqParam.id = row.id
        reqParam.status = row.status == '0' || row.status == '2' ? '1' : '2'
        service.chain.coupon.changeStatus(reqParam).then(res => {
          if (res.resp_code == 200) {
            yid.util.success('修改成功')
            this.getData()
          }
        })
      })
    },
    getTimeTypeWord(row) {
      if (row.timeType == '1') {
        return (
          $yid.util.formatDate(row.sdate) +
          '至' +
          $yid.util.formatDate(row.edate)
        )
      } else if (row.timeType == '2') {
        let afterDay = row.afterDay
        let expiryDay = row.expiryDay
        return afterDay == 0
          ? '当天有效，有效期' + expiryDay + '天'
          : '领取' + afterDay + '天后起用，有效期' + expiryDay + '天'
      } else if (row.timeType == '3') {
        let afterDay = row.afterDay
        let expiryDay = row.expiryDay
        return afterDay == 0
          ? '当天有效，有效期' + expiryDay + '个月'
          : '领取' + afterDay + '天后起用，有效期' + expiryDay + '个月'
      } else if (row.timeType == '0') {
        return '不限'
      }
    },
    showEditPage(data) {
      this.showList = false
      this.showEdit = true
      this.$refs.editEditCoupon.originData = null
      this.$refs.editEditCoupon.initData(data)
    },
    closeEditPage(flushType) {
      this.showList = true
      this.showEdit = false
      if (flushType != '0') {
        this.getData()
      }
    },
    async showRecordsDialog(data) {
      this.recordSearchForm.cpcode = data.cpcode
      this.recordsDialog.recordsData = []
      this.recordsDialog.pageInfo = { page: 1, limit: 10 }
      this.recordsDialog.visible = true
      await this.getRecordList()
    },
    cancelRecordsDialog() {
      this.recordsDialog.visible = false
    },
    getUseStatusName(type) {
      switch (type) {
        case '1':
          return '未使用'
        case '2':
          return '已使用'
        case '3':
          return '已过期'
        default:
          return '未知'
      }
    },
    getBrandList() {
      service.chain.brand.brandList({ isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.brandList = res.data
        }
      })
    },
    getAllActivityList() {
      service.chain.mktactiv.listAll().then(res => {
        if (res.resp_code == 200) {
          this.filterActivityList = res.data
          this.allActivityList = Object.assign(this.filterActivityList) //保留原数据
        }
      })
    },
    filterActivity(v) {
      this.filterActivityList = this.allActivityList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.name.indexOf(v) !== -1) return true
      })
    },
    clearFormShopList() {
      this.recordSearchForm.shopid = null
      this.filterShopList = this.ShopList
    },
    filterShop(v) {
      this.filterShopList = this.ShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    clearFormRecordName() {
      this.recordSearchForm.maname = ''
      this.filterActivityList = Object.assign(this.allActivityList)
    },
    searchRecords() {
      this.$refs.recordsTable.clearData()
      this.recordsDialog.pageInfo = { page: 1, limit: 10 }
      this.getRecordList()
    },
    async getRecordList(reqParams) {
      const fetch = service.member.couponinfo.getCouponRecordForChain
      const params = { ...this.recordsDialog.pageInfo, ...reqParams }
      params.shopid = this.recordSearchForm.shopid
      params.cpcode = this.recordSearchForm.cpcode
      params.maname = this.recordSearchForm.maname
      params.status = this.recordSearchForm.status
      if (this.recordSearchForm.getDateRange) {
        params.getDateStr = this.recordSearchForm.getDateRange[0]
        params.getDateEnd = this.recordSearchForm.getDateRange[1]
      }
      if (this.recordSearchForm.useDateRange) {
        params.useDateStr = this.recordSearchForm.useDateRange[0]
        params.useDateEnd = this.recordSearchForm.useDateRange[1]
      }
      if (this.$refs.recordsTable != null) {
        await this.$refs.recordsTable.reloadData({
          fetch,
          params
        })
      }
    }
  }
}
</script>

<style scoped></style>
