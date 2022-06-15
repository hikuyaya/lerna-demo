<template>
  <div class="Rq">
    <el-collapse-transition>
      <div v-show="showList">
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

          <el-form-item label="日期：" prop="rq" label-width="100px">
            <div class="block">
              <el-date-picker
                :clearable="true"
                style="width: 150px"
                v-model="searchForm.rq"
                type="date"
                fromat="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="日期">
              </el-date-picker>
            </div>
          </el-form-item>
          <el-form-item label="门店编码：" prop="shopcode" label-width="100px">
            <el-input
              clearable
              v-model="searchForm.shopcode"
              placeholder="门店编码"
              style="width: 180px"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button @click="search" type="primary">查询</el-button>
            <el-button @click="rest" type="primary">重置</el-button>
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
              <span v-if="scope.row.status == 3">已复核</span>
              <span v-if="scope.row.status == 9">已作废</span>
            </template>
          </yid-table-column>
          <yid-table-column
            prop="auditBy"
            label="审核人"
            width="120"></yid-table-column>
          <yid-table-column prop="auditTime" label="审核日期" width="150">
            <template slot-scope="scope">
              {{ $yid.util.formatDate(scope.row.auditTime) }}
            </template>
          </yid-table-column>
          <yid-table-column
            prop="money"
            label="金额"
            width="100"></yid-table-column>
          <yid-table-column
            prop="rejectmemo"
            label="驳回原因"
            width="100"></yid-table-column>
          <yid-table-column label="操作" min-width="150" fixed="right">
            <template slot-scope="scope">
              <el-link
                type="primary"
                v-if="scope.row.status != '1'"
                @click="editBill(scope.row)"
                >查看</el-link
              >
            </template>
          </yid-table-column>
        </yid-table>
      </div>
    </el-collapse-transition>
    <el-collapse-transition>
      <div v-show="!showList">
        <el-button @click="back" type="primary">返回</el-button>
        <el-button v-show="isEdit" @click="auditBill" type="primary"
          >复核</el-button
        >
        <el-button
          v-show="isEdit"
          @click="openRject"
          style="background-color: red; color: white"
          >驳回</el-button
        >
        <el-button
          v-show="isCancel"
          @click="cancelFhBill"
          style="background-color: red; color: white"
          >取消复核</el-button
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
            <div style="width: 250px; display: inline-block"></div>
          </div>
          <div class="container">
            <div style="width: 210px; display: inline-block">
              审核状态：{{
                billForm.status == '2'
                  ? '已审核'
                  : billForm.status == '3'
                  ? '已复核'
                  : billForm.status == '9'
                  ? '已作废'
                  : '未审核'
              }}
            </div>
            <div style="width: 210px; display: inline-block">
              审核人：{{ billForm.auditBy }}
            </div>
            <div style="width: 250px; display: inline-block">
              审核时间：{{ billForm.auditTime }}
            </div>
            <div style="width: 250px; display: inline-block">
              日&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;期：
              <el-date-picker
                :disabled="true"
                :clearable="true"
                style="width: 150px"
                v-model="billForm.rq"
                type="date"
                fromat="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                placeholder="日期">
              </el-date-picker
              >&nbsp;&nbsp;<font color="red">*</font>
            </div>
          </div>
        </el-form>
        <div style="margin-top: -5px">
          <el-divider />
        </div>
        <el-form ref="billForm" :model="billForm" label-width="140px">
          <el-row :gutter="20">
            <el-col :span="16">
              <el-form-item label="门店编码：" prop="shopcode" :disabled="true">
                {{ billForm.shopcode }}
              </el-form-item>

              <el-form-item
                label="申请金额："
                width="150"
                prop="money"
                :rules="[{ required: true, message: '申请金额为空' }]">
                <el-input v-model="billForm.money" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="">
                本店余额为：大额备用金余额为：{{ billForm.breservfund }} ;
                日常备用金余额为：{{ billForm.sreservfund }}
              </el-form-item>
              <el-form-item
                label="经办人"
                width="150"
                prop="eecode"
                :rules="[{ required: true, message: '请选择经办人' }]">
                <el-input v-model="billForm.eename" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item
                label="证明人"
                width="150"
                prop="zeecode"
                :rules="[{ required: true, message: '请选择证明人' }]">
                <el-input
                  v-model="billForm.zeename"
                  :disabled="true"></el-input>
              </el-form-item>
              <el-form-item
                label="备用金类型："
                prop="type"
                :rules="[{ required: true, message: '请选择备用金类型' }]">
                <el-select
                  value-key="id"
                  placeholder="请选择"
                  :disabled="true"
                  v-model.trim="billForm.type">
                  <el-option label="日常备用金" value="1"></el-option>
                  <el-option label="大额备用金" value="2"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="申请原因："
                prop="reason"
                :rules="[{ required: true, message: '申请原因为空' }]">
                <el-input
                  :disabled="true"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  placeholder="请输入内容"
                  v-model="billForm.reason">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import ElButton from '../../library/components/button/button'

