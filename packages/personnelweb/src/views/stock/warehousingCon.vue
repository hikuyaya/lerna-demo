<template>
<div>
    <el-page-header @back="goBack" content="详情页面"></el-page-header>
    <hr>
    <el-row>
        <el-button type="primary" v-if="canEditable" @click="checkedType">+添加商品</el-button>
        <el-button type="primary" v-if="!canEditable && this.baseData.entryData.status == '2'" @click="revoke">撤单</el-button>
    </el-row>
    <el-row style="margin-top: 20px">
        <div class="grid-content bg-purple">入库类型：
        <el-select style="width: 150px" :disabled="!canEditable" v-model="inTypeObj" clearable placeholder="请选择" value-key="id">
            <el-option
                    v-for="item in typeDictList"
                    :key="item.id"
                    :label="item.sdiname"
                    :value="item">
            </el-option>
        </el-select></div>
    </el-row>
    <el-row style="margin-top: 20px" :gutter="20">
        <el-col :span="4" ><div class="grid-content bg-purple">入库金额：<label inline style="color: red">{{inAllMoney}}元</label></div></el-col>
        <el-col :span="20"><div class="grid-content bg-purple" style="display: flex">
            <div style="width: 80px; text-align: right">备注：</div>
            <el-input :disabled="!canEditable" type="textarea" autosize placeholder="请输入内容" v-model="memo"></el-input></div>
        </el-col>
    </el-row>
    <yid-table ref="table" :data="selectProducts" style="margin-top: 15px;">
        <yid-table-column label="产品编码" width="150" prop="pcode"></yid-table-column>
        <yid-table-column label="产品名称" prop="pname"></yid-table-column>
        <yid-table-column label="规格" width="160" prop="norms"></yid-table-column>
        <yid-table-column label="入库数量" width="150" prop="count">
            <template slot-scope="scope">
                <el-input-number min="0" :disabled="!canEditable" v-model="scope.row.count"></el-input-number>
            </template>
        </yid-table-column>
        <yid-table-column label="进价" width="150" prop="incost">
            <template slot-scope="scope">
                <el-input-number min="0" :disabled="!canEditable" v-model="scope.row.cost" ></el-input-number>
            </template>
        </yid-table-column>
        <yid-table-column label="入库金额" width="150" prop="money">
            <template slot-scope="scope">
                <el-input-number disabled v-model="scope.row.count * scope.row.cost" ></el-input-number>
            </template>
        </yid-table-column>
        <yid-table-column label="操作" width="100" prop="operating">
            <template slot-scope="scope">
                <el-button :disabled="!canEditable" v-model="scope.$index" type="text" @click="deleteAction(scope.$index,scope.row)">删除</el-button>
            </template>
        </yid-table-column>
    </yid-table>
    <el-row style="text-align: center; margin-top: 20px">
        <el-button type="primary" @click="confirm" v-if="canEditable">保存</el-button>
    </el-row>
    <!--出库商品选择-->
    <yid-dialog :title="dialogProduct.title" :visible.sync="dialogProduct.visible"  width="900px">
        <checkProducts ref="productSelectPage" @onClose="closedProductDialog"></checkProducts>
    </yid-dialog>
