<template>
    <div class="dept">
        <el-collapse-transition>
            <div v-show="listShow">
                <el-form inline>
                    <el-form-item label="">
                        <el-button type="primary" @click="addShopPrice()">新增价格体系</el-button>
                    </el-form-item>
                    <el-form-item label="价格体系：">
                        <el-input clearable v-model="form.name" placeholder="价格体系名称/编码" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="门店：">
                        <el-input clearable v-model="form.shop" placeholder="门店名称/编码" style="width: 180px;"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="queryShopPrice()">查询</el-button>
                    </el-form-item>
                </el-form>
                <yid-table ref="table"  :data="priceData" style="width: 810px;">
                    <yid-table-column label="编号"  prop="code" width="80"></yid-table-column>
                    <yid-table-column label="名称"  prop="name" width="160"></yid-table-column>
                    <yid-table-column label="适用门店"  prop="shopNum" width="180" align="left">
                        <template slot-scope="scope">
                            <label>共{{scope.row.shopNum}}家门店</label><br/>
                            <el-link @click="lookupShop(scope.row)" type="primary">查看修改</el-link>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="备注"  prop="memo" width="180"></yid-table-column>
                    <yid-table-column label="状态"  prop="sertype" width="80">
                        <template slot-scope="scope">
                            <el-switch style="margin: 0 10px 0 10px;"
                                       @change="stop(scope.row)"
                                       v-model="scope.row.status=='1'?true:false"
                                       active-color="#13ce66"
                                       inactive-color="#ff4949">
                            </el-switch>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作"  prop="status" width="120">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="editShopPrice(scope.row)">编辑</el-link>
                            <el-link type="primary" @click="setServPrice(scope.row)" style="margin-left: 10px;">设置价格</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </div>
        </el-collapse-transition>

        <el-collapse-transition>
            <div v-show="!listShow"><servPriceConfig ref="servPrice" @onClose="closeDetail" /></div>
        </el-collapse-transition>

        <yid-dialog :title="addDialog.title" :visible.sync="addDialog.visible" @close="addDialog.visible=false" width="680px">
            <el-form ref="addDialog" :model="addDialog" label-width="150px" >
                <el-form-item label="编号：" prop="code" :rules="[{required: true,message:'请填写项目编号'}]">
                    <el-input :value="addDialog.code" disabled placeholder="编号从F001开始递增，不可重复"/>
                </el-form-item>
                <el-form-item clearable label="价格体系名称：" prop="name" :rules="[{required: true,message:'请填写价格体系名称'}]">
                    <el-input v-model="addDialog.name" placeholder="不超过10个汉字"/>
                </el-form-item>
                <el-form-item label="适用门店：" prop="shop">
                    <el-button type="primary" @click="selectShop()">选择门店</el-button>
                </el-form-item>
                <el-form-item label="备注：" prop="memo">
                    <el-input
                            id="headtext"
                            type="textarea"
                            v-model="addDialog.memo"
                            :autosize="{ minRows: 3, maxRows: 5}"
                            placeholder="请输入备注"
                            style="width: 400px; font-size: 12px">
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveShopPrice()">保存</el-button>
                    <el-button @click="addDialog.visible=false">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
        <yid-dialog :title="shopDialog.title" :visible.sync="shopDialog.visible" @close="shopDialog.visible=false" width="1100px">
            <el-row type="flex" justify="space-between">
                <el-form inline>
                    <el-form-item label="门店：">
                        <el-input clearable v-model="shopDialog.shop" placeholder="门店名称/编码" style="width: 160px;"></el-input>
                    </el-form-item>
                    <el-form-item label="业务类型：">
                        <el-select clearable v-model="shopDialog.type">
                            <el-option label="美发" value="1"></el-option>
                            <el-option label="美容" value="2"></el-option>
                            <el-option label="综合" value="3"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="品牌：">
                        <el-select clearable v-model="shopDialog.brand" >
                            <el-option v-for="item in brands" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="区域：">
                        <el-select clearable v-model="shopDialog.region" >
                            <el-option v-for="item in regions" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="">
                        <el-button type="primary" @click="queryShop()">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <el-row>
                <el-col :span="14">
                    <yid-table pagination ref="table1" style="margin-top: 10px;" @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"></el-table-column>
                        <yid-table-column label="门店编码" min-width="60" prop="shopcode"></yid-table-column>
                        <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
                        <yid-table-column label="门店品牌" min-width="60" prop="brandName"></yid-table-column>
                        <yid-table-column label="门店区域" min-width="120" prop="regionName"></yid-table-column>
                        <yid-table-column label="业务类型" min-width="80" prop="type" >
                            <template slot-scope="scope">
                                {{scope.row.type | formatValue(branchs)}}
                            </template>
                        </yid-table-column>
                    </yid-table>
                </el-col>
                <el-col :span="1" style="padding: 60px 0px">
                    <div><el-button @click="addShop()" type="primary" size="mini"><i class="el-icon-right"></i></el-button></div>
                </el-col>
                <el-col :span="8" style="margin-left: 5px;">
                    <yid-table ref="table2" style="margin-top: 10px;" :data="shopDialog.shoplist">
                        <yid-table-column label="门店编码" min-width="80" prop="shopcode"></yid-table-column>
                        <yid-table-column label="门店名称" min-width="100" prop="shopname"></yid-table-column>
                        <yid-table-column label="操作" min-width="80">
                            <template slot-scope="scope">
                                <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteShop(scope.row)">删除</el-link>
                            </template>
                        </yid-table-column>
                    </yid-table>
                </el-col>
            </el-row>
            <el-row  justify="space-between" style="margin-top: 10px;">
                <el-col :span="2" :offset="10" v-if="type=='1'"><el-button type="primary" @click="setShop()">选好了</el-button></el-col>
                <el-col :span="2" :offset="10" v-if="type=='2'"><el-button type="primary" @click="saveShop()">保存</el-button></el-col>
                <el-col :span="2" ><el-button @click="shopDialog.visible=false">取消</el-button></el-col>
                <el-col :span="10"></el-col>
            </el-row>
        </yid-dialog>
    </div>

