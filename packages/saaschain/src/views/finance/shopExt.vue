<template>
    <div class="salaryRewardDetail">
        <el-collapse-transition>
            <div v-show="showList">
                <el-row>
                    <el-button @click="addShopExt('')" type="primary">添加</el-button>
                </el-row>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="门店编码：" prop="shopcode">
                        <el-input v-model="searchForm.shopcode" clearable   style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                    </el-form-item>

                </el-form>

                <yid-table pagination ref="table" :data="jobData" style="margin-top: 15px;" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column label="门店类型" min-width="100" prop="shopType">
                        <template slot-scope="scope">
                            <span v-if='scope.row.shopType==1'>美发</span>
                            <span v-if='scope.row.shopType==2'>美容</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="门店品牌" min-width="150" prop="brandCode">
                        <template slot-scope="scope">
                        <span v-for="shoppro in allShopList">
                                <span v-if="scope.row.shopcode == shoppro.shopcode">
                                    {{shoppro.brandName}}
                                </span>
                            </span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="收款人姓名" min-width="150" prop="payee"></yid-table-column>
                    <yid-table-column label="开户行" min-width="150" prop="bank"></yid-table-column>
                    <yid-table-column label="开户账号" min-width="200" prop="bankno"></yid-table-column>
                    <yid-table-column label="支行名称" min-width="150" prop="branchbank"></yid-table-column>
                    <yid-table-column label="财务片区" min-width="150" prop="faname">

                    </yid-table-column>
                    <yid-table-column label="是否关店清零" min-width="150" prop="isClosed">
                        <template slot-scope="scope">
                            <span v-if='scope.row.isClosed==0'>未关店</span>
                            <span v-if='scope.row.isClosed==1' style="color: red">已关店</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="关店清零日期" min-width="150" prop="closeDate"></yid-table-column>
                    <yid-table-column label="财务公司类型" min-width="150" prop="ftype">
                        <template slot-scope="scope">
                            <span v-if='scope.row.ftype==1'>对私</span>
                            <span v-if='scope.row.ftype==2'>咨询公司</span>
                        </template>
                    </yid-table-column>


                    <yid-table-column label="操作" min-width="150" prop="content" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="editAction(scope.row)">编辑</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-show="!showList">
                <el-button @click="back" type="primary">返回</el-button>
                <el-button @click="saveJob" type="primary">保存</el-button>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
            <el-form ref="shopExtForm" :model="shopExtForm"  label-width="140px">
                <el-row :gutter="20">
                    <el-col :span="8">
                <el-form-item label="门店编码：" prop="shopcode" :rules="[{ required: true, message: '门店编码为空'}]">
                    <el-input v-model="shopExtForm.shopcode"  @change="getshopcode"></el-input>
                </el-form-item>

                <el-form-item label="门店类型：" prop="shopType"  >
                    <el-select value-key="id" placeholder="请选择" v-model.trim="shopExtForm.shopType" disabled>
                        <el-option label="美发" value="1"></el-option>
                        <el-option label="美容" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="收款人姓名：" prop="payee"  :rules="[{ required: true, message: '收款人姓名为空'}]">
                    <el-input v-model="shopExtForm.payee"></el-input>
                </el-form-item>

                <el-form-item label="开户行：" prop="bank"  :rules="[{ required: true, message: '开户行为空'}]">
                    <el-input v-model="shopExtForm.bank"></el-input>
                </el-form-item>
                <el-form-item label="财务片区：" prop=""  :rules="[{ required: true, message: '财务片区为空'}]">
                    <el-select value-key="pid" placeholder="请选择" v-model="shopExtForm.facode">
                        <el-option :key="item.id" :value="item.code" :label="item.name" v-for="item in financeAreaList"/>
                    </el-select>
                </el-form-item>

                <el-form-item label="是否关店清零：" prop="isClosed"  :rules="[{ required: true, message: '是否关店清零为空'}]">

                    <el-select value-key="id" placeholder="请选择" v-model.trim="shopExtForm.isClosed">
                        <el-option label="未关店" value="0"></el-option>
                        <el-option label="已关店" value="1"></el-option>
                    </el-select>
                </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="门店名称：" prop="shopname" >
                            {{shopExtForm.shopname}}
                        </el-form-item>
                        <el-form-item label="门店品牌：" prop="brandName"  :disabled="true">
                            {{shopExtForm.brandName}}
                        </el-form-item>
                <el-form-item label="开户账号：" prop="bankno"  :rules="[{ required: true, message: '开户账号为空'}]">
                    <el-input v-model="shopExtForm.bankno"></el-input>
                </el-form-item>
                <el-form-item label="支行名称：" prop="branchbank"  :rules="[{ required: true, message: '支行名称为空'}]">
                    <el-input v-model="shopExtForm.branchbank"></el-input>
                </el-form-item>
                <el-form-item label="财务公司类型：" prop="ftype" :rules="[{ required: true, message: '请选择财务公司类型'}]">
                    <el-select value-key="id" placeholder="请选择" v-model.trim="shopExtForm.ftype">
                        <el-option label="对私" value="1"></el-option>
                        <el-option label="咨询公司" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="关店清零日期：" prop="closeDate" >
                    <el-input v-model="shopExtForm.closeDate"></el-input>
                </el-form-item>


                    </el-col>
                </el-row>
            </el-form>
            </div>
        </el-collapse-transition>

    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    export default {
        name: "dept",
        data() {
            return {
                activeName: 'position',
                showList: true,
                type:'1',
                searchForm: {
                    shopcode: "",

                },
                shopExtForm:{
                    id:'',
                    shopid:'',
                    shopcode :'',
                    shponame :'',
                    shopType : '',
                    brandId : '',
                    brandCode : '',
                    brandName : '',
                    payee : '',
                    bank : '',
                    bankno : '',
                    branchbank : '',
                    faid : '',
                    facode : '',
                    faname : '',
                    isClosed : '',
                    closeDate : '',
                    ftype : '',
                },
                pageInfo:{page:1,limit:10},
                maxCode:0,
                allShopList: [],
                financeAreaList: [],
                jobData: [

                ],



                jobDialog: {
                    title: '',
                    visible: false,
                },

            }
        },
        created() {
           // this.getjobList();
        },

        mounted() {

            this.getjobList();
            this.getShopList();
            this.getFinanceAreaList();
        },
        methods: {
            search() {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getData(this.searchForm);

            },
            rest() {
                this.$refs["searchForm"].resetFields()
                this.searchForm.yearmonth = "";
                this.searchForm.type = "";
                this.searchForm.status = "";
                this.search()
            },
            getData(reqParams) {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch =  service.finance.shopExt.jobList
                const params = {...this.pageInfo, ...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getjobList(type){

                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.finance.shopExt.jobList
                const params = this.pageInfo
                params.type = type

                this.$refs.table.reloadData({
                    fetch,
                    params
                });
            },

            handleClick(tab, event) {
                this.getjobList();
            },

            getshopcode() {
                let shopPobj = {};
                let shopcode = this.shopExtForm.shopcode;
                shopPobj = this.allShopList.find((shopp)=>{

                    return shopp.shopcode === shopcode;
                });
                if(yid.util.isEmpty(shopPobj)){
                    yid.util.error("没有店号为"+shopcode+"的门店信息，请重新输入");
                    this.shopExtForm.shopcode="";
                    return;
                }
                this.shopExtForm.shopid = shopPobj.id;
                this.shopExtForm.shopname = shopPobj.shopname;
                this.shopExtForm.shopType = shopPobj.type;
                this.shopExtForm.brandId = shopPobj.brandId;
                this.shopExtForm.brandCode = shopPobj.brandCode;
                this.shopExtForm.brandName = shopPobj.brandName
            },

            getFinanceAreaList(){

                service.finance.dicFinancialArea.financeAreaAll({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.financeAreaList = res.data;

                    }
                })

            },

            getShopList() {
                service.chain.shop.shopList({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.allShopList = res.data;

                    }
                })
            },

            addShopExt() {
                this.shopExtForm.id = ''
                this.shopExtForm.name= '';
                this.shopExtForm.shopid='';
                this.shopExtForm.shopcode ='';
                this.shopExtForm.shponame ='';
                this.shopExtForm.shopType = '';
                this.shopExtForm.brandid = '';
                this.shopExtForm.brandCode = '';
                this.shopExtForm.payee = '';
                this.shopExtForm.bank = '';
                this.shopExtForm.bankno = '';
                this.shopExtForm.branchbank = '';
                this.shopExtForm.faid = '';
                this.shopExtForm.facode = '';
                this.shopExtForm.faname = '';
                this.shopExtForm.isClosed = '';
                this.shopExtForm.closeDate = '';
                this.shopExtForm.ftype = '';
                this.showList = false;

            },
            async editAction(row) {
                this.shopExtForm.id = row.id;
                this.shopExtForm.name= row.name;
                this.shopExtForm.shopid=row.shopid;
                this.shopExtForm.shopcode =row.shopcode;
                this.shopExtForm.shopname =row.shopname;
                this.shopExtForm.shopType = row.shopType;
                this.shopExtForm.brandId = row.brandId;
                this.shopExtForm.brandCode =  row.brandCode;
                let brandPobj = {};
                brandPobj = this.allShopList.find((item)=>{
                    return item.brandCode === row.brandCode;
                });
                this.shopExtForm.brandName =  brandPobj.brandName;
                this.shopExtForm.payee = row.payee;
                this.shopExtForm.bank = row.bank;
                this.shopExtForm.bankno = row.bankno;
                this.shopExtForm.branchbank = row.branchbank;
                this.shopExtForm.faid =  row.faid;
                this.shopExtForm.facode =  row.facode;
                this.shopExtForm.faname =  row.faname;
                this.shopExtForm.isClosed =  row.isClosed;
                this.shopExtForm.closeDate = row.closeDate;
                this.shopExtForm.ftype = row.ftype;
                this.showList = false;
            },

            saveJob(){
                this.$refs['shopExtForm'].validate((valid) => {
                    if(valid){
                        if(this.shopExtForm.isClosed =='1'&&this.shopExtForm.closeDate==''){
                            yid.util.alert("请填写关店日期");
                            return false;
                        }
                        this.shopExtForm.closeDate='';
                        let financeAreapobj = {};
                        financeAreapobj = this.financeAreaList.find((item)=>{
                            return item.code === this.shopExtForm.facode;
                        });
                        this.shopExtForm.faid = financeAreapobj.id;
                        this.shopExtForm.faname = financeAreapobj.name;
                        debugger;
                        service.finance.shopExt.saveJob(this.shopExtForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                                this.back();
                                this.getData(this.searchForm);
                            }else{
                                yid.util.error(res.resp_msg)
                            }

                        });

                    }
                })

            },
            back() {
                this.$refs['shopExtForm'].resetFields();
                this.showList = true;
            },

        }
    }
</script>

<style scoped>

</style>
