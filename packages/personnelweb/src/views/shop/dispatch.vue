<template>
  <div class="dispatchBill">
    <el-collapse-transition>
      <div v-show="showList">
        <el-button @click="addBill" type="primary">新建单据</el-button>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="searchForm" inline :model="searchForm">
          <el-form-item label="单据编码：" prop="billcode">
            <el-input
              clearable
              v-model="searchForm.billcode"
              placeholder="单据编码"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="创建日期：" prop="createTimeRange">
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
          <el-form-item label="审核日期：" prop="auditTimeRange">
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
          <el-form-item label="门店：" prop="shopid">
            <el-select
              clearable
              v-model.trim="searchForm.shopid"
              filterable
              :filter-method="filterShop"
              placeholder="请选择门店"
              style="width: 160px">
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
          <el-form-item label="开始卡号：" prop="startno">
            <el-input
              clearable
              v-model="searchForm.startno"
              placeholder="开始卡号"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="结束卡号：" prop="endno">
            <el-input
              clearable
              v-model="searchForm.endno"
              placeholder="结束卡号"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="search" type="primary">查询</el-button>
            <el-button @click="reset" type="primary">重置</el-button>
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
          <yid-table-column prop="createdTime" label="制单日期" width="180">
            <template slot-scope="scope">
              {{ $yid.util.formatTime(scope.row.createdTime) }}
            </template>
          </yid-table-column>
          <yid-table-column
            prop="updatedBy"
            label="修改人"
            width="120"></yid-table-column>
          <yid-table-column prop="updatedTime" label="修改日期" width="180">
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
          <yid-table-column prop="auditTime" label="审核日期" width="180">
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
                >编辑
              </el-link>
              <el-link
                v-if="scope.row.status == '2'"
                type="primary"
                @click="editBill(scope.row)"
                >查看
              </el-link>
              <el-link
                v-if="scope.row.status == '1'"
                type="primary"
                @click="deleteBillrow(scope.row)"
                style="margin-left: 15px"
                >删除
              </el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button v-show="showButton" @click="saveBill" type="primary"
          >保存</el-button
        >
        <el-button v-show="isSp" @click="auditBill" type="primary"
          >审核</el-button
        >
        <el-button v-show="isSp" @click="deleteBill" type="primary"
          >删除</el-button
        >
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form
          ref="billForm"
          :model="billForm"
          style="margin-top: 16px"
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
            <div style="width: 210px; display: inline-block">
              审核人：{{ billForm.auditBy }}
            </div>
            <div style="width: 250px; display: inline-block">
              审核时间：{{ billForm.auditTime }}
            </div>
          </div>
        </el-form>
        <el-row style="text-align: left; margin-top: 10px">
          <el-link type="primary" v-if="showButton" @click="addRow"
            >添加门店</el-link
          >
        </el-row>
        <yid-table
          ref="itemTable"
          style="margin-top: 15px"
          :data="billForm.details">
          <yid-table-column label="店号" width="150" prop="shopcode">
            <template slot-scope="scope">
              <el-input
                :disabled="!showButton"
                v-model="scope.row.shopcode"
                @blur="setShopName(scope.row)"></el-input>
            </template>
          </yid-table-column>
          <yid-table-column
            label="店名"
            width="220"
            prop="shopname"></yid-table-column>
          <yid-table-column label="开始卡号" width="240" prop="startno">
            <template slot-scope="scope">
              <el-input
                type="number"
                :disabled="!showButton"
                :precision="2"
                :min="1"
                :max="9999999999"
                @blur="countEndNo(scope.row)"
                v-model="scope.row.startno"></el-input>
            </template>
          </yid-table-column>
          <yid-table-column label="分拨卡张数" width="200" prop="count">
            <template slot-scope="scope">
              <el-input
                type="number"
                :disabled="!showButton"
                :precision="2"
                :min="1"
                @change="countEndNo(scope.row)"
                v-model="scope.row.count"></el-input>
            </template>
          </yid-table-column>
          <yid-table-column
            label="结束卡号"
            width="160"
            prop="endno"></yid-table-column>
          <yid-table-column label="操作" width="100" prop="operating">
            <template slot-scope="scope">
              <el-button
                :disabled="!showButton"
                v-model="scope.$index"
                type="text"
                @click="delRow(scope.$index)"
                >删除
              </el-button>
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import cache from '@src/library/helper/cache'
import type from '@src/type'

