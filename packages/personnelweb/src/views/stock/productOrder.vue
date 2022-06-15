<template>
  <div class="productOrder">
    <el-collapse-transition>
      <div v-show="showList">
        <el-button @click="addBill" type="primary">新增要货申请</el-button>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="申请单号：" prop="billcode">
            <el-input
              v-model="searchForm.billcode"
              clearable
              style="width: 150px"></el-input>
          </el-form-item>
          <el-form-item label="申请日期：" prop="createTimeRange">
            <div class="block">
              <el-date-picker
                :clearable="true"
                v-model="searchForm.createTimeRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="审核日期：" prop="sTimeRange">
            <div class="block">
              <el-date-picker
                :clearable="true"
                v-model="searchForm.sTimeRange"
                type="daterange"
                value-format="yyyy-MM-dd"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
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
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
          </el-form-item>
        </el-form>
        <yid-table ref="table" pagination style="width: 100%; margin-top: 20px">
          <yid-table-column
            prop="billcode"
            label="申请单号"
            width="180"></yid-table-column>
          <yid-table-column
            prop="shopname"
            label="申请门店"
            width="150"></yid-table-column>
          <yid-table-column
            prop="createdBy"
            label="申请人"
            width="120"></yid-table-column>
          <yid-table-column prop="createdTime" label="申请时间" width="180">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.createdTime) }}
            </template>
          </yid-table-column>
          <yid-table-column
            prop="memo"
            label="备注"
            width="200"></yid-table-column>
          <yid-table-column prop="status" label="状态" width="120">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 1">未提交</span>
              <span v-if="scope.row.status == 2">待审核</span>
              <span v-if="scope.row.status == 3">已审核</span>
            </template>
          </yid-table-column>
          <yid-table-column
            prop="check"
            label="审核人"
            width="100"></yid-table-column>
          <yid-table-column prop="checkDate" label="审核时间" width="180">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.checkDate) }}
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status == '1'"
                type="text"
                @click="editBill(scope.row)"
                style="margin-left: 6px"
                >编辑</el-button
              >
              <el-button
                v-if="scope.row.status == '1'"
                type="text"
                @click="deleteBill(scope.row)"
                style="margin-left: 6px; color: red"
                >删除</el-button
              >
              <el-button
                v-if="scope.row.status != '1'"
                type="text"
                @click="showBill(scope.row)"
                style="margin-left: 6px"
                >明细</el-button
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back">返回</el-button>
        <el-button
          v-show="showButton"
          @click="alertProductDialog"
          type="primary"
          >选择产品</el-button
        >&nbsp;&nbsp;&nbsp;
        <el-button
          v-show="showButton"
          @click="removeProduct"
          style="background-color: red; color: white"
          >批量移除产品</el-button
        >&nbsp;&nbsp;&nbsp;
        <el-button v-show="showButton" @click="saveBill" type="primary"
          >保存</el-button
        >
        <el-button v-show="showButton" @click="auditBill" type="primary"
          >提交</el-button
        >
        <el-button v-show="!showButton" @click="excel" type="primary"
          >导出</el-button
        >
        <el-form
          ref="billForm"
          :model="billForm"
          style="margin-top: 16px"
          :rules="rules"
          label-width="100px"
          label-position="right">
          <span style="width: 150px">申请单号：{{ billForm.billcode }}</span
          >&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="width: 200px"
            >订货门店：{{ billForm.shopcode }}&nbsp;&nbsp;{{
              billForm.shopname
            }}</span
          >&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="width: 200px">申请时间：{{ billForm.createdTime }}</span
          >&nbsp;&nbsp;&nbsp;&nbsp;
          <span style="width: 200px"
            >申请人：{{ billForm.opercode }} {{ billForm.oper }}</span
          ><br />&nbsp;&nbsp;&nbsp;&nbsp;
          <span
            >备注：<el-input
              :disabled="!showButton"
              v-model="billForm.memo"
              type="textarea"
              :rows="1"
              placeholder="备注"
              style="width: 60%" />
          </span>
        </el-form>
        <yid-table
          v-show="showButton"
          ref="itemTable"
          style="margin-top: 15px"
          :data="orderitemData"
          @selection-change="handleSelectionChange">
          <yid-table-column type="selection" width="55"></yid-table-column>
          <yid-table-column
            label="产品编码"
            min-width="120"
            prop="pcode"></yid-table-column>
          <yid-table-column
            label="产品名称"
            min-width="200"
            prop="pname"></yid-table-column>
          <yid-table-column
            label="规格"
            min-width="100"
            prop="norms"></yid-table-column>
          <yid-table-column
            label="单位"
            min-width="100"
            prop="unit"></yid-table-column>
          <yid-table-column
            label="门店当前库存"
            min-width="100"
            prop="stock"></yid-table-column>
          <yid-table-column label="要货数" min-width="100" prop="num">
            <template slot-scope="scope">
              <el-input
                onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
                type="number"
                v-model="scope.row.num"></el-input>
            </template>
          </yid-table-column>
          <yid-table-column label="操作" min-width="100" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="deleteProuct(scope.$index, scope.row)"
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
          :data="orderitemData"
          @selection-change="handleSelectionChange">
          <yid-table-column
            label="产品编码"
            min-width="120"
            prop="pcode"></yid-table-column>
          <yid-table-column
            label="产品名称"
            min-width="200"
            prop="pname"></yid-table-column>
          <yid-table-column
            label="规格"
            min-width="100"
            prop="norms"></yid-table-column>
          <yid-table-column
            label="单位"
            min-width="100"
            prop="unit"></yid-table-column>
          <yid-table-column
            label="门店当前库存"
            min-width="100"
            prop="stock"></yid-table-column>
          <yid-table-column
            label="要货数量"
            min-width="100"
            prop="num"></yid-table-column>
          <yid-table-column
            label="发货数量"
            min-width="100"
            prop="sendnum"></yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>

    <el-dialog
      :title="productDialog.title"
      :visible.sync="productDialog.visible"
      width="850px">
      <div style="display: flex">
        <el-tree
          :data="categoryData"
          :props="defaultProps"
          :default-expand-all="true"
          style="width: 200px"
          @node-click="handleNodeClick">
        </el-tree>
        <yid-table
          ref="productData"
          :data="productData"
          style="margin-top: 15px; flex: 1; margin-left: 20px"
          @selection-change="handleSelectionChange">
          <yid-table-column type="selection" width="55"></yid-table-column>
          <yid-table-column
            label="产品编码"
            min-width="120"
            prop="pcode"></yid-table-column>
          <yid-table-column
            label="产品名称"
            min-width="150"
            prop="pname"></yid-table-column>
          <yid-table-column
            label="规格"
            min-width="100"
            prop="norms"></yid-table-column>
          <yid-table-column
            label="单位"
            min-width="100"
            prop="unit"></yid-table-column>
        </yid-table>
      </div>
      <el-row style="text-align: center; margin-top: 20px">
        <el-button type="primary" @click="addProduct">确定</el-button>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import { mapGetters } from 'vuex'
