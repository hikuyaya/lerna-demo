<template>
  <div class="member-relation">
    <el-form ref="searchForm" inline :model="searchForm">
      <el-form-item label="日期：">
        <el-date-picker
            :clearable = false
            v-model="searchForm.createdTimeRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
        </el-date-picker>
        <el-form-item label="门店：" prop="shopid" :rules="[{ required: true, message: '请选择一个门店'}]">
          <el-select clearable v-model.trim="searchForm.shopid" @clear="clearFormShop" @blur="clearFormShop" filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
              <span style="float: left">{{ item.shopcode }}</span>
              <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-form-item>
      <el-form-item style="margin-bottom:0">
        <el-button @click="searchPt" type="primary">查询</el-button>
        <el-button @click="seniorSearch" type="primary">高级查询</el-button>
      </el-form-item>
    </el-form>
    <yid-table pagination ref="table" style="margin-top: 15px;">
      <yid-table-column label="来源" min-width="120" prop="channel">
        <template slot-scope="scope">{{scope.row.channel=='DY'?'抖音':scope.row.channel=='MT'?'美团':''}}</template>
      </yid-table-column>
      <yid-table-column label="券号" min-width="120" prop="code">
        <template slot-scope="scope">{{ scope.row.realCode ? scope.row.realCode : scope.row.code }}</template>
      </yid-table-column>
      <yid-table-column label="商品名称" min-width="250" prop="product"></yid-table-column>
      <yid-table-column label="券金额" min-width="100" prop="money"></yid-table-column>
      <yid-table-column label="使用门店" min-width="100" prop="shopname"></yid-table-column>
      <yid-table-column label="核销时间" min-width="150" prop="paySuccTime"></yid-table-column>
      <yid-table-column label="使用状态" min-width="80" prop="status">
        <template slot-scope="scope">
          <span v-if='scope.row.status == -1'>已取消</span>
          <span v-if='scope.row.status == 0'>未核销</span>
          <span v-if='scope.row.status == 1'>已核销</span>
          <span v-if='scope.row.status == 2'>已使用</span>
          <span v-if='scope.row.status == 3'>核销失败</span>
          <span v-if='scope.row.status == 4'>已退款</span>
        </template>
      </yid-table-column>
      <yid-table-column label="关联订单" min-width="150" prop="refbillcode"></yid-table-column>
      <yid-table-column label="操作人" min-width="100" prop="updatedBy"></yid-table-column>
      <yid-table-column label="是否退款" min-width="200" prop="content" fixed="right">
        <template slot-scope="scope">
          <span v-if='scope.row.status == 1'><el-link type="primary" @click="tkBill(scope.row)">标记退款</el-link></span>
          <span v-if='scope.row.status == 4'><el-link type="primary" @click="cancelTkBill(scope.row)">取消标记</el-link></span>
        </template>
      </yid-table-column>
    </yid-table>

    <yid-dialog :title="searchDialog.title" :visible.sync="searchDialog.visible" width="450px">
      <el-form label-width="140px" ref="copyForm">
        <el-form-item label="券号：" prop="code">
          <el-input  v-model="searchForm.code"  style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="商品名称：" prop="product">
          <el-input  v-model="searchForm.product"  style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="核销时间：" prop="paySuccTime">
          <el-date-picker
              :clearable = false
              v-model="searchForm.paySuccRange"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="核销来源：" prop="channel">
          <el-select filterable placeholder="请选择" v-model.trim="searchForm.channel" style="width: 200px">
            <el-option label="美团" value="MT"></el-option>
            <el-option label="抖音" value="DY"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用状态：" prop="status">
          <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.status" style="width: 200px">
            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in statusList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关联订单：" prop="billcode">
          <el-input  v-model="searchForm.billcode" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="操作人：" prop="updatedBy">
          <el-input  v-model="searchForm.updatedBy" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="cancel">取消</el-button>
          <el-button @click="searchgj" type="primary">提交</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
