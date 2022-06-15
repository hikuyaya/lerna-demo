<template>
  <div class="packagebillDetail">
    <el-page-header @back="goBack" content="详情页面"> </el-page-header>
    <el-row style="text-align: right; margin-top: 20px">
      <template v-if="this.baseData.entryData.eSign">
        <el-button @click="qianm">查看签名</el-button>
      </template>
      <template v-if="!this.baseData.entryData.eSign"> 暂未签名 </template>
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
        v-if="this.baseData.entryData.isHc == '1'"
        label="撤单时间：">
        {{ this.baseData.entryData.hcTime }}
      </el-form-item>
      <el-form-item v-if="this.baseData.entryData.isHc == '1'" label="撤单人：">
        {{ this.baseData.entryData.hcBy }}
      </el-form-item>
      <el-form-item
        v-if="this.baseData.entryData.isHc == '1'"
        label="撤单备注：">
        {{ this.baseData.entryData.hcMemo }}
      </el-form-item>
      <el-form-item label="服务单号：">
        {{ this.baseData.entryData.billcode }}
      </el-form-item>
      <el-form-item label="客户信息：">
        {{ this.baseData.entryData.memName }}
        {{ getSexName(this.baseData.entryData.sex) }}
        {{ this.baseData.entryData.mobile }}
        {{
          this.baseData.entryData.cardname == null
            ? ''
            : '【' +
              this.baseData.entryData.cardname +
              ' ' +
              this.baseData.entryData.cardno +
              '】'
        }}
        {{ this.baseData.entryData.isShare == '1' ? '(共享卡)' : '' }}
      </el-form-item>
      <el-form-item label="消费时间：">
        {{ this.baseData.entryData.updatedTime }}
      </el-form-item>
      <el-form-item label="消费详情：">
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="content" label="消费内容" width="180">
          </el-table-column>
          <el-table-column prop="money" label="金额" width="180">
            <template slot-scope="scope">
              ￥{{ keepTwoDecimal(Number(scope.row.money)) }}
            </template>
          </el-table-column>
          <el-table-column prop="money" label="赠送金额" width="180">
            <template slot-scope="scope">
              <span
                v-show="scope.row.gmoney && baseData.entryData.isHcMkt != '1'">
                ￥{{ keepTwoDecimal(Number(scope.row.gmoney)) }}
              </span>
              <span
                v-show="!scope.row.gmoney || baseData.entryData.isHcMkt == '1'">
                ￥0
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="exprite" label="有效期" width="180">
          </el-table-column>
          <el-table-column prop="eename" label="服务人员">
            <template slot-scope="scope">
              <span v-for="royaltys in scope.row.yjsList"
                >销售：{{ royaltys.eecode }} {{ royaltys.eename }}<br
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
          <el-table-column prop="yjje" label="业绩">
            <template slot-scope="scope">
              <span v-for="royaltys in scope.row.yjsList"
                >￥{{ royaltys.yjje }}<br
              /></span>
            </template>
          </el-table-column>
          <el-table-column prop="royalty" label="提成">
            <template slot-scope="scope">
              <span v-for="royaltys in scope.row.yjsList"
                >￥{{ royaltys.royalty == null ? 0 : royaltys.royalty }}<br
              /></span>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="支付方式：">
        <span>单据金额：￥{{ this.baseData.entryData.money }}</span>
        <div style="border-top: 1px solid #333; width: 250px" />
        <span v-if="Number(this.baseData.entryData.zkeTotal) > 0"
          >优惠券 -￥{{ this.baseData.entryData.zkeTotal }}</span
        ><span v-if="Number(this.baseData.entryData.zkeTotal) > 0"><br /></span>
        <span v-for="pays in this.baseData.entryData.paysList"
          >{{ pays.payname }} ￥{{ pays.payje }}<br
        /></span>
        <div style="border-top: 1px solid #333; width: 250px" />
        <span
          >应收金额：￥{{
            this.baseData.entryData.ysje
          }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消费金额：￥{{
            this.baseData.entryData.ysje
          }}</span
        >
      </el-form-item>
      <el-form-item label="核销记录：">
        <span v-for="pays in this.baseData.entryData.xmdList"
          >{{ pays.paycode == '27' ? '新美大' : '骁骁网' }}：{{
            pays.paymentNo
          }}&nbsp;&nbsp;&nbsp;&nbsp;</span
        >
      </el-form-item>
      <el-form-item label="活动详情：">
        <!--<span v-for="cardzss in this.baseData.entryData.cardZsInfoVOS">
                    <span v-if="cardzss.bcode?true:false">【{{cardzss.maname}}】 {{getcardBtype(cardzss.btype)}}{{cardzss.name}} {{getcardMtype(cardzss.mtype)}}
                        <span v-if="cardzss.money?true:false">￥{{Number(cardzss.money).toFixed(2)}}</span>
                        <span v-if="cardzss.num?true:false">*{{(cardzss.num)}}</span>
                    </span>&nbsp;
                    <span v-if="cardzss.bcode?false:true">{{getcardBtype(cardzss.btype)}}{{cardzss.name}} {{getcardMtype(cardzss.mtype)}}
                        <span v-if="cardzss.money?true:false">￥{{Number(cardzss.money).toFixed(2)}}</span>
                        <span v-if="cardzss.num?true:false">*{{(cardzss.num)}}</span>
                    </span>&nbsp;
                </span>-->
        <div
          class="zengs"
          v-show="
            this.baseData.entryData.isHcMkt != '1' &&
            (Object.keys(this.baseData.entryData.zsinfo).length != 0 ||
              this.baseData.entryData.gmoney)
          ">
          <span class="item" v-show="this.baseData.entryData.mktBillmemo"
            >充值累计单据：
            <label>【{{ this.baseData.entryData.mktBillmemo }}】</label
            >&nbsp;&nbsp;</span
          >
          <span class="item"
            >活动名称：<label
              >【{{ this.baseData.entryData.mktname }}】</label
            ></span
          >
          <span class="item"
            >赠送内容： /
            <label v-show="this.baseData.entryData.gmoney"
              >赠送金：{{ '￥' + this.baseData.entryData.gmoney }} /
            </label>
            <label v-show="this.baseData.entryData.zsinfo.walletname"
              >赠送红包：{{ this.baseData.entryData.zsinfo.walletname }} /
            </label>
            <label v-show="this.baseData.entryData.zsinfo.sername"
              >赠送服务项目：{{ this.baseData.entryData.zsinfo.sername }} /
            </label>
            <label v-show="this.baseData.entryData.zsinfo.productname"
              >赠送产品：{{
                this.baseData.entryData.zsinfo.productname
              }}
              /</label
            >
            <label v-show="this.baseData.entryData.zsinfo.zqname"
              >赠送优惠券：{{ this.baseData.entryData.zsinfo.zqname }} /</label
            >
          </span>
        </div>
      </el-form-item>
      <el-form-item label="单据备注：">
        {{ this.baseData.entryData.billmemo }}
      </el-form-item>
      <el-form-item label="是否为补单：">
        <span v-show="this.baseData.entryData.isBill == '0'">否</span>
        <span v-show="this.baseData.entryData.isBill == '1'"
          >是&nbsp;&nbsp;{{ this.baseData.entryData.refBillcode }}</span
        >
      </el-form-item>
    </el-form>

    <yid-dialog
      :title="editDialog.title"
      :visible.sync="editDialog.visible"
      width="500px">
      <span
        >消费内容:{{ editForm.content }}&nbsp;&nbsp;&nbsp;&nbsp;消费金额:￥{{
          editForm.money
        }}</span
      ><br /><br />

      <template v-for="station in stations">
        <div>
          <div>
            销售：&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置业绩(输入的金额必须大于0)
          </div>
          <template :index="index" v-for="(ees, index) in editRow.yjsList">
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
                v-model="editForm.eeyjList[index].yjje"
                style="width: 150px"></el-input
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
  </div>
</template>

<script>
import service from '@src/service'
import { isEmpty } from '../../library/helper/util'
export default {
  name: 'packagebillDetail',
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
        content: '',
        money: '',
        eeyjList: []
      },
      editRow: {},
      stations: [],
      employeeList: [],
      centerDialogVisible: false,
      isSign: ''
    }
  },
  methods: {
    async initData(obj) {
      this.restData()
      this.baseData = obj
      this.getYjs(this.baseData.entryData.updatedTime, this.baseData.billid)
      this.baseData.entryData.zsinfo = {}
      if (
        this.baseData.entryData.cardZsInfoVOS &&
        this.baseData.entryData.cardZsInfoVOS.length > 0
      ) {
        let walletsArr = []
        let zqArr = []
        let sersArr = []
        let productsArr = []
        this.baseData.entryData.cardZsInfoVOS.filter(a => {
          if (a.btype == 1) {
            walletsArr.push(a.name)
          }
        })
        this.baseData.entryData.cardZsInfoVOS.filter(a => {
          if (a.btype == 2) {
            zqArr.push(a.name)
          }
        })
        this.baseData.entryData.cardZsInfoVOS.filter(a => {
          if (a.btype == 3) {
            if (a.num > 1) {
              sersArr.push(a.name + '*' + a.num)
            } else {
              sersArr.push(a.name)
            }
          }
        })
        this.baseData.entryData.cardZsInfoVOS.filter(a => {
          if (a.btype == 4) {
            if (a.num > 1) {
              productsArr.push(a.name + '*' + a.num)
            } else {
              productsArr.push(a.name)
            }
          }
        })
        this.$set(
          this.baseData.entryData.zsinfo,
          'name',
          this.baseData.entryData.cardZsInfoVOS[0].maname
        )
        this.$set(
          this.baseData.entryData.zsinfo,
          'walletname',
          walletsArr.join(',')
        )
        this.$set(this.baseData.entryData.zsinfo, 'zqname', zqArr.join(','))
        this.$set(this.baseData.entryData.zsinfo, 'sername', sersArr.join(','))
        this.$set(
          this.baseData.entryData.zsinfo,
          'productname',
          productsArr.join(',')
        )
      }
      console.log(this.baseData.entryData.zsinfo)
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
      service.cashier.cardRecords
        .cardrecordyj({ saleTime: saleTime, id: id })
        .then(res => {
          if (res.resp_code == 200) {
            this.tableData = res.data
          }
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
    getcardBtype(btype) {
      let res = ''
      if (btype === '1') {
        res = '红包：'
      } else if (btype === '2') {
        res = '优惠券：'
      } else if (btype === '3') {
        res = '服务：'
      } else if (btype === '4') {
        res = '产品：'
      }
      return res
    },
    getcardMtype(mtype) {
      let res = ''
      if (mtype === '1') {
        res = '金额：'
      } else if (mtype === '2') {
        res = '折扣：'
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
    editBill(row) {
      //编辑单据
      this.editRow = row
      this.editForm.content = this.editRow.content
      this.editForm.money = this.keepTwoDecimal(Number(row.money))
      this.editForm.eeyjList = this.editRow.yjsList
      this.editForm.eeyjList.forEach(data => {
        data.eeid = String(data.eeid)
      })
      this.getStations(this.baseData.entryData.shopid, '002')
      this.getEmployeeList(this.baseData.entryData.shopid)
      console.log(this.editRow)
      this.editDialog.visible = true
    },
    editCancel() {
      //查询列表
      this.getYjs(this.baseData.entryData.updatedTime, this.baseData.billid)
      this.editDialog.visible = false
    },
    delEmployee(ees, index) {
      this.editRow.yjsList.splice(index, 1)
    },
    addEmployee(station) {
      let postion = station.postion
      let rowindex = 0
      this.tableData.forEach(data => {
        rowindex = rowindex + data.yjsList.length
      })
      const royalty = {}
      royalty.postion = postion
      royalty.rowindex = rowindex
      this.editRow.yjsList.push(royalty)
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

        if (isEmpty(edit.yjje)) {
          $yid.util.error('请输入业绩金额！')
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

        if (isNaN(edit.yjje)) {
          $yid.util.error('业绩必须输入数字！')
          return
        }

        if (Number(edit.yjje) <= 0) {
          $yid.util.error('业绩必须输入大于0的数字！')
          return
        }

        if (edit.postion === 1) {
          sumje1 = sumje1 + Number(edit.yjje)
          ee1.push(edit.eecode)
        }
        if (edit.postion === 2) {
          sumje2 = sumje2 + Number(edit.yjje)
          ee2.push(edit.eecode)
        }
        if (edit.postion === 3) {
          sumje3 = sumje3 + Number(edit.yjje)
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
      this.editRow.yjsList = this.editForm.eeyjList

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
      let id = this.baseData.entryData.id
      let yjsList = []
      this.tableData.forEach(data => {
        data.yjsList.forEach(res => {
          yjsList.push(res)
        })
      })
      const param = {}
      param.id = id
      param.yjsList = yjsList
      console.log(param)
      service.cashier.cardRecords.reviseBill(param).then(res => {
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
      this.isSign = this.baseData.entryData.eSign
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
</style>