</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    import servPriceConfig from './servPriceConfig.vue'

    /**
     * 清空
     * @param obj
    */
    function isClear(obj) {
        for(var i in obj) {
            if(obj[i] instanceof Array){
                obj[i]=[]
            }else{
                obj[i]=''
            }
        }
    }

    export default {
        data() {
            return {
                listShow: true,
                type:'',
                form: {
                    name:'',
                    shop:''
                },
                priceData:[],
                addDialog:{
                    id:'',
                    title:'',
                    visible: false,
                    code:'',
                    name:'',
                    memo:'',
                    shoplist: []
                },
                shopDialog: {
                    id:'',
                    title:'',
                    visible: false,
                    shop: '',
                    type: '',
                    branch: '',
                    region: '',
                    shoplist: []
                },
                pageInfo:{
                    page:1,
                    limit:10,
                    count:0
                },
                selectShops:[],
                branchs: [],
                brands: [],
                regions: [],
            }
        },
        mounted(){
            this.init();
        },
        components:{
            servPriceConfig
        },
        filters:{
            formatValue(str,stsList){
                let label=""
                stsList.map(m =>{
                    if(m.value == str){
                        label=m.name
                    }
                })
                if(label){
                    return label
                }else{
                    return str
                }
            }
        },
        methods:{
            init(){
                service.chain.servShop.findbrands({status:'1'}).then(res => {
                    this.brands=res.data
                });
                service.chain.servShop.findbranchs({status:'1'}).then(res => {
                    this.branchs=res.data
                });
                service.chain.servShop.findregions({status:'1',parentId:'-1'}).then(res => {
                    this.regions=res.data
                });
            },
            handleSelectionChange(rows){
                this.selectShops = rows;
            },
            queryShopPrice(){
                service.chain.servShop.findServicePrices(this.form).then(res =>{
                    if(res.resp_code=="200"){
                        this.priceData=res.data;
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            addShopPrice(){
                isClear(this.addDialog)
                service.chain.servShop.newCode().then(res =>{
                    if(res.resp_code=="200"){
                        this.addDialog.visible=true
                        this.addDialog.title='新增价格体系'
                        this.addDialog.code="F"+res.data;
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            editShopPrice(row){
                this.addDialog.visible=true
                this.addDialog.title='新增价格体系'
                this.addDialog.code=row.code;
                this.addDialog.name=row.name;
                this.addDialog.memo=row.memo;
                this.addDialog.shoplist=row.shoplist || []
                this.addDialog.id=row.id
            },
            selectShop(){
                this.type='1'
                isClear(this.shopDialog)
                this.shopDialog.visible=true
                this.shopDialog.title='选择门店'
                this.shopDialog.shoplist=this.addDialog.shoplist
                this.shopDialog.id=this.addDialog.id
            },
            lookupShop(row){
                this.type='2'
                isClear(this.shopDialog)
                this.shopDialog.visible=true
                this.shopDialog.title='选择门店'
                this.shopDialog.shoplist=row.shoplist || []
                this.shopDialog.id=row.id
                debugger
                this.$refs['table1'].data=[]
            },
            queryShop(){
                const fetch = service.chain.servShop.queryShop
                const params = {...this.pageInfo}
                this.$refs['table1'].reloadData({
                    fetch,
                    params,
                });
            },
            addShop(){
                this.selectShops.map(m =>{
                    let flag=true
                    this.shopDialog.shoplist.forEach(p =>{
                        if(p.id == m.id){
                            flag=false
                        }
                    })
                    if(flag){
                        this.shopDialog.shoplist.push(m)
                    }
                })
            },
            deleteShop(row){
                yid.util.confirm('你确定要这个门店吗？', '','', ()=> {
                    let i=-1;
                    this.shopDialog.shoplist.forEach((p,index) =>{
                        if(p.shopid == row.shopid){
                            i=index
                        }
                    })
                    this.shopDialog.shoplist.splice(i,1)
                })
            },
            saveShopPrice(){
                this.$refs['addDialog'].validate((valid) => {
                    if(valid){
                        service.chain.servShop.saveShopPrice(this.addDialog).then(res =>{
                            if(res.resp_code=="200"){
                                this.addDialog.visible=false
                                yid.util.success(res.resp_msg);
                            }else{
                                yid.util.error(res.resp_msg);
                            }
                        })
                    }
                })
            },
            setShop(){
                this.addDialog.shoplist=this.addDialog.shoplist
                this.shopDialog.visible=false
            },
            saveShop(){
                service.chain.servShop.saveShop(this.shopDialog).then(res =>{
                    if(res.resp_code=="200"){
                        this.addDialog.visible=false
                        yid.util.success(res.resp_msg);
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            stop(row){
                const param={
                    id: row.id,
                    status: row.status == '1'?'2':'1'
                }
                service.chain.servShop.stopPrice(param).then(res =>{
                    if(res.resp_code=="200"){
                        this.queryShopPrice()
                        yid.util.success(res.resp_msg);
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            setServPrice(row){
                //this.$router.push({path: '/setting/servPriceConfig'})
                this.listShow=false
                this.$refs.servPrice.clear();
            },
            closeDetail(){
                this.listShow=true
            }
        }
    }
</script>

<style scoped>

</style>
