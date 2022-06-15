<template>
    <div class="dept">
        <el-form inline>
            <el-form-item label="">
                <el-button type="primary" @click="exportServs()">导出美发项目价</el-button>
            </el-form-item>
            <br/>
            <el-form-item label="门店：">
                <el-select @clear="clearFormShop" @blur="clearFormShop" clearable v-model.trim="form.shopcode" filterable @change="changeShop"
                           :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.shopcode" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="项目：">
                <el-input clearable v-model="form.serv" placeholder="请输入编码或名称" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="价格体系：">
                <el-input clearable v-model="form.servtemp" placeholder="请输入编码或名称" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="项目分类：">
                <el-select clearable  filterable placeholder="请选择" v-model.trim="form.servtcode">
                    <el-option :key="item.scode" :label="item.sname" :value="item.scode" v-for="item in serviceType"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态：">
                <el-select clearable v-model="form.status" placeholder="请选择状态" style="width: 120px;">
                    <el-option label="正常" value="1"></el-option>
                    <el-option label="停用" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="queryServData()">查询</el-button>
            </el-form-item>
        </el-form>

        <yid-table ref="tableService" pagination style="width: 100%;" @selection-change="handleServicesChange">
            <yid-table-column label="店号" prop="shopcode" width="120"></yid-table-column>
            <yid-table-column label="店名" prop="shopname" width="140"></yid-table-column>
            <yid-table-column label="价格体系" prop="tempname" width="140"></yid-table-column>
            <yid-table-column label="项目编码" prop="servcode" width="120"></yid-table-column>
            <yid-table-column label="项目名称" prop="servname" width="160"></yid-table-column>
            <yid-table-column label="项目分类" prop="sname" width="120"></yid-table-column>
            <yid-table-column label="项目原价" prop="price" width="160"></yid-table-column>
            <yid-table-column label="项目会员价" prop="pprice" width="200"></yid-table-column>
            <yid-table-column label="状态" prop="status" width="80">
                <template slot-scope="scope">
                    <label>{{scope.row.status == '1' ? '正常' : '停用'}}</label>
                </template>
            </yid-table-column>
        </yid-table>

    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    import {exportExecl, imporExecl} from "../../library/helper/execl";
    import download from '@src/library/http/download'

    export default {
        data() {
            return {
                form: {
                    shopid: '',
                    serv: '',
                    servtemp: '',
                    servtcode: '',
                    status: ''
                },
                pageInfo: {page: 1, limit: 10},
                allShopList: [],
                filterShopList: [],
                searchFormPositionList : [],
                serviceType: []
            }
        },
        mounted() {
            this.queryServData();
            this.getShopList({status: "1"});
            this.getSearchFormPositionList();
            this.findServiceType();
        },
        methods: {
            getSearchFormPositionList(){
                service.position.list({status:"1",isDel:"0"}).then(res=> {
                    if(res.resp_code == 200) {
                        this.searchFormPositionList = res.data;
                    }
                })

            },
            getShopList(params) {
                service.chain.shop.shopList(params).then(res => {
                    if (res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                    }
                })
            },
            clearFormShop() {
                setTimeout(() =>{
                    if(this.searchForm.shopid == ''){
                        this.searchForm.shopid = "";
                        this.filterShopList = Object.assign(this.allShopList);
                    }

                },300)
            },
            filterShop(v) {
                this.filterShopList = this.allShopList.filter(item => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            },
            //选择门店
            changeShop() {
                this.filterShopList.forEach(item => {
                    if (item.id == this.searchForm.shopid) {
                        this.shopcode = item.shopcode;
                        this.shopname = item.shopname;
                    }
                })
            },
            queryServData() {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.tableService.Pagination.internalPageSize;
                this.getData(this.form);
            },
            async getData(reqParams) {
                const fetch = service.serviceInfo.findShopServprice
                const params = {...this.pageInfo, ...reqParams}
                this.$refs.tableService.reloadData({
                    fetch,
                    params,
                });
            },
            exportServs() {
                const head = {
                    shopcode: '店号',
                    shopname: '店名',
                    tempname: '价格体系',
                    servcode: '项目编号',
                    servname: '项目名称',
                    sname: '项目类别',
                    price: '项目原价',
                    pprice: '项目会员价',
                    status: '状态',
                }
                service.serviceInfo.findShopServpriceList({...this.form}).then(res => {
                    if (res.resp_code == "200") {
                        res.data.forEach(item => {
                            if (item.status == "1") {
                                item.status = "正常";
                            } else {
                                item.status = "停用";
                            }
                        })
                        exportExecl(head, res.data, "服务项目导出");
                    } else {
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            findServiceType(){
                service.serviceInfo.findServiceType({"status": "1"}).then(res => {
                    this.serviceType = res.data;
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .margin5 {
        margin: 3px 2px;
    }

    .mutirow {
        flex-wrap: wrap;
        .el-tag {
            width: 100%;
        }
    }

    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>
