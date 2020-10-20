<template>
    <div class="product">
        <el-collapse-transition>
            <div v-show="showList">
                <el-form ref="searchForm" inline :model="searchForm">
                    <el-form-item label="">
                        <el-button @click="addProduct" type="primary">新增</el-button>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="mutiImportProduct" type="primary">批量导入</el-button>
                    </el-form-item>
                    <br/>
                    <el-form-item label="产品：" prop="pcodename">
                        <el-input clearable filterable  v-model="searchForm.pcodename" placeholder="产品编码/产品名称" style="width: 150px;"></el-input>
                    </el-form-item>
                    <el-form-item label="产品品牌：" prop="brand">
                        <el-select clearable filterable placeholder="请选择" v-model.trim="searchForm.brand">
                            <el-option :key="item.id" :label="item.bname" :value="item.id" v-for="item in searchProductBrandList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产品品类：" prop="categrory">
                        <el-select clearable value-key="id" filterable placeholder="请选择" v-model.trim="searchForm.categrory" @change="getCategroryList">
                            <el-option-group v-for="group in categroryList" :key="group.id" :label="group.cname">
                                <el-option v-for="item in group.categroryListz" :key="item.id" :label="item.cname" :value="item.id"></el-option>
                            </el-option-group>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                        <el-select  clearable filterable placeholder="请选择" v-model.trim="searchForm.status">
                            <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in statusList"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button @click="search" type="primary">查询</el-button>
                        <el-button @click="rest" type="primary">重置</el-button>
                    </el-form-item>
                </el-form>

                <yid-table  ref="table" pagination style="width: 100%;margin-top: 20px;" @selection-change="handleSelectionChange">
                    <yid-table-column prop="pcode" label="产品编码" width="120"></yid-table-column>
                    <yid-table-column prop="pname" label="产品名称" width="190"></yid-table-column>
                    <yid-table-column prop="barcode" label="产品条码" width="130"></yid-table-column>
                    <yid-table-column prop="norms" label="规格" width="80"></yid-table-column>
                    <yid-table-column prop="unit" label="单位" width="80"></yid-table-column>
                    <yid-table-column prop="bname" label="品牌" width="100"></yid-table-column>
                    <yid-table-column prop="cname" label="类别" width="100"></yid-table-column>
                    <yid-table-column prop="cost" label="进价" width="80"></yid-table-column>
                    <yid-table-column prop="price" label="售价" width="80"></yid-table-column>
                    <yid-table-column prop="status" label="状态" width="70">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.status" active-value="1" inactive-value="2" active-color="#339933" inactive-color="#DCDFE6" @change="updateStatus(scope.row)">
                            </el-switch>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="100" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="editProduct(scope.row)">编辑</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-show="!showList">
                <el-button  @click="back" type="primary">返回</el-button>
                <el-button  @click="save" type="primary">保存</el-button>
                <el-form ref="productForm" :model="productForm" style="margin-top: 16px"  label-width="150px" label-position="right">

                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-form-item label="产品编码：" prop="pcode" :rules="[{ required: true, message: '产品编码不能为空'}]">
                                <el-input v-model="productForm.pcode" :disabled="isEditCode" placeholder="产品编码" style="width: 200px;" @change="checkPcode"></el-input>
                            </el-form-item>

                            <el-form-item label="产品条码：" prop="barcode" :rules="[{ required: true, message: '产品条码不能为空'}]">
                                <el-input  v-model="productForm.barcode" placeholder="产品条码" style="width: 200px;"></el-input>
                            </el-form-item>

                            <el-form-item label="产品名称：" prop="pname" :rules="[{ required: true, message: '产品名称不能为空'}]">
                                <el-input  v-model="productForm.pname" placeholder="产品名称" style="width: 200px;"></el-input>
                            </el-form-item>

                            <el-form-item label="产品规格：" prop="norms">
                                <el-input  v-model="productForm.norms" placeholder="规格" style="width: 200px;"></el-input>
                            </el-form-item>

                            <el-form-item label="产品单位：" prop="unit">
                                <el-input  v-model="productForm.unit" placeholder="单位" style="width: 200px;"></el-input>
                            </el-form-item>

                            <el-form-item label="产品品牌：" prop="brandObj" :rules="[{ required: true, message: '请选择品牌'}]">
                                <el-select value-key="id" filterable placeholder="请选择" v-model.trim="productForm.brandObj" @change="getBrandList">
                                    <el-option :key="item.id" :label="item.bname" :value="item" v-for="item in brandList"></el-option>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="产品品类：" prop="categroryObj" :rules="[{ required: true, message: '请选择品类'}]">
                                <el-select value-key="id" filterable placeholder="请选择" v-model.trim="productForm.categroryObj" @change="getCategroryList">
                                    <el-option-group v-for="group in categroryList" :key="group.id" :label="group.cname">
                                        <el-option v-for="item in group.categroryListz" :key="item.id" :label="item.cname" :value="item"></el-option>
                                    </el-option-group>
                                </el-select>
                            </el-form-item>

                            <el-form-item label="进价：" prop="cost" :rules="[{ required: true, message: '进价不能为空'}]">
                                <el-input type="number" v-model="productForm.cost" placeholder="进价" style="width: 200px;"></el-input>
                            </el-form-item>

                            <el-form-item label="是否客装销售：" prop="iskz" :rules="[{ required: true, message: '是否客装销售不能为空'}]">
                                <el-radio-group v-model="productForm.iskz">
                                    <el-radio label="0">否</el-radio>
                                    <el-radio label="1">是</el-radio>
                                </el-radio-group>
                            </el-form-item>

                            <el-form-item label="售价：" prop="price" :rules="[{ required: true, message: '售价不能为空'}]">
                                <el-input type="number" v-model="productForm.price" placeholder="售价" style="width: 200px;"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="10">
                            <el-form-item label="产品图片：" prop="photo">
                                <el-upload
                                        ref="upload"
                                        class="avatar-uploader"
                                        action="https://sass.yidmall.com/api/api-file/files-anon"
                                        :headers="myheaders"
                                        :show-file-list="false"
                                        :on-success="handleAvatarSuccess"
                                        :before-upload="beforeAvatarUpload">
                                    <img style="width: 200px;height: 200px" v-if="productForm.photo" :src="productForm.photo" class="avatar el-upload">
                                    <i v-else class="el-icon-plus avatar-uploader-icon el-upload"></i>
                                    <div class="el-upload__tip" slot="tip">仅支持jpg，png格式的图片上传 图片尺寸：200px*200px</div>
                                </el-upload>
                                <el-button @click="handleRemove" type="primary">移除图片</el-button>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </el-collapse-transition>

        <yid-dialog :title="mutiImportDialog.title" :visible.sync="mutiImportDialog.visible" @close="importCancel" width="700px">
            <el-form :model="mutiImportDialog.model"  label-width="120px" ref="copyForm" :label-position="labelPosition">
                <p>批量导入产品基础资料方法</p>
                <p>1、点击链接：下载产品基础资料模板；</p>
                <p>2、下载完成并保存文件，然后打开文件并输入产品基础资料信息；</p>
                <p>3、在下面导入修改完毕的模板文件。</p>
                <el-form-item label="下载导入模板：" align="left">
                    <el-link @click="downExcelTemplate" type="primary">产品基础资料模板</el-link>
                </el-form-item>

                <el-form-item label="选择导入文件:">
                    <el-upload
                            ref="uploadExcel"
                            class="avatar-uploader"
                            :headers="myheaders"
                            action="https://sass.yidmall.com/api/api-base/product/importExcel"
                            :show-file-list="true"
                            :on-success="handleAvatarExcelSuccess"
                            :before-upload="beforeAvatarExcelUpload">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">支持上传 .xls .xlsx后缀文件，表格中一行为一条数据，一次最多可导入3000条数据。</div>
                    </el-upload>
                </el-form-item>

                <el-form-item>
                    <el-button @click="saveImportProducts" type="primary">保存</el-button>
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
        name: "product",
        data(){
            return {
                myheaders:{},
                searchProductBrandList:[],
                searchProductcategorylList:[],
                statusList:[{
                    id : '1',
                    name : '正常'
                },{
                    id : '2',
                    name : '停用'
                }],
                isEditCode : false,
                brandList:[],
                categroryList:[],
                pageInfo:{page:1,limit:10},
                searchForm:{
                    pcodename:'',
                    brand:'',
                    categrory:'',
                    status:'',
                },
                productForm:{
                    photo:"",
                    pcode:"",
                    barcode :'',
                    pname:"",
                    norms:"",
                    unit:"",
                    brandObj:null,
                    categroryObj:null,
                    cost:'',
                    iskz:'',
                    price:'',
                    safeStock:'',
                    ckc:'',
                },
                showList:true,
                mutiImportDialog: {
                    title: '',
                    visible: false,
                    products: []
                },
            }
        },
        mounted(){
            this.getData();
            this.getProductBrandList();
            this.getCategorylList();
            this.getProductcategorylList();
        },
        methods:{
            getData(reqParams){
                const fetch = service.product.productListByPage
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            getProductBrandList(){
                service.productBrand.alllist({isDel:'0'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.searchProductBrandList = res.data;
                        this.brandList = res.data;
                    }
                })
            },
            getProductcategorylList(){
                service.productCategory.alllist({level:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.searchProductcategorylList = res.data;
                    }
                })
            },
            getCategorylList(){
                service.chain.productCategory.allfz({level:'1'}).then(res=>{
                    if(res.resp_code == 200) {
                        this.categroryList = res.data;
                    }
                })
            },
            getBrandList(){
                this.$forceUpdate();
            },
            getCategroryList(){
                this.$forceUpdate();
            },
            handleAvatarSuccess(res, file) {
                this.productForm.photo = res.data.url;
            },
            handleRemove(){
                this.$refs.upload.clearFiles()
                this.productForm.photo = '';
            },
            beforeAvatarUpload(file) {
                const isJPG = (file.type === 'image/jpeg' || file.type === 'image/png');
                const isLt2M = file.size / 1024 / 1024 < 10;
                if (!isJPG) {
                    yid.util.error('上传头像图片只能是 JPG/PNG 格式!');
                    return;
                }
                if (!isLt2M) {
                    yid.util.error('上传头像图片大小不能超过 10MB!');
                    return;
                }
                return isJPG && isLt2M;
            },
            addProduct(){
                //获取商品code
                //service.product.getCode({}).then(res =>{
                //   this.productForm.pcode = res.data;
                //})
                this.$refs['productForm'].resetFields()
                this.productForm.id = "";

                this.isEditCode = false;

                this.showList = false;
            },
            mutiImportProduct(){
                this.mutiImportDialog.title = '批量导入产品基础资料';
                this.mutiImportDialog.visible = true;
                this.mutiImportDialog.products = [];
                this.myheaders={
                    authorization:'Bearer ' + yid.cache.get(yid.type.USER.TOKEN)
                };
                this.$refs.uploadExcel.clearFiles()
            },
            saveImportProducts(){
                if(this.mutiImportDialog.products.length == 0){
                    yid.util.info("无导入数据");
                }else{
                    console.log(this.mutiImportDialog.products);
                    service.product.batchImport({maps:this.mutiImportDialog.products}).then(res=>{
                        if(res.resp_code == 200) {
                            yid.util.success("导入成功")
                            this.importCancel();
                            this.getData(this.searchForm);
                        }
                    })
                }
            },
            importCancel(){
                this.mutiImportDialog.visible = false;
            },
            search(){
                this.pageInfo.page=1
                this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
                this.getData(this.searchForm);
            },
            rest(){
                this.$refs["searchForm"].resetFields()
                this.search()
            },
            handleSelectionChange() {

            },
            save(){
                this.$refs['productForm'].validate((valid) => {
                    if(valid){
                        if(Number(this.productForm.iskz) == 1){
                            if(this.productForm.price == null || this.productForm.price.length == 0){
                                yid.util.info("如果允许客装销售，则售价必填!");
                                return false;
                            }
                        }
                        if(this.productForm.status == null || this.productForm.status.length == 0){
                            this.productForm.status = "1";
                        }
                        //品牌
                        this.productForm.brand = this.productForm.brandObj.id;
                        this.productForm.bname = this.productForm.brandObj.bname;
                        //类别
                        this.productForm.categrory = this.productForm.categroryObj.id;
                        this.productForm.cname = this.productForm.categroryObj.cname;
                        this.productForm.ccode = this.productForm.categroryObj.ccode;

                        this.productForm.bbid = this.productForm.categroryObj.bbid;
                        service.product.saveProduct(this.productForm).then(res =>{
                            if(res.resp_code == 200) {
                                if(this.productForm.id != null && this.productForm.id.length > 0){
                                    let stockProduck = {};
                                    stockProduck.pid = this.productForm.id;
                                    stockProduck.barcode = this.productForm.barcode;
                                    stockProduck.pname = this.productForm.pname;
                                    stockProduck.norms = this.productForm.norms;
                                    stockProduck.unit = this.productForm.unit;
                                    stockProduck.categrory = this.productForm.categrory;
                                    stockProduck.cname = this.productForm.cname;
                                    stockProduck.ccode = this.productForm.ccode;
                                    stockProduck.bbid = this.productForm.bbid;
                                    stockProduck.brand = this.productForm.brand;
                                    stockProduck.bname = this.productForm.bname;
                                    stockProduck.cost = this.productForm.cost;
                                    stockProduck.price = this.productForm.price;
                                    stockProduck.safeStock = this.productForm.safeStock;
                                    //同时更新stock库 的库存表信息
                                    service.stock.product.updateBypid(stockProduck).then(res=>{
                                        if(res.resp_code == 200) {
                                            yid.util.success("更新成功")
                                            this.getData(this.searchForm);
                                            this.showList = true
                                        }
                                    });
                                }else{
                                    yid.util.success("保存成功")
                                    this.getData(this.searchForm);
                                    this.showList = true
                                }
                            }else{
                                this.$message({
                                    message: "保存产品失败",
                                    type: 'warning'
                                });
                            }
                        })

                    }

                });
            },
            updateStatus(data){
                service.product.saveProduct(data).then(res=> {
                    if(res.resp_code == 200) {
                        //同时更新stock_product表的状态
                        const param  = {pid:data.id,status:data.status}
                        service.stock.product.updateStatus(param).then(res=> {
                            if(res.resp_code == 200) {
                                let page = this.$refs.table.Pagination.internalCurrentPage;
                                this.pageInfo.page = page;
                                console.log(this.pageInfo);
                                this.getData(this.searchForm);
                            }
                        })
                    }
                })
            },
            editProduct(data){
                this.productForm.id = data.id;
                this.productForm.photo = data.photo;
                this.productForm.pcode = data.pcode;
                this.productForm.barcode = data.barcode;
                this.productForm.pname = data.pname;
                this.productForm.norms = data.norms;
                this.productForm.unit = data.unit;
                this.productForm.brand = data.brand;
                this.productForm.categrory = data.categrory;
                this.productForm.cost = data.cost;
                this.productForm.iskz = data.iskz;
                this.productForm.price = data.price;
                this.productForm.safeStock = data.safeStock;
                this.productForm.ckc = data.ckc;
                //选中品牌和品类
                this.brandList.forEach(res=>{
                    if(Number(res.id) === Number(data.brand)){
                        this.productForm.brandObj = res;
                    }
                });
                this.categroryList.forEach(res=>{
                    res.categroryListz.forEach(res1=>{
                        if(Number(res1.id) === Number(data.categrory)){
                            this.productForm.categroryObj = res1;
                        }
                    })
                });
                this.isEditCode = true;
                this.showList = false;
            },
            back(){
                this.showList = true
            },
            checkPcode(){
                let id = this.productForm.id
                let pcode =  this.productForm.pcode;
                const param  = {id:id,pcode:pcode}
                service.product.checkPcode(param).then(res=> {
                    if(res.resp_code=="200"){
                        if(res.data != "0"){
                            yid.util.info(res.resp_msg);
                            this.productForm.pcode = '';
                        }
                    }
                })
            },
            downExcelTemplate(){
                download(yid.config.API.BASE + '/api-chain/product/excelTemplate', {})
            },
            beforeAvatarExcelUpload(file){
                const isJPG = (file.type.indexOf("sheet") ||file.type.indexOf('excel'));
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
            handleAvatarExcelSuccess(res){
                this.mutiImportDialog.products = res.data;
                console.log(this.mutiImportDialog.products);
            },
        }
    }
</script>

<style scoped lang="scss">

</style>
