<template>
  <div class="check_chstatistics">
    <el-form ref="searchForm" inline :model="searchForm">
      <el-form-item
        label="门店："
        prop="shopid"
        :rules="[{ required: true, message: '选择门店' }]">
        <el-select
          @clear="clearFormShopList"
          clearable
          v-model.trim="searchForm.shopid"
          filterable
          :filter-method="filterShop"
          placeholder="请选择门店"
          style="width: 200px">
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
      <el-form-item
        label="查询日期："
        prop="day"
        :rules="[{ required: true, message: '查询日期' }]">
        <el-date-picker
          style="width: 200px"
          v-model="searchForm.day"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="margin-bottom: 0">
        <el-button @click="seachData" type="primary">查询</el-button>
        <el-button
          @click="handleprint(printAll)"
          v-print="printAll"
          type="primary"
          >打印</el-button
        >
        <el-button
          @click="handleprint(printObj)"
          v-print="printObj"
          type="primary"
          >打印结存</el-button
        >
      </el-form-item>
      <el-form-item>
        <el-select
          style="width: 320px"
          v-model="paycodes"
          multiple
          clearable
          @change="changePayment"
          placeholder="付款方式筛选">
          <el-option
            :key="item.id"
            :label="item.payname"
            :value="item.paycode"
            v-for="item in payList"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div
      ref="printAll"
      id="printAll"
      cellspacing="0"
      cellpadding="0"
      border="0">
      <yid-table ref="cardtable" :data="carddata" style="margin-top: 5px">
        <yid-table-column
          label="选择"
          type="selection"
          prop="id"
          width="55"></yid-table-column>
        <yid-table-column
          label="序号"
          width="50"
          prop="orderno"></yid-table-column>
        <yid-table-column
          label="单据编码"
          width="150"
          prop="billcode"></yid-table-column>
        <yid-table-column
          label="卡号"
          width="130"
          prop="cardno"></yid-table-column>
        <yid-table-column
          label="会员名"
          width="80"
          prop="memname"></yid-table-column>
        <yid-table-column label="性别" width="50" prop="sex"></yid-table-column>
        <yid-table-column
          label="新卡"
          width="60"
          prop="isOpen"></yid-table-column>
        <yid-table-column
          label="充值金额"
          width="100"
          prop="money"
          :formatter="formatMoney"></yid-table-column>
        <yid-table-column
          label="赠送金额"
          width="100"
          prop="gmoney"
          :formatter="formatMoney"></yid-table-column>
        <el-table-column
          label="美容师:业绩"
          min-width="300"
          prop="yj1"
          label-class-name="colunmcenter"></el-table-column>
        <el-table-column
          label="跟单顾问:业绩"
          min-width="300"
          prop="yj2"
          label-class-name="colunmcenter"></el-table-column>
        <el-table-column
          label="付款方式"
          min-width="200"
          prop="pays"
          label-class-name="colunmcenter"></el-table-column>
      </yid-table>
      <yid-table ref="packagetable" :data="packagedata" style="margin-top: 5px">
        <yid-table-column
          label="选择"
          type="selection"
          prop="id"
          width="55"></yid-table-column>
        <yid-table-column
          label="序号"
          width="50"
          prop="orderno"></yid-table-column>
        <yid-table-column
          label="单据编码"
          width="150"
          prop="billcode"></yid-table-column>
        <yid-table-column
          label="卡号"
          width="130"
          prop="cardno"></yid-table-column>
        <yid-table-column
          label="会员名"
          width="80"
          prop="memname"></yid-table-column>
        <yid-table-column label="性别" width="50" prop="sex"></yid-table-column>
        <el-table-column
          label="套餐内容"
          min-width="340"
          prop="packageinfo"
          label-class-name="colunmcenter"></el-table-column>
        <el-table-column
          label="美容师:划疗程"
          min-width="180"
          prop="yj1"
          label-class-name="colunmcenter"></el-table-column>
        <el-table-column
          label="跟单顾问:业绩"
          min-width="140"
          prop="yj2"
          label-class-name="colunmcenter"></el-table-column>
        <yid-table-column
          label="单据金额"
          width="80"
          prop="billje"></yid-table-column>
        <yid-table-column
          label="抵扣金额"
          width="80"
          prop="zkje"
          :formatter="formatMoney"></yid-table-column>
        <yid-table-column
          label="应收金额"
          width="80"
          prop="ysje"
          :formatter="formatMoney"></yid-table-column>
        <el-table-column
          label="付款方式"
          min-width="140"
          prop="pays"
          label-class-name="colunmcenter"></el-table-column>
      </yid-table>
      <yid-table ref="saletable" :data="saledata" style="margin-top: 5px">
        <yid-table-column
          label="选择"
          type="selection"
          prop="id"
          width="55"></yid-table-column>
        <yid-table-column
          label="序号"
          width="50"
          prop="orderno"></yid-table-column>
        <yid-table-column
          label="单据编码"
          width="150"
          prop="billcode"></yid-table-column>
        <yid-table-column
          label="卡号"
          width="130"
          prop="cardno"></yid-table-column>
        <yid-table-column
          label="会员名"
          width="80"
          prop="memname"></yid-table-column>
        <yid-table-column label="性别" width="50" prop="sex"></yid-table-column>
        <yid-table-column
          label="是否计客次"
          min-width="60"
          prop="iskc"></yid-table-column>
        <el-table-column
          label="项目/客装"
          min-width="340"
          prop="servnames"
          label-class-name="colunmcenter"></el-table-column>
        <el-table-column
          label="美容师:业绩"
          min-width="180"
          prop="sjss"
          label-class-name="colunmcenter"></el-table-column>
        <el-table-column
          label="跟单顾问:业绩"
          min-width="140"
          prop="assts"
          label-class-name="colunmcenter"></el-table-column>
        <yid-table-column
          label="单据金额"
          min-width="80"
          prop="billje"></yid-table-column>
        <yid-table-column
          label="抵扣金额"
          min-width="80"
          prop="zkje"></yid-table-column>
        <yid-table-column
          label="应收金额"
          min-width="80"
          prop="ysje"></yid-table-column>
        <el-table-column
          label="付款方式"
          min-width="140"
          prop="pays"
          label-class-name="colunmcenter"></el-table-column>
      </yid-table>
      <el-collapse
        v-model="activeNames"
        @change="handleChange"
        style="margin-top: 5px">
        <el-collapse-item title="客量" name="1" v-if="false">
          <yid-table ref="kstable" :data="ksdata">
            <yid-table-column
              label="总客数"
              min-width="100"
              prop="sumks"></yid-table-column>
            <yid-table-column
              label="女客数"
              min-width="120"
              prop="gks"></yid-table-column>
            <yid-table-column
              label="男客数"
              min-width="120"
              prop="mks"></yid-table-column>
            <yid-table-column
              label="设计师指定客数"
              min-width="80"
              prop="sjszks"></yid-table-column>
            <yid-table-column
              label="助理指定客数"
              min-width="80"
              prop="asstzks"></yid-table-column>
            <yid-table-column
              label="大项目客数"
              min-width="80"
              prop="bxks"></yid-table-column>
            <yid-table-column
              label="大项目指定客数"
              min-width="120"
              prop="bxzks"></yid-table-column>
            <yid-table-column
              label="非储值客数"
              min-width="80"
              prop="fczks"></yid-table-column>
            <yid-table-column
              label="新客数"
              min-width="120"
              prop="nks"></yid-table-column>
          </yid-table>
        </el-collapse-item>
        <el-collapse-item title="服务业绩/客装业绩" name="2">
          <div class="servpack">
            <yid-table
              ref="servtable"
              :data="servyj"
              style="width: 50%; display: inline-block">
              <yid-table-column
                label="项目分类"
                min-width="140"
                prop="name"></yid-table-column>
              <yid-table-column
                label="数量"
                min-width="100"
                prop="sl"></yid-table-column>
              <yid-table-column
                label="金额"
                min-width="100"
                prop="je"
                :formatter="formatMoney"></yid-table-column>
              <yid-table-column
                label="业绩"
                min-width="100"
                prop="yj"
                :formatter="formatMoney"></yid-table-column>
            </yid-table>
            <yid-table
              ref="packagetable"
              :data="packageyj"
              style="width: 49%; display: inline-block; margin-left: 1%">
              <yid-table-column
                label="产品分类"
                min-width="140"
                prop="name"></yid-table-column>
              <yid-table-column
                label="数量"
                min-width="100"
                prop="sl"></yid-table-column>
              <yid-table-column
                label="金额"
                min-width="100"
                prop="je"
                :formatter="formatMoney"></yid-table-column>
              <yid-table-column
                label="业绩"
                min-width="100"
                prop="yj"
                :formatter="formatMoney"></yid-table-column>
            </yid-table>
          </div>
        </el-collapse-item>
        <el-collapse-item title="开卡" name="3">
          <yid-table ref="kktable" :data="kkdata">
            <yid-table-column
              label="卡名称"
              min-width="120"
              prop="cardname"></yid-table-column>
            <yid-table-column
              label="开卡数量"
              min-width="120"
              prop="kksl"></yid-table-column>
            <yid-table-column
              label="开卡金额"
              min-width="120"
              prop="kkje"
              :formatter="formatMoney"></yid-table-column>
            <yid-table-column
              label="开卡业绩"
              min-width="120"
              prop="kkyj"
              :formatter="formatMoney"></yid-table-column>
            <yid-table-column
              label="充值数量"
              min-width="120"
              prop="czsl"></yid-table-column>
            <yid-table-column
              label="充值金额"
              min-width="120"
              prop="czje"
              :formatter="formatMoney"></yid-table-column>
            <yid-table-column
              label="充值业绩"
              min-width="120"
              prop="czyj"
              :formatter="formatMoney"></yid-table-column>
            <yid-table-column
              label="开充数量"
              min-width="120"
              prop="kcsl"></yid-table-column>
            <yid-table-column
              label="开充金额"
              min-width="120"
              prop="kcje"
              :formatter="formatMoney"></yid-table-column>
            <yid-table-column
              label="开充业绩"
              min-width="120"
              prop="kcyj"
              :formatter="formatMoney"></yid-table-column>
          </yid-table>
        </el-collapse-item>
      </el-collapse>
      <div
        ref="printId"
        id="printId"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <table class="tableName">
          <tr>
            <td>业绩汇总</td>
          </tr>
        </table>
        <yid-table ref="sumyjtable" :data="payhj">
          <yid-table-column
            label="类型"
            min-width="80"
            prop="name"></yid-table-column>
          <yid-table-column
            label="现金"
            min-width="80"
            prop="pay1"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column label="POS" min-width="80" prop="pay2">
            <template slot-scope="scope">
              <div>
                {{ scope.row.pay2 | moneyFormat }}/{{
                  scope.row.pay21 | moneyFormat
                }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column label="微信" min-width="80" prop="pay3">
            <template slot-scope="scope">
              <div>
                {{ scope.row.pay3 | moneyFormat }}/{{
                  scope.row.pay31 | moneyFormat
                }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column label="银联通" min-width="80" prop="pay4">
            <template slot-scope="scope">
              <div>
                {{ scope.row.pay4 | moneyFormat }}/{{
                  scope.row.pay41 | moneyFormat
                }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column label="工行爱购" min-width="80" prop="pay5">
            <template slot-scope="scope">
              <div>
                {{ scope.row.pay5 | moneyFormat }}/{{
                  scope.row.pay51 | moneyFormat
                }}
              </div>
            </template>
          </yid-table-column>
          <yid-table-column
            label="团购消费"
            min-width="80"
            prop="pay6"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="储值卡卡金"
            min-width="80"
            prop="pay7"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="储值卡赠送"
            min-width="80"
            prop="pay8"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="生日赠送"
            min-width="80"
            prop="pay9"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="红包"
            min-width="80"
            prop="pay10"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="其他"
            min-width="80"
            prop="payOther"
            :formatter="formatMoney"></yid-table-column>
        </yid-table>
        <yid-table ref="sumtable" :data="sumdata" style="margin-top: 8px">
          <yid-table-column
            label="资金总业绩"
            min-width="80"
            prop="zjzyj"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="主营资金"
            min-width="80"
            prop="zyzj"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="营业外资金"
            min-width="80"
            prop="zywj"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="微慕拨款"
            min-width="80"
            prop="wmbk"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="团购拨款"
            min-width="80"
            prop="tgbk"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="电商券拨款"
            min-width="80"
            prop="dsbk"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="日常支出"
            min-width="80"
            prop="rzio"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="退卡资金"
            min-width="80"
            prop="tkzj"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="消卡金"
            min-width="80"
            prop="xkj"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="消套餐疗程"
            min-width="80"
            prop="xdc"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="消赠送"
            min-width="80"
            prop="xzs"
            :formatter="formatMoney"></yid-table-column>
          <yid-table-column
            label="消老卡"
            min-width="80"
            prop="xlk"
            :formatter="formatMoney"></yid-table-column>
        </yid-table>
      </div>
    </div>
  </div>
</template>

<script>
import { common } from './dayreportcommon'

export default {
  name: 'mfdayreport',
  mounted() {
    this.getShopList({ status: '1', type: '2' })
  },
  mixins: [common]
}
</script>

<style scoped>
/deep/ .el-collapse-item__header {
  background-color: white;
  height: 30px;
  font-size: 15px;
  padding-left: 5px;
  border: 1px #cccccc solid;
}

/deep/ .el-collapse-item__content {
  padding-bottom: 15px;
}

.tableName {
  background-color: white;
  height: 30px;
  width: 100%;
  font-size: 15px;
  padding-left: 5px;
  border: 1px #cccccc solid;
}

/deep/ .tablecolumn {
  text-align: center;
  background-color: #ffe1685c;
}

/deep/ .colunmcenter {
  text-align: center;
}

/deep/ .el-table .cell {
  white-space: pre-line;
}

.servpack {
  display: flex;
  align-items: flex-start;
}
</style>
