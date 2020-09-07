<template>
    <div class="region">
        <div class="top">
            <el-button @click="addRegion" type="primary">添加</el-button>
            <el-button @click="editRegion" style="color: #00b6ff">编辑</el-button>
            <el-button @click="stopRegion" style="color: #df5000">停用</el-button>
            <el-button @click="openRegion" style="color: #5daf34">启用</el-button>
            <el-button @click="showRegionShop" style="color: #00b6ff">查看区域下门店</el-button>
        </div>
        <br>
        <div class="middle">
            <el-tree
                    :data="regionData"
                    :props="defaultProps"
                    :default-expand-all="true"
                    @node-click="handleNodeClick">
            </el-tree>

            <div v-if="!showRegion" class="table">
                {{this.upTitle}}
                <el-form ref="regionForm" :model="regionForm"  label-width="140px" >
                    <el-form-item label="区域名称：" prop="name" :rules="[{ required: true, message: '区域名称为空'}]">
                        <el-input style="width: 150px" v-model="regionForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="上级区域：" prop="parentObj">
                        <el-select @clear="clearSelectRegion" clearable :disabled="isEdit" v-model="regionForm.parentObj" placeholder="请选择上级区域">
                            <el-option :value="regionForm.parentObjValue" style="height: auto">
                                <el-tree
                                        size="small"
                                        show-checkbox
                                        :default-expand-all="true"
                                        :data="nodeTwoData"
                                        :props="defaultProps"
                                        node-key="id"
                                        :check-strictly="true"
                                        @check-change="templateCheckChange"
                                        ref="templateTree">
                                </el-tree>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button @click="saveRegion" type="primary">保存</el-button>
                        <el-button @click="cancelRegion">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="showRegion" class="table">
                <yid-table :data="shopData" style="margin-top: 15px;">
                    <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column label="门店品牌" min-width="120" prop="brandName"></yid-table-column>
                    <yid-table-column label="业务类型" min-width="100" prop="type">
                        <template slot-scope="scope">
                            <span v-if='scope.row.type==1'>美发</span>
                            <span v-if='scope.row.type==2'>美容</span>
                            <span v-if='scope.row.type==3'>综合</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="门店状态" min-width="100" prop="status">
                        <template slot-scope="scope">
                            <span v-if='scope.row.status==1'>正常</span>
                            <span v-if='scope.row.status==2'>关店</span>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" min-width="250" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="">详情</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </div>

        <yid-dialog title="转移门店" :visible.sync="moveShopDialog.visible"  width="750px">
           &nbsp;&nbsp;&nbsp;
            <el-button @click="batchShop" type="primary">批量设置门店区域</el-button>
            <div style="margin-top: -10px;">
                <el-divider/>
            </div>

            <yid-table :data="shopAllData" style="margin-top: 15px;" @selection-change="handleSelectionChange">
                <yid-table-column type="selection" width="55"></yid-table-column>
                <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
                <yid-table-column label="门店名称" min-width="150" prop="shopname"></yid-table-column>
                <yid-table-column label="门店品牌" min-width="120" prop="brandName"></yid-table-column>
                <yid-table-column label="业务类型" min-width="100" prop="type">
                    <template slot-scope="scope">
                        <span v-if='scope.row.type==1'>美发</span>
                        <span v-if='scope.row.type==2'>美容</span>
                        <span v-if='scope.row.type==3'>综合</span>
                    </template>
                </yid-table-column>
                <yid-table-column label="门店状态" min-width="100" prop="status">
                    <template slot-scope="scope">
                        <span v-if='scope.row.status==1'>正常</span>
                        <span v-if='scope.row.status==2'>关店</span>
                    </template>
                </yid-table-column>
            </yid-table>
        </yid-dialog>

        <yid-dialog title="批量设置门店区域" :visible.sync="pbDialog.visible" width="450px">
            <el-form ref="shopForm" :model="shopForm"  label-width="140px">
                <el-form-item label="门店：" prop="shopnames" :rules="[{ required: true, message: '门店不能为空'}]">
                    {{shopForm.shopnames}}
                </el-form-item>
                <el-form-item label="门店区域：" prop="parentObj" :rules="[{ required: true, message: '请选择区域'}]">
                    <el-select @clear="clearSelectRegion1" clearable v-model="shopForm.parentObj" placeholder="请选择门店区域">
                        <el-option :value="shopForm.parentObjValue" style="height: auto">
                            <el-tree
                                    size="small"
                                    show-checkbox
                                    :default-expand-all="true"
                                    :data="regionData"
                                    :props="defaultProps"
                                    node-key="id"
                                    :check-strictly="true"
                                    @check-change="templateCheckChange1"
                                    ref="templateTree1">
                            </el-tree>
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="batchPb" type="primary">保存</el-button>
                    <el-button @click="batchPbCancel">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>

