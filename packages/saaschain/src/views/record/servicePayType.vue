<!--<template>-->
<!--  <div class="member-relation">-->
<!--    <el-collapse-transition>-->
<!--      <div v-show="!detailShow">-->
<!--        <el-form ref="searchForm" inline :model="searchForm">-->
<!--          <el-form-item label="日期：">-->
<!--            <el-date-picker-->
<!--                :clearable = false-->
<!--                v-model="searchForm.updatedTimeRange"-->
<!--                type="daterange"-->
<!--                value-format="yyyy-MM-dd"-->
<!--                range-separator="至"-->
<!--                start-placeholder="开始日期"-->
<!--                end-placeholder="结束日期">-->
<!--            </el-date-picker>-->
<!--          </el-form-item>-->
<!--          <el-form-item label="业务类型：">-->
<!--            <el-select clearable v-model="searchForm.serviceType"  placeholder="请选择" style="width: 100px">-->
<!--              <el-option label="美发" value="01"></el-option>-->
<!--              <el-option label="美容" value="02"></el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          &lt;!&ndash;<el-form-item label="门店：" prop="shopid" :rules="[{ required: true, message: '请选择一个门店'}]">&ndash;&gt;-->
<!--          <el-form-item label="门店：" prop="shopid">-->
<!--            <el-select clearable v-model.trim="searchForm.shopid"   @clear="clearFormShop"  placeholder="请选择门店" style="width: 160px;">-->
<!--              <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">-->
<!--                <span style="float: left">{{ item.shopcode }}</span>-->
<!--                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>-->
<!--              </el-option>-->
<!--            </el-select>-->
<!--          </el-form-item>-->
<!--          <el-form-item style="margin-bottom:0">-->
<!--            <el-button @click="search" type="primary">查询</el-button>-->
<!--            <el-button @click="importBill" type="primary">导出</el-button>-->
<!--          </el-form-item>-->
<!--        </el-form>-->
<!--        <el-alert v-model="viewTotal" :title="viewTotal.title"-->
<!--                  type="info">-->
<!--        </el-alert>-->
<!--        <yid-table pagination ref="table" style="margin-top: 15px;">-->
<!--          <yid-table-column label="区" min-width="180" prop="billcode"></yid-table-column>-->
<!--          <yid-table-column label="部" min-width="120" prop="shopname"></yid-table-column>-->
<!--          <yid-table-column label="处" min-width="180" prop="updatedTime"></yid-table-column>-->
<!--          <yid-table-column label="门店编码" min-width="120" prop="shopname"></yid-table-column>-->
<!--          <yid-table-column label="门店名称" min-width="180" prop="updatedTime"></yid-table-column>-->
<!--          <yid-table-column label="服务单数总数" min-width="120" prop="shopname"></yid-table-column>-->
<!--          <yid-table-column label="扫码" min-width="180" prop="updatedTime"></yid-table-column>-->
<!--          <yid-table-column label="读卡" min-width="120" prop="shopname"></yid-table-column>-->
<!--          <yid-table-column label="未读卡" min-width="180" prop="updatedTime"></yid-table-column>-->
<!--          <yid-table-column label="线上预约开单" min-width="120" prop="shopname"></yid-table-column>-->
<!--        </yid-table>-->
<!--      </div>-->
<!--    </el-collapse-transition>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--import service from '@src/service'-->
<!--import download from '@src/library/http/download'-->
<!--export default {-->
<!--  name: "member-relation",-->
<!--  components: {-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      detailShow : false,-->
<!--      searchForm  : {-->
<!--        updatedTimeRange : [],-->
<!--        serviceType:''-->
<!--      },-->
<!--      pageInfo:{page:1,limit:10},-->
<!--    }-->
<!--  },-->
<!--  mounted(){-->
<!--    let d = new Date-->
<!--    let year = d.getFullYear()-->
<!--    let month = d.getMonth()+1-->
<!--    if(Number(month) < 10){-->
<!--      month = "0" + month-->
<!--    }-->
<!--    let day = d.getDate()-->
<!--    if(Number(day) < 10){-->
<!--      day = "0" + day-->
<!--    }-->
<!--    let date1 = year + "-" + month + "-" + day-->
<!--    this.searchForm.updatedTimeRange.push(date1)-->
<!--    this.searchForm.updatedTimeRange.unshift(date1)-->
<!--    this.init();-->
<!--    //this.getCraftsmans();-->
<!--    // this.getCardpays();-->
<!--    //this.search();-->
<!--    // this.getShopList({status:"1"});-->
<!--    // this.getMtkInfos();-->
<!--  },-->
<!--  computed:{-->
<!--    searchFormReq: function () {-->
<!--      let reqObj = {}-->
<!--      let updatedTimeRange = this.searchForm.updatedTimeRange;-->
<!--      if(updatedTimeRange){-->
<!--        reqObj.updatedTimeStart = this.searchForm.updatedTimeRange[0];-->
<!--        reqObj.updatedTimeEnd = this.searchForm.updatedTimeRange[1];-->
<!--      }else{-->
<!--        reqObj.updatedTimeStart = ''-->
<!--        reqObj.updatedTimeEnd = ''-->
<!--      }-->
<!--      reqObj.shopid = this.searchForm.shopid-->
<!--      reqObj.eename = this.searchForm.eename-->
<!--      return reqObj;-->
<!--    },-->
<!--  },-->
<!--  methods: {-->
<!--    init() {-->
<!--      service.serviceInfo.findbranch({"status": "1"}).then(res => {-->
<!--        this.branch = res.data-->
<!--      });-->
<!--    },-->
<!--    getData(reqParams){-->
<!--      const fetch = service.cashier.cardRecords.cardRecordList-->
<!--      const params = {...this.pageInfo,...reqParams}-->
<!--      this.$refs.table.reloadData({-->
<!--        fetch,-->
<!--        params,-->
<!--      });-->
<!--    },-->
<!--    //获取服务人员列表-->
<!--    /*getCraftsmans(){-->
<!--        service.employee.listAll({isDel:'0',status:'1'}).then(res=> {-->
<!--            if(res.resp_code == 200) {-->
<!--                this.employeeList = res.data;-->
<!--            }-->
<!--        })-->
<!--    },*/-->
<!--    // getCardpays(){-->
<!--    //   service.cashier.payType.listAll({}).then(res=> {-->
<!--    //     if(res.resp_code == 200) {-->
<!--    //       this.cardpays = res.data;-->
<!--    //     }-->
<!--    //   })-->
<!--    // },-->
<!--    // getMtkInfos(){-->
<!--    //   service.cashier.mktInfo.listAll({matype:"2",isDel:"0"}).then(res=>{-->
<!--    //     if(res.resp_code == 200) {-->
<!--    //       this.mktInfos = res.data;-->
<!--    //     }-->
<!--    //   })-->
<!--    // },-->
<!--    // seniorSearch(){-->
<!--    //   this.searchDialog.visible = true;-->
<!--    // },-->
<!--    search(){-->
<!--      this.$refs['searchForm'].validate((valid) => {-->
<!--        if (valid) {-->
<!--          this.pageInfo.page=1-->
<!--          this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;-->
<!--          if($yid.util.isEmpty(this.searchFormReq.updatedTimeStart) || $yid.util.isEmpty(this.searchFormReq.updatedTimeEnd)){-->
<!--            $yid.util.alert("请选择日期再进行查询!");-->
<!--            return;-->
<!--          }-->
<!--          let arg = this.DateMinus(this.searchFormReq.updatedTimeStart, this.searchFormReq.updatedTimeEnd);-->
<!--          if(Number(arg) > 60){-->
<!--            $yid.util.error("时间间隔请选择60天之内!");-->
<!--            return;-->
<!--          }-->
<!--          // this.cleanSearch();-->
<!--          this.getData(this.searchFormReq);-->
<!--        }-->
<!--      })-->
<!--    },-->
<!--    // gjsearch(){-->
<!--    //   this.$refs['searchForm'].validate((valid) => {-->
<!--    //     if (valid) {-->
<!--    //       this.pageInfo.page=1-->
<!--    //       this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;-->
<!--    //       if($yid.util.isEmpty(this.searchFormReq.updatedTimeStart) || $yid.util.isEmpty(this.searchFormReq.updatedTimeEnd)){-->
<!--    //         $yid.util.alert("请选择日期再进行查询!");-->
<!--    //         return;-->
<!--    //       }-->
<!--    //       let arg = this.DateMinus(this.searchFormReq.updatedTimeStart, this.searchFormReq.updatedTimeEnd);-->
<!--    //       if(Number(arg) > 30){-->
<!--    //         $yid.util.error("时间间隔请选择30天之内!");-->
<!--    //         return;-->
<!--    //       }-->
<!--    //       this.getData(this.searchFormReq);-->
<!--    //     }-->
<!--    //   })-->
<!--    // },-->
<!--    // cleanSearch(){-->
<!--    //   this.searchForm.billcode = '';-->
<!--    //   this.searchForm.mobile = '';-->
<!--    //   this.searchForm.paycode = '';-->
<!--    //   this.searchForm.memName = '';-->
<!--    //   this.searchForm.cmcode = '';-->
<!--    //   this.searchForm.isOpen = '';-->
<!--    //   this.searchForm.eeid = '';-->
<!--    //   this.searchForm.minmoney = '';-->
<!--    //   this.searchForm.maxmoney = '';-->
<!--    //   this.searchForm.ismkt = '';-->
<!--    //   this.searchForm.mktbillcode = '';-->
<!--    //   this.searchForm.eename = '';-->
<!--    // },-->
<!--    // searchgj(){-->
<!--    //   console.log(this.searchFormReq);-->
<!--    //   this.gjsearch();-->
<!--    //   this.searchDialog.visible = false;-->
<!--    // },-->
<!--    // cancel(){-->
<!--    //   this.searchDialog.visible = false;-->
<!--    // },-->
<!--    // getSexName(sex){-->
<!--    //   let res = '';-->
<!--    //   if(sex === '1'){-->
<!--    //     res = '男';-->
<!--    //   }else if(sex === '2'){-->
<!--    //     res = '女';-->
<!--    //   }-->
<!--    //   return res;-->
<!--    // },-->
<!--    // checkDetail(row) {-->
<!--    //   this.detailShow = true;-->
<!--    //   this.detailInitData.billid = row.id;-->
<!--    //   this.detailInitData.entryData = row;-->
<!--    //   this.$refs.billDetailPage.initData(this.detailInitData);-->
<!--    // },-->
<!--    // closeDetailPage(){-->
<!--    //   this.detailInitData = {};-->
<!--    //   this.detailShow = false;-->
<!--    //   this.search();-->
<!--    // },-->
<!--    // revokeBill(row){-->
<!--    //   this.revokeForm.id = row.id;-->
<!--    //   this.revokeForm.billcode = row.billcode;-->
<!--    //   this.revokeForm.hcMemo = '';-->
<!--    //   this.revokeDialog.visible = true;-->
<!--    // },-->
<!--    // revokeCancel(){-->
<!--    //   this.revokeDialog.visible = false;-->
<!--    // },-->
<!--    // revoke(){-->
<!--    //   if(this.revokeForm.id == null || this.revokeForm.id.length == 0){-->
<!--    //     $yid.util.alert("单据id为空，不允许撤单");-->
<!--    //     return-->
<!--    //   }-->
<!--    //   if(this.revokeForm.hcMemo != null && this.revokeForm.hcMemo.length > 0){-->
<!--    //     if(this.revokeForm.hcMemo.length > 30){-->
<!--    //       $yid.util.alert("撤单备注不能超过30个字");-->
<!--    //       return-->
<!--    //     }-->
<!--    //   }-->
<!--    //   service.cashier.cardRecords.recall(this.revokeForm).then(res=>{-->
<!--    //     if(res.resp_code == 200) {-->
<!--    //       $yid.util.success("操作成功");-->
<!--    //       this.revokeDialog.visible = false;-->
<!--    //       this.search();-->
<!--    //     }else{-->
<!--    //       $yid.util.error(res.resp_msg)-->
<!--    //       return-->
<!--    //     }-->
<!--    //   })-->
<!--    // },-->
<!--    // getShopList(params){-->
<!--    //   service.chain.shop.shopList(params).then(res=> {-->
<!--    //     if(res.resp_code == 200) {-->
<!--    //       this.filterShopList = res.data;-->
<!--    //       this.allShopList = Object.assign(this.filterShopList);//保留原数据-->
<!--    //     }-->
<!--    //   })-->
<!--    // },-->
<!--    // filterShop(v){-->
<!--    //   this.filterShopList = this.allShopList.filter((item) => {-->
<!--    //     // 如果直接包含输入值直接返回true-->
<!--    //     if (item.shopname.indexOf(v) !== -1) return true-->
<!--    //     if (item.shopcode.indexOf(v) !== -1) return true-->
<!--    //-->
<!--    //   })-->
<!--    // },-->
<!--    clearFormShop(){-->
<!--      // this.searchForm.shopid = "";-->
<!--      // this.filterShopList = Object.assign(this.allShopList);-->
<!--    },-->
<!--    importBill(){-->
<!--      console.log(this.searchFormReq);-->
<!--      let updatedTimeStart = this.searchFormReq.updatedTimeStart;-->
<!--      let updatedTimeEnd = this.searchFormReq.updatedTimeEnd;-->
<!--      /*let shopid = this.searchFormReq.shopid;-->
<!--      if($yid.util.isEmpty(shopid)){-->
<!--          $yid.util.error("请选择门店");-->
<!--          return;-->
<!--      }*/-->
<!--      if($yid.util.isEmpty(updatedTimeStart) || $yid.util.isEmpty(updatedTimeEnd)){-->
<!--        $yid.util.error("请选择日期");-->
<!--        return;-->
<!--      }-->
<!--      let arg = this.DateMinus(updatedTimeStart, updatedTimeEnd);-->
<!--      if(Number(arg) > 60){-->
<!--        $yid.util.error("时间间隔请选择60天之内!");-->
<!--        return;-->
<!--      }-->
<!--      download($yid.config.API.BASE + 'api-cashier/cardrecords/cardrecordsExportForChain', this.searchFormReq)-->
<!--    },-->
<!--    DateMinus(date1, date2) {-->
<!--      //date1:小日期   date2:大日期-->
<!--      var sdate = new Date(date1);-->
<!--      var now = new Date(date2);-->
<!--      var days = now.getTime() - sdate.getTime();-->
<!--      var day = parseInt(days / (1000 * 60 * 60 * 24));-->
<!--      return day;-->
<!--    },-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style scoped lang="scss">-->
<!--.member-relation {-->

<!--}-->
<!--</style>-->
