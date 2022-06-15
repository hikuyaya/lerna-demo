<template>
    <div class="salaryRewardDetail">
        <el-collapse-transition>
            <div v-show="showList">
                <el-row>
                    <el-button @click="addFundShop" type="primary">新增</el-button>
                </el-row>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="店号：" prop="shopcode">
                        <el-input v-model="searchForm.shopcode"  style="width: 100px;"></el-input>
                    </el-form-item>
                    <el-form-item label="店名：" prop="shopname">
                        <el-input v-model="searchForm.shopname" style="width: 100px;"></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                    </el-form-item>
                </el-form>
                <yid-table ref="table" pagination style="width: 100%;margin-top: 10px;">
                    <yid-table-column prop="shopcode" label="店号" width="120"></yid-table-column>
                    <yid-table-column prop="shopname" label="店名" width="150"></yid-table-column>
                    <yid-table-column prop="initsreservfund" label="日常备用金" width="130"></yid-table-column>
                    <yid-table-column prop="isCheck" label="大额备用金是否检查营业款" width="260">
                        <template slot-scope="scope">
                            <span v-if='scope.row.isCheck==0'>不检查</span>
                            <span v-if='scope.row.isCheck==1'>检查</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="updatedTime" label="更新时间" width="150"></yid-table-column>
                    <yid-table-column
                            label="操作" min-width="70" fixed="right">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="editAction(scope.row,false)">编辑</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-show="!showList">
                <el-button @click="back" type="primary">返回</el-button>
                <el-button @click="save" type="primary" >保存</el-button>
                <el-form ref="fundShopForm" :model="fundShopForm" style="margin-top: 16px" :rules="rules"
                         label-width="210px" label-position="right">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="门店店号：" prop="shopcode" :rules="[{ required: true, message: '门店店号不能为空'}]">
                                <el-input v-model="fundShopForm.shopcode"
                                          style="width: 150px;" @change="getshopcode"></el-input>
                            </el-form-item>
                            <el-form-item label="门店名称：" prop="shopname">
                               {{fundShopForm.shopname}}
                            </el-form-item>
                            <el-form-item label="日常备用金：" prop="initsreservfund" :rules="[{ required: true, message: '门店店号不能为空'}]">
                                <el-input-number  :precision="2" :min="0" v-model="fundShopForm.initsreservfund"></el-input-number>
                            </el-form-item>
                            <el-form-item label="大额备用金是否检查营业款：" prop="isCheck"  :rules="[{ required: true, message: '请选择大额备用金是否检查营业款'}]">
                                <el-select value-key="id" placeholder="请选择" v-model="fundShopForm.isCheck">
                                    <el-option label="不检查" value="0"></el-option>
                                    <el-option label="检查" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import ElButton from "../../library/components/button/button";

    export default {
        components: {ElButton},
        name: "profile",
        data() {
            return {
                upload: yid.config.API.UPLOAD,
                showList: true,
                myheaders: {},
                dataList: [],
                status: '2',
                quitShow: false,
                pageInfo: {page: 1, limit: 10, isDel: "0"},
                allShopList: [],
                searchForm: {
                    shopcode: "",
                    shopname: "",

                },
                fundShopForm: {
                    shopid: "",
                    shopcode: "",
                    shopname: "",
                    shopType: "",
                    brandId: "",
                    brandCode: "",
                    initsreservfund:"",
                    isCheck:"",
                },
                rules: {},
                brands: [],

                labelPosition: 'left',
                types: [{name: '美发', value: '1'}, {name: '美容', value: '2'}, {name: '综合', value: '3'}],

            }
        },
        mounted() {
           this.getData("1");
            this.getShopList();
        },
        filters: {},
        methods: {

            getData(status, reqParams) {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch =  service.finance.fundShop.list
                const params = {...this.pageInfo, ...reqParams}
                params.status = status
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },

            addFundShop() {
                this.fundShopForm.shopid = "";
                this.fundShopForm.shopcode = "";
                this.fundShopForm.shopname = "";
                this.fundShopForm.shopType = "";
                this.fundShopForm.brandId = "";
                this.fundShopForm.brandCode = "";
                this.fundShopForm.initsreservfund = "";
                this.fundShopForm.isCheck = "";

                this.showList = false;

                this.myheaders = {
                    authorization: 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
            },
            async editAction(row) {

                this.fundShopForm.id = row.id;
                this.fundShopForm.shopid = row.shopid;
                this.fundShopForm.shopcode = row.shopcode;
                this.fundShopForm.shopname = row.shopname;
                this.fundShopForm.shopType = row.shopType;
                this.fundShopForm.brandId = row.brandId;
                this.fundShopForm.brandCode = row.brandCode;
                this.fundShopForm.initsreservfund = row.initsreservfund;
                this.fundShopForm.isCheck = row.isCheck;

                this.showList = false;
            },
            search() {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                if (this.status == '1') {
                    this.getData("2", this.searchForm);
                } else {
                    this.getData("1", this.searchForm);
                }

            },
            rest() {
                this.$refs["searchForm"].resetFields()
                this.searchForm.shopcode = "";
                this.searchForm.shopname = "";
                this.search()
            },

            save() {
                const that = this;
                this.$refs['fundShopForm'].validate((valid) => {
                    if (valid) {

                        service.finance.fundShop.save(that.fundShopForm).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success("保存成功");
                                that.getData("1", that.searchForm);
                                that.$refs['fundShopForm'].resetFields()
                                that.showList = true
                            }
                        })
                    }
                });
            },
            back() {
                this.$refs['fundShopForm'].resetFields()
                this.showList = true
            },
            edit() {

            },
            getshopcode() {
                let shopPobj = {};
                let shopcode = this.fundShopForm.shopcode;
                shopPobj = this.allShopList.find((shopp)=>{

                    return shopp.shopcode === shopcode;
                });
                if(yid.util.isEmpty(shopPobj)){
                    yid.util.error("没有店号为"+shopcode+"的门店信息，请重新输入");
                    this.fundShopForm.shopcode="";
                    return;
                }
                service.finance.fundShop.getFundShop({shopcode:shopcode,shopType:shopPobj.type}).then(res => {

                    if(res.resp_code == 200){
                        this.fundShopForm = res.data;
                    }
                    this.fundShopForm.shopid = shopPobj.id;
                    this.fundShopForm.shopname = shopPobj.shopname;
                    this.fundShopForm.shopType = shopPobj.type;
                    this.fundShopForm.brandId = shopPobj.brandId;
                    this.fundShopForm.brandCode = shopPobj.brandCode;
                })


            },

            getShopList() {
                service.chain.shop.shopList({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.allShopList = res.data;

                    }
                })
            },
           

        }
    }
</script>

<style scoped lang="scss">

</style>
