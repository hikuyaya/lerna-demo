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

                    <el-form-item label="门店编码：" prop="name">
                        <el-input v-model="searchForm.shopcode"   style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="是否报销：" prop="shopType" label-width="100px">
                        <el-select clearable v-model="searchForm.status" style="width: 180px">
                            <el-option label="未报销" value="0"></el-option>
                            <el-option label="已报销" value="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                    </el-form-item>

                </el-form>
                <yid-table pagination ref="table" :data="jobData" style="margin-top: 15px;" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column prop="status" label="是否报销" width="80">
                        <template slot-scope="scope">
                            <span v-if='scope.row.status==0'>未报销</span>
                            <span v-if='scope.row.status==1'>已报销</span>
                        </template>
                    </yid-table-column>

                    <yid-table-column prop="startdate" label="开始时间" width="100">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.startdate)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column prop="enddate" label="结束时间" width="100">
                        <template slot-scope="scope">
                            {{$yid.util.formatDate(scope.row.enddate)}}
                        </template>
                    </yid-table-column>
                    <yid-table-column label="事项内容" min-width="150" prop="itemnmae"> </yid-table-column>
                    <yid-table-column label="身份证姓名" min-width="150" prop="eename"> </yid-table-column>
                    <yid-table-column label="职位" min-width="150" prop="psname"> </yid-table-column>
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

            <el-form ref="travelForm" :model="travelForm"  label-width="140px">
                <el-row :gutter="20">
                    <el-col :span="8">
                    <el-form-item label="门店编码：" prop="shopcode"  :rules="[{ required: true, message: '门店编码为空'}]">
                        <el-input  v-model="travelForm.shopcode" @change="getshopcode"></el-input>
                    </el-form-item>
                    <el-form-item label="门店名称：" prop="shopname"  >
                       {{travelForm.shopname}}
                    </el-form-item>
                     <el-form-item label="是否报销：" prop="status" style="display: inline-block;"  :rules="[{ required: true, message: '请选择是否报销'}]">
                            <el-select value-key="id" placeholder="请选择"   v-model.trim="travelForm.status" >
                                <el-option label="否" value="0"></el-option>
                                <el-option label="是" value="1"></el-option>
                            </el-select>
                     </el-form-item>
                        <el-form-item label="时间周期：" prop="sTimeRange"  width="150">

                            <el-date-picker
                                    :clearable = true
                                    v-model="travelForm.applyDateRange"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="事项内容：" prop="itemnmae"  :rules="[{ required: true, message: '事项内容为空'}]">
                            <el-input  v-model="travelForm.itemnmae" maxlength="32"
                                       show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="身份证姓名：" prop="eename"  :rules="[{ required: true, message: '身份证姓名为空'}]">
                            <el-input  v-model="travelForm.eename" maxlength="32"
                                       show-word-limit></el-input>
                        </el-form-item>
                        <el-form-item label="职位：" prop="psname"  :rules="[{ required: true, message: '职位为空'}]">
                            <el-input  v-model="travelForm.psname" maxlength="32"
                                       show-word-limit></el-input>
                        </el-form-item>
                <el-form-item label="备注：" prop="memo" >
                    <el-input v-model="travelForm.memo" type="textarea"
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
                <p>批量导入差旅费维护方法</p>
                <p>1、点击链接：下载差旅费维护模板；</p>
                <p>2、下载完成并保存文件，然后打开文件并输入信息；</p>
                <p>3、在下面导入修改完毕的模板文件。</p>
                <el-form-item label="下载导入模板：" align="left">
                    <el-link @click="downExcelTemplate" type="primary">差旅费维护模板</el-link>
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
                    status: "",
                    shopcode: "",

                },
                travelForm:{
                    id:'',
                    shopid : '',
                    shopType :'',
                    brandId :'',
                    brandCode :'',
                    brandName :'',
                    shopcode:'',
                    shopname:'',
                    startdate:'',
                    enddate:'',
                    status :'0',
                    itemnmae:'',
                    eename :'',
                    psname :'',
                    memo : '',
                    applyDateRange:[],
                },

                pageInfo:{page:1,limit:10},
                maxCode:0,


                jobData: [

                ],
                jobDataAll: [

                ],
                allShopList: [],
                importDialog: {
                    title: '差旅费维护导入',
                    visible: false,
                    iolimits: []
                },

            }
        },
        created() {

        },

        mounted() {
            this.excelConvertUrl = $yid.config.API.BASE + "api-finance/fundtravel/convertSystem";

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
                this.searchForm.status = "";
                this.search()
            },

            getData(reqParams) {
                this.pageInfo.page = 1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.finance.fundtravel.jobList
                const params = {...this.pageInfo, ...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getshopcode() {
                let shopPobj = {};
                let shopcode = this.travelForm.shopcode;

                shopPobj = this.allShopList.find((shopp)=>{

                    return shopp.shopcode === shopcode;
                });
                if(yid.util.isEmpty(shopPobj)){
                    yid.util.error("没有店号为"+shopcode+"的门店信息，请重新输入");
                    this.travelForm.shopcode="";
                    return;
                }
                this.travelForm.shopid = shopPobj.id;
                this.travelForm.shopname = shopPobj.shopname;
                this.travelForm.shopType = shopPobj.type;
                this.travelForm.brandId = shopPobj.brandId;
                this.travelForm.brandCode = shopPobj.brandCode;
                this.travelForm.brandName = shopPobj.brandName
            },
            getShopList() {
                service.chain.shop.shopList({status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.allShopList = res.data;

                    }
                })
            },

            getjobList(type){

                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                const fetch = service.finance.fundtravel.jobList
                const params = this.pageInfo
                params.type = type

                this.$refs.table.reloadData({
                    fetch,
                    params
                });
            },
            getjobListAll(){
                service.finance.fundtravel.jobAll({}).then(res=> {
                    if(res.resp_code == 200) {
                        this.jobDataAll = res.data;
                    }
                })
            },


            jobAlert(tag,row) {
                this.showList = false;

                this.travelForm.applyDateRange =[];
                if(tag == false){
                    this.travelForm.id = '';
                    this.travelForm.shopcode = '';
                    this.travelForm.shopname = '';
                    this.travelForm.startdate = '';
                    this.travelForm.enddate = '';
                    this.travelForm.status = '';
                    this.travelForm.itemnmae = '';
                    this.travelForm.eename  = '';
                    this.travelForm.psname  = '';
                    this.travelForm.memo  = '';
                }else{
                    this.travelForm.id = row.id;
                    this.travelForm.shopcode = row.shopcode;
                    this.travelForm.shopname = row.shopname;
                    this.travelForm.startdate = row.startdate;
                    this.travelForm.enddate = row.enddate;
                    this.travelForm.status = row.status;
                    this.travelForm.itemnmae = row.itemnmae;
                    this.travelForm.eename  = row.eename;
                    this.travelForm.psname  = row.psname;
                    this.travelForm.memo  = row.memo;
                    this.travelForm.applyDateRange.push(row.startdate);
                    this.travelForm.applyDateRange.push(row.enddate);

                }
            },
            saveJob(){
                this.$refs['travelForm'].validate((valid) => {
                    if(valid){

                        let applyDateRange = this.travelForm.applyDateRange;
                        if(applyDateRange!=null && applyDateRange.length>0){
                            this.travelForm.startdate = this.travelForm.applyDateRange[0];
                            this.travelForm.enddate = this.travelForm.applyDateRange[1];
                        }else{
                            this.travelForm.startdate = '';
                            this.travelForm.enddate = '';
                        }
                        service.finance.fundtravel.saveJob(this.travelForm).then(res=> {
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
                this.$refs['travelForm'].resetFields();
                this.showList = true;
            },
            downExcelTemplate(){
                download(yid.config.API.BASE + 'api-finance/fundtravel/downSysTemplate', {})
            },
            saveImportIolimit(){
                if(this.importDialog.iolimits.length == 0){
                    yid.util.info("无导入数据");
                }else{
                    service.finance.fundtravel.saveSystem(this.importDialog.iolimits).then(res =>{
                        if(res.resp_code=="200"){
                            this.importDialog.visible = false
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
