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
          <el-form-item label="红包：">
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
        <yid-table ref="table" style="margin-top: 10px" pagination>
          <yid-table-column label="发放渠道" min-width="80" prop="isOnline">
            <template slot-scope="scope">
              <div v-if="scope.row.isOnline == '1'">线上</div>
              <div v-if="scope.row.isOnline == '0'">线下</div>
            </template>
          </yid-table-column>
          <yid-table-column
            label="编码"
            min-width="80"
            prop="rcode"></yid-table-column>
          <yid-table-column
            label="门店品牌"
            min-width="80"
            prop="brandName"></yid-table-column>
          <yid-table-column
            label="红包名称"
            min-width="80"
            prop="rname"></yid-table-column>
          <yid-table-column label="价值" min-width="80" prop="money">
            <template slot-scope="scope">
              {{ scope.row.money + '元' }}
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
              <div v-if="scope.row.ismanytimes == '1'">可分多次消费</div>
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
                }}
              </el-link>
              <el-link
                v-if="scope.row.status != '3'"
                type="primary"
                @click="changeStatus(scope.row)"
                style="margin-left: 6px">
                {{
                  scope.row.status == '0' || scope.row.status == '2'
                    ? '发布'
                    : '停用'
                }}
              </el-link>
              <el-link
                style="margin-left: 6px"
                type="primary"
                @click="showRecordsDialog(scope.row)"
                >明细
              </el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-collapse-transition>
      <div v-show="showEdit">
        <EditRedEnvelope
          ref="editRedEnvelope"
          @onClose="closeEditPage($event)" />
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
        <el-form-item label="发布门店：">
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

      <yid-table ref="recordsTable" style="margin-top: 10px" pagination>
        <yid-table-column
          label="活动名称"
          min-width="80"
          prop="maname"></yid-table-column>
        <yid-table-column
          label="红包码"
          min-width="80"
          prop="bcode"></yid-table-column>
        <!--<yid-table-column label="会员名称" min-width="80" prop="shopcode"></yid-table-column>-->
        <yid-table-column
          label="剩余金额"
          min-width="80"
          prop="ye"></yid-table-column>
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
        <yid-table-column label="状态" min-width="80" prop="status">
          <template slot-scope="scope">
            {{ getUseStatusName(scope.row.status) }}
          </template>
        </yid-table-column>
        <yid-table-column label="使用记录" min-width="80">
          <template slot-scope="scope">
            <el-button type="text" @click="expandRecord(scope.row)"
              >查看</el-button
            >
          </template>
        </yid-table-column>
        <yid-table-column type="expand" width="1">
          <template slot-scope="scope">
            <el-table
              :data="scope.row.recordsList"
              max-height="250"
              border
              style="width: 100%">
              <el-table-column prop="billcode" label="消费单号" width="180">
              </el-table-column>
              <el-table-column prop="money" label="使用金额" width="180">
              </el-table-column>
              <el-table-column prop="createdTime" label="使用时间">
              </el-table-column>
              <el-table-column width="100" prop="shopname" label="使用门店">
              </el-table-column>
            </el-table>
          </template>
        </yid-table-column>
      </yid-table>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import EditRedEnvelope from './components/editRedEnvelope'

export default {
  name: 'redEnvelope',
  components: {
    EditRedEnvelope
  },
  data() {
    return {
      showList: true,
      showEdit: false,
      pageInfo: { page: 1, limit: 10 },
      searchForm: {
        pcodename: '',
        status: '',
        brandId: null,
        isOnline: ''
      },
      brandList: [],
      ShopList: [],
      filterShopList: [],
      recordsDialog: {
        visible: false,
        title: '红包明细',
        recordsData: [],
        pageInfo: { page: 1, limit: 10 }
      },
      recordSearchForm: {
        shopid: '',
        rcode: '',
        maname: '',
        status: '',
        getDateRange: []
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
      const fetch = service.chain.redEnvelopeInfo.search
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
    searchRecords() {
      this.$refs.recordsTable.clearData()
      this.recordsDialog.pageInfo = { page: 1, limit: 10 }
      this.getRecordList()
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
          ? '保存发布后，红包将不能再次编辑！'
          : '停用后，活动中有赠送该红包的将停止赠送，但不影响已领取红包的使用，确定要停用吗？'

      yid.util.confirm(tips, '', '', () => {
        let reqParam = {}
        reqParam.id = row.id
        reqParam.status = row.status == '0' || row.status == '2' ? '1' : '2'
        service.chain.redEnvelopeInfo.changeStatus(reqParam).then(res => {
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
      } else if (row.timeType == '0') {
        return '不限'
      }
    },
    showEditPage(data) {
      this.showList = false
      this.showEdit = true
      this.$refs.editRedEnvelope.originData = null
      this.$refs.editRedEnvelope.initData(data)
    },
    async showRecordsDialog(data) {
      this.recordSearchForm.rcode = data.rcode
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
    expandRecord(row) {
      let dataList = this.$refs.recordsTable.getCurData()
      dataList.map(item => {
        if (row.id != item.id) {
          this.$refs.recordsTable.toggleRowExpansion(item, false)
        }
      })
      this.$refs.recordsTable.toggleRowExpansion(row)
    },
    closeEditPage(flushType) {
      this.showList = true
      this.showEdit = false
      if (flushType != '0') {
        this.getData()
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
    async getRecordList(reqParams) {
      const fetch = service.member.redEnvelopeInfo.getRedEnvelopeRecordForChain
      const params = { ...this.recordsDialog.pageInfo, ...reqParams }
      params.shopid = this.recordSearchForm.shopid
      params.rcode = this.recordSearchForm.rcode
      params.maname = this.recordSearchForm.maname
      params.status = this.recordSearchForm.status
      if (this.recordSearchForm.getDateRange) {
        params.getDateStr = this.recordSearchForm.getDateRange[0]
        params.getDateEnd = this.recordSearchForm.getDateRange[1]
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
