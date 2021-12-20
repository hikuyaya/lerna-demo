<template>
    <div class="salaryRewardDetail">
        <el-collapse-transition>
            <div v-show="showList">
                <el-row>
                    <el-button @click="addIoaccount" type="primary">新增</el-button>
                    <el-button @click="mutiImportEmployee" type="primary">导入</el-button>
                </el-row>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="店号：" prop="shopcode">
                    <el-input v-model="searchForm.shopcode"  style="width: 100px;"></el-input>
                </el-form-item>
                    <el-form-item label="项目名称：" prop="ioitemname">
                        <el-input v-model="searchForm.ioitemname" style="width: 100px;"></el-input>
                    </el-form-item>

                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>

                    </el-form-item>
                </el-form>
                <yid-table ref="table" pagination style="width: 100%;margin-top: 10px;">
                    <yid-table-column
                            prop="shopcode"
                            label="店号"
                            width="90">
                    </yid-table-column>
                    <yid-table-column
                            prop="shopname"
                            label="店名"
                            width="120">

                    </yid-table-column>
                    <yid-table-column
                            prop="ioitemcode"
                            label="项目编码"
                            width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="ioitemname"
                            label="项目名称"
                            width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="payee"
                            label="收款账户人"
                            width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="bank"
                            label="收款账户" width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="bankno"
                            label="收款开户银行" width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="branchbank"
                            label="收款银行支行" width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="updatedTime"
                            label="更新时间" width="130">
                    </yid-table-column>
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
                <el-form ref="ioaccountForm" :model="ioaccountForm" style="margin-top: 16px" :rules="rules"
                         label-width="130px" label-position="right">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="门店店号：" prop="shopcode"   :rules="[{ required: true, message: '门店店号不能为空'}]">
                                <el-input v-model="ioaccountForm.shopcode"  :disabled="isEdit"
                                          style="width: 150px;" @change="getshopcode"></el-input>
                            </el-form-item>
                            <el-form-item label="项目编码：" prop="ioitemcode"     :rules="[{ required: true, message: '项目编码不能为空'}]">
                                <el-input v-model="ioaccountForm.ioitemcode" :disabled="isEdit"
                                          style="width: 150px;" @change="getItemcode" ></el-input>
                            </el-form-item>
                            <el-form-item label="收款账户人：" prop="payee"  :rules="[{ required: true, message: '收款账户人不能为空'}]">
                                <el-input v-model="ioaccountForm.payee"
                                          style="width: 200px;"></el-input>
                            </el-form-item>
                            <el-form-item label="收款开户银行：" prop="bank" :rules="[{ required: true, message: '收款开户银行不能为空'}]">
                                <el-input v-model="ioaccountForm.bank"
                                          style="width: 200px;" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="门店店名：" prop="shopname">
                                {{ioaccountForm.shopname}}
                            </el-form-item>
                            <el-form-item label="项目名称：" prop="ioitemname">
                                {{ioaccountForm.ioitemname}}
                            </el-form-item>

                            <el-form-item label="收款账户：" prop="bankno" :rules="[{ required: true, message: '收款账户不能为空'}]">
                                <el-input v-model="ioaccountForm.bankno"
                                          style="width: 200px;"></el-input>
                            </el-form-item>
                            <el-form-item label="收款银行支行：" prop="branchbank" :rules="[{ required: true, message: '收款银行支行不能为空'}]">
                                <el-input v-model="ioaccountForm.branchbank"
                                          style="width: 200px;"></el-input>
                            </el-form-item>

                        </el-col>

                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>
        <yid-dialog :title="mutiImportDialog.title" :visible.sync="mutiImportDialog.visible" @close="importCancel"
                    width="700px">
            <el-form :model="mutiImportDialog.model" label-width="120px" ref="copyForm" :label-position="labelPosition">
                <p>操作提示</p>
                <el-form-item label="下载导入模板：" align="left">
                    <el-link @click="downExcelTemplate" type="primary">导入模板</el-link>
                </el-form-item>

                <el-form-item label="选择导入文件:">
                    <el-upload
                            ref="uploadExcel"
                            class="avatar-uploader"
                            :headers="myheaders"
                            action="https://sass.yidmall.com/api-finance/ioaccount/importExcel"
                            :show-file-list="true"
                            :on-success="handleAvatarExcelSuccess"
                            :before-upload="beforeAvatarExcelUpload">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">支持上传 .xls .xlsx后缀文件，表格中一行为一条数据，一次最多可导入3000条数据。</div>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button @click="saveImportAccount" type="primary">保存</el-button>
                    <el-button @click="importCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>



    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import download from '@src/library/http/download'
    import VueQrcode from '@chenfengyuan/vue-qrcode'
    import ElButton from "../../library/components/button/button";

    export default {
        components: {ElButton,VueQrcode},
        name: "profile",
        data() {
            return {
                upload: yid.config.API.UPLOAD,
                showList: true,
                isEdit :true,
                myheaders: {},
                dataList: [],
                status: '2',
                pageInfo: {page: 0, limit: 10, isDel: "0"},

                sexList: [{id: "1", name: "男"}, {id: "2", name: "女"}],
                allShopList: [],
                ioitemDataAll:[],
                searchForm: {
                    shopcode: "",
                    ioitemname: "",
                },
                ioaccountForm: {
                    id:"",
                    shopid: "",
                    shopcode: "",
                    shopname: "",
                    shopType: "",
                    brandId: "",
                    brandCode: "",
                    ioitemid : "",
                    ioitemcode :  "",
                    ioitemname :  "",
                    payee :  "",
                    bank :  "",
                    bankno :  "",
                    branchbank: "",
                    memo : "",

                },

                rules: {
                    mobile: [{required: true, message: '请输入手机号'},
                        {validator: this.checkMobile, trigger: "blur"}
                    ],

                },
                brands: [],
                mutiImportDialog: {
                    title: '',
                    visible: false,
                    unionpays: []
                },

                labelPosition: 'left',
                types: [{name: '美发', value: '1'}, {name: '美容', value: '2'}, {name: '综合', value: '3'}],

            }
        },
        mounted() {
            this.getData("1");
            this.getShopList();
            this.getioitemListAll();
        },
        filters: {
            formatValue(str, stsList) {
                let label = ""
                stsList.map(m => {
                    if (m.value == str) {
                        label = m.name
                    }
                })
                if (label) {
                    return label
                } else {
                    return str
                }
            },
            formatBrand(str, stsList) {
                let label = ""
                stsList.map(m => {
                    if (Number(m.id) == str) {
                        label = m.bname
                    }
                })
                if (label) {
                    return label
                } else {
                    return str
                }
            }
        },
        methods: {
            lookup() {
                this.getData(this.status);

            },
            getData(status, reqParams) {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch =  service.finance.ioaccount.list
                const params = {...this.pageInfo, ...reqParams}
                params.status = status
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            checkMobile(rule, value, callback) {
                if (value === '') {
                    callback(new Error('请输入手机号'));
                } else if (!yid.validate.mobile(value)) {
                    callback(new Error('输入正确手机号'));
                }
                else {
                    callback();
                }
            },

            addIoaccount() {
                this.ioaccountForm.id ="";
                this.ioaccountForm.shopid = "";
                this.ioaccountForm.shopcode = "";
                this.ioaccountForm.shopname = "";
                this.ioaccountForm.shopType = "";
                this.ioaccountForm.brandId = "";
                this.ioaccountForm.brandCode = "";
                this.ioaccountForm.ioitemid = "";
                this.ioaccountForm.ioitemcode = "";
                this.ioaccountForm.ioitemname = "";
                this.ioaccountForm.payee = "";
                this.ioaccountForm.bank = "";
                this.ioaccountForm.bankno = "";
                this.ioaccountForm.branchbank="";
                this.ioaccountForm.memo = "";
                this.showList = false;
                this.isEdit = false;
                this.myheaders = {
                    authorization: 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
            },
            async editAction(row) {

                this.ioaccountForm.id = row.id;
                this.ioaccountForm.shopid = row.shopid;
                this.ioaccountForm.shopcode = row.shopcode;
                this.ioaccountForm.shopname = row.shopname;
                this.ioaccountForm.shopType = row.shopType;
                this.ioaccountForm.brandId = row.brandId;
                this.ioaccountForm.brandCode = row.brandCode;
                this.ioaccountForm.ioitemid = row.ioitemid;
                this.ioaccountForm.ioitemcode = row.ioitemcode;
                this.ioaccountForm.ioitemname = row.ioitemname;
                this.ioaccountForm.payee = row.payee;
                this.ioaccountForm.bank = row.bank;
                this.ioaccountForm.bankno = row.bankno;
                this.ioaccountForm.memo = row.memo;
                this.ioaccountForm.branchbank = row.branchbank;
                this.showList = false;
                this.isEdit = true;
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
                this.search()
            },

            save() {
                const that = this;
                this.$refs['ioaccountForm'].validate((valid) => {
                    if (valid) {

                        service.finance.ioaccount.save(that.ioaccountForm).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success("保存成功");
                                that.getData("1", that.searchForm);

                                that.$refs['ioaccountForm'].resetFields()
                                that.showList = true
                            }
                        })
                    }
                });
            },
            back() {
                this.$refs['ioaccountForm'].resetFields()
                this.showList = true
            },
            edit() {

            },
            getshopcode() {

                let shopPobj = {};
                let shopcode = this.ioaccountForm.shopcode;
                shopPobj = this.allShopList.find((shopp)=>{

                    return shopp.shopcode === shopcode;
                });
                if(yid.util.isEmpty(shopPobj)){
                    yid.util.error("没有店号为"+shopcode+"的门店信息，请重新输入");
                    this.ioaccountForm.shopcode="";
                    this.ioaccountForm.shopid="";
                    return;
                }
                this.ioaccountForm.shopid = shopPobj.id;
                this.ioaccountForm.shopname = shopPobj.shopname;
                this.ioaccountForm.shopType = shopPobj.type;
                this.ioaccountForm.brandId = shopPobj.brandId;
                this.ioaccountForm.brandCode = shopPobj.brandCode;

            },

            getItemcode() {

                let itemobj = {};
                let itemcode = this.ioaccountForm.ioitemcode;
                itemobj = this.ioitemDataAll.find((item) => {
                    return item.code === itemcode
                });
                if(yid.util.isEmpty(itemobj)){
                    yid.util.error("没有编号为"+itemcode+"的项目信息，请重新输入");
                    this.ioaccountForm.ioitemid = "";
                    this.ioaccountForm.ioitemname = "";
                    return;
                }
                this.ioaccountForm.ioitemid = itemobj.id;
                this.ioaccountForm.ioitemname = itemobj.name;

            },


            getShopList() {
                service.chain.shop.shopList({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.allShopList = res.data;

                    }
                })
            },
            getioitemListAll(){
                service.finance.ioitem.jobAll({status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.ioitemDataAll = res.data;
                    }
                })
            },
            mutiImportEmployee() {
                this.mutiImportDialog.title = '批量导入门店汇款信息';
                this.mutiImportDialog.visible = true;
                this.mutiImportDialog.unionpays = [];
                this.myheaders = {
                    authorization: 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
                this.$refs.uploadExcel.clearFiles()
            },
            downExcelTemplate() {
                download(yid.config.API.BASE + 'api-finance/ioaccount/excelTemplate', {})
            },
            beforeAvatarExcelUpload(file) {
                const isJPG = (file.type.indexOf("sheet") || file.type.indexOf('excel'));
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isJPG) {
                    yid.util.error('上传excel只能是 xls/xlsx 格式!');
                    return;
                }
                if (!isLt2M) {
                    yid.util.error('上传excel大小不能超过 10MB!');
                    return;
                }
                return isJPG && isLt2M;
            },
            handleAvatarExcelSuccess(res) {
                this.mutiImportDialog.unionpays = res.data;

                console.log(this.mutiImportDialog.unionpays);
            },
            saveImportAccount() {
                if (this.mutiImportDialog.unionpays.length == 0) {
                    yid.util.info("无导入数据");
                } else {
                    console.log(this.mutiImportDialog.unionpays);
                    service.finance.ioaccount.batchImport({maps: this.mutiImportDialog.unionpays}).then(res => {
                        if (res.resp_code == 200) {
                            yid.util.success("导入成功")
                            this.importCancel();
                            this.getData("1", this.searchForm);
                        }
                    })
                }
            },
            importCancel() {
                this.mutiImportDialog.visible = false;
            },

        }
    }
</script>

<style scoped lang="scss">

</style>