export default {
  name: 'dispatchBill',
  data() {
    return {
      showList: true,
      pageInfo: {
        page: 1,
        limit: 10,
        isDel: '0'
      },
      searchForm: {
        billcode: '',
        auditBy: '',
        status: '',
        createTimeRange: [],
        auditTimeRange: [],
        shopid: '',
        startno: '',
        endno: ''
      },
      statusList: [
        {
          value: '',
          label: '全部'
        },
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
        billid: '',
        createdBy: null,
        createdTime: null,
        details: []
      },
      allShopList: [],
      filterShopList: [],
      showButton: true,
      isSp: false
    }
  },
  mounted() {
    this.getShopList({ status: '1' })
    this.search()
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      reqObj.billcode = this.searchForm.billcode
      reqObj.shopid = this.searchForm.shopid
      reqObj.status = this.searchForm.status
      reqObj.startno = this.searchForm.startno
      reqObj.endno = this.searchForm.endno
      if (
        this.searchForm.createTimeRange != null &&
        this.searchForm.createTimeRange.length > 0
      ) {
        reqObj.createTimeStart = this.searchForm.createTimeRange[0]
        reqObj.createTimeEnd = this.searchForm.createTimeRange[1] + ' 23:59:59'
      } else {
        reqObj.createTimeStart = ''
        reqObj.createTimeEnd = ''
      }
      if (
        this.searchForm.auditTimeRange != null &&
        this.searchForm.auditTimeRange.length > 0
      ) {
        reqObj.auditTimeStart = this.searchForm.auditTimeRange[0]
        reqObj.auditTimeEnd = this.searchForm.auditTimeRange[1] + ' 23:59:59'
      } else {
        reqObj.auditTimeStart = ''
        reqObj.auditTimeEnd = ''
      }
      return reqObj
    }
  },
  methods: {
    getShopList(params) {
      service.chain.shop.shopList(params).then(res => {
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
    reset() {
      this.searchForm.billcode = ''
      this.searchForm.auditBy = ''
      this.searchForm.status = ''
      this.searchForm.createTimeRange = []
      this.searchForm.auditTimeRange = []
      this.searchForm.shopcode = ''
      this.searchForm.startno = ''
      this.searchForm.endno = ''
    },
    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.dispatch.page
      const params = { ...this.pageInfo, ...reqParams }
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
    back() {
      this.showList = true
      this.search()
    },
    addBill() {
      this.billForm.id = null
      this.billForm.billcode = ''
      this.billForm.createdBy = null
      this.billForm.createdTime = null
      this.billForm.status = '1'
      this.billForm.auditBy = null
      this.billForm.auditTime = null
      this.billForm.details = []
      this.showList = false
      this.showButton = true
      this.isSp = false
    },
    addRow() {
      this.billForm.details.push({
        shopid: '',
        shopcode: '',
        shopname: '',
        startno: '',
        count: '',
        endno: ''
      })
    },
    setShopName(row) {
      let flag = true
      this.filterShopList.forEach(each => {
        if (each.shopcode == row.shopcode) {
          row.shopid = each.id
          row.shopname = each.shopname
          flag = false
        }
      })
      if (flag) {
        row.shopid = ''
        row.shopname = ''
        yid.util.error('没找到店号:' + row.shopcode)
      }
      this.$forceUpdate()
    },
    delRow(index) {
      this.billForm.details.splice(index, 1) //移除删除的项目
    },
    countEndNo(row) {
      if (row.startno) {
        if (row.startno.length != 10) {
          yid.util.error('卡号必须10位数')
          row.startno = ''
        } else if (row.count) {
          if (row.count.length > 3) {
            yid.util.error('分拨卡张数不能大于3位数')
            row.count = '1'
          }
          let code = ''
          let endno = Number(row.startno) + Number(row.count) - 1
          if (row.startno.length > String(endno).length) {
            for (
              let j = 0;
              j < row.startno.length - String(endno).length;
              j++
            ) {
              code += '0'
            }
            endno = code + endno
          }
          row.endno = endno
        }
        this.$forceUpdate()
      }
    },
    editBill(row) {
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.createdBy = row.createdBy
      this.billForm.createdTime = row.createdTime
      this.billForm.status = row.status
      this.billForm.auditBy = row.auditBy
      this.billForm.auditTime = row.auditTime
      service.dispatch.getDetail(row.id).then(res => {
        if (res.resp_code == 200) {
          this.showList = false
          this.showButton = row.status == '1'
          this.isSp = row.status == '1'
          this.billForm.details = res.data
        } else {
          $yid.util.error(res.resp_msg)
        }
      })
    },
    deleteBillrow(row) {
      if (!yid.util.isEmpty(row.billcode)) {
        yid.util.confirm(
          '您确定要删除[' + row.billcode + ']的单据?',
          '',
          '',
          () => {
            service.dispatch.deleteBill(row.id).then(res => {
              if (res.resp_code == '200') {
                yid.util.success('删除成功!')
                this.search()
              } else {
                yid.util.error(res.resp_msg)
              }
            })
          }
        )
      }
    },
    deleteBill() {
      if (!yid.util.isEmpty(this.billForm.billcode)) {
        yid.util.confirm(
          '您确定要删除[' + this.billForm.billcode + ']的单据?',
          '',
          '',
          () => {
            service.dispatch.deleteBill(this.billForm.id).then(res => {
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
    saveBefore() {
      if (this.billForm.details.length == 0) {
        yid.util.error('请填写明细')
        return false
      }
      let value = true
      this.billForm.details.forEach((each, index) => {
        if (!each.shopcode) {
          yid.util.error('第' + (index + 1) + '行请输入店号')
          value = false
        }
        if (!each.shopname) {
          yid.util.error('第' + (index + 1) + '行请输入正确店号')
          value = false
        }
        if (!each.startno) {
          yid.util.error('第' + (index + 1) + '行请输入开始卡号')
          value = false
        }
        if (!each.count) {
          yid.util.error('第' + (index + 1) + '行请输入分拨张数')
          value = false
        } else if (each.count > 100) {
          yid.util.error('第' + (index + 1) + '行请输入分拨张数不能大于200')
          value = false
        }
      })
      return value
    },
    saveBill() {
      if (!this.saveBefore()) return
      service.dispatch.saveBill(this.billForm).then(res => {
        if (res.resp_code == '200') {
          this.billForm = res.data
          this.isSp = true
          yid.util.success('保存成功')
        } else {
          yid.util.error(res.resp_msg)
        }
      })
    },
    auditBill() {
      if (!this.saveBefore()) return
      const that = this
      if (!yid.util.isEmpty(that.billForm.billcode)) {
        yid.util.confirm(
          '您确定要审核[' + that.billForm.billcode + ']的单据?',
          '',
          '',
          () => {
            if (that.billForm.status == '2') {
              yid.util.error('已审核的单据不能再次进行审核')
              return
            } else {
              // 保存
              service.dispatch.saveBill(that.billForm).then(res => {
                if (res.resp_code == '200') {
                  //调用审核单据接口
                  service.dispatch.auditBill(that.billForm).then(res => {
                    if (res.resp_code == '200') {
                      yid.util.success('审核成功')
                      that.showButton = false
                      that.isSp = false
                    } else {
                      yid.util.error(res.resp_msg)
                    }
                  })
                } else {
                  yid.util.error(res.resp_msg)
                  return
                }
              })
            }
          }
        )
      } else {
        yid.util.error('单据保存后再进行审核!')
        return
      }
    },
    getnowDate() {
      let d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate()
      if (Number(month) < 10) {
        month = '0' + month
      }
      if (Number(day) < 10) {
        day = '0' + day
      }
      let datenow = year + '-' + month + '-' + day
      return datenow
    },
    getcreateDate(d) {
      d.setMonth(d.getMonth() - 3)
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate()
      if (Number(month) < 10) {
        month = '0' + month
      }
      if (Number(day) < 10) {
        day = '0' + day
      }
      let datenow = year + '-' + month + '-' + day
      return datenow
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
