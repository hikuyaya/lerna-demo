<template>
  <div>
    <el-tabs v-model="activetab">
      <el-tab-pane :label="'会员储值卡' + hyInfo.cards.length" name="first">
        <div>
          <yid-table :data="hyInfo.cards" ref="hycards" height="300">
            <yid-table-column
              label="卡号"
              min-width="140"
              prop="cardno"></yid-table-column>
            <yid-table-column
              label="卡名称"
              min-width="120"
              prop="cardname"></yid-table-column>
            <yid-table-column
              label="卡金余额"
              min-width="120"
              prop="money"></yid-table-column>
            <yid-table-column
              label="赠送金余额"
              min-width="140"
              prop="gmoney"></yid-table-column>
            <yid-table-column label="批次门店" min-width="250">
              <template slot-scope="scope">{{
                scope.row.shopcode + ' ' + scope.row.shopname
              }}</template>
            </yid-table-column>
            <!--
                    <yid-table-column label="已使用的赠送金额度" min-width="120" prop="usezsmoney"></yid-table-column>
-->
            <yid-table-column
              label="注销卡金额度"
              min-width="150"
              prop="tkje"></yid-table-column>
            <yid-table-column
              label="注销赠送金额度"
              min-width="150"
              prop="tzje"></yid-table-column>
          </yid-table>
          <div
            style="
              display: flex;
              justify-content: space-between;
              padding: 15px 0;
            ">
            <span
              style="color: #00aaee; cursor: pointer"
              @click="showDetail('cards')"
              >查看卡金明细</span
            >
            <span>
              <el-checkbox v-model="billForm.cardChecked" disabled
                >会员卡储值金额为0时自动注销会员卡</el-checkbox
              >
              <el-tooltip
                class="item"
                effect="dark"
                content="勾选此选项后，退款复核成功后自动判断会员卡余额和赠送金余额为0时，注销此会员卡（判断所有门店的卡金批次）。"
                placement="right-start">
                <i class="icon iconfont el-icon-question"></i> </el-tooltip
            ></span>
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'可用套餐' + hyInfo.packages.length" name="second">
        <div>
          <yid-table :data="hyInfo.packages" ref="hypackages" height="300">
            <yid-table-column
              label="套餐名称"
              min-width="140"
              prop="packageinfoname"></yid-table-column>
            <yid-table-column
              label="项目/产品名称"
              prop="servname"></yid-table-column>
            <yid-table-column label="所属门店" min-width="250">
              <template slot-scope="scope">{{
                scope.row.shopcode + ' ' + scope.row.shopname
              }}</template>
            </yid-table-column>
            <yid-table-column
              label="所属卡号"
              min-width="100"
              prop="cardno"></yid-table-column>
            <yid-table-column
              label="总次数"
              min-width="60"
              prop="total"></yid-table-column>
            <yid-table-column
              label="剩余次数"
              min-width="60"
              prop="snum"></yid-table-column>
            <yid-table-column
              label="剩余金额"
              min-width="70"
              prop="lessmoney"></yid-table-column>
            <yid-table-column
              label="到期日期"
              min-width="150"
              prop="expiryTime"></yid-table-column>
            <yid-table-column
              label="批次单价"
              min-width="70"
              prop="singlePrice"></yid-table-column>
            <yid-table-column
              label="注销项目次数"
              min-width="100"
              property="tkpackageNum"></yid-table-column>
            <yid-table-column
              label="注销项目金额"
              min-width="100"
              prop="tkpackageje"></yid-table-column>
          </yid-table>
          <div
            style="
              display: flex;
              justify-content: space-between;
              padding: 15px 0;
            ">
            <span
              style="color: #00aaee; cursor: pointer"
              @click="showDetail('packages')"
              >查看套餐记录</span
            >
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'寄存产品' + hyInfo.products.length" name="third">
        <div>
          <yid-table :data="hyInfo.products" ref="hyproducts" height="300">
            <yid-table-column
              label="商品编号"
              min-width="80"
              prop="pcode"></yid-table-column>
            <yid-table-column label="商品名称" prop="pname"></yid-table-column>
            <yid-table-column label="寄存来源" min-width="80">
              <template slot-scope="scope">{{
                scope.row.source == 1
                  ? '购买商品'
                  : scope.row.couponType == 2
                  ? '套餐划扣'
                  : ''
              }}</template>
            </yid-table-column>
            <yid-table-column label="所属门店" min-width="150">
              <template slot-scope="scope">{{
                scope.row.shopcode + ' ' + scope.row.shopname
              }}</template>
            </yid-table-column>
            <yid-table-column
              label="所属卡号"
              min-width="100"
              prop="cardno"></yid-table-column>
            <yid-table-column
              label="购买时间"
              min-width="140"
              prop="buyTime"></yid-table-column>
            <yid-table-column
              label="寄存数量"
              min-width="70"
              prop="total"></yid-table-column>
            <yid-table-column
              label="剩余数量"
              min-width="70"
              prop="checknum"></yid-table-column>
            <yid-table-column
              label="寄存单价"
              min-width="70"
              prop="price"></yid-table-column>
            <yid-table-column
              label="注销数量"
              min-width="150"
              prop="tkproductNum"></yid-table-column>
            <yid-table-column
              label="注销金额"
              min-width="100"
              prop="tkproductje"></yid-table-column>
          </yid-table>
          <div
            style="
              display: flex;
              justify-content: space-between;
              padding: 15px 0;
            ">
            <span
              style="color: #00aaee; cursor: pointer"
              @click="showDetail('products')"
              >查看寄存记录</span
            >
          </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'优惠券' + hyInfo.coupons.length" name="four">
        <div>
          <yid-table :data="hyInfo.coupons" ref="hycoupons" height="300">
            <yid-table-column
              label="活动名称"
              min-width="140"
              prop="maname"></yid-table-column>
            <yid-table-column
              label="优惠券名称"
              min-width="120"
              prop="cpname"></yid-table-column>
            <yid-table-column
              label="发券单号"
              min-width="120"
              prop="sbillcode"></yid-table-column>
            <yid-table-column label="形式" min-width="120">
              <template slot-scope="scope">{{
                scope.row.couponType == 2
                  ? '折扣' + scope.row.discount + '折'
                  : scope.row.couponType == 1
                  ? '固定金额' + scope.row.discount + '元'
                  : ''
              }}</template>
            </yid-table-column>
            <yid-table-column
              label="领券时间"
              min-width="150"
              prop="couponcreatedTime"></yid-table-column>
            <yid-table-column label="发券门店" min-width="250">
              <template slot-scope="scope">{{
                scope.row.shopcode + ' ' + scope.row.shopname
              }}</template>
            </yid-table-column>
            <yid-table-column label="有效期" min-width="120">
              <template slot-scope="scope">
                {{
                  scope.row.sdate && scope.row.edate
                    ? scope.row.sdate.substring(0, 10) +
                      '~' +
                      scope.row.edate.substring(0, 10)
                    : '不限期'
                }}
              </template>
            </yid-table-column>
          </yid-table>
          <!-- <div style="display: flex; justify-content: space-between; padding: 15px 0">
                    <span style="color: #00AAEE; cursor: pointer" @click="showDetail('coupons')">查看优惠券使用明细</span>
                </div>-->
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'红包' + hyInfo.redpacks.length" name="five">
        <div>
          <yid-table :data="hyInfo.redpacks" ref="hyredpacks" height="300">
            <yid-table-column
              label="活动名称"
              min-width="140"
              prop="maname"></yid-table-column>
            <yid-table-column
              label="红包名称"
              min-width="120"
              prop="rname"></yid-table-column>
            <yid-table-column
              label="发券单号"
              min-width="120"
              prop="sbillcode"></yid-table-column>
            <yid-table-column
              label="价值"
              min-width="80"
              prop="money"></yid-table-column>
            <yid-table-column
              label="剩余金额"
              min-width="80"
              prop="ye"></yid-table-column>
            <yid-table-column
              label="领券时间"
              min-width="140"
              prop="redcreatedTime"></yid-table-column>
            <yid-table-column label="发券门店">
              <template slot-scope="scope">{{
                scope.row.shopcode + ' ' + scope.row.shopname
              }}</template>
            </yid-table-column>
            <yid-table-column label="有效期" min-width="140">
              <template slot-scope="scope">
                {{
                  scope.row.sdate && scope.row.edate
                    ? scope.row.sdate.substring(0, 10) +
                      '~' +
                      scope.row.edate.substring(0, 10)
                    : '不限期'
                }}
              </template>
            </yid-table-column>
            <yid-table-column
              label="注销金额"
              min-width="80"
              prop="tkredje"></yid-table-column>
          </yid-table>
          <!-- <div style="display: flex; justify-content: space-between; padding: 15px 0">
                    <span style="color: #00AAEE; cursor: pointer" @click="showDetail('coupons')">查看红包使用明细</span>
                </div>-->
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import yid from '@src/library'
import { mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'hydetail',
  props: {
    billForm: Object
  },
  watch: {
    activetab(v) {
      this.$parent.$parent.activetab = v
    }
  },
  data() {
    return {
      activetab: 'first',
      hyInfo: {
        cards: [],
        packages: [],
        products: [],
        coupons: [],
        redpacks: []
      },
      recordsinfo: {}
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo'
    })
  },
  mounted() {},
  methods: {
    async initData(obj) {
      //   await this.restData();
      this.baseData = obj
      this.recordsinfo = obj
      let headData = this.baseData.headData
      this.hyInfo.cards = headData.cardVOs
      this.hyInfo.packages = headData.packageVOs
      this.hyInfo.coupons = headData.couponVOs
      this.hyInfo.redpacks = headData.redpackVOs
      this.hyInfo.products = headData.productVOs
    },
    showDetail(type) {
      type == 'cards'
        ? (this.$parent.$parent.detailDialog.title = '卡金明细')
        : type == 'packages'
        ? (this.$parent.$parent.detailDialog.title = '套餐明细')
        : type == 'products'
        ? (this.$parent.$parent.detailDialog.title = '寄存记录')
        : type == 'coupons'
        ? (this.$parent.$parent.detailDialog.title = '优惠券记录')
        : type == 'redpacks'
        ? (this.$parent.$parent.detailDialog.title = '红包记录')
        : ''
      if (type == 'cards') {
        const res = new Map()
        this.recordsinfo.cardLists = this.hyInfo.cards.filter(
          card => !res.has(card.cardno) && res.set(card.cardno, 1)
        )
      }
      if (type == 'packages') {
        const res = new Map()
        this.recordsinfo.shopLists = this.hyInfo.packages.filter(
          pack => !res.has(pack.shopcode) && res.set(pack.shopcode, 1)
        )
      }
      if (type == 'products') {
        const res = new Map()
        this.recordsinfo.shopLists = this.hyInfo.products.filter(
          product => !res.has(product.shopcode) && res.set(product.shopcode, 1)
        )
      }
      if (type == 'coupons') {
        const res = new Map()
        this.recordsinfo.shopLists = this.hyInfo.coupons.filter(
          coupon => !res.has(coupon.shopcode) && res.set(coupon.shopcode, 1)
        )
      }
      if (type == 'redpacks') {
        const res = new Map()
        this.recordsinfo.shopLists = this.hyInfo.redpacks.filter(
          redpack => !res.has(redpack.shopcode) && res.set(redpack.shopcode, 1)
        )
      }

      this.$nextTick(() => {
        this.$parent.$parent.$refs.detailRecord.initData(this.recordsinfo)
      })
      this.$parent.$parent.detailDialog.visible = true
    }
  }
}
</script>
<style scoped lang="scss">
.hyrefund {
  height: 100%;
  /deep/.el-table {
    .disableRowClass {
      color: #ccc;
    }
  }
}
</style>
