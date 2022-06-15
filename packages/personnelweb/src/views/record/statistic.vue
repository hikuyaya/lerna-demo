<template>
  <div class="member-relation">
    <el-form ref="searchForm" inline :model="searchForm">
      <el-form-item label="门店：" prop="shopid" :rules="[{ required: true, message: '请选择一个门店'}]">
        <el-select clearable v-model.trim="searchForm.shopid" filterable :filter-method="filterShop" placeholder="请选择"
                   style="width: 160px;">
          <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
            <span style="float: left">{{ item.shopcode }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="日期：">
        <el-date-picker
            :clearable=false
            v-model="searchForm.payTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="支付方式：">
        <el-select style="width: 160px;" v-model="searchForm.paycode">
          <el-option label="全部" value=""></el-option>
          <el-option label="银联通" value="52"></el-option>
          <el-option label="建行生活" value="53"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-bottom:0">
        <el-button @click="search" type="primary">查询</el-button>
        <!--<el-button @click="seniorSearch" type="primary">高级查询</el-button>-->
      </el-form-item>
    </el-form>
    <!--<el-alert v-model="viewTotal" :title="viewTotal.title"
              type="info">
    </el-alert>-->
    <yid-table pagination ref="table" style="margin-top: 15px;">
      <yid-table-column label="支付类型" min-width="100" prop="payname"></yid-table-column>
      <yid-table-column label="交易号" min-width="180" prop="paymentNo"></yid-table-column>
      <yid-table-column label="系统单号" min-width="180" prop="billcode"></yid-table-column>
      <yid-table-column label="店名" min-width="120" prop="shopname"></yid-table-column>
      <yid-table-column label="金额" min-width="80" prop="money">
        <template slot-scope="scope">
          ￥{{ scope.row.money }}
        </template>
      </yid-table-column>
      <yid-table-column label="支付时间" min-width="180" prop="payTime"></yid-table-column>
      <yid-table-column label="预收款关联" min-width="100" prop="refmemo">
        <template slot-scope="scope">
          <template v-if="scope.row.refmemo">{{ scope.row.refmemo }}</template>
          <template v-if="!scope.row.refmemo">--</template>
        </template>
      </yid-table-column>
      <yid-table-column label="预收款备注" min-width="100" prop="paymemo">
        <template slot-scope="scope">
          <template v-if="scope.row.paymemo">{{ scope.row.paymemo }}</template>
          <template v-if="!scope.row.paymemo">--</template>
        </template>
      </yid-table-column>
      <yid-table-column label="状态" min-width="100" prop="status">
        <template slot-scope="scope">
          {{ getStatusName(scope.row.status) }}
        </template>
      </yid-table-column>
      <yid-table-column label="剩余金额" min-width="80" prop="verMoney">
        <template slot-scope="scope">
          <template v-if="scope.row.verMoney">￥{{ scope.row.verMoney }}</template>
          <template v-if="!scope.row.verMoney">--</template>
        </template>
      </yid-table-column>
      <yid-table-column label="核销记录" min-width="180" prop="recordList">
        <template slot-scope="scope">
          <template v-if="scope.row.recordList.length > 0">
            <span
                v-for="record in scope.row.recordList">{{ record.refbillcode }}&nbsp;&nbsp;￥{{ record.money }}<br></span>
          </template>
          <template v-if="scope.row.recordList.length == 0">--</template>
        </template>
      </yid-table-column>
      <yid-table-column label="操作" min-width="80" prop="content">
        <template slot-scope="scope">
          <template v-if="scope.row.money === scope.row.verMoney">
            <template v-if="scope.row.status === '1'">
              <el-link type="primary" @click="revokeBill(scope.row)">退款</el-link>
            </template>
          </template>
          <template v-if="scope.row.money != scope.row.verMoney">--</template>
        </template>
      </yid-table-column>
    </yid-table>
  </div>
</template>

<script>
import service from '@src/service'

export default {
  name: "member-relation",
  components: {},
  data() {
    return {
      value1: '',
      activeName: 'analyze',
      searchForm: {
        shopid: "",
        payTimeRange: [],
        paycode: ""
      },
      pageInfo: {page: 1, limit: 10},
      viewTotal: {
        title: '本次查询共  0 条记录   总金额：￥0.00     支付宝:￥0 微信：￥0'
      },
      statusList: [{
        id: 0,
        name: '未支付'
      }, {
        id: 1,
        name: '未使用完毕'
      }, {
        id: 2,
        name: '已使用'
      }, {
        id: 3,
        name: '交易失败'
      }, {
        id: 4,
        name: '已退款'
      }, {
        id: 9,
        name: '营业外收入'
      }],
      allShopList: [],
      filterShopList: [],
    }
  },
  mounted() {
    this.getShopList();
    let d = new Date
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    if (Number(month) < 10) {
      month = "0" + month
    }
    let day = d.getDate()
    if (Number(day) < 10) {
      day = "0" + day
    }
    let date1 = year + "-" + month + "-" + day
    this.searchForm.payTimeRange.push(date1)
    this.searchForm.payTimeRange.unshift(date1)
    //this.search();
  },
  computed: {
    searchFormReq: function () {
      let reqObj = {}
      let saleTimeRange = this.searchForm.payTimeRange;
      if (saleTimeRange) {
        reqObj.payTimeStart = this.searchForm.payTimeRange[0];
        reqObj.payTimeEnd = this.searchForm.payTimeRange[1];
      } else {
        reqObj.payTimeStart = ''
        reqObj.payTimeEnd = ''
      }
      reqObj.shopid = this.searchForm.shopid;
      return reqObj;
    }
  },
  methods: {
    getData(reqParams) {
      const fetch = service.cashier.prepaidorder.orderList;
      const params = {...this.pageInfo, ...reqParams}
      this.$refs.table.reloadData({
        fetch,
        params,
      });
      /*//显示总条数和金额
      service.cashier.turnover.turnoverListSum(params).then(res=>{
          if(res.resp_code == 200) {
              let totalMoney = 0;
              let zfbMoney = 0;
              let wxMoney = 0;
              let date = res.data;
              let totalNum = date.length;
              date.forEach(item=>{
                  let money = Number(item.money);
                  let paycode = item.paycode;
                  if(paycode == '02'){//支付宝
                      zfbMoney = zfbMoney + money;
                  }
                  if(paycode == '03'){//微信
                      wxMoney = wxMoney + money;
                  }
                  totalMoney = totalMoney + money;
              })
              this.viewTotal.title = '本次查询共'+ totalNum +'条记录   总金额：￥'+totalMoney+'     支付宝:￥'+zfbMoney+' 微信：￥'+wxMoney;
          }
      });*/
    },
    search() {
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.searchFormReq.paycode = this.searchForm.paycode;
          this.pageInfo.page = 1
          this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
          let arg = this.DateMinus(this.searchFormReq.payTimeStart, this.searchFormReq.payTimeEnd);
          if (Number(arg) > 30) {
            $yid.util.error("时间间隔请选择30天之内!");
            return;
          }
          this.getData(this.searchFormReq);
        }
      })
    },
    getStatusName(key) {
      for (let i = 0; i < this.statusList.length; i++) {
        let statusObj = this.statusList[i]
        if (statusObj.id == key) {
          return statusObj.name;
        }
      }
    },
    revokeBill(row) {
      $yid.util.confirm('您确认要操作退款吗？', '', '', () => {
        if (row.status === '4') {
          $yid.util.error("已退款状态，不允许再次退款");
          return;
        }
        const param = {};
        param.billcode = row.billcode;
        param.paycode = row.paycode;
        //调用退款接口进行退款
        service.cashier.prepaidorder.refound(param).then(res => {
          if (res.resp_code == 200) {
            $yid.util.success("退款成功");
            this.search();
          } else {
            $yid.util.error(resp_msg);
          }
        })
      })
    },
    getShopList() {
      service.chain.shop.shopList({status: '1'}).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data;
          this.allShopList = Object.assign(this.filterShopList);//保留原数据
        }
      })
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter((item) => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    DateMinus(date1, date2) {
      //date1:小日期   date2:大日期
      var sdate = new Date(date1);
      var now = new Date(date2);
      var days = now.getTime() - sdate.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      return day;
    }
  }
}
</script>

<style scoped lang="scss">
.member-relation {

}
</style>
