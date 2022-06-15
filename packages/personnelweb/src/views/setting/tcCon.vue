<template>
  <div class="tcTon">
    <el-button @click="goBack" type="primary">返回</el-button>
    <el-button @click="save" type="primary">保存</el-button>
    <el-row>
      <label>适用人员：</label>
      <el-cascader
        :options="stuffTree.tree"
        :props="props"
        :show-all-levels="false"
        clearable
        ref="rps"
        v-model="cascaderValue"
        style="min-width: 700px"></el-cascader>
    </el-row>
    <el-row style="display: flex; margin: 15px 0">
      <label>提成高级设置：</label>
      <el-checkbox v-model="showGroup.show_cost">成本</el-checkbox>
      <el-checkbox
        v-model="showGroup.show_pay"
        v-show="rItem.prtid == '1' || rItem.prtid == '2'"
        >支付方式</el-checkbox
      >
      <el-checkbox v-model="showGroup.show_norm">指标提成</el-checkbox>
    </el-row>
    <el-button @click="toAddDesc" type="primary" style="margin-bottom: 15px"
      >新增</el-button
    >
    <!--提成明细表-->
    <table
      border="1"
      bordercolor="#ebeef5"
      width="100%"
      class="tcbiaot"
      cellpadding="0"
      cellspacing="0">
      <tbody>
        <tr height="40">
          <td>提成项</td>
          <td width="9%">提成方式</td>
          <td width="7%" v-show="showGroup.show_cost">扣成本方式</td>
          <td width="7%" v-show="showGroup.show_cost">扣成本额度</td>
          <td width="10%" v-show="showGroup.show_pay">支付方式</td>
          <td width="51%" v-show="showGroup.show_norm">
            <table
              width="100%"
              class="licengborder"
              cellpadding="0"
              cellspacing="0">
              <tr>
                <td colspan="3" class="bottomcolor">指标提成</td>
                <td rowspan="2" width="100">指定提成</td>
                <td rowspan="2" width="100">不指定提成</td>
                <td rowspan="2" width="90">操作</td>
              </tr>
              <tr>
                <td width="50">操作</td>
                <td width="60">级别</td>
                <td>条件</td>
              </tr>
            </table>
          </td>
          <td v-show="!showGroup.show_norm">指定提成</td>
          <td v-show="!showGroup.show_norm">不指定提成</td>
          <td v-show="!showGroup.show_norm">操作</td>
        </tr>
      </tbody>
      <!--数据表-->
      <tr height="40" class="td_content" v-for="(desc, i) in rItem.descList">
        <!--提成项-->
        <td>
          <el-row type="flex" justify="space-between">
            <el-col :span="22">
              <el-tag
                closable
                type="info"
                v-for="(item, k) in desc.descitemList"
                @close="deleteTcx(i, k)">
                {{ item.itemname }}
              </el-tag>
            </el-col>
            <el-col :span="1">
              <el-link :underline="false"
                ><i
                  class="el-icon-edit"
                  @click="toEditTcx(desc.descitemList, desc.itemtype, i)"></i>
              </el-link>
            </el-col>
          </el-row>
        </td>
        <!--提成方式-->
        <td>
          <el-select
            v-model="desc.normType"
            placeholder="请选择"
            @change="handleChangeType($event, i)">
            <el-option label="按金额" value="1"></el-option>
            <el-option label="按比例" value="2"></el-option>
          </el-select>
        </td>
        <!--扣成本方式-->
        <td v-show="showGroup.show_cost">
          <el-select v-model="desc.costType" placeholder="请选择">
            <el-option label="百分比" value="1"></el-option>
            <el-option label="固定额" value="2"></el-option>
          </el-select>
        </td>
        <!--扣成本额度-->
        <td v-show="showGroup.show_cost">
          <el-input placeholder="" v-model="desc.cost" clearable></el-input>
        </td>
        <!--支付方式-->
        <td v-show="showGroup.show_pay">
          <el-row type="flex" justify="space-between">
            <el-col :span="18">
              <el-tag
                closable
                type="info"
                v-for="(pay, l) in desc.payList"
                @close="deletePay(i, l)">
                {{ pay.payname }}
              </el-tag>
            </el-col>
            <el-col :span="3">
              <el-link :underline="false"
                ><i class="el-icon-edit" @click="showDialogPay(i)"></i
              ></el-link>
            </el-col>
          </el-row>
        </td>
        <!--指标提成-->
        <td v-show="showGroup.show_norm">
          <table
            width="100%"
            class="licengborder"
            border="0"
            cellpadding="0"
            cellspacing="0">
            <tr height="40">
              <td width="50">
                <el-row type="flex" justify="center">
                  <el-link :underline="false"
                    ><i class="el-icon-circle-plus" @click="toAddZb(i)"></i
                  ></el-link>
                </el-row>
              </td>
              <td
                colspan="5"
                style="padding: 0"
                v-show="desc.levelList.length == 0">
                <el-row>
                  <el-link
                    type="primary"
                    style="margin: 0 10px 0 10px"
                    @click="descDelete(i)"
                    >删除
                  </el-link>
                </el-row>
              </td>
              <td
                colspan="5"
                style="padding: 0"
                v-show="desc.levelList.length > 0">
                <table
                  width="100%"
                  border="0"
                  class="td_bottom_zb"
                  cellpadding="0"
                  cellspacing="0">
                  <tr height="36" v-for="(level, j) in desc.levelList">
                    <!--指标提成-级别-->
                    <td width="60">
                      <el-input placeholder="" v-model="level.level"></el-input>
                    </td>
                    <!--指标提成-条件-->
                    <td>
                      <el-row type="flex" justify="space-between">
                        <el-col :span="20">
                          <label style="fone-size: 12px">{{
                            showLevelMemo(level)
                          }}</label>
                        </el-col>
                        <el-col :span="2">
                          <el-link :underline="false"
                            ><i class="el-icon-edit" @click="toEditZb(i, j)"></i
                          ></el-link>
                        </el-col>
                      </el-row>
                    </td>
                    <!--指标提成-指定-->
                    <td width="100">
                      <el-row type="flex" justify="space-between">
                        <el-col :span="18">
                          <el-input
                            placeholder=""
                            v-model="level.norm"></el-input>
                        </el-col>
                        <el-col :span="4" v-show="level.normType == '1'"
                          ><label>元</label></el-col
                        >
                        <el-col :span="4" v-show="level.normType == '2'"
                          ><label>%</label></el-col
                        >
                      </el-row>
                    </td>
                    <!--指标提成-不指定-->
                    <td width="100">
                      <el-row type="flex" justify="space-between">
                        <el-col :span="18">
                          <el-input
                            placeholder=""
                            v-model="level.norm2"></el-input>
                        </el-col>
                        <el-col :span="4" v-show="level.normType == '1'"
                          ><label>元</label></el-col
                        >
                        <el-col :span="4" v-show="level.normType == '2'"
                          ><label>%</label></el-col
                        >
                      </el-row>
                    </td>
                    <td width="90">
                      <el-row>
                        <el-link type="primary">复制</el-link>
                        <el-link
                          type="primary"
                          style="margin: 0 10px 0 10px"
                          @click="levelDelete(i, j)"
                          >删除
                        </el-link>
                      </el-row>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
        <!--指定-->
        <td v-show="!showGroup.show_norm">
          <el-row type="flex" justify="space-between">
            <el-col :span="18">
              <el-input placeholder="" v-model="desc.norm"></el-input>
            </el-col>
            <el-col :span="4" v-show="desc.normType == '1'"
              ><label>元</label></el-col
            >
            <el-col :span="4" v-show="desc.normType == '2'"
              ><label>%</label></el-col
            >
          </el-row>
        </td>
        <!--不指定-->
        <td v-show="!showGroup.show_norm">
          <el-row type="flex" justify="space-between">
            <el-col :span="18">
              <el-input placeholder="" v-model="desc.norm2"></el-input>
            </el-col>
            <el-col :span="4" v-show="desc.normType == '1'"
              ><label>元</label></el-col
            >
            <el-col :span="4" v-show="desc.normType == '2'"
              ><label>%</label></el-col
            >
          </el-row>
        </td>
        <td v-show="!showGroup.show_norm">
          <el-row>
            <el-link
              type="primary"
              style="margin: 0 10px 0 10px"
              @click="descDelete(i)"
              >删除</el-link
            >
          </el-row>
        </td>
      </tr>
    </table>
    <!--提成项选择-->
    <yid-dialog
      :title="dialogTcx.title"
      :visible.sync="dialogTcx.visible"
      @close="cancelDialogTcx"
      width="350px">
      <panel-tc-item
        ref="dialogtcx"
        :type.sync="dialogTcx.type"
        :prtid.sync="dialogTcx.prtid"
        :tcxData.sync="dialogTcx.tcxData"
        :func="doEditTcx"></panel-tc-item>
    </yid-dialog>
    <!--支付方式选择-->
    <yid-dialog
      :title="dialogPay.title"
      :visible.sync="dialogPay.visible"
      @close="cancelDialogPay"
      width="350px">
      <panel-pay
        :defaultCheckedKeys.sync="this.dialogPay.checkedKeys"
        :func.sync="setPays"
        ref="dialogpay"></panel-pay>
    </yid-dialog>
    <!--指标提成弹出层-->
    <yid-dialog
      :title="dialogZb.title"
      :visible.sync="dialogZb.visible"
      @close="cancelDialogZb"
      width="800px">
      <panel-tc-sub-desc
        ref="dialogzb"
        :pcondition="dialogZb.pcondition"
        :subDesc="dialogZb.subDesc"
        :func="setZb"></panel-tc-sub-desc>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import panelPay from './components/panelPay'