</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    export default {
        name: "dictregion",
        data() {
            return {
                regionData: [],
                showRegion : false,
                defaultProps: {
                    children: 'children',
                    label: 'name',
                    disabled: this.disabledFn,
                },
                upTitle : '新增',
                regionForm : {
                    parentObj : '',
                    parentObjValue : [],
                    code: '',
                    name : '',
                    oname : '',
                    parentId : '',
                    parentCode : '',
                },
                shopForm:{
                    shopids : '',
                    shopnames : '',
                    parentObj : '',
                    parentObjValue : [],
                    regionId : '',
                },
                nodeData : [],
                nodeTwoData : [],
                checkedId : '',
                checkedId1 : '',
                isEdit : false,
                shopData : [],
                shopAllData : [],
                selectShops : [],
                moveShopDialog:{
                    title:'转移门店',
                    visible: false,
                },
                pbDialog:{
                    visible: false,
                },
                shopnames : '',
            };
        },
        mounted(){
            //获取三级树
            this.getTreeAll();
            //获取二级树
            this.getTreeTwo();
        },
        methods: {
            handleNodeClick(data) {
                this.nodeData = data
            },
            getTreeAll(){
                service.chain.region.treeAll({}).then(res=>{
                    if(res.resp_code == 200) {
                        this.regionData = res.data;
                    }
                })
            },
            getTreeTwo(){
                service.chain.region.treeTwo({}).then(res=>{
                    if(res.resp_code == 200) {
                        this.nodeTwoData = res.data;
                    }
                })
            },
            addRegion(){
                this.upTitle = '新增'
                this.isEdit = false;
                this.showRegion = false;
                this.regionForm.id  = ''
                this.regionForm.code = ''
                this.regionForm.name = ''
                this.regionForm.oname = ''
                this.regionForm.parentObj = ''
                this.regionForm.parentObjValue = []
                this.regionForm.parentId = ''
                this.regionForm.parentCode = ''
                this.regionForm.status = '1'
                this.regionForm.num = '0'
                this.checkedId = ''
                this.checkedId1 = ''
                this.$refs.templateTree.setCheckedKeys([]);
                this.$refs.templateTree1.setCheckedKeys([]);
            },
            editRegion(){
                if(this.nodeData == null || this.nodeData.length ==0){
                    yid.util.alert("请选中一个区域进行编辑!")
                    return
                }
                if(this.nodeData.status ==='2'){
                    yid.util.alert("禁用的区域不能进行操作!")
                    return
                }
                console.log(this.nodeData);
                this.upTitle = '编辑'
                this.isEdit = true;
                this.showRegion = false;
                this.regionForm.id  = this.nodeData.id;
                this.regionForm.code = this.nodeData.code;
                this.regionForm.name = this.nodeData.oname;
                this.regionForm.parentId = this.nodeData.parentId;
                this.regionForm.parentCode = this.nodeData.parentCode;
                this.regionForm.status = this.nodeData.status;
                this.regionForm.num = this.nodeData.num;
                if(this.nodeData.parentId != '-1'){
                    service.chain.region.treeAll({id:this.nodeData.parentId}).then(res=>{
                        if(res.resp_code == 200) {
                            let arrLabel = [];
                            arrLabel.push(res.data[0].name);
                            this.regionForm.parentObj = arrLabel;
                        }
                    })
                }
            },
            cancelRegion(){
                this.addRegion();
            },
            handleSelectionChange(row){
                this.selectShops = row;
            },
            showRegionShop(){//查看门店列表
                if(this.nodeData == null || this.nodeData.length ==0){
                    yid.util.alert("请选中一个区域进行查看!")
                    return
                }
                this.showRegion = true;
                console.log(this.nodeData);
                const shopParams = {};
                shopParams.regionId = this.nodeData.id;
                service.chain.shop.regionShopList(shopParams).then(res=>{
                    if(res.resp_code == 200) {
                        this.shopData = res.data;
                    }
                })
            },
           templateCheckChange(data,checked,child){
                if(checked === true){
                    this.checkedId = data.id
                    this.$refs.templateTree.setCheckedKeys([data.id]);
                }else{
                    if(this.checkedId === data.id){
                        this.$refs.templateTree.setCheckedKeys([data.id]);
                    }
                }

               let res = this.$refs.templateTree.getCheckedNodes(false, false); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
               let arrLabel = [];
               let arr = [];
               res.forEach(item => {
                   arrLabel.push(item.name);
                   arr.push(item);
               });
               this.regionForm.parentObjValue = arr;
               this.regionForm.parentObj = arrLabel;
               console.log('arr:'+JSON.stringify(arr))
            },
            clearSelectRegion(){
                this.regionForm.parentObj = ''
                this.regionForm.parentObjValue = []
                this.regionForm.parentId = ''
                this.regionForm.parentCode = ''
                this.checkedId = ''
                this.$refs.templateTree.setCheckedKeys([]);
            },
            clearSelectRegion1(){
                this.shopForm.parentObj = ''
                this.shopForm.parentObjValue = []
                this.checkedId1 = ''
                this.$refs.templateTree1.setCheckedKeys([]);
            },
            templateCheckChange1(data,checked,child){
                if(checked === true){
                    this.checkedId1 = data.id
                    this.$refs.templateTree1.setCheckedKeys([data.id]);
                }else{
                    if(this.checkedId1 === data.id){
                        this.$refs.templateTree1.setCheckedKeys([data.id]);
                    }
                }

                let res = this.$refs.templateTree1.getCheckedNodes(false, false); //这里两个true，1. 是否只是叶子节点 2. 是否包含半选节点（就是使得选择的时候不包含父节点）
                let arrLabel = [];
                let arr = [];
                res.forEach(item => {
                    arrLabel.push(item.name);
                    arr.push(item);
                });
                this.shopForm.parentObjValue = arr;
                this.shopForm.parentObj = arrLabel;
                console.log('arr:'+JSON.stringify(arr))
            },
            templateClick(data){
               this.checkedId == data.id
                this.$refs.templateTree.setCheckedKeys([data.id]);
            },
            templateClick1(data){
                this.checkedId1 == data.id
                this.$refs.templateTree1.setCheckedKeys([data.id]);
            },
            selectChange(e){
                var arrNew = [];
                var dataLength = this.regionForm.parentObjValue.length;
                var eleng = e.length;
                for(let i = 0; i< dataLength ;i++){
                    for(let j = 0; j < eleng; j++){
                        if(e[j] === this.regionForm.parentObjValue[i].name){
                            arrNew.push(this.regionForm.parentObjValue[i])
                        }
                    }
                }
                this.$refs.templateTree.setCheckedNodes(arrNew);//设置勾选的值
            },
            selectChange1(e){
                var arrNew = [];
                var dataLength = this.shopForm.parentObjValue.length;
                var eleng = e.length;
                for(let i = 0; i< dataLength ;i++){
                    for(let j = 0; j < eleng; j++){
                        if(e[j] === this.shopForm.parentObjValue[i].name){
                            arrNew.push(this.shopForm.parentObjValue[i])
                        }
                    }
                }
                this.$refs.templateTree1.setCheckedNodes(arrNew);//设置勾选的值
            },
            saveRegion(){
                this.$refs['regionForm'].validate((valid) => {
                        if(valid){
                            if(this.regionForm.parentObjValue != null && this.regionForm.parentObjValue.length > 0){
                                this.regionForm.parentId = this.regionForm.parentObjValue[0].id;
                                this.regionForm.parentCode = this.regionForm.parentObjValue[0].code;
                            }
                            console.log(this.regionForm);
                            service.chain.region.saveRegion(this.regionForm).then(res=>{
                                if(res.resp_code == 200) {
                                    yid.util.success("操作成功");
                                    this.getTreeAll();
                                    this.getTreeTwo();
                                    this.addRegion();
                                }
                            })
                        }
                })
            },
            stopRegion(){
                if(this.nodeData == null || this.nodeData.length ==0){
                    yid.util.alert("请选中一个区域进行停用!")
                    return
                }
                if(this.nodeData.status === "2"){
                    yid.util.alert("该区域为[停用]状态不允许再次停用")
                    return;
                }
                let num = this.nodeData.num;
                let id = this.nodeData.id;
                if(Number(num) === 0){
                    //如果门店关联门店直接进行停用
                    const regionParam = {};
                    regionParam.id = id;
                    regionParam.status = '2';
                    service.chain.region.saveRegion(regionParam).then(res=>{
                        if(res.resp_code == 200) {
                            yid.util.success("操作成功");
                            this.getTreeAll();
                            this.getTreeTwo();
                            this.addRegion();
                        }
                    })
                }else{
                    yid.util.confirm('该门店区域下有门店信息，请转移门店后停用！', '提示',{confirmButtonText: '转移门店'}, ()=> {
                        //查询所有门店信息
                        service.chain.shop.shopList({}).then(res=>{
                            if(res.resp_code == 200) {
                                this.shopAllData = res.data;
                            }
                        })
                        this.moveShopDialog.visible = true;
                    })
                }
            },
            openRegion(){
                if(this.nodeData == null || this.nodeData.length ==0){
                    yid.util.alert("请选中一个区域进行启用!")
                    return
                }
                if(this.nodeData.status === "1"){
                    yid.util.alert("该区域为【正常】状态不允许再次启用")
                    return;
                }
                const regionParam = {};
                regionParam.id = this.nodeData.id;
                regionParam.status = '1';
                service.chain.region.saveRegion(regionParam).then(res=>{
                    if(res.resp_code == 200) {
                        yid.util.success("操作成功");
                        this.getTreeAll();
                        this.getTreeTwo();
                        this.addRegion();
                    }
                })
            },
            batchShop(){
                if(this.selectShops.length == 0){
                    yid.util.alert("请至少选择一个门店!")
                    return false;
                }
                if(this.nodeData.status ==='2'){
                    yid.util.alert("禁用的区域不能进行操作!")
                    return
                }
                this.pbDialog.visible = true;

                this.shopForm.shopids = '';
                this.shopForm.shopnames = '';
                this.shopForm.parentObj = '';
                this.shopForm.parentObjValue = [];
                this.shopForm.regionId = '';
                let shopids = '';
                let shopnames = '';
                for(var i=0;i<this.selectShops.length;i++){
                    shopids = shopids + this.selectShops[i].id + ","
                    shopnames = shopnames + this.selectShops[i].shopname + ","
                }
                shopnames = shopnames.substr(0,shopnames.length-1);
                shopids = shopids.substr(0,shopids.length-1);
                this.shopForm.shopids = shopids;
                this.shopForm.shopnames = shopnames;

                this.checkedId1 = '';
                this.$refs.templateTree1.setCheckedKeys([]);
            },
            batchPbCancel(){
                this.pbDialog.visible = false;
            },
            batchPb(){
                this.$refs['shopForm'].validate((valid) => {
                    if(valid){
                        const shopParams = {};
                        console.log(this.nodeData);
                        shopParams.oregionId = this.nodeData.id;
                        shopParams.shopids = this.shopForm.shopids;
                        shopParams.shopnames = this.shopForm.shopnames;
                        if(this.shopForm.parentObjValue != null && this.shopForm.parentObjValue.length > 0){
                            shopParams.regionId = this.shopForm.parentObjValue[0].id;
                        }
                        console.log(shopParams);
                        //调用批量修改门店接口进行修改
                        service.chain.shop.batchRegion(shopParams).then(res=>{
                            if(res.resp_code == 200) {
                                yid.util.success("操作成功");
                                this.batchPbCancel();
                                this.moveShopDialog.visible = false;
                                this.getTreeAll();
                                this.getTreeTwo();
                                this.addRegion();
                            }
                        })
                    }
                })
            },
            disabledFn(data, node){
                if (data.status === '2') {
                    return true;
                } else {
                    return false;
                }
            },
        }
    }
</script>

<style scoped lang="scss">
    .region {
        .middle {
            display: flex;
            .el-tree {
                width: 300px;
                height: 450px;
            }
            .table {
                flex: 1;
                margin-left: 30px;
            }
        }
    }

</style>