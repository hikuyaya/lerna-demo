<template>
    <div class="balance">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="门店结存月报表" name="shopBalance">
                <el-form :model="searchForm" ref="ruleForm" inline>
                    <el-form-item label="月份：" prop="month">
                        <el-date-picker
                                :clearable="false"
                                v-model="searchForm.month"
                                type="month"
                                value-format="yyyy-MM"
                                format="yyyy-MM"
                                placeholder="选择月">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="店号：" prop="month">
                        <el-input clearable v-model="searchForm.shopcode" placeholder="门店编码" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="getshopBalanceList" type="primary">查询</el-button>
                        <el-button @click="showImportDialog"  type="primary">导入</el-button>
                    </el-form-item>
                </el-form>
                <el-table ref="shopBalancetable" style="margin-top: 15px;" :data="shopBalanceDate" :row-class-name="$yid.util.getTableClass">
                    <el-table-column v-for="(item) in dicBalanceList"
                                     align="center"
                                     :prop="item.colName"
                                     :label="item.name">

                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="结存字段管理" name="dicBalance">
                <el-button @click="dicBalanceAlert(false,'')" type="primary">添加</el-button>
                <font color="red">（最多可添加50条字段）</font>
                <yid-table pagination ref="dicBalancetable" style="margin-top: 15px;" :row-class-name="$yid.util.getTableClass">
                    <yid-table-column label="字段名称" min-width="150" prop="name"></yid-table-column>
                    <yid-table-column label="报表对应字段" min-width="120" prop="colName"></yid-table-column>
                    <yid-table-column label="是否默认字段" min-width="100" prop="isDefault">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isDefault == 0">否</span>
                            <span v-if="scope.row.isDefault == 1">是</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="是否在报表展示" min-width="120" prop="isShow">
                        <template slot-scope="scope">
                            <span v-if="scope.row.isShow == 0">否</span>
                            <span v-if="scope.row.isShow == 1">是</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="报表展示顺序" min-width="120" prop="colOrder"></yid-table-column>
                    <yid-table-column label="操作" min-width="120" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="dicBalanceAlert(true,scope.row)">编辑</el-link>
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="dicBalanceDelete(scope.row)" :disabled="scope.row.isDefault == 1">删除</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>

        <yid-dialog :title="dicBalanceDialog.title" :visible.sync="dicBalanceDialog.visible" width="450px">
            <el-form ref="dicBalanceForm" :model="dicBalanceForm"  label-width="140px" >
                <el-form-item label="字段名称：" prop="name" :rules="[{ required: true, message: '字典名称不能为空'}]">
                    <el-input clearable placeholder="字段名称" v-model="dicBalanceForm.name" :disabled="dicBalanceForm.isDefault == 1" style="width: 200px"/>
                </el-form-item>
                <el-form-item label="对应报表字段：" prop="colName" :rules="[{ required: true, message: '请选择对应报表字段'}]">
                    <el-select clearable placeholder="请选择报表字段" v-model.trim="dicBalanceForm.colName" style="width: 160px" filterable :disabled="isEditCol">
                        <el-option v-show="checkColName(val.value)" v-for="val in colNameList" :key="val.value" :value="val.value" :label="val.label"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否默认字段：" prop="isDefault" :rules="[{ required: true, message: '请选择是否默认字段'}]">
                    <el-select placeholder="请选择是否默认字段" v-model.trim="dicBalanceForm.isDefault" style="width: 160px" :disabled="dicBalanceForm.isDefault == 1">
                        <el-option v-for="val in isDefaultList" :key="val.value" :value="val.value" :label="val.label"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="是否报表展示：" prop="isShow" :rules="[{ required: true, message: '请选择是否报表展示'}]">
                    <el-select placeholder="请选择是否报表展示" v-model.trim="dicBalanceForm.isShow" style="width: 160px" :disabled="dicBalanceForm.isDefault == 1">
                        <el-option v-for="val in isShowList" :key="val.value" :value="val.value" :label="val.label"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="报表展示顺序：" prop="colOrder" :rules="[{ required: true, message: '报表展示顺序不能为空'}]">
                    <el-input-number placeholder="报表展示顺序" :min="1" v-model="dicBalanceForm.colOrder" style="width: 160px"/>
                </el-form-item>
                <el-form-item>
                    <el-button @click="dicBalanceSave" type="primary">确定</el-button>
                    <el-button @click="cancleDicBalance">取消</el-button>
                </el-form-item>

            </el-form>
        </yid-dialog>

        <yid-dialog :title="importDialog.title" :visible.sync="importDialog.visible" @close="importCancel" width="700px">
            <el-form :model="importDialog.model"  label-width="120px" ref="copyForm">
                <p>批量导入门店结存月报表方法</p>
                <p>1、点击链接：下载门店结存月报表模板；</p>
                <p>2、下载完成并保存文件，然后打开文件并输入门店结存月报表信息；</p>
                <p>3、在下面导入修改完毕的模板文件。</p>
                <el-form-item label="下载导入模板：" align="left">
                    <el-link @click="downExcelTemplate" type="primary">门店结存月报表模板</el-link>
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
                    <el-button @click="saveImportShopBalances" type="primary">确定</el-button>
                    <el-button @click="importCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    import download from '@src/library/http/download'
    import {isEmpty} from "../../library/helper/validate";
    export default {
        name: "balance",
        data() {
            return {
                excelConvertUrl:"",
                myheaders:{},
                activeName: 'shopBalance',
                pageInfo:{page:1,limit:10},
                dicBalanceDialog: {
                    title: '',
                    visible: false,
                },
                dicBalanceForm : {
                    name : '',
                    colName : '',
                    isDefault : '',
                    isShow : '',
                    colOrder : '',
                },
                colNameList:[{value: 'col1', label: 'col1'}, {value: 'col2', label: 'col2'},{value: 'col3', label: 'col3'}, {value: 'col4', label: 'col4'},{value: 'col5', label: 'col5'},
                    {value: 'col6', label: 'col6'}, {value: 'col7', label: 'col7'},{value: 'col8', label: 'col8'},{value: 'col9', label: 'col9'},{value: 'col10', label: 'col10'},
                    {value: 'col11', label: 'col11'},{value: 'col12', label: 'col12'},{value: 'col13', label: 'col13'},{value: 'col14', label: 'col14'},{value: 'col15', label: 'col15'},
                    {value: 'col16', label: 'col16'},{value: 'col17', label: 'col17'},{value: 'col18', label: 'col18'},{value: 'col19', label: 'col19'},{value: 'col20', label: 'col20'},
                    {value: 'col21', label: 'col21'},{value: 'col22', label: 'col22'},{value: 'col23', label: 'col23'},{value: 'col24', label: 'col24'},{value: 'col25', label: 'col25'},
                    {value: 'col26', label: 'col26'},{value: 'col27', label: 'col27'},{value: 'col28', label: 'col28'},{value: 'col29', label: 'col29'},{value: 'col30', label: 'col30'},
                    {value: 'col31', label: 'col31'},{value: 'col32', label: 'col32'},{value: 'col33', label: 'col33'},{value: 'col34', label: 'col34'},{value: 'col35', label: 'col35'},
                    {value: 'col36', label: 'col36'},{value: 'col37', label: 'col37'},{value: 'col38', label: 'col38'},{value: 'col39', label: 'col39'},{value: 'col40', label: 'col40'},
                    {value: 'col41', label: 'col41'},{value: 'col42', label: 'col42'},{value: 'col43', label: 'col43'},{value: 'col44', label: 'col44'},{value: 'col45', label: 'col45'},
                    {value: 'col46', label: 'col46'},{value: 'col47', label: 'col47'},{value: 'col48', label: 'col48'},{value: 'col49', label: 'col49'},{value: 'col50', label: 'col50'},
                ],
                isDefaultList:[{
                    value: '0',
                    label: '否'
                }, {
                    value: '1',
                    label: '是'
                }],
                isShowList : [{
                    value: '0',
                    label: '否'
                },{
                    value: '1',
                    label: '是'
                }],
                dicBalanceList : [],
                dicBalanceListAll : [],
                searchForm : {
                    month : '',
                    shopcode : '',
                },
                shopBalanceDate : [],
                importDialog: {
                    title: '门店结存月报表导入',
                    visible: false,
                    shopbalances: []
                },
                isEditCol : true,
            }
        },
        mounted() {
            let d = new Date
            let year = d.getFullYear()
            let month = d.getMonth()+1
            if(Number(month) < 10){
                month = "0" + month
            }
            let date1 = year + "-" + month
            this.searchForm.month = date1
            this.excelConvertUrl = $yid.config.API.BASE + "api-finance/dicbalance/convertSystem";
            this.queryDicBalanceList();
            this.queryDicBalanceListAll();
            this.getshopBalanceList();
        },
        methods: {
            getdicBalanceList(){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.dicBalancetable.Pagination.internalPageSize;
                const fetch = service.finance.dicBalance.list
                const params = this.pageInfo
                params.isDel = '0'
                this.$refs.dicBalancetable.reloadData({
                    fetch,
                    params
                });
            },
            queryDicBalanceList(){
                service.finance.dicBalance.listAll({isDel:'0',isShow:'1'}).then(res=>{
                    if(res.resp_code == 200) {
                        this.dicBalanceList = res.data;
                    }
                })
            },
            queryDicBalanceListAll(){
                service.finance.dicBalance.listAll({isDel:'0'}).then(res=>{
                    if(res.resp_code == 200) {
                        this.dicBalanceListAll = res.data;
                    }
                })
            },
            dicBalanceAlert(tag = false,row){
                this.dicBalanceDialog.visible = true;
                this.dicBalanceDialog.title = tag? '编辑结存字段' : '添加结存字段';
                if(tag == false){
                    this.$nextTick(()=> {
                        this.dicBalanceForm.id = '';
                        this.getMaxOrder();
                        this.isEditCol = false;
                        this.$refs['dicBalanceForm'].resetFields();
                        this.dicBalanceForm.name = '';
                        this.dicBalanceForm.colName = '';
                        this.dicBalanceForm.isDefault = '0';
                        this.dicBalanceForm.isShow = '1';
                    })
                }else{
                    this.$nextTick(()=> {
                        this.isEditCol = true;
                        this.dicBalanceForm.id = row.id;
                        this.dicBalanceForm.name = row.name;
                        this.dicBalanceForm.colName = row.colName;
                        this.dicBalanceForm.isDefault = row.isDefault;
                        this.dicBalanceForm.isShow = row.isShow;
                        this.dicBalanceForm.colOrder = row.colOrder;
                    })
                }
            },
            getMaxOrder(){
                service.finance.dicBalance.getMaxOrder({isDel:'0'}).then(res=>{
                    this.dicBalanceForm.colOrder = res.data;
                });
            },
            cancleDicBalance(){
                this.dicBalanceDialog.visible = false;
            },
            dicBalanceSave(){
                this.$refs['dicBalanceForm'].validate((valid) => {
                    if(valid){
                        console.log(this.dicBalanceForm);
                        //判断名称  对应表字段  和 排序 是否有重复的记录
                        service.finance.dicBalance.listAllNoId({id:this.dicBalanceForm.id,isDel:'0',name:this.dicBalanceForm.name}).then(res=>{
                            if(res.resp_code == 200) {
                                if(res.data.length > 0){
                                    yid.util.error("已存在名称为["+this.dicBalanceForm.name+"]的字段，请修改名称!");
                                    return;
                                }
                                service.finance.dicBalance.listAllNoId({id:this.dicBalanceForm.id,isDel:'0',colName:this.dicBalanceForm.colName}).then(res=>{
                                    if(res.resp_code == 200) {
                                        if(res.data.length > 0){
                                            yid.util.error("已存在报表对应字段为["+this.dicBalanceForm.colName+"]的字段，请修改报表对应字段!");
                                            return;
                                        }
                                        service.finance.dicBalance.listAllNoId({id:this.dicBalanceForm.id,isDel:'0',colOrder:this.dicBalanceForm.colOrder}).then(res=>{
                                            if(res.resp_code == 200) {
                                                if(res.data.length > 0){
                                                    yid.util.error("已存在报表展示顺序为["+this.dicBalanceForm.colOrder+"]的字段，请修改报表展示顺序!");
                                                    return;
                                                }
                                                service.finance.dicBalance.listAll({isDel:'0'}).then(res=>{
                                                    if(res.resp_code == 200) {
                                                        let total = res.data.length;
                                                        if(Number(total) >= 55){
                                                            yid.util.error("最多添加50个字段，不能再次进行添加！");
                                                            return;
                                                        }
                                                        service.finance.dicBalance.save(this.dicBalanceForm).then(res=> {
                                                            if(res.resp_code == 200) {
                                                                yid.util.success("更新成功")
                                                                this.cancleDicBalance();
                                                                this.getdicBalanceList();
                                                                this.queryDicBalanceList();
                                                                this.queryDicBalanceListAll();
                                                            }else{
                                                                yid.util.error(res.resp_msg)
                                                            }
                                                        })
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
            },
            dicBalanceDelete(row){
                yid.util.confirm('你确定要删除吗['+row.name+']字段吗？', '','', ()=> {
                    //row.isDel = '1';
                    service.finance.dicBalance.deleteDicBalance(row.id).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("删除成功")
                            this.getdicBalanceList();
                            this.queryDicBalanceList();
                            this.queryDicBalanceListAll();
                        }else{
                            yid.util.error(res.resp_msg)
                        }
                    })
                })
            },
            getshopBalanceList(){
                if (isEmpty(this.searchForm.month)) {
                    yid.util.error("查询条件[年月]不能为空")
                    return;
                }
                this.shopBalanceDate = [];
                if (this.searchForm.month instanceof Date)
                    this.searchForm.month = this.searchForm.month.formatDate("yyyy-MM");

                //获取年月的值
                let years = this.searchForm.month.substr(0,4);
                let month = this.searchForm.month.substr(5,2);
                service.finance.shopBalance.listAll({isDel:'0',year:Number(years),month:Number(month),shopcode:this.searchForm.shopcode}).then(res=>{
                    if(res.resp_code == 200) {
                        this.shopBalanceDate = res.data;
                    }
                })
            },
            showImportDialog(){
                this.importDialog.visible = true;
                this.importDialog.shopbalances = [];
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
                this.importDialog.shopbalances = res.data;
            },
            beforeAvatarExcelUpload(file){
                const isJPG = (file.type.indexOf("sheet")!=-1 ||file.type.indexOf('excel')!=-1);
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isJPG) {
                    yid.util.error('上传excel只能是 xls/xlsx 格式!');
                }
                if (!isLt2M) {
                    yid.util.error('上传excel大小不能超过 10MB!');
                }

                return isJPG && isLt2M;
            },
            downExcelTemplate(){
                //动态生成导入模版
                download(yid.config.API.BASE + 'api-finance/dicbalance/excel/exportMb',this.searchForm)
            },
            saveImportShopBalances(){
                if(this.importDialog.shopbalances == null || this.importDialog.shopbalances.length == 0){
                    yid.util.error("无导入数据或数据格式有误,请使用下载的模版编辑正确的数据导入");
                    return
                }
                service.finance.dicBalance.saveSystem(this.importDialog.shopbalances).then(res =>{
                    if(res.resp_code=="200"){
                        this.queryDicBalanceList();
                        this.getshopBalanceList();
                        this.importCancel();
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                });
            },
            handleClick(tab, event) {
                console.log(tab, event);
                if(tab.name == 'dicBalance'){
                    this.getdicBalanceList();
                }else if(tab.name == 'shopBalance'){
                    this.queryDicBalanceList();
                    this.getshopBalanceList();
                }
            },
            checkColName(colname){
                let flag = true;
                this.dicBalanceListAll.forEach(res=>{
                    if(res.colName == colname){
                        flag = false;
                    }
                })
                return flag;
            }
        }
    }
</script>

<style scoped lang="scss">
    .levelWrap {
        display: flex;
        width: 300px;
        flex-wrap: wrap;
        .box {
            width: 55px;
            height: 55px;
            border: 1px solid #969896;
            margin: 0 10px 10px 0;
        }
        .xiangm{
            width: 50px;
            height: 50px;
            border:1px #999 solid;
            box-sizing:content-box;
            position: relative;
            border-radius: 4px;
            margin:0 25px 25px 0 ;
            padding: 0;
            span{
                width: 100%;
                height: 100%;
                overflow: hidden;
                img{
                    width: 120px;
                    height: 150px;
                    margin: 0;
                    padding: 0;
                }
            }
            .gou{
                display: none;
            }

            .xmname{
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                display: flex;justify-content: center;
                align-items: center;
                color: #000;
                z-index: 2222;
            }
        }
        .xiangm.active{
            border:5px rgba(255, 102, 0, 1) solid;

            .gou{
                width: 5px;
                height: 5px;
                border-radius: 1px;
                background-color: rgba(255, 102, 0, 1);
                position: absolute;
                top: -5px;
                right: -5px;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0;
                margin: 0;
                i{
                    color: #fff;
                    font-size: 20px;
                    font-weight: bold;
                }
            }
        }
    }
</style>