import download from '@src/library/http/download'

export default {
  name: 'productOrder',
  data() {
    return {
      categoryData: [],
      productData: [],
      showList: true,
      showButton: true,
      searchForm: {
        billcode: '',
        createTimeRange: [],
        sTimeRange: []
      },
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      billForm: {
        id: '',
        billcode: '',
        shopid: '',
        shopcode: '',
        shopname: '',
        createdTime: '',
        oper: '',
        opercode: '',
        memo: ''
      },
      pageInfo: { page: 0, limit: 10 },
      orderitemData: [],
      statusList: [
        {
          value: '1',
          label: '未提交'
        },
        {
          value: '2',
          label: '待审核'
        },
        {
          value: '3',
          label: '已审核'
        }
      ],
      isSave: false,
      productDialog: {
        title: '添加商品',
        visible: false
      },
      selectProducts: []
    }
  },
  mounted() {
    this.getData()
    //this.getUserInfo();
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      reqObj.billcode = this.searchForm.billcode
      reqObj.status = this.searchForm.status
      let createTimeRange = this.searchForm.createTimeRange
      if (createTimeRange) {
        reqObj.sCreatedTimeStart = this.searchForm.createTimeRange[0]
        reqObj.sCreatedTimeEnd = this.searchForm.createTimeRange[1]
      } else {
        reqObj.sCreatedTimeStart = ''
        reqObj.sCreatedTimeEnd = ''
      }
      let sTimeRange = this.searchForm.sTimeRange
      if (sTimeRange) {
        reqObj.sSTimeStart = this.searchForm.sTimeRange[0]
        reqObj.sSTimeEnd = this.searchForm.sTimeRange[1]
      } else {
        reqObj.sSTimeStart = ''
        reqObj.sSTimeEnd = ''
      }
      return reqObj
    },
    ...mapGetters({
      user: 'user/user'
    })
  },
  methods: {
    getUserInfo() {
      service.user.userInfo().then(res => {
        // yid.cache.set(yid.type.USER.APPID,  res.data.appId, yid.type.SYSTEM.CACHE.LOCAL_STORAGE)
        console.log('user', res.data)
        this.$store.commit('user/setUserInfo', res.data)
        //console.log('getters', this.$store.getters);
      })
    },
    getTreeAll() {
      service.productCategory.treeAll({}).then(res => {
        if (res.resp_code == 200) {
          this.categoryData = res.data
        }
      })
    },
    handleNodeClick(data) {
      console.log(data)
      if (data.type === '1') {
        yid.util.alert('请选择子节点进行查询')
        return false
      }
      let categrory = data.id
      //通过id查询商品列表
      service.stock.product
        .allList({ categrory: categrory, status: '1' })
        .then(res => {
          if (res.resp_code == 200) {
            this.productData = res.data
          }
        })
    },
    handleSelectionChange(rows) {
      this.selectProducts = rows
    },
    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.chain.productOrder.orderList
      const params = { ...this.pageInfo, ...reqParams }
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    addBill() {
      //清空列表和form
      this.orderitemData = []
      this.billForm.id = ''
      this.billForm.billcode = ''
      this.billForm.shopcode = ''
      this.billForm.shopid = ''
      this.billForm.shopname = ''
      this.billForm.oper = ''
      this.billForm.opercode = ''
      this.billForm.createdTime = ''
      this.billForm.memo = ''
      this.productDialog.visible = false
      this.productData = []
      this.showList = false
      this.showButton = true
      this.isSave = false
    },
    back() {
      if (this.isSave) {
        this.showList = true
        this.search()
      } else {
        yid.util.confirm(
          '页面上有新编辑内容未保存，是否保存后再退出？',
          '',
          '',
          () => {
            if (this.orderitemData.length == 0) {
              yid.util.alert('请添加商品')
              return false
            }
            //调用保存方法
            this.saveBill()
            this.showList = true
          },
          () => {
            this.search()
            this.showList = true
          }
        )
      }
    },
    addProduct() {
      if (this.selectProducts.length == 0) {
        yid.util.alert('请选择至少一个商品')
        return
      }
      for (let n = 0; n < this.orderitemData.length; n++) {
        let pcode = this.orderitemData[n].pcode
        for (let i = 0; i < this.selectProducts.length; i++) {
          let item = this.selectProducts[i]
          if (item.pcode == pcode) {
            yid.util.alert(
              '列表中存在【' + this.orderitemData[n].pname + '】不能再次添加'
            )
            return false
          }
        }
      }
      this.orderitemData = this.orderitemData.concat(this.selectProducts)
      this.productDialog.visible = false
    },
    search() {
      this.getData(this.searchFormReq)
    },
    alertProductDialog() {
      this.getTreeAll()
      this.productData = []
      this.productDialog.visible = true
    },
    saveBill() {
      if (this.orderitemData.length == 0) {
        yid.util.alert('请添加商品')
        return false
      }
      for (let n = 0; n < this.orderitemData.length; n++) {
        let num = this.orderitemData[n].num
        if (num == null || num == '' || num.length == 0 || num <= 0) {
          yid.util.alert('要货数为必填大于0的整数')
          return false
        }
      }
      //调用接口进行新增单据
      let order = {}
      order.id = this.billForm.id
      order.memo = this.billForm.memo
      order.billcode = this.billForm.billcode
      order.createdTime = this.billForm.createdTime
      order.isDel = '0'
      order.status = '1'

      const details = []
      for (let i = 0; i < this.orderitemData.length; i++) {
        let item = this.orderitemData[i]
        let detail = {}
        detail.id = ''
        detail.pid = item.pid
        detail.pcode = item.pcode
        detail.pname = item.pname
        detail.barcode = item.barcode
        detail.categrory = item.categrory
        detail.cname = item.cname
        detail.bbid = item.bbid
        detail.brand = item.brand
        detail.bname = item.bname
        detail.unit = item.unit
        detail.norms = item.norms
        detail.cost = item.cost
        detail.price = item.price
        detail.num = item.num
        detail.stock = item.stock
        detail.averageCost = item.averageCost
        detail.money = item.money
        details.push(detail)
      }
      order.details = details
      console.log(order)
      service.chain.productOrder.saveBill(order).then(res => {
        if (res.resp_code == 200) {
          yid.util.success('保存成功!')
          this.billForm.id = res.data.id
          this.billForm.billcode = res.data.billcode
          this.billForm.createdTime = res.data.createdTime
          this.billForm.shopid = res.data.shopid
          this.billForm.shopcode = res.data.shopcode
          this.billForm.shopname = res.data.shopname
          this.billForm.opercode = res.data.opercode
          this.billForm.oper = res.data.oper
          this.billForm.memo = res.data.memo
          this.isSave = true
          this.search()
        }
      })
    },
    auditBill() {
      if (this.billForm.id == '' || this.billForm.id.length == 0) {
        yid.util.alert('请先保存单据再提交!')
        return false
      }
      const billrow = {}
      billrow.id = this.billForm.id
      billrow.billcode = this.billForm.billcode
      service.chain.productOrder.submitBill(billrow).then(res => {
        if (res.resp_code == 200) {
          this.search()
          yid.util.alert('要货单已成功提交到总部，等待总部审核!')
          this.showList = true
          this.showButton = false
        }
      })
    },
    editBill(row) {
      if (row.status != '1') {
        yid.util.alert('未提交的单据才可以编辑')
        return false
      }
      //给from和列表设置值
      this.orderitemData = row.details
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.shopcode = row.shopcode
      this.billForm.shopid = row.shopid
      this.billForm.shopname = row.shopname
      this.billForm.oper = row.oper
      this.billForm.opercode = row.opercode
      this.billForm.createdTime = row.createdTime
      this.billForm.memo = row.memo
      this.productDialog.visible = false
      this.productData = []
      this.showList = false
      this.showButton = true
      this.isSave = false
    },
    deleteBill(row) {
      if (row.status != '1') {
        yid.util.alert('未提交的单据才可以删除')
        return false
      }
      yid.util.confirm('确定删除订货单' + row.billcode + '?', '', '', () => {
        const billrow = {}
        billrow.id = row.id
        billrow.isDel = '1'
        service.chain.productOrder.saveOrUpdate(billrow).then(res => {
          if (res.resp_code == 200) {
            this.search()
          }
        })
      })
    },
    showBill(row) {
      if (row.status == '1') {
        yid.util.alert('未提交的单据不能查看明细')
        return false
      }
      //给from和列表设置值
      this.orderitemData = row.details
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.shopcode = row.shopcode
      this.billForm.shopid = row.shopid
      this.billForm.shopname = row.shopname
      this.billForm.oper = row.oper
      this.billForm.opercode = row.opercode
      this.billForm.createdTime = row.createdTime
      this.billForm.memo = row.memo
      this.productDialog.visible = false
      this.productData = []
      this.showList = false
      this.showButton = false
      this.isSave = true
    },
    deleteProuct(index, row) {
      this.orderitemData.splice(index, 1) //移除删除的产品
    },
    removeProduct() {
      if (this.selectProducts.length === 0) {
        yid.util.alert('请选择需要移除的商品')
        return
      }
      this.selectProducts.forEach(m => {
        this.orderitemData.forEach((p, index) => {
          if (m.id === p.id) {
            this.orderitemData.splice(index, 1)
          }
        })
      })
    },
    excel() {
      if (this.billForm.id == '' || this.billForm.id.length == 0) {
        yid.util.alert('为保存的单据不允许导出!')
        return false
      }
      download(yid.config.API.BASE + 'api-chain/productorderitem/list/excel', {
        poid: this.billForm.id
      })
    }
  }
}
</script>

<style scoped></style>