import panelTcItem from './components/panelTcItem'
import panelTcSubDesc from './components/panelTcSubDesc'

export default {
  components: {
    panelPay,
    panelTcItem,
    panelTcSubDesc
  },
  name: 'tcCon',
  data: function () {
    return {
      props: { multiple: true, value: 'treekey', checkStrictly: true },
      showGroup: { show_cost: false, show_pay: false, show_norm: false },
      cascaderValue: [],
      radio: '1',
      dialogTcx: {
        visible: false,
        title: '提成项选择',
        prtid: 0,
        type: '0',
        tcxData: [],
        index: -1
      },
      dialogPay: {
        visible: false,
        title: '支付方式选择',
        descsIndex: 0,
        checkedKeys: []
      },
      dialogZb: {
        visible: false,
        title: '指标条件',
        pcondition: '0',
        index: -1,
        descIndex: -1,
        subDesc: []
      },
      rItem: {},
      structure: {},
      pays: [],
      stuffTree: []
    }
  },
  mounted() {
    service.tc.tcCon.structure().then(res => {
      this.structure = res.data
    })
    service.payType.payTypeList().then(res => {
      this.pays = res.data
    })
    service.employee.stuffTree().then(res => {
      this.stuffTree = res.data
    })
  },
  watch: {
    'showGroup.show_cost'(v) {
      this.rItem.descList.map(e => {
        e.isCost = v ? '1' : '0'
      })
    },
    'showGroup.show_pay'(v) {
      this.rItem.descList.map(e => {
        e.isPay = v ? '1' : '0'
        if (e.payList.length == 0) {
          e.payList = $yid.util.deepClone(this.pays)
        }
      })
    },
    'showGroup.show_norm'(v) {
      this.rItem.descList.map(e => {
        e.isSubdesc = v ? '1' : '0'
      })
    }
  },
  methods: {
    getFullItem(priid) {
      service.tc.tcCon.getFullItem(priid).then(res => {
        this.rItem = res.data
        this.setCascaderValue(this.rItem.psList)
        this.dialogTcx.prtid = this.rItem.prtid
        this.showGroup.show_cost =
          this.rItem.descList[0] && this.rItem.descList[0].isCost == '1'
            ? true
            : false
        this.showGroup.show_pay =
          this.rItem.descList[0] && this.rItem.descList[0].isPay == '1'
            ? true
            : false
        this.showGroup.show_norm =
          this.rItem.descList[0] && this.rItem.descList[0].isSubdesc == '1'
            ? true
            : false
      })
    },
    goBack() {
      this.$parent.listShow = true
      this.rItem = []
      this.cascaderValue = []
    },
    showDialogPay(i) {
      this.dialogPay.descsIndex = i
      this.dialogPay.checkedKeys = []
      if (this.rItem.descList[i].payList) {
        this.rItem.descList[i].payList.map(p => {
          this.dialogPay.checkedKeys.push(p.payid)
        })
      } else {
        this.rItem.descList[i].payList = []
      }

      this.dialogPay.visible = true
    },
    cancelDialogPay() {
      this.dialogPay.visible = false
    },
    setPays(v) {
      this.rItem.descList[this.dialogPay.descsIndex].payList = v
      this.dialogPay.visible = false
    },
    toAddDesc() {
      this.dialogTcx.visible = true
      this.dialogTcx.tcxData = []
      this.dialogTcx.type = '0'
      this.dialogTcx.index = this.rItem.descList.length
      this.dialogTcx.prtid = this.rItem.prtid
    },
    toEditTcx(item, itemtype, index) {
      this.dialogTcx.visible = true
      this.dialogTcx.tcxData = item
      this.dialogTcx.type = itemtype
      this.dialogTcx.index = index
      this.dialogTcx.prtid = this.rItem.prtid
    },
    doEditTcx(items) {
      if (items.length == 0) {
        $yid.util.error('请选择提成项')
        return false
      }
      if (!this.rItem.descList[this.dialogTcx.index]) {
        let desc = $yid.util.deepClone(this.structure.desc)
        desc.isCost = this.showGroup.show_cost ? '1' : '0'
        desc.cost = 0
        desc.status = '1'
        desc.costType = '1'
        desc.normType = '1'
        desc.norm = 0
        desc.norm2 = 0
        desc.isPay = this.showGroup.show_pay ? '1' : '0'
        if (this.showGroup.show_pay)
          desc.payList = $yid.util.deepClone(this.pays)
        desc.isSubdesc = this.showGroup.show_norm ? '1' : '0'
        this.rItem.descList.push(desc)
      }
      this.rItem.descList[this.dialogTcx.index].descitemList = items
      this.rItem.descList[this.dialogTcx.index].itemtype = items[0].itemtype
      this.cancelDialogTcx()
    },
    cancelDialogTcx() {
      this.dialogTcx.visible = false
      this.dialogTcx.tcxData = []
      this.dialogTcx.type = '0'
      this.dialogTcx.index = -1
      this.$refs.dialogtcx.clean()
    },
    setZb(pcondition, subDescs) {
      if (
        !this.rItem.descList[this.dialogZb.descIndex].levelList[
          this.dialogZb.index
        ]
      ) {
        this.rItem.descList[this.dialogZb.descIndex].levelList.push({
          level:
            this.rItem.descList[this.dialogZb.descIndex].levelList.length + 1,
          normType: this.rItem.descList[this.dialogZb.descIndex].normType,
          norm: 0, //提成额度（指定提成）
          norm2: 0, //提成额度（不指定提成）
          pcondition: pcondition, //1-and 2-or
          subdescList: subDescs
        })
      } else {
        this.rItem.descList[this.dialogZb.descIndex].levelList[
          this.dialogZb.index
        ].subdescList = subDescs
        this.rItem.descList[this.dialogZb.descIndex].levelList[
          this.dialogZb.index
        ].pcondition = pcondition
      }
      this.cancelDialogZb()
    },
    toAddZb(i) {
      if (
        !this.rItem.descList[i].levelList ||
        this.rItem.descList[i].levelList.length == 0
      ) {
        this.rItem.descList[i].levelList.push({
          level: 1,
          pcondition: '1',
          subdescList: [],
          norm: 0, //提成额度（指定提成）
          norm2: 0, //提成额度（不指定提成）
          normType: this.rItem.descList[i].normType
        })
        this.dialogZb.index = 0
      } else {
        this.dialogZb.index = this.rItem.descList[i].levelList.length
      }
      //增加第2级别指标条件时，指标选择的弹出层里默认展示第一级别的指标条件内容
      this.dialogZb.descIndex = i
      this.dialogZb.pcondition =
        this.rItem.descList[i].levelList[
          this.rItem.descList[i].levelList.length - 1
        ].pcondition
      this.dialogZb.subDesc =
        this.rItem.descList[i].levelList[
          this.rItem.descList[i].levelList.length - 1
        ].subdescList
      this.dialogZb.visible = true
    },
    toEditZb(i, j) {
      this.dialogZb.visible = true
      this.dialogZb.descIndex = i
      this.dialogZb.index = j
      this.dialogZb.pcondition = this.rItem.descList[i].levelList[j].pcondition
      this.dialogZb.subDesc = this.rItem.descList[i].levelList[j].subdescList
    },
    cancelDialogZb() {
      this.dialogZb.visible = false
      this.dialogZb.descIndex = -1
      this.dialogZb.index = -1
      this.dialogZb.pcondition = 1
      this.dialogZb.subDesc = []
    },
    descDelete(i) {
      $yid.util.confirm('你确定要删除此条提成项吗？', '', '', () => {
        this.rItem.descList.splice(i, 1)
      })
    },
    levelDelete(i, j) {
      $yid.util.confirm('你确定要删除此条指标提成吗？', '', '', () => {
        this.rItem.descList[i].levelList.splice(j, 1)
      })
    },
    showLevelMemo(level) {
      let memo = ''
      let cond = level.pcondition == '1' ? '且' : '或'
      for (let i = 0; i < level.subdescList.length; i++) {
        memo =
          memo +
          level.subdescList[i].prnname +
          '=>' +
          level.subdescList[i].pvalue +
          '\n' +
          (i == level.subdescList.length - 1 ? ' ' : cond) +
          '\n'
      }
      return memo
    },
    handleChangeType(type, index) {
      this.rItem.descList[index].levelList.map(level => {
        level.normType = type
      })
    },
    save() {
      let psList = this.$refs.rps.getCheckedNodes()
      if (psList.length < 1) {
        $yid.util.error('请勾选适用人员')
        return false
      }
      this.rItem.psList = []
      psList.map((p, index) => {
        this.rItem.psList.push({
          psid: p.data.node.id,
          type: p.data.type,
          treekey: p.data.treekey,
          psname: p.data.label,
          treepath: this.cascaderValue[index].toString()
        })
      })
      service.tc.tcCon.save(this.rItem).then(res => {
        this.getFullItem(this.rItem.id)
      })
    },
    deleteTcx(i, k) {
      this.rItem.descList[i].descitemList.splice(k, 1)
    },
    deletePay(i, l) {
      this.rItem.descList[i].payList.splice(l, 1)
    },
    setCascaderValue(psList) {
      if (psList instanceof Array) {
        psList.map(ps => {
          if (ps.treepath) this.cascaderValue.push(ps.treepath.split(','))
        })
      }
    }
  }
}
</script>

