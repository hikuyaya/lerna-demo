<template>
    <div class="salaryRewardDetail">
        <el-collapse-transition>
            <div v-show="showList">
                <el-form ref="searchForm" inline :model="searchForm">


                    <el-form-item label="类型：" prop="shopType">
                            <el-select v-model="searchForm.shopType" clearable placeholder="请选择">
                                <el-option label="美发" value="1"></el-option>
                                <el-option label="美容" value="2"></el-option>
                            </el-select>

                    </el-form-item>

                    <el-form-item label="店号：" prop="shopcode">
                    <el-input v-model="searchForm.shopcode"  style="width: 100px;"></el-input>
                </el-form-item>
                    <el-form-item label="店名：" prop="shopname">
                        <el-input v-model="searchForm.shopname" style="width: 100px;"></el-input>
                    </el-form-item>
                    <el-form-item label="商户号：" prop="merchantcode">
                        <el-input v-model="searchForm.merchantcode"  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="终端号：" prop="terminalcode">
                        <el-input v-model="searchForm.terminalcode"  style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="限制金额：" prop="limitMoney">
                        <el-input v-model="searchForm.limitMoney"  style="width: 100px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                        <el-button @click="addUnionpay" type="primary">新增</el-button>
                        <el-button @click="mutiImportEmployee" type="primary">导入</el-button>
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
                            prop="bcMerchantCode"
                            label="对私B扫C商户号"
                            width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="bcTerminalCode"
                            label="对私B扫C终端号"
                            width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="cbMerchantCode"
                            label="对私C扫B商户号"
                            width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="cbTerminalCode"
                            label="对私C扫B终端号" width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="pubBcMerchantCode"
                            label="对公B扫C商户号" width="130">
                    </yid-table-column>
                    <yid-table-column
                            prop="pubBcTerminalCode"
                            label="对公B扫C终端号" width="130">
                    </yid-table-column>
                    <yid-table-column prop="limitMoney" label="对公限制金额" width="130"></yid-table-column>

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
                <el-form ref="uplshopaccountForm" :model="uplshopaccountForm" style="margin-top: 16px" :rules="rules"
                         label-width="130px" label-position="right">
                    <el-row :gutter="20">
                        <el-col :span="8">
                            <el-form-item label="门店店号：" prop="shopcode" :rules="[{ required: true, message: '门店店号不能为空'}]">
                                <el-input v-model="uplshopaccountForm.shopcode"
                                          style="width: 150px;" @change="getshopcode"></el-input>
                            </el-form-item>

                            <el-form-item label="对私B扫C商户号：" prop="bcMerchantCode">
                                <el-input v-model="uplshopaccountForm.bcMerchantCode"
                                          style="width: 150px;"></el-input>
                            </el-form-item>
                            <el-form-item label="对私B扫C终端号：" prop="bcTerminalCode">
                                <el-input v-model="uplshopaccountForm.bcTerminalCode"
                                          style="width: 150px;"></el-input>
                            </el-form-item>
                            <el-form-item label="对私C扫B商户号：" prop="cbMerchantCode">
                                <el-input v-model="uplshopaccountForm.cbMerchantCode"
                                          style="width: 150px;" ></el-input>
                            </el-form-item>
                            <el-form-item label="对私C扫B终端号：" prop="cbTerminalCode">
                                <el-input v-model="uplshopaccountForm.cbTerminalCode"
                                          style="width: 150px;" ></el-input>
                            </el-form-item>

                            <el-form-item label="对公限金额：" prop="limitMoney">
                                <el-input v-model="uplshopaccountForm.limitMoney"
                                          style="width: 150px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="门店店名：" prop="shopname">
                                {{uplshopaccountForm.shopname}}
                            </el-form-item>


                            <el-form-item label="对公B扫C商户号：" prop="pubBcMerchantCode">
                                <el-input v-model="uplshopaccountForm.pubBcMerchantCode"
                                          style="width: 150px;"></el-input>
                            </el-form-item>

                            <el-form-item label="对公B扫C终端号：" prop="pubBcTerminalCode"
                                          :rules="[{ message: '不能为空'}]">
                                <el-input v-model="uplshopaccountForm.pubBcTerminalCode"
                                          style="width: 150px;" ></el-input>
                            </el-form-item>


                            <el-form-item label="对公C扫B商户号：" prop="pubCbMerchantCode">
                                <el-input v-model="uplshopaccountForm.pubCbMerchantCode"
                                          style="width: 150px;"></el-input>
                            </el-form-item>

                            <el-form-item label="对公C扫B终端号：" prop="pubCbTerminalCode"
                                          :rules="[{ message: '不能为空'}]">
                                <el-input v-model="uplshopaccountForm.pubCbTerminalCode"
                                          style="width: 150px;" ></el-input>
                            </el-form-item>
                            <el-form-item label="对私C扫B二维码：" >
                                <el-button type="primary" @click="getUnionQr">点击生成</el-button>
                                <VueQrcode
                                        :value="this.qrcode"
                                        :size="250"
                                />
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
                            action="https://sass.yidmall.com/api-finance/uplshopaccount/importExcel"
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
                myheaders: {},
                dataList: [],
                status: '2',
                quitShow: false,
                pageInfo: {page: 0, limit: 10, isDel: "0"},

                sexList: [{id: "1", name: "男"}, {id: "2", name: "女"}],
                allShopList: [],
                searchForm: {
                    shopType: "",
                    shopcode: "",
                    shopname: "",
                    merchantcode: "",
                    terminalcode: "",
                    limitMoney: ""
                },
                uplshopaccountForm: {

                    shopid: "",
                    shopcode: "",
                    shopname: "",
                    shopType: "",
                    brandId: "",
                    brandCode: "",
                    limitMoney: "",
                    pubBcTerminalCode: "",
                    pubBcMerchantCode: "",
                    pubCbTerminalCode: "",
                    pubCbMerchantCode: "",
                    bcTerminalCode: "",
                    bcMerchantCode: "",
                    cbTerminalCode: "",
                    cbMerchantCode: "",

                },
                qrcode:"",
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
                const fetch =  service.finance.unionpaymanage.list
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

            selectPositionLevel() {
                this.$forceUpdate();
            },
            addUnionpay() {

                this.uplshopaccountForm.shopid = "";
                this.uplshopaccountForm.shopcode = "";
                this.uplshopaccountForm.shopname = "";
                this.uplshopaccountForm.shopType = "";
                this.uplshopaccountForm.brandId = "";
                this.uplshopaccountForm.brandCode = "";
                this.uplshopaccountForm.limitMoney = "";
                this.uplshopaccountForm.pubBcTerminalCode = "";
                this.uplshopaccountForm.pubBcMerchantCode = "";
                this.uplshopaccountForm.pubCbTerminalCode = "";
                this.uplshopaccountForm.pubCbMerchantCode = "";
                this.uplshopaccountForm.bcTerminalCode = "";
                this.uplshopaccountForm.bcMerchantCode = "";
                this.uplshopaccountForm.cbTerminalCode = "";
                this.uplshopaccountForm.cbMerchantCode = "";
                this.showList = false;

                this.myheaders = {
                    authorization: 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
            },
            async editAction(row) {

                this.uplshopaccountForm.id = row.id;
                this.uplshopaccountForm.shopid = row.shopid;
                this.uplshopaccountForm.shopcode = row.shopcode;
                this.uplshopaccountForm.shopname = row.shopname;
                this.uplshopaccountForm.shopType = row.shopType;
                this.uplshopaccountForm.brandId = row.brandId;
                this.uplshopaccountForm.brandCode = row.brandCode;
                this.uplshopaccountForm.appId = row.appId;
                this.uplshopaccountForm.appKey = row.appKey;
                this.uplshopaccountForm.notifyUrl = row.notifyUrl;
                this.uplshopaccountForm.md5K = row.md5K;
                this.uplshopaccountForm.orderPrefix = row.orderPrefix;
                this.uplshopaccountForm.limitMoney = row.limitMoney;
                this.uplshopaccountForm.pubBcTerminalCode = row.pubBcTerminalCode;
                this.uplshopaccountForm.pubBcMerchantCode = row.pubBcMerchantCode;
                this.uplshopaccountForm.pubCbTerminalCode = row.pubCbTerminalCode;
                this.uplshopaccountForm.pubCbMerchantCode = row.pubCbMerchantCode;
                this.uplshopaccountForm.bcTerminalCode = row.bcTerminalCode;
                this.uplshopaccountForm.bcMerchantCode = row.bcMerchantCode;
                this.uplshopaccountForm.cbTerminalCode = row.cbTerminalCode;
                this.uplshopaccountForm.cbMerchantCode = row.cbMerchantCode;
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
                this.searchForm.shopid = "";
                this.search()
            },

            save() {
                const that = this;
                this.$refs['uplshopaccountForm'].validate((valid) => {
                    if (valid) {
                        if (that.uplshopaccountForm.status == null || that.uplshopaccountForm.status.length == 0) {
                            that.uplshopaccountForm.status = "1";
                        }



                        service.finance.unionpaymanage.save(that.uplshopaccountForm).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success("保存成功");
                                if (that.uplshopaccountForm.id == '' || that.uplshopaccountForm.id.length == 0) {
                                    that.status = "2";
                                    that.getData("1", that.searchForm);
                                } else {
                                    if (that.status == '2') {
                                        that.status = "2";
                                        that.getData("1", that.searchForm);
                                    } else {
                                        that.status = "1";
                                        that.getData("2", that.searchForm);
                                    }
                                }
                                that.$refs['uplshopaccountForm'].resetFields()
                                that.showList = true
                            }
                        })
                    }
                });
            },
            back() {
                this.$refs['uplshopaccountForm'].resetFields()
                this.showList = true
            },
            edit() {

            },
            getshopcode() {
                let shopPobj = {};
                let shopcode = this.uplshopaccountForm.shopcode;
                shopPobj = this.allShopList.find((shopp)=>{

                    return shopp.shopcode === shopcode;
                });
                service.finance.unionpaymanage.getShopcodeAccountShow({shopcode:shopcode}).then(res => {

                    if(res.resp_code == 200){

                        this.uplshopaccountForm = res.data;

                    }else{
                        yid.util.info(res.resp_msg);
                    }
                    this.uplshopaccountForm.shopname = shopPobj.shopname;
                    this.uplshopaccountForm.shopType = shopPobj.type;
                    this.uplshopaccountForm.brandId = shopPobj.brandId;
                    this.uplshopaccountForm.brandCode = shopPobj.brandCode;
                    this.qrcode = "";
                })


            },

            getUnionQr(){
                let shopid = this.uplshopaccountForm.shopid;
                service.finance.unionpaymanage.getUnionQr({shopid:shopid}).then(res => {

                    if(res.resp_code == 200){
                        this.qrcode = res.data.qrcode;
                    }else{
                        yid.util.info(res.resp_msg);
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
            mutiImportEmployee() {
                this.mutiImportDialog.title = '批量导入对公限制金额';
                this.mutiImportDialog.visible = true;
                this.mutiImportDialog.unionpays = [];
                this.myheaders = {
                    authorization: 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
                this.$refs.uploadExcel.clearFiles()
            },
            downExcelTemplate() {
                download(yid.config.API.BASE + 'api-finance/uplshopaccount/excelTemplate', {})
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
                debugger;
                console.log(this.mutiImportDialog.unionpays);
            },
            saveImportAccount() {
                if (this.mutiImportDialog.unionpays.length == 0) {
                    yid.util.info("无导入数据");
                } else {
                    console.log(this.mutiImportDialog.unionpays);
                    service.finance.unionpaymanage.batchImport({maps: this.mutiImportDialog.unionpays}).then(res => {
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