export default {
  name: "member-relation",
  components: {

  },
  data() {
    return {
      value1: '',
      activeName : 'analyze',
      searchForm  : {
        shopid : '',
        createdTimeRange : [],
        code : '',
        product : '',
        paySuccRange : [],
        status : '',
        channel:'',
        billcode : '',
        updatedBy : '',
      },
      pageInfo:{page:1,limit:10},
      searchDialog: {
        title: '高级查询',
        visible: false,
      },
      statusList : [{
        id : -1,
        name : '已取消'
      },{
        id : 0,
        name : '未核销'
      },{
        id : 1,
        name : '已核销'
      },{
        id : 2,
        name : '已使用'
      },{
        id : 3,
        name : '核销失败'
      },{
        id : 4,
        name : '已退款'
      }],
      filterShopList:[],
    }
  },
  mounted(){
    let d = new Date
    let year = d.getFullYear()
    let month = d.getMonth()+1
    if(Number(month) < 10){
      month = "0" + month
    }
    let day = d.getDate()
    if(Number(day) < 10){
      day = "0" + day
    }
    let date1 = year + "-" + month + "-" + day
    this.searchForm.createdTimeRange.push(date1)
    this.searchForm.createdTimeRange.unshift(date1)
    //this.search();
    this.getShopList({status:"1"});
  },
  computed:{
    searchFormReq: function () {
      let reqObj = {}
      let saleTimeRange = this.searchForm.createdTimeRange;
      let paySuccRange = this.searchForm.paySuccRange;
      if(saleTimeRange){
        reqObj.createdTimeStart = this.searchForm.createdTimeRange[0];
        reqObj.createdTimeEnd = this.searchForm.createdTimeRange[1];
      }else{
        reqObj.createdTimeStart = ''
        reqObj.createdTimeEnd = ''
      }
      if(paySuccRange){
        reqObj.paySuccTimeStart = this.searchForm.paySuccRange[0];
        reqObj.paySuccTimeEnd = this.searchForm.paySuccRange[1];
      }else{
        reqObj.paySuccTimeStart = ''
        reqObj.paySuccTimeEnd = ''
      }
      reqObj.code = this.searchForm.code;
      reqObj.product = this.searchForm.product;
      reqObj.status = this.searchForm.status;
      reqObj.billcode = this.searchForm.billcode;
      reqObj.channel = this.searchForm.channel;
      reqObj.updatedBy = this.searchForm.updatedBy;
      reqObj.shopid = this.searchForm.shopid;
      return reqObj;
    }
  },
  methods: {
    getData(reqParams){
      const fetch = service.cashier.thirdorder.thirdorderList
      const params = {...this.pageInfo,...reqParams}
      this.$refs.table.reloadData({
        fetch,
        params,
      });
    },
    search(){
      this.$refs['searchForm'].validate((valid) => {
        if (valid) {
          this.pageInfo.page=1
          this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
          let arg = this.DateMinus(this.searchFormReq.createdTimeStart, this.searchFormReq.createdTimeEnd);
          if(Number(arg) > 30){
            $yid.util.error("时间间隔请选择30天之内!");
            return;
          }
          this.getData(this.searchFormReq);
        }
      })
    },
    seniorSearch(){
      this.searchForm.paySuccRange = [];
      this.searchForm.code = '';
      this.searchForm.product = '';
      this.searchForm.status = '';
      this.searchForm.channel = '';
      this.searchForm.billcode = '';
      this.searchForm.updatedBy = '';
      this.searchDialog.visible = true;
    },
    cancel(){
      this.searchDialog.visible = false;
    },
    searchPt(){
      this.searchForm.paySuccRange = [];
      this.searchForm.code = '';
      this.searchForm.product = '';
      this.searchForm.status = '';
      this.searchForm.channel = '';
      this.searchForm.billcode = '';
      this.searchForm.updatedBy = '';
      console.log(this.searchFormReq);
      this.search();
    },
    searchgj(){
      console.log(this.searchFormReq);
      this.search();
      this.searchDialog.visible = false;
    },
    getShopList(params){
      service.chain.shop.shopList(params).then(res=> {
        if(res.resp_code == 200) {
          this.filterShopList = res.data;
          this.allShopList = Object.assign(this.filterShopList);//保留原数据
        }
      })
    },
    filterShop(v){
      this.filterShopList = this.allShopList.filter((item) => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true

      })
    },
    tkBill(row){
      const params = {};
      params.id = row.id;
      params.status = '4';
      //标记退款
      if(row.status === '1'){
        // status = 1 直接修改status=4
        service.cashier.thirdorder.tkBill(params).then(res=> {
          if(res.resp_code == 200) {
            $yid.util.success("操作成功!");
          }else{
            $yid.util.error(res.resp_msg)
            return
          }
          this.search();
        });
      }else if(row.status === '2'){
        // status = 2 提示‘请先删除对应消费单后再操作’ 再修改status=4
        $yid.util.confirm('先删除对应消费单后再操作', '','', ()=> {
          service.cashier.thirdorder.tkBill(params).then(res=> {
            if(res.resp_code == 200) {
              $yid.util.success("操作成功!");
            }else{
              $yid.util.error(res.resp_msg)
              return
            }
            this.search();
          });
        });
      }else {
        $yid.util.error("未知状态");
      }
    },
    cancelTkBill(row){
      const params = {};
      params.id = row.id;
      params.status = '1';
      //取消标记退款 直接修改status=1
      service.cashier.thirdorder.tkBill(params).then(res=> {
        if(res.resp_code == 200) {
          $yid.util.success("操作成功!");
        }else{
          $yid.util.error(res.resp_msg)
          return
        }
        this.search();
      });
    },
    DateMinus(date1, date2) {
      //date1:小日期   date2:大日期
      var sdate = new Date(date1);
      var now = new Date(date2);
      var days = now.getTime() - sdate.getTime();
      var day = parseInt(days / (1000 * 60 * 60 * 24));
      return day;
    },
    clearFormShop(){
      setTimeout(() =>{
        if(this.searchForm.shopid == ''){
          this.searchForm.shopid = "";
          this.filterShopList = Object.assign(this.allShopList);
        }

      },300)
    },
  }
}
</script>

<style scoped lang="scss">
.member-relation {

}
</style>
