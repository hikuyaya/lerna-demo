<template>
    <div>
        <el-form :model="formData"  label-width="120px" ref="importForm">
            <p>批量导入方法</p>
            <p>1、点击链接：下载模板；</p>
            <p>2、下载完成并保存文件，然后打开文件并输入需要导入的数据，请不要修改模板中的列名；</p>
            <p>3、在下面导入修改完毕的模板文件。</p>
            <el-form-item label="下载导入模板：" align="left">
                <el-link @click="downExcelTemplate" type="primary">下载</el-link>
            </el-form-item>
            <el-form-item label="选择导入文件:">
                <el-upload
                        ref="uploadExcel"
                        class="avatar-uploader"
                        :headers="myheaders"
                        :action="importUrl"
                        :show-file-list="true"
                        :limit="1"
                        :on-exceed="handleExceed"
                        :on-success="handleAvatarExcelSuccess"
                        :before-upload="beforeAvatarExcelUpload">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">支持上传 .xls .xlsx后缀文件。</div>
                </el-upload>
            </el-form-item>
            <slot></slot>
            <el-form-item>
                <el-button @click="doImportFunc" type="primary">确定</el-button>
                <el-button @click="cancelImp">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

    import yid from '@src/library'
    import download from '@src/library/http/download'

    export default {
        name:"importExcelForm",
        props: {excelName:String,importFunc:Function,importCancel:Function,importPath:String},
        data(){
            return {
                importData:[],
                formData:{},
                importUrl:"",
                myheaders:{},
            }
        },
        mounted() {
            this.importUrl = yid.config.API.BASE + this.importPath;
            this.myheaders['authorization'] = 'Bearer ' + yid.cache.get(yid.type.USER.TOKEN);
            this.myheaders['x-appId-header'] =  yid.cache.get(yid.type.USER.APPID);
        },
        computed:{

        },
        methods: {
            downExcelTemplate(){
                download(yid.config.API.BASE + 'api-finance/finance/global/downSysTemplate/'+this.excelName, {})
            },
            handleExceed(files, fileList){
                yid.util.error('只能导入一个文件，请先删除之前选择的文件');
                return;
            },
            handleAvatarExcelSuccess(res){
                this.importData = res.data;
            },
            beforeAvatarExcelUpload(file){
                const isExcel = (file.type.indexOf("sheet")>=0 ||file.type.indexOf('excel')>=0);
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isExcel) {
                    yid.util.error('上传excel只能是 xls/xlsx 格式!');
                    return isExcel;
                }
                if (!isLt2M) {
                    yid.util.error('上传excel大小不能超过 10MB!');
                    return isLt2M;
                }

                return isExcel && isLt2M;
            },
            doImportFunc(){
                if(this.importData.length == 0){
                    yid.util.info("请先选择导入文件");
                }else{
                    this.importFunc(this.importData);
                }
            },
            cancelImp(){
                this.$refs['uploadExcel'].clearFiles();
                if(this.importCancel)
                    this.importCancel();
            },
        },
    }

</script>

<style scoped lang="scss">

</style>
