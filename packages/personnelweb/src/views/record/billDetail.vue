<template>
  <span class="billDetail">
    <el-page-header @back="goBack" content="详情页面"> </el-page-header>
    <el-row
      v-if="this.pageName !== 'onlineSale'"
      style="text-align: right; margin-top: 20px">
      <template v-if="this.baseData.entryData.eeSign">
        <el-button @click="qianm">查看签名</el-button>
      </template>
      <template v-if="!this.baseData.entryData.eeSign"> 暂未签名 </template>
      <el-button @click="get">打印小票</el-button>
      <el-button
        v-if="this.baseData.entryData.isHc == '0'"
        @click="editBillTotal"
        type="primary"
        >保存</el-button
      >
    </el-row>
    <el-form ref="ruleForm" label-width="100px">
      <el-form-item
        v-if="
          this.baseData.entryData.isHc == '1' && this.pageName !== 'onlineSale'
        "
        label="撤单时间：">
        {{ this.baseData.entryData.hcTime }}
      </el-form-item>
      <el-form-item
        v-if="
          this.baseData.entryData.isHc == '1' && this.pageName !== 'onlineSale'
        "
        label="撤单人：">
        {{ this.baseData.entryData.hcBy }}
      </el-form-item>
      <el-form-item
        v-if="
          this.baseData.entryData.isHc == '1' && this.pageName !== 'onlineSale'
        "
        label="撤单备注：">
        {{ this.baseData.entryData.hcMemo }}
      </el-form-item>
      <el-form-item label="服务单号：" v-if="this.pageName !== 'onlineSale'">
        {{ this.baseData.entryData.billcode }}
      </el-form-item>
      <el-form-item
        label="线上客装销售单号："
        class="onlinedh"
        v-else
        style="width: 300px">
        {{ this.baseData.entryData.billcode }}
      </el-form-item>
      <el-form-item label="客户信息：" v-if="this.pageName !== 'onlineSale'">
        {{
          this.baseData.entryData.custname
            ? this.baseData.entryData.custname
            : this.baseData.entryData.memName
        }}&nbsp;
        {{
          getSexName(
            this.baseData.entryData.custsex
              ? this.baseData.entryData.custsex
              : this.baseData.entryData.sex
          )
        }}&nbsp;
        {{
          this.baseData.entryData.custtel
            ? this.baseData.entryData.custtel
            : this.baseData.entryData.mobile
        }}&nbsp;
        {{
          this.baseData.entryData.cardInfo == null
            ? ''
            : '【' +
              this.baseData.entryData.cardInfo +
              ' ' +
              this.baseData.entryData.cmcode +
              '】'
        }}
        {{ this.isgx == '1' ? '(共享卡)' : '' }}
        {{
          this.baseData.entryData.dawncmcode
            ? '关联实体卡:' + this.baseData.entryData.dawncmcode
            : ''
        }}
      </el-form-item>
      <el-form-item label="顾客信息：" v-else>
        {{
          this.baseData.entryData.custname
            ? this.baseData.entryData.custname
            : this.baseData.entryData.memname
        }}&nbsp;
        {{
          getSexName(
            this.baseData.entryData.custsex
              ? this.baseData.entryData.custsex
              : this.baseData.entryData.sex
          )
        }}&nbsp;
        {{
          this.baseData.entryData.custtel
            ? this.baseData.entryData.custtel
            : this.baseData.entryData.mobile
        }}&nbsp;
      </el-form-item>
      <el-form-item label="提货方式：" v-if="this.pageName === 'onlineSale'">
        {{
          this.baseData.entryData.pickWay == 0
            ? '物流部邮寄'
            : this.baseData.entryData.pickWay == 1
            ? '到店自提'
            : ''
        }}
      </el-form-item>
      <el-form-item label="消费时间：" v-if="this.pageName !== 'onlineSale'">
        {{ this.baseData.entryData.saleTime }}
      </el-form-item>

      <el-form-item label="计客数：" v-if="this.pageName !== 'onlineSale'">
        {{ getIsCompute(this.baseData.entryData.isCompute) }}
      </el-form-item>
      <el-form-item label="顾客来源：" v-if="this.pageName !== 'onlineSale'">
        {{ this.baseData.entryData.mccname }}
      </el-form-item>
      <el-form-item
        v-show="this.baseData.entryData.memid && this.pageName !== 'onlineSale'"
        label="开单方式：">
        <div v-if="this.baseData.entryData.isread == '0'">未读卡</div>
        <div v-if="this.baseData.entryData.isread == '1'">读卡</div>
        <div v-if="this.baseData.entryData.isread == '2'">扫码</div>
      </el-form-item>
      <el-form-item
        v-show="
          this.baseData.entryData.yycode && this.pageName !== 'onlineSale'
        "
        label="预约单据：">
        {{ this.baseData.entryData.yycode }}&nbsp;&nbsp;&nbsp;&nbsp;{{
          this.baseData.entryData.yydcname
        }}
      </el-form-item>
      <el-form-item
        v-if="this.pageName === 'onlineSale'"
        class="onlinetime"
        label="提货时间/核销时间: "
        style="width: 300px">
        {{ this.baseData.entryData.updatedTime }}
      </el-form-item>
      <el-form-item label="消费详情：" v-if="this.pageName !== 'onlineSale'">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="sname" label="消费内容" width="180">
            <template slot-scope="scope">
              {{ scope.row.sname
              }}{{
                scope.row.norms == undefined || scope.row.norms == ''
                  ? ''
                  : '(' + scope.row.norms + ')'
              }}{{ scope.row.isgx && scope.row.isgx == '1' ? '(共享)' : '' }}
            </template>
          </el-table-column>
          <el-table-column prop="stype" label="消费类型" width="180">
            <template slot-scope="scope">
              {{ scope.row.stype == '1' ? '项目' : '客装' }}
              {{ scope.row.isKeep == '0' ? '' : '(寄存)' }}
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量" width="100">
          </el-table-column>
          <el-table-column prop="ysje" label="总金额">
            <template slot-scope="scope">
              ￥{{
                keepTwoDecimal(Number(scope.row.num) * Number(scope.row.price))
              }}
            </template>
          </el-table-column>
          <el-table-column prop="additional" label="加收/扣减">
            <template slot-scope="scope">
              <span v-if="scope.row.additional == 0">0</span>
              <span v-if="scope.row.additional != 0">
                <span v-if="scope.row.additionaltype == 1"
                  >+{{ scope.row.additional }}</span
                >
                <span v-if="scope.row.additionaltype == 2"
                  >-{{ scope.row.additional }}</span
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="eename" label="服务人员">
            <template slot-scope="scope">
              <span v-for="royaltys in scope.row.royaltyList"
                >第{{ royaltys.postion }}工位：{{ royaltys.eecode }}
                {{ royaltys.eename }}<br
              /></span>
              <span
                ><el-link
                  v-if="baseData.entryData.isHc == '0'"
                  type="primary"
                  :underline="false"
                  @click="editBill(scope.row)"
                  >编辑</el-link
                ></span
              >
              <!--<span><el-link type="primary" :underline="false">编辑</el-link></span>-->
            </template>
          </el-table-column>
          <el-table-column prop="performance" label="业绩">
            <template slot-scope="scope">
              <span v-for="royaltys in scope.row.royaltyList"
                >￥{{ royaltys.yj }} {{ getisAppoint(royaltys.isApppoint) }}<br
              /></span>
            </template>
          </el-table-column>
          <!--<el-table-column
                          prop="royalty"
                          label="提成">
                      <template slot-scope="scope">
                          <span v-for="royaltys in scope.row.royaltyList">￥{{royaltys.royalty == null ? 0 :royaltys.royalty}}<br></span>
                      </template>
                  </el-table-column>-->
        </el-table>
      </el-form-item>
      <!--  线上客装销售  -->
      <el-form label="" v-else>
        <el-table
          :data="this.tablelist"
          border
          style="width: 80%; margin-left: 30px">
          <el-table-column prop="pid" label="客装" style="width: 40%">
            <template slot-scope="scope">
              {{ scope.row.pcode + ' ' + scope.row.pname }}
            </template>
          </el-table-column>
          <el-table-column prop="num" label="数量" style="width: 30%">
            <template slot-scope="scope">
              {{ scope.row.num }}
            </template>
          </el-table-column>
          <el-table-column prop="hjbillje" label="总金额" style="width: 30%">
            <template slot-scope="scope">
              {{ scope.row.hjbillje }}
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <!--<el-form-item label="消费总金额：">
              ￥{{this.baseData.entryData.totalMoney}}
          </el-form-item>
          <el-form-item label="入账总金额：">
              ￥{{this.baseData.entryData.hjysje == null ? 0 : this.baseData.entryData.hjysje}}
          </el-form-item>-->
      <el-form-item label="支付方式：" v-if="this.pageName !== 'onlineSale'">
        <span>单据金额：￥{{ this.baseData.entryData.totalMoney }}</span>
        <div style="border-top: 1px solid #333; width: 250px" />
        <span v-if="Number(this.baseData.entryData.zkePop) > 0"
          >活动折扣 -￥{{ this.baseData.entryData.zkePop }}<br
        /></span>
        <span v-if="Number(this.baseData.entryData.zkeHyq) > 0"
          >优惠券 -￥{{ this.baseData.entryData.zkeHyq }} {{ coupons }}<br />
        </span>
        <span v-for="pays in this.baseData.entryData.payList"
          >{{ pays.payname }} ￥{{ pays.money
          }}{{ pays.isdf == '1' || pays.isgx == '1' ? '(代付)' : '' }}<br
        /></span>
        <div style="border-top: 1px solid #333; width: 250px" />
        <span
          >应收金额：￥{{
            this.baseData.entryData.hjbillje
          }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消费金额：￥{{
            this.baseData.entryData.hjbillje
          }}</span
        >
      </el-form-item>
      <el-form-item
        label="支付方式："
        class="onlinezf"
        style="display: flex; margin-top: 2vh"
        v-else>
        <span>单据金额：￥{{ this.baseData.entryData.totalMoney }}</span
        ><br />
        <span
          >骁骁网: ￥{{ this.baseData.entryData.xxwbusinesslog.paymoney }}</span
        >
      </el-form-item>
      <el-form-item label="营销活动：" v-if="this.pageName !== 'onlineSale'">
        <div v-for="activitythis in this.baseData.entryData.serviceActivity">
          <span v-show="activitythis.popname">
            {{ activitythis.popname }}(合计折扣:
            {{ activitythis.zkePop }} 赠送内容:
            {{ activitythis.zsdescription }})
          </span>
        </div>
      </el-form-item>
      <el-form-item label="核销记录：" v-if="this.pageName !== 'onlineSale'">
        <span v-for="paynos in this.baseData.entryData.paynoList">
          <span v-show="paynos.paycode == '27'">
            美团:{{ paynos.payno }} <br />
          </span>
          <span v-show="paynos.paycode == '35'">
            骁骁网:{{ paynos.payno }} <br />
          </span>
        </span>
      </el-form-item>
      <el-form-item label="核销记录：" v-else>
        <span
          >骁骁网: {{ this.baseData.entryData.xxwbusinesslog.billcode }}</span
        >
      </el-form-item>
      <el-form-item label="服务单评价：" v-if="this.pageName !== 'onlineSale'">
        {{ getRate(this.baseData.entryData.rate) }}
      </el-form-item>
      <el-form-item label="单据备注：" v-if="this.pageName !== 'onlineSale'">
        {{ this.baseData.entryData.memo }}
      </el-form-item>
      <el-form-item label="是否为补单：" v-if="this.pageName !== 'onlineSale'">
        <span v-show="this.baseData.entryData.isBill == '0'">否</span>
        <span v-show="this.baseData.entryData.isBill == '1'"
          >是&nbsp;&nbsp;{{ this.baseData.entryData.refBillcode }}</span
        >
      </el-form-item>
      <el-form-item
        v-if="
          this.baseData.entryData.shopcode.startsWith('MF') &&
          this.pageName !== 'onlineSale'
        "
        label="顾客类型：">
        <span v-show="this.baseData.entryData.customerType == '0'">储值客</span>
        <span v-show="this.baseData.entryData.customerType == '1'">团购客</span>
        <span v-show="this.baseData.entryData.customerType == '2'"
          >非储值客</span
        >
      </el-form-item>
      <el-form-item label="操作人：" v-if="this.pageName === 'onlineSale'">
        {{ this.baseData.entryData.createdBy }}
      </el-form-item>
      <el-form-item label="温馨提示: " v-if="this.pageName === 'onlineSale'">
        <br />
        <span
          >请门店店员与顾客确认后，操作提货；提货成功后，不提供退换货服务!</span
        >
      </el-form-item>
    </el-form>

    <yid-dialog
      :title="editDialog.title"
      :visible.sync="editDialog.visible"
      width="550px">
      <span
        >项目名称:{{ editForm.sname }}&nbsp;&nbsp;&nbsp;&nbsp;消费金额:￥{{
          editForm.money
        }}</span
      ><br /><br />

      <template v-for="station in stations">
        <div>
          <div>
            第{{
              station.postion
            }}工位：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置业绩(输入的金额必须大于0)
            是否指定:
          </div>
          <template :index="index" v-for="(ees, index) in editRow.royaltyList">
            <div
              v-if="station.postion === ees.postion"
              style="margin: 5px 0 5px 0">
              <el-select
                placeholder="请选择"
                v-model="editForm.eeyjList[index].eeid"
                style="width: 120px">
                <template v-for="psls in station.pslist">
                  <template v-for="emp in employeeList">
                    <div v-if="emp.psid === psls.psid">
                      <el-option
                        :key="emp.id"
                        :label="emp.eename"
                        :value="emp.id"></el-option>
                    </div>
                  </template>
                </template> </el-select
              >&nbsp;&nbsp;
              <el-input
                v-model="editForm.eeyjList[index].performance"
                style="width: 150px"></el-input
              >&nbsp;&nbsp;
              <el-select
                placeholder="请选择"
                v-model="editForm.eeyjList[index].isApppoint"
                style="width: 100px">
                <el-option
                  v-for="item in apppoints"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"></el-option> </el-select
              >&nbsp;&nbsp;
              <el-link type="primary" @click="delEmployee(ees, index)"
                >删除</el-link
              >
            </div>
          </template>
          <div>
            <el-link type="primary" @click="addEmployee(station)">添加</el-link>
          </div>
        </div>
      </template>

      <el-row style="text-align: center; margin-top: 20px">
        <el-button @click="editCancel">取消</el-button>
        <el-button @click="editTableData" type="primary">确定</el-button>
      </el-row>
    </yid-dialog>

    <!--签名-->
    <el-dialog
      :visible.sync="centerDialogVisible"
      width="870"
      center
      :show-close="false"
      class="isign">
      <div class="title">
        <ul>
          顾客签名：
        </ul>
        <ul>
          服务人员签名：
        </ul>
      </div>
      <div class="img">
        <img :src="isSign" v-if="isSign" />
        <label v-else>没有签名哦！</label>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        @click="centerDialogVisible = false"
        >关 闭</span
      >
    </el-dialog>
  </span>
</template>

<script>
import service from '@src/service'
import { isEmpty } from '../../library/helper/util'
export default {
  name: 'billDetail',
  props: {
    pageName: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      baseData: {},
      tableData: [],
      editDialog: {
        title: '编辑服务人员',
        visible: false
      },
      editForm: {
        id: '',
        sname: '',
        money: '',
        eeyjList: []
      },
      editRow: {},
      stations: [],
      employeeList: [],
      apppoints: [
        {
          id: '1',
          name: '是'
        },
        {
          id: '0',
          name: '否'
        }
      ],
      centerDialogVisible: false,
      isSign: '',
      coupons: '',
      isgx: '',
      tablelist: []
    }
  },
  mounted() {},
  methods: {
    async initData(obj) {
      this.restData()
      this.baseData = obj

      // console.log(this.pageName)
      if (this.pageName !== 'onlineSale') {
        this.getYjs(this.baseData.entryData.saleTime, this.baseData.billid)
      }
      //  console.log('baseData',this.baseData)
      this.tablelist.push(this.baseData.entryData)
      // console.log(this.baseData.entryData.xxwbusinesslog,this.tablelist)
      if (this.baseData.entryData.couponList.length > 0) {
        let conpon = ''
        this.baseData.entryData.couponList.forEach(c => {
          conpon = conpon + c.cpname + '*' + c.sl + ','
        })
        if (conpon.length > 0) {
          this.coupons = conpon.substr(0, conpon.length - 1)
        }
      } else {
        this.coupons = ''
      }
      if (this.baseData.entryData.memid && this.baseData.entryData.omemid) {
        if (this.baseData.entryData.memid != this.baseData.entryData.omemid) {
          this.isgx = '1'
        }
      }
    },
    /* objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                 console.log(row, rowIndex)
                 if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
                     if (row.rows) { // 如果有值,说明需要合并
                         return [row.rows, 1]
                     } else return [0, 0]
                 }
             },*/
    goBack() {
      this.$emit('onClose')
    },
    getIsCompute(val) {
      let result = '否'
      if (val == '1') {
        result = '是'
      }
      return result
    },
    restData() {
      Object.assign(this.$data, this.$options.data())
    },
    getYjs(saleTime, id) {
      //查询业绩列表
      service.cashier.serviceRecords
        .servicrecordyj({ saleTime: saleTime, id: id })
        .then(res => {
          if (res.resp_code == 200) {
            this.tableData = res.data
            if (this.baseData.entryData.payList.length > 0) {
              this.baseData.entryData.payList.forEach(item => {
                if (item.payname == '套餐' && item.isgx == '1') {
                  this.tableData.forEach(index => {
                    if (index.rowindex == item.rowindex) {
                      index.isgx = '1'
                    }
                  })
                }
              })
            }
          }
        })
    },
    getStations(shopid, code) {
      //获取工位信息
      service.wheelRest
        .station({ shopid: Number(shopid), code: code })
        .then(res => {
          this.stations = res.data.desc
        })
    },
    getEmployeeList(shopid) {
      service.employee.listAll({ shopid: shopid, isDel: '0' }).then(res => {
        this.employeeList = res.data
      })
    },
    getSexName(sex) {
      let res = ''
      if (sex === '1') {
        res = '男'
      } else if (sex === '2') {
        res = '女'
      }
      return res
    },
    getisAppoint(isApppoint) {
      let res = ''
      if (isApppoint === '0') {
        res = '非指定'
      } else if (isApppoint === '1') {
        res = '指定'
      }
      return res
    },
    getRate(rate) {
      let res = ''
      if (rate === '0') {
        res = '不评价'
      } else if (rate === '1') {
        res = '不满意'
      } else if (rate === '2') {
        res = '一般'
      } else if (rate === '3') {
        res = '满意'
      }
      return res
    },
    keepTwoDecimal(num) {
      var result = parseFloat(num)
      if (isNaN(result)) {
        alert('传递参数错误，请检查！')
        return false
      }
      result = Math.round(num * 100) / 100
      return result
    },
    editBill(row) {
      //编辑单据
      this.editRow = row
      this.editForm.sname = this.editRow.sname
      this.editForm.money = this.keepTwoDecimal(
        Number(row.num) * Number(row.price)
      )
      this.editForm.eeyjList = this.editRow.royaltyList
      this.editForm.eeyjList.forEach(data => {
        data.eeid = String(data.eeid)
        data.isApppoint = String(data.isApppoint)
      })
      this.getStations(this.baseData.entryData.shopid, '005')
      this.getEmployeeList(this.baseData.entryData.shopid)
      console.log(this.editRow)
      this.editDialog.visible = true
    },
    editCancel() {
      //查询列表
      this.getYjs(this.baseData.entryData.saleTime, this.baseData.billid)
      this.editDialog.visible = false
    },
    delEmployee(ees, index) {
      this.editRow.royaltyList.splice(index, 1)
    },
    addEmployee(station) {
      let postion = station.postion
      let rowindex = 0
      this.tableData.forEach(data => {
        rowindex = rowindex + data.royaltyList.length
      })
      let srowindex = this.editRow.rowindex
      const royalty = {}
      royalty.postion = postion
      royalty.rowindex = rowindex
      royalty.srowindex = srowindex
      this.editRow.royaltyList.push(royalty)
    },
    editTableData() {
      let sumje1 = 0
      let sumje2 = 0
      let sumje3 = 0

      var ee1 = []
      var ee2 = []
      var ee3 = []

      //获取员工其它信息
      for (let i = 0; i < this.editForm.eeyjList.length; i++) {
        let edit = this.editForm.eeyjList[i]

        if (isEmpty(edit.eeid)) {
          $yid.util.error('请选择员工！')
          return
        }

        if (isEmpty(edit.performance)) {
          $yid.util.error('请输入业绩金额！')
          return
        }

        if (isEmpty(edit.isApppoint)) {
          $yid.util.error('请选择是否指定！')
          return
        }

        this.employeeList.forEach(employee => {
          if (Number(employee.id) === Number(edit.eeid)) {
            edit.eecode = employee.eecode
            edit.eename = employee.eename
            edit.psid = employee.psid
            edit.psname = employee.psname
            edit.pslid = employee.pslid
            edit.pslname = employee.pslname
          }
        })

        if (isNaN(edit.performance)) {
          $yid.util.error('业绩必须输入数字！')
          return
        }

        if (Number(edit.performance) <= 0) {
          $yid.util.error('业绩必须输入大于0的数字！')
          return
        }

        if (edit.postion === 1) {
          sumje1 = sumje1 + Number(edit.performance)
          ee1.push(edit.eecode)
        }
        if (edit.postion === 2) {
          sumje2 = sumje2 + Number(edit.performance)
          ee2.push(edit.eecode)
        }
        if (edit.postion === 3) {
          sumje3 = sumje3 + Number(edit.performance)
          ee3.push(edit.eecode)
        }
      }

      //判断同一个工位是否有重复员工，同一个工位业绩总额是否超出
      if (
        sumje1 > this.editForm.money ||
        sumje2 > this.editForm.money ||
        sumje2 > this.editForm.money
      ) {
        $yid.util.error('同一工位业绩总额不能超过消费总额！')
        return
      }

      if (this.isRepeat(ee1)) {
        $yid.util.error('同一工位存在相同员工！')
        return
      }

      //给列表赋值
      this.editRow.royaltyList = this.editForm.eeyjList

      console.log(this.editRow)

      //隐藏弹出框
      this.editDialog.visible = false
    },
    isRepeat(ary) {
      var flag = false
      var s = ary.join(',') + ','
      for (var i = 0; i < ary.length; i++) {
        if (s.replace(ary[i] + ',', '').indexOf(ary[i] + ',') > -1) {
          flag = true
        }
      }
      return flag
    },
    editBillTotal() {
      //拼接json调用改单方法
      let id = this.baseData.entryData.id
      let royaltyList = []
      this.tableData.forEach(data => {
        data.royaltyList.forEach(res => {
          royaltyList.push(res)
        })
      })
      const param = {}
      param.id = id
      param.eeyjList = royaltyList
      console.log(param)
      service.cashier.serviceRecords.reviseBill(param).then(res => {
        if (res.resp_code == 200) {
          $yid.util.success('操作成功！')
          this.goBack()
        } else {
          $yid.util.error(res.resp_msg)
        }
      })
    },
    qianm() {
      this.centerDialogVisible = true
      this.isSign = this.baseData.entryData.eeSign
    }
  }
}
</script>

<style lang="scss" scoped>
//签名
.isign {
  /deep/.el-dialog__header {
    display: none;
  }
  /deep/.el-dialog__body {
    padding: 0;
    .title {
      display: flex;
      ul {
        flex: 1;
      }
    }
    .img {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 300px;
      width: 100%;

      overflow: hidden;
      div {
        width: 100%;
        overflow: hidden;
        img {
          width: 100%;
          height: 300px;
          overflow: hidden;
        }
      }
    }
  }
}
.onlinedh {
  /deep/ .el-form-item__label {
    width: 160px !important;
  }
}
.onlinetime {
  /deep/ .el-form-item__label {
    width: 150px !important;
  }
}
.onlinezf {
  /deep/ .el-form-item__content {
    margin-left: 0px !important;
  }
}
</style>
