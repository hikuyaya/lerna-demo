<template>
    <div class="member-review">
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="选择门店：">
                <el-select clearable v-model="searchForm.shopid" filterable :filter-method="filterShop" placeholder="请选择">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="选择月份：">
                <el-date-picker
                        v-model="searchForm.yearMonth"
                        value-format="yyyy-MM"
                        format="yyyy-MM"
                        type="month"
                        placeholder="提成月份">
                </el-date-picker>
            </el-form-item>
            <br/>
            <el-form-item label="单据类型：">
                <el-select clearable v-model="searchForm.btype" filterable placeholder="请选择">
                    <el-option
                            v-for="item in billtypeList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="员工：">
                <el-input clearable v-model="searchForm.eecodename" placeholder="姓名/工号"  style="width: 120px;"></el-input>
            </el-form-item>
            <el-form-item label="职务：">
                <el-select clearable v-model="searchForm.psid" filterable placeholder="请选择">
                    <el-option
                            v-for="item in positionList"
                            :key="item.id"
                            :label="item.psname"
                            :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
                <el-button @click="seachTc" type="primary">查询</el-button>
                <el-button @click="exportTc" type="primary">导出</el-button>
            </el-form-item>
        </el-form>
        <yid-table pagination ref="table">
            <yid-table-column label="员工姓名" min-width="100" prop="eename"></yid-table-column>
            <yid-table-column label="职务" min-width="120" prop="psname"></yid-table-column>
            <yid-table-column label="级别" min-width="120" prop="pslname"></yid-table-column>
            <yid-table-column label="日期" min-width="150" prop="billdate"></yid-table-column>
            <yid-table-column label="单号" min-width="150" prop="billcode"></yid-table-column>
            <yid-table-column label="项目" min-width="200" prop="sername"></yid-table-column>
            <yid-table-column label="业绩金额" min-width="100" prop="money"></yid-table-column>
            <yid-table-column label="提成比率" min-width="80" prop="royaltyRate"></yid-table-column>
            <yid-table-column label="提成金额" min-width="100" prop="royalty"></yid-table-column>
        </yid-table>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import {exportExecl} from "../../library/helper/execl";
    export default {
        name: "reviews",
        data() {
            return {
                searchForm : {
                    shopid: '',
                    yearMonth : '',
                    billtype : '',
                    eecodename : '',
                    psid : '',
                },
                billtypeList : [{
                    value : '1',
                    label : '收银'
                },{
                    value : '2',
                    label : '套餐'
                },{
                    value : '3',
                    label : '资格卡'
                },{
                    value : '4',
                    label : '储值卡'
                },{
                    value : '5',
                    label : '外卖'
                }],
                positionList : [],
                pageInfo:{page:1,limit:10},

                allShopList:[],
                filterShopList:[],
            }
        },
        mounted(){
            this.getShopList();
            let d = new Date
            let year = d.getFullYear()
            let month = d.getMonth()+1
            if(Number(month) < 10){
                month = "0" + month
            }
            let date1 = year + "-" + month
            this.searchForm.yearMonth = date1
            this.getData(this.searchForm);
            this.getPositionList();

        },
        methods:{
            getPositionList(){
                service.dept.jobAll({status : 1,bbid : 1}).then(res=>{
                    this.positionList = res.data;
                })
            },
            getData(reqParams){
                console.log(reqParams);
                const fetch = service.pers.stream.streamList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            seachTc(){
                this.getData(this.searchForm);
            },
            exportTc(){
                const head = {
                    eename: '员工姓名',
                    psname: '职务',
                    pslname: '级别',
                    billdate: '日期',
                    billcode: '单号',
                    sername: '项目',
                    money: '业绩金额',
                    royaltyRate: '提成比率',
                    royalty: '提成金额',
                }
                service.pers.stream.streamListExport({...this.searchForm}).then(res => {
                    if(res.resp_code=="200"){
                        res.data.forEach(item =>{
                            if(item.rate == '1'){
                                item.rate = '好评'
                            }else if(item.rate == '2'){
                                item.rate = '中评'
                            }else if(item.rate == '3'){
                                item.rate = '差评'
                            }

                            if(item.isReply == '0'){
                                item.isReply = '否';
                            }else if(item.isReply == '1'){
                                item.isReply = '是';
                            }
                        });
                        console.log(res.data)
                        exportExecl(head,res.data,"员工提成明细表");
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            getShopList() {
                service.chain.shop.shopList({status:'0'}).then(res => {
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
        }
    }
</script>

<style scoped>

</style>
