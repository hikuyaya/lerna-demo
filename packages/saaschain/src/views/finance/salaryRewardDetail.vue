<template>
    <div class="salaryRewardDetail">
        <el-form :model="ruleForm" ref="ruleForm" inline>
            <el-form-item label="选择月份：" prop="month">
                <el-date-picker
                        :clearable="false"
                        v-model="ruleForm.month"
                        type="month"
                        value-format="yyyy-MM"
                        format="yyyy-MM"
                        placeholder="选择月">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="门店：">

                <el-select clearable v-model.trim="ruleForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="">
                <el-button @click="getAwardDescList" type="primary">查询</el-button>
                &nbsp;&nbsp;&nbsp;
                <el-button @click="mutiImportAlert">导入</el-button>
            </el-form-item>
        </el-form>
        奖项合计:{{this.zmoney}};罚项合计:{{this.fmoney}}
        <yid-table style="width: 100%;" :data="tableData" :summary-method="getSummaries">
            <el-table-column
                    prop="eecode"
                    align="center"
                    fixed
                    label="员工编码"
                    width="80">
            </el-table-column>
            <el-table-column
                    prop="eename"
                    align="center"
                    fixed
                    label="员工姓名"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="totalMoney"
                    align="center"
                    fixed
                    label="合计"
                    width="80">
            </el-table-column>
            <el-table-column
                    align="center"
                    label="奖项">
                <el-table-column v-for="(item,i) in awardList"
                                 align="center"
                                 :label="item.padname">
                    <template slot-scope="scope">
                        <el-input type="number" min="0" v-model="scope.row.awards[getAwardid(scope.row.awards,item.id)].value"></el-input>
                        <!--<span>{{ scope.row.awards.find(e=>awardList[i].id==e.padid)?scope.row.awards.find(e=>awardList[i].id==e.padid).value:0 }}</span>-->
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="扣罚项">
                <el-table-column
                        align="center" v-for="(item,i) in penaltyList"
                        :label="item.padname">
                    <template slot-scope="scope">
                        <el-input type="number" min="0"  v-model="scope.row.penaltys[getPenaltyid(scope.row.penaltys,item.id)].value"></el-input>
                        <!--<span>{{ scope.row.penaltys.find(e=>penaltyList[i].id==e.padid)?scope.row.penaltys.find(e=>penaltyList[i].id==e.padid).value:0 }}</span>-->
                    </template>
                </el-table-column>
            </el-table-column>
        </yid-table>
        <el-row style="text-align: center; margin-top: 20px">
            <el-button type="primary" @click="saveAwardDesc">保存</el-button>
        </el-row>
        <yid-dialog :title="mutiImportDialog.title" :visible.sync="mutiImportDialog.visible" @close="levelCancel" width="700px">
            <el-form :model="mutiImportDialog.model"  label-width="120px" ref="copyForm" :label-position="labelPosition">
                <p>批量导入员工奖罚</p>
                <p>1、点击链接：下载员工奖罚模板；</p>
                <p>2、下载完成并保存文件，然后打开文件并输入员工奖罚信息；</p>
                <p>3、在下面导入修改完毕的模板文件。</p>
                <el-form-item label="下载导入模板：" align="left">
                    <el-link @click="downMb" type="primary">员工奖罚模板</el-link>
                </el-form-item>

                <el-form-item label="选择导入文件:">
                    <el-upload
                            ref="upload"
                            class="avatar-uploader"
                            :headers="myheaders"
                            action="https://sass.yidmall.com/api/api-pers/awarddesc/importExcel"
                            :show-file-list="true"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">支持上传 .xls .xlsx后缀文件，表格中一行为一条数据，一次最多可导入3000条数据。</div>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button @click="saveImportDescs" type="primary">保存</el-button>
                    <el-button @click="levelCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import {isEmpty} from "../../library/helper/validate";
    import download from '@src/library/http/download'
    export default {
        name: "salaryRewardDetail",
        data: function () {
            return {
                awardDictList: [],
                tableData : [],
                ruleForm: {
                    month: '',
                    shopid:""
                },
                mutiImportDialog: {
                    title: '',
                    visible: false,
                    importData: []
                },
                myheaders:{},
                zmoney : '0',
                fmoney:'0',
                allShopList:[],
                filterShopList:[]
            }
        },
        computed: {
            awardList: function () {
                return this.awardDictList.filter(e => e.padtype == "1")
            },
            penaltyList: function () {
                return this.awardDictList.filter(e => e.padtype == "2")
            },
        },
        mounted() {
            let d = new Date
            let year = d.getFullYear()
            let month = d.getMonth()+1
            if(Number(month) < 10){
                month = "0" + month
            }
            let date1 = year + "-" + month
            this.ruleForm.month = date1
            service.awardDict.getAll({'status': '1'}).then(res => {
                this.awardDictList = res.data
            });

            this.getAwardDescList();
            this.getShopList({status:"1"});
        },
        methods:{
            getAwardDescList(){
                if (isEmpty(this.ruleForm.month)) {
                    yid.util.error("查询条件[年月]不能为空")
                    return;
                }
                this.tableData = [];
                this.zmoney = '0';
                this.fmoney = '0';
                if (this.ruleForm.month instanceof Date)
                    this.ruleForm.month = this.ruleForm.month.formatDate("yyyy-MM");
                service.pers.awardDesc.awarddescList(this.ruleForm).then(res => {
                    if(res.resp_code == 200) {
                        this.tableData = res.data;
                        //查询奖励项和扣罚项合计
                        service.pers.awardDesc.awarddescSum(this.ruleForm).then(res1=>{
                            if(res1.data != null && res1.data != ''){
                                this.zmoney = res1.data.zmoney;
                                this.fmoney = res1.data.fmoney;
                            }
                        })
                    }
                })
            },
            saveAwardDesc(){
                console.log(this.tableData);
                if(this.tableData.length > 0){
                    service.pers.awardDesc.batchUpate({awardDescVOList:this.tableData}).then(res=>{
                        if(res.resp_code == 200) {
                            yid.util.success("更新成功")
                            this.getAwardDescList();
                        }
                    })
                }
            },
            mutiImportAlert() {
                this.mutiImportDialog.title = '批量导入员工奖罚';
                this.mutiImportDialog.visible = true;
                this.mutiImportDialog.importData = [];
                this.myheaders={
                    authorization:'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
                this.$refs.upload.clearFiles()
            },
            levelCancel(){
                this.mutiImportDialog.visible = false;
            },
            saveImportDescs(){
                if(this.mutiImportDialog.importData.length == 0){
                    yid.util.info("无导入数据");
                }else{
                    console.log(this.mutiImportDialog.importData);
                    service.pers.awardDesc.batchImport({month:this.ruleForm.month,maps:this.mutiImportDialog.importData}).then(res=>{
                        if(res.resp_code == 200) {
                            yid.util.success("导入成功")
                            this.getAwardDescList();
                            this.levelCancel();
                        }
                    })
                }
            },
            beforeAvatarUpload(file){
                const isJPG = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||file.type === 'application/vnd.ms-excel');
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
            handleAvatarSuccess(res) {
                this.mutiImportDialog.importData = res.data;
                console.log(this.mutiImportDialog.importData);
            },
            downMb(){
                download(yid.config.API.BASE + '/api-pers/awarddesc/excel/exportMb', this.ruleForm)
            },
            getAwardid(awards,id){
                let n = 0;
                for(let i=0;i<awards.length;i++){
                    if(String(awards[i].padid) === String(id)){
                        n = i;
                    }
                }
                return n;
            },
            getPenaltyid(penaltys,id){
                let n = 0;
                for(let i=0;i<penaltys.length;i++){
                    if(String(penaltys[i].padid) === String(id)){
                        n = i;
                    }
                }
                return n;
            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }


                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);


                        if (index >= 6) {
                            var a = sums[index]/data.length;

                            a = new Number(a * 100).toFixed(2);
                            a += '%';
                            sums[index] = a;
                        }
                    } else {
                        sums[index] = '';
                    }
                });

                return sums;

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

<style scoped>

</style>