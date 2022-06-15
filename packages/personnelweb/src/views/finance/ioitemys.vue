<template>

    <div class="salaryRewardDetail">

        <el-collapse-transition>
            <div v-show="showList">
                <el-row>
                    <el-button @click="jobAlert(false,'')" type="primary">添加</el-button>
                    <el-button  @click="showImportDialog" style="background-color: red;color: white">导入</el-button>&nbsp;&nbsp;&nbsp;

                </el-row>
                <div style="margin-top: -5px;">
                    <el-divider/>
                </div>
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="年：" prop="name">
                        <el-input v-model="searchForm.years"   style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="项目描述：" prop="name">
                        <el-input v-model="searchForm.ioname"   style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="门店编码：" prop="name">
                        <el-input v-model="searchForm.shopcode"   style="width: 150px;"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                    </el-form-item>

                </el-form>
                <yid-table pagination ref="table" :data="jobData" style="margin-top: 15px;" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column label="收支项目编码" min-width="150" prop="iocode"></yid-table-column>
                    <yid-table-column label="收支项目描述" min-width="150" prop="ioname"></yid-table-column>
                    <yid-table-column label="年" min-width="150" prop="years"> </yid-table-column>
                    <yid-table-column label="年金额" min-width="150" prop="yearsmoney"> </yid-table-column>
                    <yid-table-column label="一季度金额" min-width="150" prop="onesmoney"> </yid-table-column>
                    <yid-table-column label="二季度金额" min-width="150" prop="twosmoney"> </yid-table-column>
                    <yid-table-column label="三季度金额" min-width="150" prop="threesmoney"> </yid-table-column>
                    <yid-table-column label="四季度金额" min-width="150" prop="foursmoney"></yid-table-column>
                    <yid-table-column label="更新人" min-width="150" prop="updatedBy"></yid-table-column>
                    <yid-table-column label="更新时间" min-width="150" prop="updatedTime"></yid-table-column>
                    <yid-table-column label="备注" min-width="250" prop="memo"></yid-table-column>
                    <yid-table-column label="操作" fixed="right" min-width="150" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="jobAlert(true,scope.row)">编辑</el-link>
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

            <el-form ref="ioitemysForm" :model="ioitemysForm"  label-width="140px">
                <el-row :gutter="20">
                    <el-col :span="8">
                    <el-form-item label="门店编码：" prop="shopcode"  :rules="[{ required: true, message: '门店编码为空'}]">
                        <el-input  v-model="ioitemysForm.shopcode" @change="getshopcode"></el-input>
                    </el-form-item>
                    <el-form-item label="门店名称：" prop="shopname"  >
                       {{ioitemysForm.shopname}}
                    </el-form-item>
                <el-form-item label="收支项目名称：" prop="iocode"  :rules="[{ required: true, message: '收支项目名称为空'}]">
                    <el-select value-key="pid" filterable placeholder="请选择" v-model="ioitemysForm.iocode">
                        <el-option :key="item.id" :value="item.code" :label="item.name" v-for="item in ioitemDataAll"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="年：" prop="years"  :rules="[{ required: true, message: '年为空'}]">

                    <div class="block">
                        <el-date-picker
                                :clearable = true
                                style="width: 150px"
                                v-model="ioitemysForm.years"
                                type="year"
                                fromat = "yyyy"
                                value-format="yyyy"
                                placeholder="日期">
                        </el-date-picker>
                    </div>
                </el-form-item>

                <el-form-item label="年金额：" prop="yearsmoney"  :rules="[{ required: true, message: '年为空'}]">
                    <el-input-number  :precision="2" :min="0" v-model="ioitemysForm.yearsmoney"></el-input-number>
                </el-form-item>
                <el-form-item label="一季度金额：" prop="onesmoney"  :rules="[{ required: true, message: '一季度金额为空'}]">

                    <el-input-number  :precision="2" :min="0" v-model="ioitemysForm.onesmoney"></el-input-number>

                </el-form-item>
                <el-form-item label="二季度金额：" prop="twosmoney"  :rules="[{ required: true, message: '二季度金额为空'}]">

                    <el-input-number  :precision="2" :min="0" v-model="ioitemysForm.twosmoney"></el-input-number>

                </el-form-item>
                <el-form-item label="三季度金额：" prop="threesmoney"  :rules="[{ required: true, message: '三季度金额为空'}]">

                    <el-input-number  :precision="2" :min="0" v-model="ioitemysForm.threesmoney"></el-input-number>

                </el-form-item>
                <el-form-item label="四季度金额：" prop="foursmoney"  :rules="[{ required: true, message: '四季度金额为空'}]">

                    <el-input-number  :precision="2" :min="0" v-model="ioitemysForm.foursmoney"></el-input-number>

                </el-form-item>
                <el-form-item label="备注：" prop="memo" >
                    <el-input v-model="ioitemysForm.memo" type="textarea"
                              :autosize="{ minRows: 4, maxRows: 8}" maxlength="1000"
                              show-word-limit></el-input>
                </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            </div>

        </el-collapse-transition>
        <yid-dialog :title="importDialog.title" :visible.sync="importDialog.visible" @close="importCancel" width="700px">
            <el-form :model="importDialog.model"  label-width="120px" ref="copyForm">
                <p>批量导入门店支出上限设置(年季)方法</p>
                <p>1、点击链接：下载门店支出上限设置(年季)模板；</p>
                <p>2、下载完成并保存文件，然后打开文件并输入信息；</p>
                <p>3、在下面导入修改完毕的模板文件。</p>
                <el-form-item label="下载导入模板：" align="left">
                    <el-link @click="downExcelTemplate" type="primary">门店支出上限设置(年季)模板</el-link>
                </el-form-item>
                <el-form-item label="选择导入文件:">
                    <el-upload
                            ref="uploadExcel"
                            class="avatar-uploader"
                            :headers="myheaders"
                            :action="excelConvertUrl"
                            :show-file-list="true"
                            :limit="1"
                            :on-exceed="handleExceed"
                            :on-success="handleAvatarExcelSuccess"
                            :before-upload="beforeAvatarExcelUpload">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">支持上传 .xls .xlsx后缀文件，表格中一行为一条数据，一次最多可导入1000条数据。</div>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button @click="saveImportIolimit" type="primary">确定</el-button>
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
    export default {
        name: "dept",
        data() {
            return {
                excelConvertUrl:"",
                myheaders:{},
                showList: true,
                type:'1',
                searchForm: {
                    years: "",
                    shopcode: "",
                    ioname: "",
                },
                status: '2',
                ioitemysForm:{
                    id:'',
                    shopcode:'',
                    shopname:'',
                    ioid:'',
                    iocode:'',
                    ioname:'',
                    years :'',
                    yearsmoney :'',
                    onesmoney : '',
                    twosmoney :'',
                    threesmoney : '',
                    foursmoney:"",
                    memo : '',
                    shopid : '',
                    shopType :'',
                    brandId :'',
                    brandCode :'',
                    brandName :'',
                },

                pageInfo:{page:1,limit:10},
                maxCode:0,
                ioitemData: [

                ],
                ioitemDataAll: [

                ],
                jobData: [

                ],
                jobDataAll: [

                ],
                allShopList: [],
                importDialog: {
                    title: '门店支出上限设置(年季)导入',
                    visible: false,
                    iolimits: []
                },

            }
        },
        created() {

        },

        mounted() {
            this.excelConvertUrl = $yid.config.API.BASE + "api-finance/iolimitys/convertSystem";

            this.getShopList();
        },
        methods: {
            search() {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getData(this.searchForm);

            },
            rest() {
                this.$refs["searchForm"].resetFields()
                this.searchForm.shopcode = "";
                this.searchForm.years = "";
                this.searchForm.ioname = "";
                this.search()
            },

            getData(reqParams) {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.finance.ioitemys.jobList
                const params = {...this.pageInfo, ...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getshopcode() {
                let shopPobj = {};
                let shopcode = this.ioitemysForm.shopcode;

                shopPobj = this.allShopList.find((shopp)=>{

                    return shopp.shopcode === shopcode;
                });
                if(yid.util.isEmpty(shopPobj)){
                    yid.util.error("没有店号为"+shopcode+"的门店信息，请重新输入");
                    this.ioitemysForm.shopcode="";
                    return;
                }
                this.ioitemysForm.shopid = shopPobj.id;
                this.ioitemysForm.shopname = shopPobj.shopname;
                this.ioitemysForm.shopType = shopPobj.type;
                this.ioitemysForm.brandId = shopPobj.brandId;
                this.ioitemysForm.brandCode = shopPobj.brandCode;
                this.ioitemysForm.brandName = shopPobj.brandName
            },
            getShopList() {
                service.chain.shop.shopList({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.allShopList = res.data;

                    }
                })
            },
            getioitemListAll(){
                service.finance.ioitemys.ioitemAll({status:'1',type:'2'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.ioitemDataAll = res.data;
                    }
                })
            },
            getjobList(type){

                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.finance.ioitemys.jobList
                const params = this.pageInfo
                params.type = type

                this.$refs.table.reloadData({
                    fetch,
                    params
                });
            },
            getjobListAll(){
                service.finance.ioitemys.jobAll({}).then(res=> {
                    if(res.resp_code == 200) {
                        this.jobDataAll = res.data;
                    }
                })
            },


            jobAlert(tag,row) {
                this.showList = false;
                this.getioitemListAll();

                if(tag == false){
                    this.ioitemysForm.id = '';
                    this.ioitemysForm.shopcode = '';
                    this.ioitemysForm.shopname = '';
                    this.ioitemysForm.ioid = '';
                    this.ioitemysForm.iocode = '';
                    this.ioitemysForm.ioname = '';
                    this.ioitemysForm.years  = '';
                    this.ioitemysForm.yearsmoney  = '';
                    this.ioitemysForm.onesmoney  = '';
                    this.ioitemysForm.twosmoney  = '';
                    this.ioitemysForm.threesmoney = '';
                    this.ioitemysForm.foursmoney = '';
                    this.ioitemysForm.memo  = '';
                }else{
                    this.ioitemysForm.id = row.id;
                    this.ioitemysForm.shopcode = row.shopcode;
                    this.ioitemysForm.shopname = row.shopname;
                    this.ioitemysForm.ioid = row.ioid;
                    this.ioitemysForm.iocode = row.iocode;
                    this.ioitemysForm.ioname = row.ioname;
                    this.ioitemysForm.years  = row.years;
                    this.ioitemysForm.yearsmoney  = row.yearsmoney;
                    this.ioitemysForm.onesmoney  = row.onesmoney;
                    this.ioitemysForm.twosmoney  = row.twosmoney;
                    this.ioitemysForm.threesmoney = row.threesmoney;
                    this.ioitemysForm.foursmoney = row.foursmoney;
                    this.ioitemysForm.memo  = row.memo;
                }
            },
            saveJob(){
                this.$refs['ioitemysForm'].validate((valid) => {
                    if(valid){
                        let yearsmonty = this.ioitemysForm.yearsmoney  ;
                        let onesmoney = this.ioitemysForm.onesmoney
                        let twosmoney = this.ioitemysForm.twosmoney
                        let threesmoney = this.ioitemysForm.threesmoney
                        let foursmoney = this.ioitemysForm.foursmoney

                        if(Number(onesmoney)+Number(twosmoney)+Number(threesmoney)+Number(foursmoney)!=Number(yearsmonty)){
                            yid.util.error("四季度金额合计不等于年金额");
                            return;
                        }
                        //获取部门id
                        let pobj = {};
                        pobj = this.ioitemDataAll.find((item)=>{
                            return item.code === this.ioitemysForm.iocode;
                        });
                        this.ioitemysForm.ioid =pobj.id;
                        this.ioitemysForm.ioname =pobj.name;
                        service.finance.ioitemys.saveJob(this.ioitemysForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                                this.back();
                                this.getjobList();
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                        });

                    }
                })

            },
            back() {
                this.$refs['ioitemysForm'].resetFields();
                this.showList = true;
            },
            downExcelTemplate(){
                download(yid.config.API.BASE + 'api-finance/iolimitys/downSysTemplate', {})
            },
            saveImportIolimit(){
                if(this.importDialog.iolimits.length == 0){
                    yid.util.error("无导入数据");
                }else{
                    service.finance.ioitemys.saveSystem(this.importDialog.iolimits).then(res =>{
                        if(res.resp_code=="200"){
                            this.importDialog.visible = false;
                            yid.util.success("导入成功");
                            this.search();
                        }else{
                            yid.util.error(res.resp_msg);
                        }
                    });
                }
            },
            showImportDialog(){
                this.importDialog.visible = true;
                this.importDialog.iolimits = [];
                this.myheaders['authorization'] = 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN);
                this.$refs.uploadExcel.clearFiles()
            },
            importCancel(){
                this.importDialog.visible = false;
            },
            handleExceed(files, fileList){
                yid.util.error('只能导入一个文件，请先删除之前选择的文件');
                return;
            },
            handleAvatarExcelSuccess(res){
                this.importDialog.iolimits = res.data;
            },
            beforeAvatarExcelUpload(file){
                const isJPG = (file.type.indexOf("sheet")!=-1 ||file.type.indexOf('excel')!=-1);
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isJPG) {
                    yid.util.error('上传excel只能是 xls/xlsx 格式!');
                    return false;
                }
                if (!isLt2M) {
                    yid.util.error('上传excel大小不能超过 10MB!');
                    return false;
                }

                return isJPG && isLt2M;
            },

        }
    }
</script>

<style scoped>

</style>
