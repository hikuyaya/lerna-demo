<template>
  <div class="billDetail">
      <el-page-header @back="goBack" content="详情页面"></el-page-header>
      <el-form ref="ruleForm" label-width="100px" >
          <el-form-item label="服务单号：">
              {{this.baseData.entryData.billcode}}
          </el-form-item>
          <el-form-item label="客户信息：">
              {{this.baseData.entryData.memName}} {{getSexName(this.baseData.entryData.sex)}} {{this.baseData.entryData.mobile}} 【{{this.baseData.entryData.cardInfo}} {{this.baseData.entryData.cmcode}}】
          </el-form-item>
          <el-form-item label="消费时间：">
              {{this.baseData.entryData.saleTime}}
          </el-form-item>
          <el-form-item label="计客数：">
              {{getIsCompute(this.baseData.entryData.isCompute)}}
          </el-form-item>
          <el-form-item label="消费详情：">
              <el-table
                      :data="tableData"
                      border
                      style="width: 100%">
                  <el-table-column
                          prop="sname"
                          label="消费内容"
                          width="180">
                    <template slot-scope="scope">
                          {{scope.row.sname}}{{(scope.row.norms == undefined || scope.row.norms == '')?'':'('+scope.row.norms+')'}}
                    </template>
                  </el-table-column>
                  <el-table-column
                          prop="stype"
                          label="消费类型"
                          width="180">
                      <template slot-scope="scope">
                          {{scope.row.stype == '1' ? "项目" : "产品"}}
                      </template>
                  </el-table-column>
                  <el-table-column
                          prop="ysje"
                          label="金额">
                      <template slot-scope="scope">
                          ￥{{scope.row.ysje}}
                      </template>
                  </el-table-column>
                  <el-table-column
                          prop="eename"
                          label="服务人员">
                      <template slot-scope="scope">
                          <span v-for="royaltys in scope.row.royaltyList">{{royaltys.eecode}} {{royaltys.eename}}<br></span>
                          <span><el-link type="primary" :underline="false" @click="editBill">编辑</el-link></span>
                      </template>
                  </el-table-column>
                  <el-table-column
                          prop="performance"
                          label="业绩">
                      <template slot-scope="scope">
                          <span v-for="royaltys in scope.row.royaltyList">￥{{royaltys.yj}} {{getisAppoint(royaltys.isApppoint)}}<br></span>
                      </template>
                  </el-table-column>
                  <el-table-column
                          prop="royalty"
                          label="提成">
                      <template slot-scope="scope">
                          <span v-for="royaltys in scope.row.royaltyList">￥{{royaltys.royalty == null ? 0 :royaltys.royalty}}<br></span>
                      </template>
                  </el-table-column>
              </el-table>
          </el-form-item>
          <el-form-item label="消费总金额：">
              ￥{{this.baseData.entryData.totalMoney}}
          </el-form-item>
          <el-form-item label="入账总金额：">
              ￥{{this.baseData.entryData.hjysje == null ? 0 : this.baseData.entryData.hjysje}}
          </el-form-item>
          <el-form-item label="支付方式：">
              <span v-for="pays in this.baseData.entryData.payList">{{pays.payname}} ￥{{pays.money}}<br></span>
          </el-form-item>
          <el-form-item>
              <el-button @click="get">打印小票</el-button>
              <el-button @click="get" type="primary">保存</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
    import service from '@src/service'
    export default {
        name: "billDetail",
        data() {
            return {
                baseData : {},
                tableData :[],
            }
        },
        methods: {
            async initData(obj){
                this.restData();
                this.baseData = obj;
                this.getYjs(this.baseData.billid);
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
                this.$emit('onClose');
            },
            getIsCompute(val){
                let result = '否';
                if(val == '1'){
                    result = '是';
                }
                return result;
            },
            restData(){
                Object.assign(this.$data, this.$options.data());
            },
            getYjs(id){
                //查询业绩列表
                service.cashier.serviceRecords.servicrecordyj({id:id}).then(res=>{
                    if(res.resp_code == 200) {
                        this.tableData = res.data;
                    }
                })
            },
            getSexName(sex){
                let res = '';
                if(sex === '1'){
                    res = '男';
                }else if(sex === '2'){
                    res = '女';
                }
                return res;
            },
            getisAppoint(isApppoint){
                let res = "";
                if(isApppoint === "0"){
                    res = "非指定"
                }else if(isApppoint === "1"){
                    res = "指定"
                }
                return res;
            },
        }
    }
</script>

<style scoped>

</style>
