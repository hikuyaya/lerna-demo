<template>
  <div>
    <el-alert title="" type="info" :closable="false">
      总部短信余量<span style="color: red; font-size: 16px">{{
        msgAllowanceObj && msgAllowanceObj.num ? msgAllowanceObj.num : 0
      }}</span
      >条

      <el-button
        type="primary"
        @click="showAssignDialog"
        style="margin-left: 16px"
        >短信分配</el-button
      >
    </el-alert>

    <el-form
      ref="searchForm"
      inline
      :model="assignForm"
      style="margin-top: 8px">
      <el-form-item label="充值记录：" prop="sTimeRange">
        <div class="block">
          <el-date-picker
            :clearable="false"
            v-model="assignForm.sTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </div>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button @click="assignSearch" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <yid-table pagination ref="table">
      <yid-table-column
        label="门店编码"
        min-width="100"
        prop="shopcode"></yid-table-column>
      <yid-table-column
        label="门店名称"
        min-width="100"
        prop="shopname"></yid-table-column>
      <yid-table-column
        label="分配短信数量(条)"
        min-width="100"
        prop="num"></yid-table-column>
      <yid-table-column
        label="时间"
        min-width="100"
        prop="createdTime"></yid-table-column>
      <yid-table-column
        label="操作人"
        min-width="100"
        prop="createdBy"></yid-table-column>
    </yid-table>

    <yid-dialog
      :title="assignDialog.title"
      :visible.sync="assignDialog.visible"
      @close=""
      width="750px">
      <el-form ref="searchForm" inline :model="searchForm">
        <el-form-item label="门店：">
          <el-input
            clearable
            v-model.trim="searchForm.pcodename"
            placeholder="门店编码/名称"
            style="width: 180px"></el-input
        ></el-form-item>
        <el-form-item label="业务类型：">
          <el-select
            clearable
            filterable
            v-model="searchForm.type"
            placeholder="请选择业务类型"
            style="width: 160px">
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.id"
              v-for="item in btypeList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-bottom: 0"
          ><el-button @click="search" type="primary"
            >查询</el-button
          ></el-form-item
        >
      </el-form>
      <yid-table ref="assignTable" :data="smsShopList">
        <yid-table-column
          label="门店编码"
          min-width="100"
          prop="shopcode"></yid-table-column>
        <yid-table-column
          label="门店名称"
          min-width="100"
          prop="shopname"></yid-table-column>
        <yid-table-column label="业务类型" min-width="100" prop="type">
          <template slot-scope="scope">
            {{ getTypeName(scope.row.type) }}
          </template>
        </yid-table-column>
        <yid-table-column
          label="现有短信数量（条）"
          min-width="100"
          prop="num"></yid-table-column>
        <yid-table-column
          label="分配短信数量（条）"
          min-width="100"
          prop="count">
          <template slot-scope="scope">
            <el-input-number
              min="0"
              v-model="scope.row.assignCount"></el-input-number>
          </template>
        </yid-table-column>
      </yid-table>
      <el-row gutter="20" style="margin-top: 8px">
        <el-col :span="10"
          ><el-button plain @click="closeAssignDialog">取消</el-button></el-col
        >
        <el-col :span="10"
          ><el-button type="primary" @click="confirmAssign"
            >确认</el-button
          ></el-col
        >
      </el-row>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
export default {
  name: 'msgAssign',
  data() {
    return {
      msgAllowanceObj: {},
      assignDialog: {
        visible: false,
        title: '短信分配'
      },
      smsShopList: [],
      searchForm: {
        pcodename: null,
        type: null
      },
      assignForm: {
        sTimeRange: []
      },
      pageInfo: { page: 1, limit: 10 },
      btypeList: [],
      typeList: [
        { value: '1', name: '美发' },
        { value: '2', name: '美容' },
        { value: '3', name: '综合' }
      ]
    }
  },
  mounted() {
    this.getMsgAllowance()
    this.getBtypeAll()
    this.getAssignList()
  },
  methods: {
    getAssignList(reqParams) {
      const fetch = service.push.smsAccount.assignListForChain
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    assignSearch() {
      this.pageInfo = { page: 1, limit: 10 }
      let reqObj = {}
      let sTimeRange = this.assignForm.sTimeRange
      if (sTimeRange) {
        reqObj.pTimeStart = this.assignForm.sTimeRange[0]
        reqObj.pTimeEnd = this.assignForm.sTimeRange[1]
      }
      this.getAssignList(reqObj)
    },
    getBtypeAll() {
      service.chain.btype.btypeAllList({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.btypeList = res.data
        }
      })
    },
    getMsgAllowance() {
      let that = this
      service.chain.smsAllowance.getSmsAllowanceByTenement().then(res => {
        if (res.resp_code == 200) {
          that.msgAllowanceObj = res.data
        }
      })
    },
    showAssignDialog() {
      this.assignDialog.visible = true
      this.getSmsShopList()
    },
    closeAssignDialog() {
      this.assignDialog.visible = false
    },
    confirmAssign() {
      let that = this
      let count = 0
      let assignShopList = []
      that.smsShopList.map(item => {
        if (item && item.assignCount > 0) {
          count += item.assignCount
          assignShopList.push(item)
        }
      })
      if (count == 0) {
        that.assignDialog.visible = false
      } else if (count > that.msgAllowanceObj.num) {
        $yid.util.error(
          '总部短信数量不足，请调整分店分配数量！可供分配数量：' +
            that.msgAllowanceObj.num +
            ' 现分配数量：' +
            count
        )
      } else {
        service.push.smsShop
          .batchAssignForChain({ smsShops: assignShopList })
          .then(res => {
            if (res.resp_code == 200) {
              this.pageInfo = { page: 1, limit: 10 }
              this.getMsgAllowance()
              this.getAssignList()
              that.assignDialog.visible = false
            }
          })
      }
    },
    getSmsShopList(params) {
      let that = this
      service.push.smsShop.listAllForChain(params).then(res => {
        if (res.resp_code == 200) {
          that.smsShopList = res.data
        }
      })
    },
    search() {
      this.getSmsShopList(this.searchForm)
    },
    getTypeName(type) {
      let result = '未知'
      for (let i = 0; i < this.btypeList.length; i++) {
        if (this.btypeList[i].id == type) {
          return this.btypeList[i].name
        }
      }
      return result
    }
  }
}
</script>

<style scoped></style>
