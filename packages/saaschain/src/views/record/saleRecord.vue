<template>
    <div class="member-relation">
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="日期：">
                <el-date-picker
                        v-model="searchForm.saleTimeRange"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="门店：">
                <el-select clearable v-model.trim="searchForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom:0">
                <el-button @click="search" type="primary">查询</el-button>
                <el-button @click="seniorSearch" type="primary">高级查询</el-button>
            </el-form-item>
        </el-form>
        <el-alert v-model="viewTotal" :title="viewTotal.title"
                  type="info">
        </el-alert>
        <yid-table pagination ref="table" style="margin-top: 15px;">
            <yid-table-column label="单号" min-width="150" prop="billcode"></yid-table-column>
            <yid-table-column label="销售时间" min-width="180" prop="saleTime"></yid-table-column>
            <yid-table-column label="顾客信息" min-width="200" prop="cardInfo">
                <template slot-scope="scope">
                    <span>{{scope.row.memName}}</span><br>
                    <span>{{scope.row.mobile}}</span><br>
                    <span>{{scope.row.cardInfo}}</span>
                    <span>{{scope.row.cmcode}}</span>
                </template>
            </yid-table-column>
            <yid-table-column label="金额" min-width="200" prop="payments">
                <template slot-scope="scope">
                    <span v-for="pays in scope.row.paysList">￥{{pays.money}}({{pays.payname}})<br></span>
                </template>
            </yid-table-column>
            <yid-table-column label="套餐内容" min-width="200" prop="snames">
                <template slot-scope="scope">
                    <span v-for="servs in scope.row.servVOList">￥{{servs.sname}}*{{servs.num}}<br></span>
                </template>
            </yid-table-column>
            <yid-table-column label="员工" min-width="200" prop="members">
                <template slot-scope="scope">
                    <span v-for="yjs in scope.row.royaltyList">{{yjs.eecode}} {{yjs.eename}}<br></span>
                    <span><el-link type="primary" :underline="false" @click="editBill">编辑</el-link></span>
                </template>
            </yid-table-column>
            <yid-table-column label="业绩" min-width="200" prop="eeyjs">
                <template slot-scope="scope">
                    <span v-for="yjs in scope.row.royaltyList">￥{{yjs.yjje== null ? 0 :yjs.yjje}}<br></span>
                </template>
            </yid-table-column>
            <yid-table-column label="提成" min-width="200" prop="royaltys">
                <template slot-scope="scope">
                    <span v-for="yjs in scope.row.royaltyList">￥{{yjs.royalty== null ? 0 :yjs.royalty}}<br></span>
                </template>
            </yid-table-column>
            <yid-table-column label="操作人" min-width="150" prop="updatedBy"></yid-table-column>
            <yid-table-column label="操作" min-width="150" prop="content" fixed="right">
                <template slot-scope="scope">
                    <el-link type="primary">撤单</el-link>
                    <el-link type="primary" style="margin: 0 10px 0 10px;">打印小票</el-link>
                </template>
            </yid-table-column>
        </yid-table>
        <yid-dialog :title="searchDialog.title" :visible.sync="searchDialog.visible" width="450px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="服务单号：" prop="billcode">
                    <el-input  v-model="searchForm.billcode"  style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="电话号码：" prop="mobile">
                    <el-input  v-model="searchForm.mobile"  style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="支付方式：" prop="paycode">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.paycode">
                        <el-option :key="item.paycode" :label="item.payname" :value="item.paycode" v-for="item in cardpays"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="顾客姓名：" prop="memName">
                    <el-input  v-model="searchForm.memName" style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="会员卡号：" prop="channel">
                    <el-input  v-model="searchForm.cmcode" style="width: 120px;"></el-input>
                </el-form-item>
                <el-form-item label="项目/套餐名称：" prop="isOpen">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.sid">
                        <el-option :key="item.id" :label="item.spname" :value="item.id" v-for="item in packages"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="提成员工：" prop="eeid">
                    <el-select value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.eeid">
                        <el-option :key="item.id" :label="item.eename" :value="item.id" v-for="item in employeeList"></el-option>
                    </el-select>
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
                    saleTimeRange : [],
                    isDel : '0',
                    isHc : '',
                    status : '',
                    billcode : '',
                    mobile : '',
                    paycode : '',
                    memName : '',
                    cmcode : '',
                    sid : '',
                    eeid : '',
                    shopid:""
                },
                pageInfo:{page:1,limit:10},
                searchDialog: {
                    title: '高级查询',
                    visible: false,
                },
                totalNum : '',
                totalMoney : '',
                viewTotal : {
                    title : '本次查询共  0 条记录    合计总金额：￥0'
                },
                packages : [],
                employeeList : [],
                cardpays : [],
                allShopList:[],
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
            this.searchForm.saleTimeRange.push(date1)
            this.searchForm.saleTimeRange.unshift(date1)
            this.getCraftsmans();
            this.getCardpays();
            this.getPackages();
            this.search();
            this.getShopList({status:"1"});
        },
        computed:{
            searchFormReq: function () {
                let reqObj = {}
                let saleTimeRange = this.searchForm.saleTimeRange;
                if(saleTimeRange){
                    reqObj.saleTimeStart = this.searchForm.saleTimeRange[0];
                    reqObj.saleTimeEnd = this.searchForm.saleTimeRange[1];
                }
                reqObj.billcode = this.searchForm.billcode
                reqObj.mobile = this.searchForm.mobile
                reqObj.paycode = this.searchForm.paycode
                reqObj.memName = this.searchForm.memName
                reqObj.cmcode = this.searchForm.cmcode
                reqObj.sid = this.searchForm.sid
                reqObj.eeid = this.searchForm.eeid
                reqObj.isDel = this.searchForm.isDel
                reqObj.isHc = this.searchForm.isHc
                reqObj.status = this.searchForm.status
                reqObj.shopid = this.searchForm.shopid
                return reqObj;
            }
        },
        methods: {
            getData(reqParams){
                const fetch = service.cashier.packageRecords.packagerecordList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
                //显示总条数和金额
                service.cashier.packageRecords.packagerecordListSum(params).then(res=>{
                    if(res.resp_code == 200) {
                        let date = res.data;
                        if(date != null){
                            this.viewTotal.title = '本次查询共  '+date.totalNum+' 条记录    合计总金额：￥'+date.totalMoney;
                        }
                    }
                });
            },
            //获取服务人员列表
            getCraftsmans(){
                service.employee.listAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.employeeList = res.data;
                    }
                })
            },
            getCardpays(){
                service.cashier.payType.listAll({}).then(res=> {
                    if(res.resp_code == 200) {
                        this.cardpays = res.data;
                    }
                })
            },
            getPackages(){
                service.servicepackage.findAll({isDel:'0'}).then(res=>{
                    if(res.resp_code == 200){
                        this.packages = res.data;
                    }
                })
            },
            seniorSearch(){
                this.searchDialog.visible = true;
            },
            search(){
                this.pageInfo.page=1
                this.getData(this.searchFormReq);
                this.cleanSearch();
            },
            cleanSearch(){
                this.searchForm.billcode = '';
                this.searchForm.mobile = '';
                this.searchForm.paycode = '';
                this.searchForm.memName = '';
                this.searchForm.cmcode = '';
                this.searchForm.isOpen = '';
                this.searchForm.eeid = '';
            },
            searchgj(){
                console.log(this.searchFormReq);
                this.search();
                this.searchDialog.visible = false;
            },
            cancel(){
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
            }
        }
    }
</script>

<style scoped lang="scss">
    .member-relation {

    }
</style>