export default {
  components: { ElButton },
  name: 'fundhcBill',
  data() {
    return {
      pageInfo: { page: 1, limit: 10, isDel: '0' },
      searchForm: {
        shopcode: '',
        billcode: '',
        auditBy: '',
        status: '',
        auditTimeRange: [],
        shopid: '',
        rq: ''
      },
      statusList: [
        {
          value: '1',
          label: '未审核'
        },
        {
          value: '2',
          label: '已审核'
        },
        {
          value: '3',
          label: '已复核'
        },
        {
          value: '4',
          label: '已驳回'
        },
        {
          value: '9',
          label: '已作废'
        }
      ],
      billForm: {
        id: '',
        shopid: '',
        shopcode: '',
        shopname: '',
        shopType: '',
        brandId: '',
        brandCode: '',
        billcode: '',
        type: '',
        createdBy: '',
        createdTime: '',
        status: '',
        auditBy: '',
        auditTime: '',
        money: '',
        rq: '',
        reason: '',
        rejectmemo: '',
        eeid: '',
        eecode: '',
        eename: '',
        zeeid: '',
        zeecode: '',
        zeename: ''
      },

      employeeDataAll: [],
      fundshop: {},
      showList: true,
      isEdit: true,
      isCancel: false,
      rules: {}
    }
  },
  mounted() {},
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
      reqObj.shopcode = this.searchForm.shopcode
      if (yid.util.isEmpty(this.searchForm.rq)) {
      }
      //$yid.util.formatTime
      reqObj.rq = this.searchForm.rq
      return reqObj
    }
  },
  methods: {
    rest() {
      this.$refs['searchForm'].resetFields()
      this.searchForm.auditTimeRange = []
    },
    getData(reqParams) {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      const fetch = service.finance.fundhcSpBill.billList
      const params = { ...this.pageInfo, ...reqParams }
      params.isDel = '0'
      this.$refs.table.reloadData({
        fetch,
        params
      })
    },
    search() {
      /*if(yid.util.isEmpty(this.searchForm.auditTimeRange)){
                    yid.util.error("审核时间为必填");
                    return;
                }*/
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize
      this.getData(this.searchFormReq)
    },

    queryFundshopData(shopcode) {
      service.finance.fundhcSpBill
        .queryFundShop({ shopcode: shopcode })
        .then(res => {
          if (res.resp_code == '200') {
            this.fundshop = res.data
            this.billForm.breservfund = this.fundshop.breservfund
            this.billForm.sreservfund = this.fundshop.sreservfund
          } else {
            yid.util.error(res.resp_msg)
          }
        })
    },

    back() {
      this.search()
      this.showList = true
    },

    editBill(row) {
      this.billForm.id = row.id
      this.billForm.billcode = row.billcode
      this.billForm.shopcode = row.shopcode
      this.billForm.type = row.type
      this.billForm.createdBy = row.createdBy
      this.billForm.createdTime = row.createdTime
      this.billForm.status = row.status
      this.billForm.auditBy = row.auditBy
      this.billForm.auditTime = row.auditTime
      this.billForm.money = row.money
      this.billForm.rq = row.rq
      ;(this.billForm.reason = row.reason),
        (this.billForm.rejectmemo = row.rejectmemo),
        (this.billForm.eeid = row.eeid),
        (this.billForm.eecode = row.eecode),
        (this.billForm.eename = row.eename),
        (this.billForm.zeeid = row.zeeid),
        (this.billForm.zeecode = row.zeecode),
        (this.billForm.zeename = row.zeename),
        (this.showList = false)
      this.isEdit = row.status == '2'
      this.isCancel = row.status == '3'
      this.queryFundshopData(row.shopcode)
    },

    auditBill() {
      let id = this.billForm.id
      let billcode = this.billForm.billcode
      let status = this.billForm.status
      if (!yid.util.isEmpty(billcode)) {
        yid.util.confirm(
          '您确定要复核[' + billcode + ']的单据?',
          '',
          '',
          () => {
            if (status == '3') {
              yid.util.error('已复核的单据不能再次进行复核')
              return
            } else {
              //调用审核单据接口
              service.finance.fundhcSpBill
                .auditFhBill({ id: id, billcode: billcode })
                .then(res => {
                  if (res.resp_code == '200') {
                    yid.util.success('复核成功')
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
    },

    cancelFhBill() {
      let id = this.billForm.id
      let billcode = this.billForm.billcode
      let status = this.billForm.status
      if (!yid.util.isEmpty(billcode)) {
        yid.util.confirm(
          '您确定要取消复核[' + billcode + ']的单据?',
          '',
          '',
          () => {
            if (status == '2') {
              yid.util.error('未复核的单据不能取消复核')
              return
            } else {
              //调用取消复核单据接口
              service.finance.fundhcSpBill
                .cancelFhBill({ id: id, billcode: billcode })
                .then(res => {
                  if (res.resp_code == '200') {
                    yid.util.success('取消复核成功')
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
        yid.util.error('请先查询单据!')
        return
      }
    },

    openRject() {
      this.$prompt('', '请输入驳回原因', {
        confirmButtonText: '确定',
        cancelButtonText: '取消'
        // inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        // inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          if (!yid.util.isEmpty(value)) {
            this.billForm.rejectmemo = value
            this.rejectBill()
          } else {
            yid.util.error('请先填写驳回原因')
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          })
        })
    },

    rejectBill() {
      let id = this.billForm.id
      let billcode = this.billForm.billcode
      let status = this.billForm.status
      let rejectmemo = this.billForm.rejectmemo
      if (status == '3') {
        yid.util.error('已复核的单据不能驳回')
        return
      }
      if (status == '4') {
        yid.util.error('已驳回的单据不能重复驳回')
        return
      }
      //调用驳回单据接口
      service.finance.fundhcSpBill
        .rejectBill({ id: id, billcode: billcode, rejectmemo: rejectmemo })
        .then(res => {
          if (res.resp_code == '200') {
            yid.util.success('驳回成功')
            this.showList = true
            this.search()
          } else {
            yid.util.error(res.resp_msg)
          }
        })
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