<style scoped lang="scss">
ul {
  margin: 0;
  padding: 0;
}

.tcsz {
  border: 1px #ebeef5 solid;
}

.bgcolor_tittcsz {
  background-color: #f5f7fa;
}

.tit_tcsz {
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
}

.tit_tcsz ul {
  border-right: 1px #ebeef5 solid;
  vertical-align: middle;
  text-align: center;
  height: auto;
  padding: 0 5px;
}

.width1 {
  flex: 1;
}

.width2 {
  flex: 0 0 100px;
}

.width3 {
  flex: 0 0 90px;
}

.width4 {
  flex: 0 0 120px;
}

.width5 {
  flex: 0 0 580px;
}

.width6 {
  flex: 1;
}

.width7 {
  flex: 0 0 100px;
}

.fennjcon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.fenji {
  width: 340px;
  border-right: 1px #ebeef5 solid;
}

.tit_zb {
  display: block;
  border-bottom: 1px #ebeef5 solid;
  text-align: center;
}

.zbcon {
  display: flex;
  justify-content: center;
  align-items: center;
}

.zbcon span:nth-child(1) {
  flex: 0 0 60px;
  border-right: 1px #ebeef5 solid;
}

.zhibiaocon {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.zhibiaocon span:nth-child(1) {
  flex: 0 0 80px;
}

.zhibiaocon span:nth-child(2) {
  flex: 1;
}

table {
  border-spacing: 0;
  border-collapse: collapse;
}

tr,
td {
  padding-top: 0;
  padding-bottom: 0;
  box-sizing: border-box;
}

.tcbiaot tbody tr:nth-child(1) {
  background-color: #f5f7fa;
}

.tcbiaot tbody tr:nth-child(1) td {
  text-align: center;
}

.licengborder td {
  border-right: 1px #ebeef5 solid;
}

.licengborder td:last-child {
  border-right: none;
}

.bottomcolor {
  border-bottom: 1px #ebeef5 solid;
}

.tcbiaot td {
  padding: 0 5px;
}

.td_bottom_zb tr:first-child {
  border-bottom: 1px #ebeef5 solid;
}

.td_bottom_zb tr:last-child {
  border-bottom: none;
}
</style>