</div>
</template>
<script>
    import service from '@src/service'
    import checkProducts from "./components/checkProducts";
    import yid from '@src/library'
    export default {

        components: {
            checkProducts
        },
        name: "warehousingCon",
        data: function () {
            return {
                dialogProduct: {
                    visible: false,
                    title:'选择入库商品',
                },
                baseData:{},
                selectProducts:[],
                typeDictList:[],
                inTypeObj:{},
                deleteProducts:[],
                actionType:"", //用于判断是新增 还是 编辑
                canEditable:true,
                memo:"",
                seid:"",
            }
        },
        mounted(){
            this.getTypeDictList()
        },
        computed:{
            inAllMoney: function () {
                let tempAllMoney = 0;
                for(let i=0;i<this.selectProducts.length;i++){
                    let item = this.selectProducts[i]
                    if(item.count > 0  && item.cost > 0){
                        tempAllMoney = tempAllMoney + item.count* item.cost
                    }
                }
                return tempAllMoney;
            }
        },

        methods: {
            async initData(obj){
                await this.restData();
                this.baseData = obj;
                this.actionType = this.baseData.actionType;
                if(this.actionType == "add"){
                    this.canEditable = true
                }else{
                    let entryData =  this.baseData.entryData
                    //this.inTypeObj = {id:entryData.btype,sdiname: entryData.bname}
                    console.log(this.typeDictList);
                    this.typeDictList.forEach(res=>{
                        if(Number(res.id) === Number(entryData.btype)){
                            this.inTypeObj = res;
                        }
                    });
                    this.memo = entryData.memo;
                    this.seid  = entryData.id;
                    let entryStatus = entryData.status;
                    if(entryStatus == "1"){
                        this.canEditable = true
                    }else{
                        this.canEditable = false;
                    }
                    await service.stock.entryProducts.list({isDel:"0",seid:entryData.id}).then(res=> {
                        if(res.resp_code == 200){
                            this.selectProducts = res.data;
                            if(this.selectProducts.length > 0){
                                for(let i=0 ;i <this.selectProducts.length; i++){
                                    this.selectProducts[i].cost = this.selectProducts[i].incost
                                }
                            }
                        }

                    })

                }
                console.error(this.baseData.actionType)
            },
            async getTypeDictList(){
                let that = this
                await service.stock.dictInout.list({type:service.stock.dictInout.inType,isDel:"0"}).then(res=> {
                    if(res.resp_code == 200) {
                        that.typeDictList = res.data;
                    }
                })
            },

            goBack() {
                this.$emit('onClose');
            },
            checkedType(){
                this.dialogProduct.visible = true;
                this.$nextTick(()=> {
                    this.$refs.productSelectPage.initData(service.stock.dictInout.inType);
                })
            },
            closedProductDialog(selectProducts){
                for(let n=0 ; n<selectProducts.length;n++){
                    let pcode = selectProducts[n].pcode;
                    for(let i=0;i<this.selectProducts.length;i++){
                        let item = this.selectProducts[i];
                        if(item.pcode == pcode){
                            yid.util.info("列表中存在【"+selectProducts[n].pname+"】不能再次添加");
                            return false;
                        }
                    }
                }
                this.selectProducts = selectProducts.concat(this.selectProducts)
                this.dialogProduct.visible = false;
            },
            async confirm(){
                if(this.actionType == "add"){
                    this.addNew();
                }else{
                    this.updateEdit();
                }
            },
            deleteAction(index,row){
                this.selectProducts.splice(index, 1)//移除删除的产品
                this.deleteProducts.push(row)//将删除的产品保存起来
            },
            //保存子表stock_entry_products信息
            async saveEnryChild(seid,item){
                let reqParam = {};
                reqParam.seid = seid;
                reqParam.pid = item.id;
                reqParam.pcode = item.pcode;
                reqParam.pname = item.pname;
                reqParam.btype = this.inTypeObj.id;
                reqParam.cost = item.cost;
                reqParam.count = item.count;
                reqParam.barcode = item.barcode;
                reqParam.categrory = item.categrory;
                reqParam.cname = item.cname;
                reqParam.brand = item.brand;
                reqParam.bbid = item.bbid;
                reqParam.bname = item.bname;
                reqParam.norms = item.norms;
                reqParam.unit = item.unit;
                reqParam.price = item.price;
                reqParam.safeStock = item.safeStock;
                reqParam.incost = item.cost;
                reqParam.money = item.count * item.cost;
                if(this.actionType =="add"){
                    reqParam.isDel = "0";
                }else{
                    reqParam.id = item.id
                }
                await service.stock.entryProducts.save(reqParam);
            },
            async deleteEntryChild(item){
                item.isDel = "1";
                service.stock.entryProducts.save(item);
            },
            async addNew(){
                let reqParms = {}
                reqParms.btype = this.inTypeObj.id;
                reqParms.bname = this.inTypeObj.sdiname;
                reqParms.memo = this.memo
                reqParms.billcode = "" //自动获取
                reqParms.status = "1" //新单状态都是未审核
                reqParms.isDel = "0";
                await  service.stock.entry.save(reqParms).then(res=> {
                    if(res.resp_code == 200) {
                        this.baseData.entryData = res.data
                        this.seid  = this.baseData.entryData.id; //入库单id
                        for(let i = 0;i<this.selectProducts.length;i++){
                            this.saveEnryChild(this.seid,this.selectProducts[i])
                        }
                        //因为保存之后还停留在这个页面 所以新增之后要把每个产品入库的id保留
                         service.stock.entryProducts.list({isDel:"0",seid:this.seid}).then(res=> {
                            if(res.resp_code == 200){
                                this.selectProducts = res.data;
                            }

                        })

                        this.actionType = "edit";

                        this.$emit('onClose');
                    }
                })
            },
            async updateEdit(){
                let reqParms = {}
                reqParms.btype = this.inTypeObj.id;
                reqParms.bname = this.inTypeObj.sdiname;
                reqParms.memo = this.memo
                reqParms.id = this.seid;
                reqParms.revision  = this.baseData.entryData.revision
                await  service.stock.entry.save(reqParms)
                for(let i = 0;i<this.selectProducts.length;i++){
                   await this.saveEnryChild(this.seid,this.selectProducts[i])
                }
                for(let i = 0;i<this.deleteProducts.length;i++){
                    await this.deleteEntryChild(this.deleteProducts[i])
                }
                this.$emit('onClose');
            },
            async restData(){
                Object.assign(this.$data, this.$options.data());
                await this.getTypeDictList();
            },
            revoke(){
                //撤单
                let entryData =  this.baseData.entryData
                service.stock.entry.revoke(entryData).then(res=> {
                    if(res.resp_code == 200) {
                        this.$emit('onClose');
                    }
                })
            },

        }

    }
</script>
<style>
</style>