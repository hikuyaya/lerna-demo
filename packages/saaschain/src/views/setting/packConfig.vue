<template>
    <div class="appoint-list">

        <el-form inline>
            <el-button type="primary" @click="addServPack()">新增套餐</el-button>
            <el-button type="primary" @click="duoServPack()">新增多选套餐</el-button>
            <el-button type="primary" @click="lookup()">{{status=='1'?'正常':'停办'}}套餐</el-button>
        </el-form>

        <yid-table pagination ref="tableData" style="margin-top: 15px;" @selection-change="handleServicesChange">
            <el-table-column type="selection" width="45" prop="id"></el-table-column>
            <yid-table-column label="编号" min-width="80" prop="spcode"></yid-table-column>
            <yid-table-column label="套餐名称" min-width="160" prop="spname">
                <template slot-scope="scope">
                    <div style="color:blue" @click="editServPack(scope.row)">{{scope.row.spname}}</div>
                </template>
            </yid-table-column>
            <yid-table-column label="可售时间" min-width="180" prop="date" :formatter="dateFormat"></yid-table-column>
            <yid-table-column label="有效期" min-width="140" prop="expiryType" :formatter="dateFormat1"></yid-table-column>
            <yid-table-column label="套餐价格" min-width="80" prop="totalprice"></yid-table-column>
            <yid-table-column label="成本价" min-width="70" prop="cost"></yid-table-column>
            <yid-table-column label="套餐内容" min-width="240" prop="content" align="left">
                <template slot-scope="scope">
                    <el-row type="flex" :key="item.id" v-for="item in scope.row.servs" justify="space-between">
                        <el-col :span="22">
                            <div v-if="scope.row.isMultiple=='0'">{{item.typename}}-{{item.sdname}}, {{item.num}}次, 总价:{{item.pprice}}</div>
                            <div v-if="scope.row.isMultiple=='1'">{{item.sdname}}, {{item.num}}次, 总价:{{item.pprice}}</div>
                        </el-col>
                    </el-row>
                    <el-row type="flex" :key="item.id" v-for="item in scope.row.products" justify="space-between">
                        <el-col :span="22">
                            <div v-if="scope.row.isMultiple=='0'">{{item.typename}}-{{item.sdname}}, {{item.num}}次, 总价:{{item.pprice}}</div>
                            <div v-if="scope.row.isMultiple=='1'">{{item.sdname}}, {{item.num}}次, 总价:{{item.pprice}}</div>
                        </el-col>
                    </el-row>
                </template>
            </yid-table-column>
            <yid-table-column label="状态" min-width="120" prop="status">
                <template slot-scope="scope">
                    <el-link type="primary" @click="editServPack(scope.row)">编辑</el-link>
                    <el-switch
                            style="margin: 0 10px 0 10px;"
                            @change="stop(scope.row)"
                            v-model="scope.row.status=='1'?true:false"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </template>
            </yid-table-column>
            <yid-table-column label="展开" width="60" type="expand">
                <template slot-scope="scope">
                    <div style="padding: 20px 50px">
                        <h4>项目明细<el-link type="primary" style="margin-left: 20px;"></el-link></h4>
                        <yid-table ref="table1" style="margin-top: 15px;" :data="scope.row.servs">
                            <yid-table-column label="项目编码" min-width="50" prop="sdcode"></yid-table-column>
                            <yid-table-column label="项目名称" min-width="100" prop="sdname"></yid-table-column>
                            <yid-table-column label="次数" min-width="50" prop="num"></yid-table-column>
                            <yid-table-column label="单价" min-width="50" prop="price"></yid-table-column>
                            <yid-table-column label="套餐价" min-width="50" prop="pprice"></yid-table-column>
                            <yid-table-column label="是否赠送" min-width="50" prop="isGift">
                                <template slot-scope="scope">
                                    <div>{{scope.row.isGift=='0'?'否':'是'}}</div>
                                </template>
                            </yid-table-column>
                        </yid-table>
                        <h4 style="margin-top: 20px">产品明细<el-link type="primary" style="margin-left: 20px;"></el-link></h4>
                        <yid-table ref="table2" style="margin-top: 15px;" :data="scope.row.products">
                            <yid-table-column label="产品编码" min-width="50" prop="sdcode"></yid-table-column>
                            <yid-table-column label="产品名称" min-width="100" prop="sdname"></yid-table-column>
                            <yid-table-column label="次数" min-width="50" prop="num"></yid-table-column>
                            <yid-table-column label="单价" min-width="50" prop="price"></yid-table-column>
                            <yid-table-column label="套餐价" min-width="50" prop="pprice"></yid-table-column>
                            <yid-table-column label="是否赠送" min-width="50" prop="isGift">
                                <template slot-scope="scope">
                                    <div>{{scope.row.isGift=='0'?'否':'是'}}</div>
                                </template>
                            </yid-table-column>
                        </yid-table>
                    </div>
                </template>
            </yid-table-column>
        </yid-table>

        <yid-dialog :title="packAddDialog.title" :visible.sync="packAddDialog.visible" width="740px">
            <el-form :model="packAddDialog"  :rules="rules" label-width="120px" ref="copyForm1" :label-position="labelPosition">
                <el-form-item label="套餐编号:" >
                    {{packAddDialog.spcode}}<explain style="color:silver">套餐编号从001开始自动叠加</explain>
                </el-form-item>
                <el-form-item label="套餐名称:" prop="spname">
                    <el-input v-model="packAddDialog.spname" style="width:320px;" clearable />
                </el-form-item>
                <el-form-item label="可售时间:" prop="date">
                    <el-date-picker style="width:320px;"
                            v-model="packAddDialog.date" value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效期:">
                    <el-radio-group v-model="packAddDialog.expiryType">
                        <el-radio :label="0" @change="changeCheck">长期</el-radio><br/>
                        <el-radio :label="1" @change="changeCheck">有效期</el-radio>
                        <el-input type="number" min="1" v-model="packAddDialog.expirtyMonth"
                                  :disabled="packAddDialog.expiryType!='1'"
                                  style="width:80px;" clearable /><label>个月</label><explain style="color:silver">从购买之日起延迟多少个月到期</explain><br/>
                        <el-radio :label="2" @change="changeCheck">指定到固定日期</el-radio>
                        <el-date-picker
                                v-model="packAddDialog.expirydate"
                                type="date" value-format="yyyy-MM-dd HH:mm:ss"
                                :disabled="packAddDialog.expiryType!='2'"
                                style="width: 150px;"
                                placeholder="选择时间">
                        </el-date-picker>
                        <explain style="color:silver">为套餐固定到期日期，不填为永久有效</explain>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="添加服务项目:">
                    <el-button type="primary" @click="openServ()">添加服务项目</el-button>
                    <el-row :gutter="10" :key="item.servid" v-for="item in packAddDialog.servs" type="flex" style="margin-top: 12px;">
                        <el-col :span="4">{{item.sdname}}</el-col>
                        <el-col :span="7"><el-input type="number" min="1" v-model="item.num" style="width:100px;margin: 0 10px 0 10px" placeholder="次数" clearable/>次</el-col>
                        <el-col :span="7"><el-input type="number" min="0" v-model="item.pprice" style="width:120px; margin-right:5px" placeholder="套餐价" clearable/>元</el-col>
                        <el-col :span="3"><el-checkbox v-model="item.isGift">赠送</el-checkbox></el-col>
                        <el-col :span="3"><el-link type="primary" @click="deleteServ(item.servid)">删除</el-link></el-col>
                    </el-row>
                    <!--                    <el-link type="primary" @click="serveAdd" style="margin-top: 10px;">继续添加项目</el-link>-->
                </el-form-item>
                <el-form-item label="添加产品:">
                    <el-button type="primary" @click="openGood()">添加产品</el-button>
                    <el-row :gutter="10" :key="item.pid" v-for="item in packAddDialog.products" type="flex" style="margin-top: 12px;">
                        <el-col :span="4">{{item.sdname}}</el-col>
                        <el-col :span="7"><el-input type="number" min="1" v-model="item.num" style="width:100px;margin: 0 10px 0 10px" placeholder="次数" clearable/>次</el-col>
                        <el-col :span="7"><el-input type="number" min="0" v-model="item.pprice" style="width:120px; margin-right:5px" placeholder="套餐价" clearable/>元</el-col>
                        <el-col :span="3"><el-checkbox v-model="item.isGift" >赠送</el-checkbox></el-col>
                        <el-col :span="3"><el-link type="primary" @click="deleteProd(item.pid)">删除</el-link></el-col>
                    </el-row>
                    <!--                    <el-link type="primary" @click="goodAdd" style="margin-top: 10px;">继续添加产品</el-link>-->
                </el-form-item>
                <el-form-item label="套餐成本价:" >
                    <el-input type="number" min="0" v-model="packAddDialog.cost" style="width:220px;" clearable/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="savePack('copyForm1')">保存</el-button>
                    <el-button @click="levelCancel(0)">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="packDuoDialog.title" :visible.sync="packDuoDialog.visible" width="740px">
            <el-form ref="copyForm4" :model="packDuoDialog" :rules="formrules" label-width="120px" :label-position="labelPosition">
                <el-form-item label="套餐编号:" >
                    {{packDuoDialog.spcode}}<explain style="color:silver">套餐编号从001开始自动叠加</explain>
                </el-form-item>
                <el-form-item label="套餐名称:" prop="spname">
                    <el-input v-model="packDuoDialog.spname" style="width:320px;" clearable />
                </el-form-item>
                <el-form-item label="可售时间:" prop="date">
                    <el-date-picker style="width:320px;"
                            v-model="packDuoDialog.date"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            type="daterange"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="有效期:">
                    <el-radio-group v-model="packDuoDialog.expiryType">
                        <el-radio :label="1" @change="changeCheck">有效期</el-radio>
                        <el-input type="number" min="1" v-model="packDuoDialog.expirtyMonth" :disabled="packDuoDialog.expiryType=='2'" style="width:80px;" clearable /><label>个月</label><explain style="color:silver">从购买之日起延迟多少个月到期</explain><br/>
                        <el-radio :label="2" @change="changeCheck">指定到固定日期</el-radio>
                        <el-date-picker
                                v-model="packDuoDialog.expirydate" value-format="yyyy-MM-dd HH:mm:ss"
                                type="date"
                                :disabled="packDuoDialog.expiryType=='1'"
                                style="width: 140px;"
                                placeholder="选择时间">
                        </el-date-picker>
                        <explain style="color:silver">为套餐固定到期日期，不填为永久有效</explain>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="添加服务项目:">
                    <el-button type="primary" @click="openDuoServ()">添加服务项目</el-button>
                    <div :key="index" v-for="(serv,index) in packDuoDialog.servs">
                        <el-row :gutter="24" type="flex" style="margin-top: 12px;">
                            <el-col :span="12">项目组标题<el-input v-model="serv.sdname" style="width:180px;margin: 0 10px 0 10px" placeholder="项目组标题" clearable/></el-col>
                            <el-col :span="3"><el-link type="primary" @click="deleteDuoServ(index)">删除</el-link></el-col>
                        </el-row>
                        <el-row :gutter="24" type="flex" style="margin-top: 12px;">
                            <el-col :span="18"><el-tag :key="i" v-for="(item,i) in serv.items" @close="delDuoServ(index,i)" closable>{{item.servname}} </el-tag></el-col>
                            <el-col :span="6"><el-link type="primary" @click="addDuoServ(index,serv.items)">添加</el-link></el-col>
                        </el-row>
                        <el-row :gutter="24" type="flex" style="margin-top: 12px;">
                            <el-col :span="12">每次可选项目次数<el-input type="number" min="1" v-model="serv.selNum" style="width:100px;margin: 0 10px 0 10px" placeholder="次数" clearable/>次</el-col>
                            <el-col :span="6"><el-checkbox v-model="serv.isGift" @change="changGift(serv)">赠送</el-checkbox></el-col>
                            <el-col :span="6"></el-col>
                        </el-row>
                        <el-row :gutter="24" type="flex" style="margin-top: 12px;">
                            <el-col :span="12">套餐总次数<el-input type="number" min="1" v-model="serv.totalNum" style="width:100px;margin: 0 10px 0 10px" placeholder="次数" clearable/>次</el-col>
                            <el-col :span="12">单次套餐价<el-input type="number" min="0" v-model="serv.price" style="width:120px;margin: 0 10px 0 10px" placeholder="套餐价" clearable/>元</el-col>
                        </el-row>
                        <el-divider></el-divider>
                    </div>
                    <!-- <el-link type="primary" @click="serveAdd" style="margin-top: 10px;">继续添加项目</el-link>-->
                </el-form-item>
                <el-form-item label="添加产品:">
                    <el-button type="primary" @click="openDuoGood()">添加产品</el-button>
                    <div :key="index" v-for="(product,index) in packDuoDialog.products">
                        <el-row :gutter="24" type="flex" style="margin-top: 12px;">
                            <el-col :span="12">商品组标题<el-input v-model="product.sdname" style="width:180px;margin: 0 10px 0 10px" placeholder="项目组标题" clearable/></el-col>
                            <el-col :span="3"><el-link type="primary" @click="deleteDuoGood(index)">删除</el-link></el-col>
                        </el-row>
                        <el-row :gutter="24" type="flex" style="margin-top: 12px;">
                            <el-col :span="18">
                                <el-tag :key="i" v-for="(item,i) in product.items" @close="delDuoGood(index,i)" closable>{{item.pname}} </el-tag></el-col>
                            <el-col :span="6"><el-link type="primary" @click="addDuoGood(index,product.items)">添加</el-link></el-col>
                        </el-row>
                        <el-row :gutter="24" type="flex" style="margin-top: 12px;">
                            <el-col :span="12">每次可选产品次数
                                <el-input type="number" min="1" v-model="product.selNum" style="width:100px;margin: 0 10px 0 10px" placeholder="次数" clearable/>次</el-col>
                            <el-col :span="6"><el-checkbox v-model="product.isGift" @change="changGift(product)">赠送</el-checkbox></el-col>
                            <el-col :span="6"></el-col>
                        </el-row>
                        <el-row :gutter="24" type="flex" style="margin-top: 12px;">
                            <el-col :span="12">套餐总次数
                                <el-input type="number" min="1" v-model="product.totalNum" style="width:100px;margin: 0 10px 0 10px" placeholder="次数" clearable/>次</el-col>
                            <el-col :span="12">单次套餐价
                                <el-input type="number" min="0" v-model="product.price" style="width:120px;margin: 0 10px 0 10px" placeholder="套餐价" clearable/>元</el-col>
                        </el-row>
                        <el-divider></el-divider>
                    </div>
                    <!-- <el-link type="primary" @click="goodAdd" style="margin-top: 10px;">继续添加产品</el-link>-->
                </el-form-item>
                <el-form-item label="套餐成本价:" >
                    <el-input type="number" min="0" v-model="packDuoDialog.cost" style="width:220px;" clearable/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="saveDuoPack('copyForm4')">保存</el-button>
                    <el-button @click="levelCancel(3)">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="servAddDialog.title" :visible.sync="servAddDialog.visible" width="700px">
            <el-form label-width="100px" ref="copyForm2">
                <el-form-item label="筛选：">
                    <el-select clearable v-model="servAddDialog.branch"
                               @change="changeBranch(servAddDialog.branch,'1')" placeholder="选择部门" style="width: 140px;">
                        <el-option v-for="item in servAddDialog.branchs"
                                   :key="item.id"
                                   :value="item.id"
                                   :label="item.bname"></el-option>
                    </el-select>
                    <el-select clearable v-model="servAddDialog.serviceType" placeholder="请选择分类" style="margin-left: 5px; width: 140px;">
                        <el-option
                                v-for="item in servAddDialog.serviceTypes"
                                :key="item.id"
                                :label="item.sname"
                                :value="item.scode">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <table border="1" style="width: 100%" class="serve-table">
                        <tr>
                            <th width="20%">所属部门</th>
                            <th width="25%">分类</th>
                            <th width="55%"><el-checkbox v-model="servAddDialog.checkbox" @change="checkServ"></el-checkbox>(编号）项目名称</th>
                        </tr>
                        <tr :key="item.servid"
                            v-for="item in servAddDialog.services"
                            v-if="screenService(item)">
                            <td>{{item.bname}}</td>
                            <td>{{item.typename}}</td>
                            <td><el-checkbox v-model="item.type" :label="item.servid"></el-checkbox>({{item.sdcode}}){{item.sdname}}</td>
                        </tr>
                    </table>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="addServs()" v-if="duoflag">确认添加</el-button>
                    <el-button type="primary" @click="addDuoServs(servAddDialog.index)" v-if="!duoflag">确认添加</el-button>
                    <el-button type="primary" @click="levelCancel(1)" >取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="goodAddDialog.title" :visible.sync="goodAddDialog.visible" width="700px">
            <el-form label-width="120px" ref="copyForm3">
                <el-form-item label="筛选：">
                    <el-select clearable v-model="goodAddDialog.branch"
                               @change="changeBranch(goodAddDialog.branch,'2')" placeholder="所属部门" style="width: 140px;">
                        <el-option v-for="item in goodAddDialog.branchs"
                                   :key="item.id"
                                   :value="item.id"
                                   :label="item.bname"></el-option>
                    </el-select>
                    <el-select clearable v-model="goodAddDialog.productType" placeholder="请选择分类" style="margin-left: 5px; width: 140px;">
                        <el-option
                                v-for="item in goodAddDialog.productTypes"
                                :key="item.id"
                                :label="item.cname"
                                :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <table border="1" style="width: 100%" class="serve-table">
                        <tr>
                            <th width="20%">所属部门</th>
                            <th width="25%">分类</th>
                            <th width="55%"><el-checkbox @change="checkProd"></el-checkbox>(编号）项目名称 规格 </th>
                        </tr>
                        <tr :key="item.pid" v-for="item in goodAddDialog.products"
                            v-if="screenProduct(item)">
                            <td>{{item.bname}}</td>
                            <td>{{item.typename}}</td>
                            <td><el-checkbox v-model="item.type" :value="item.pid"></el-checkbox>({{item.sdcode}}) {{item.sdname}} {{item.norms}}</td>
                        </tr>
                    </table>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="addGoods()" v-if="!duoflag">确认添加</el-button>
                    <el-button type="primary" @click="addDuoGoods(goodAddDialog.index)" v-if="duoflag">确认添加多</el-button>
                    <el-button type="primary" @click="levelCancel(2)">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'

    export default {
        name: "list",
        data() {
            return {
                status:'1',
                duoflag:false,
                spids: [],
                labelPosition: 'left',
                tableData: [],
                packAddDialog: {
                    title: '',
                    visible: false,
                    spcode: '',
                    spname: '',
                    date: [],
                    expirtyMonth: '',
                    expiryType: '',
                    expirydate: '',
                    servs: [],
                    products: [],
                    cost: '',
                    totalprice: '',
                    branch:[],
                },
                packDuoDialog: {
                    title: '',
                    visible: false,
                    spcode: '',
                    spname: '',
                    date: [],
                    expirtyMonth: '',
                    expiryType: '',
                    expirydate: '',
                    servs: [],
                    products: [],
                    branch:[],
                    cost:''
                },
                servAddDialog: {
                    title: '添加服务项目',
                    visible: false,
                    branchs: [],
                    branch: '',
                    serviceTypes: [],
                    serviceType: '',
                    services: [],
                    checkbox: false
                },
                goodAddDialog: {
                    title: '添加产品',
                    visible: false,
                    branchs: [],
                    branch: '',
                    productTypes: [],
                    productType: '',
                    products: [],
                    checkbox: false,
                    index: -1
                },
                pagination: {
                    pageSize:10,
                    currentPage:1,
                    total:0
                },
                formrules: {
                    spname:[{required: true, message:'请填写项套餐名称'}, {min: 0, max: 10, message: '套餐名称在10个字符以内'}],
                    date:[{required: true, message:'请选择可售时间'}],
                },
                serviceAllType: [],
                productAllType: [],
            }
        },
        computed:{
            screenService(){
               return function(item){
                    let flag=true
                    if(this.servAddDialog.branch){
                        if(this.servAddDialog.branch == item.branch){
                            flag=true
                        }else{
                            flag=false
                        }
                    }
                    if(this.servAddDialog.serviceType){
                        if(this.servAddDialog.serviceType == item.servtid){
                            flag=true
                        }else{
                            flag=false
                        }
                    }
                    return flag
                }
            },
            screenProduct(){
                return function (item) {
                    let flag=true
                    if(this.goodAddDialog.branch){
                        if(this.goodAddDialog.branch == item.branch){
                            flag=true
                        }else{
                            flag=false
                        }
                    }
                    if(this.goodAddDialog.productType){
                        if(this.goodAddDialog.productType == item.servtid){
                            flag=true
                        }else{
                            flag=false
                        }
                    }
                    return flag
                }
            }
        },
        methods: {
            lookup(){
                const fetch = service.servicepackage.findServPackList;
                const params = this.pagination
                params.status=this.status
                this.$refs.tableData.reloadData({
                    fetch,
                    params
                });
                if(this.status=='1'){
                    this.status='2'
                }else{
                    this.status='1'
                }
            },
            dateFormat:function(row){
                const sdate = row.sdate;
                const edate = row.edate;
                if(!sdate || !edate){
                    return ''
                }
                return $yid.util.formatDate(sdate) + ' ~ ' + $yid.util.formatDate(edate)
            },
            dateFormat1:function(row){
                if(row.expiryType=='1'){
                    return row.expirtyMonth+'个月';
                }else{
                    if(row.expirydate){
                        return $yid.util.formatDate(row.expirydate);
                    }else{
                        return "长期"
                    }
                }
            },
            levelCancel(i){
                // this.$refs['copyForm1'].resetFields()
                if (i==0)
                    this.packAddDialog.visible = false;
                if (i==1)
                    this.servAddDialog.visible = false;
                if(i==2)
                    this.goodAddDialog.visible = false;
                if (i==3)
                    this.packDuoDialog.visible = false;
            },
            changeCheck(val){
                if(val==1){
                    this.packAddDialog.expirydate='';
                }else{
                    this.packAddDialog.expirtyMonth='';
                }
            },
            addServPack() {
                this.packAddDialog.id = null;
                this.packAddDialog.title = '新增套餐';
                service.servicepackage.newcode().then(res => {
                    this.packAddDialog.spcode= res.data;
                    this.packAddDialog.spname= '';
                    this.packAddDialog.date= [];
                    this.packAddDialog.expirtyMonth= '';
                    this.packAddDialog.expiryType= '';
                    this.packAddDialog.expirydate= '';
                    this.packAddDialog.servs= [];
                    this.packAddDialog.products= [];
                    this.packAddDialog.cost= '';
                    this.packAddDialog.visible = true;
                });
            },
            openServ() {
                this.duoflag=true;
                this.servAddDialog.visible = true;
                this.servAddDialog.branch = '';
                this.servAddDialog.branchs = [];
                this.servAddDialog.serviceType = '';
                this.servAddDialog.serviceTypes = [];
                this.servAddDialog.checkbox= false;
                this.packAddDialog.branch.forEach(item =>{
                    this.servAddDialog.branchs.push({...item})
                })
                this.servAddDialog.services.forEach(item =>{
                    item.type=false;
                    this.packAddDialog.servs.forEach(serv =>{
                        if(serv.servid==item.servid){
                            item.type=true;
                        }
                    })
                })
            },
            checkServ(val){
                this.servAddDialog.services.forEach(item =>{
                    if(!this.servAddDialog.branch){
                        item.type=val;
                    }else if(this.servAddDialog.branch==item.branch){
                        item.type=val;
                    }
                })
            },
            openGood() {
                this.duoflag=false;
                this.goodAddDialog.visible = true;
                this.goodAddDialog.branch = '';
                this.goodAddDialog.branchs = [];
                this.goodAddDialog.productType = '';
                this.goodAddDialog.productTypes = [];
                this.goodAddDialog.checkbox= false;
                this.packAddDialog.branch.forEach(item =>{
                    this.goodAddDialog.branchs.push({...item})
                })
                this.goodAddDialog.products.forEach(item =>{
                    item.type=false;
                    this.packAddDialog.products.forEach(serv =>{
                        if(serv.pid == item.pid ){
                            item.type=true;
                        }
                    })
                })
            },
            addGoods(){
                const that=this;
                this.goodAddDialog.products.forEach(item =>{
                    if(item.type && (!that.goodAddDialog.branch || item.branch==that.goodAddDialog.branch)
                      && (!that.goodAddDialog.productType || item.servtid==that.goodAddDialog.productType)){
                        let flag=true;
                        that.packAddDialog.products.forEach(pro =>{
                            if(item.pid==pro.pid){
                                flag=false;
                            }
                        })
                        if(flag){
                            that.packAddDialog.products.push({
                                sdcode:item.sdcode,
                                sdname:item.sdname,
                                price:'',
                                pprice:'',
                                num:'',
                                type:'1',
                                pid:item.pid,
                                is_gift:''
                            });
                        }
                    }
                })
                this.levelCancel(2);
            },
            addServs(){
                const that=this;
                this.servAddDialog.services.forEach(item =>{
                    if(item.type && (!that.servAddDialog.branch || item.branch==that.servAddDialog.branch)
                     && (!that.servAddDialog.serviceType || item.servtid==that.servAddDialog.serviceType)){
                        let flag=true;
                        that.packAddDialog.servs.forEach(serv =>{
                            if(item.servid==serv.servid){
                                flag=false;
                            }
                        })
                        if(flag){
                            that.packAddDialog.servs.push({
                                sdcode:item.sdcode,
                                sdname:item.sdname,
                                price:'',
                                pprice:'',
                                num:'',
                                type:'1',
                                servid:item.servid,
                                is_gift:''
                            });
                        }
                    }
                })
                this.levelCancel(1);
            },
            duoServPack(){
                this.packDuoDialog.id = null;
                this.packDuoDialog.title = '新增多选套餐';
                service.servicepackage.newcode().then(res => {
                    this.packDuoDialog.spcode= res.data;
                    this.packDuoDialog.spname= '';
                    this.packDuoDialog.date= [];
                    this.packDuoDialog.expirtyMonth= '';
                    this.packDuoDialog.expiryType= '';
                    this.packDuoDialog.expirydate= '';
                    this.packDuoDialog.servs= [];
                    this.packDuoDialog.products= [];
                    this.packDuoDialog.visible = true;
                });
            },
            editServPack(data){
                const row=$yid.util.deepClone(data);
                if(row.isMultiple=="0"){
                    this.packAddDialog.title = '修改套餐';
                    this.packAddDialog.visible = true;
                    this.packAddDialog.id= row.id;
                    this.packAddDialog.spcode= row.spcode;
                    this.packAddDialog.spname= row.spname;
                    this.packAddDialog.date= [row.sdate,row.edate];
                    this.packAddDialog.expirtyMonth= row.expirtyMonth;
                    this.packAddDialog.expiryType= Number(row.expiryType);
                    this.packAddDialog.expirydate= row.expirydate;
                    this.packAddDialog.cost= row.cost;
                    this.packAddDialog.revision= row.revision;
                    this.packAddDialog.servs= row.servs||[];
                    this.packDuoDialog.servs.forEach(item =>{
                        if(item.isGift=='1'){//赠送
                            item.isGift=true;
                        }else{//不赠送
                            item.isGift=false
                        }
                    })
                    this.packAddDialog.products= row.products||[];
                    this.packAddDialog.products.forEach(item =>{
                        if(item.isGift=='1'){//赠送
                            item.isGift=true;
                        }else{//不赠送
                            item.isGift=false
                        }
                    })
                }
                if(row.isMultiple=="1"){
                    this.packDuoDialog.title = '修改多选套餐';
                    this.packDuoDialog.visible = true;
                    this.packDuoDialog.id= row.id;
                    this.packDuoDialog.spcode= row.spcode;
                    this.packDuoDialog.spname= row.spname;
                    this.packDuoDialog.date= [row.sdate,row.edate];
                    this.packDuoDialog.expirtyMonth= row.expirtyMonth;
                    this.packDuoDialog.expiryType= Number(row.expiryType);
                    this.packDuoDialog.expirydate= row.expirydate;
                    this.packDuoDialog.servs= row.servs||[];
                    this.packDuoDialog.products= row.products||[];
                    this.packDuoDialog.cost= row.cost;
                    this.packDuoDialog.revision= row.revision;
                    this.packDuoDialog.servs.forEach(item =>{
                        if(item.isGift=='1'){//赠送
                            item.isGift=true;
                        }else{//不赠送
                            item.isGift=false
                        }
                        if(!item.items){
                            item.items=[];
                        }
                    })
                    this.packDuoDialog.products.forEach(item =>{
                        if(item.isGift=='1'){//赠送
                            item.isGift=true;
                        }else{//不赠送
                            item.isGift=false
                        }
                        if(!item.items){
                            item.items=[];
                        }
                    })
                }
            },
            stop(row) {
                const params={
                    id:row.id,
                    revision:row.revision
                };
                if(row.status=="1"){
                    params.status='2';
                }else{
                    params.status='1';
                }
                service.servicepackage.editStatus(params).then(res =>{
                    if(res.resp_code=="200"){
                        this.querylist();
                        yid.util.success(res.resp_msg);
                    }else{
                        yid.util.error(res.resp_msg);
                    }
                })
            },
            openDuoServ(){
                this.duoflag=false;
                this.servAddDialog.visible = true;
                this.servAddDialog.branch = '';
                this.servAddDialog.branchs = [];
                this.servAddDialog.checkbox= false;
                this.packAddDialog.branch.forEach(item =>{
                    this.servAddDialog.branchs.push({...item})
                })
                this.servAddDialog.services.forEach(item =>{
                    item.type=false;
                })
            },
            addDuoServ(index,rows){
                this.duoflag=false;
                this.servAddDialog.visible = true;
                this.servAddDialog.index=index;
                this.servAddDialog.branch = '';
                this.servAddDialog.branchs = [];
                this.servAddDialog.checkbox= false;
                this.packAddDialog.branch.forEach(item =>{
                    this.servAddDialog.branchs.push({...item})
                })
                this.servAddDialog.services.forEach(item =>{
                    item.type=false;
                    rows.forEach(row =>{
                        if(item.servid==row.servid){
                            item.type=true;
                        }
                    })
                })
            },
            addDuoServs(index){
                const servs=[];
                this.servAddDialog.services.forEach(item =>{
                    if(item.type && (!this.servAddDialog.branch || item.branch==this.servAddDialog.branch)){
                        servs.push({
                            servid:item.servid,
                            servcode:item.sdcode,
                            servname:item.sdname
                        })
                    }
                })
                if(index || index>=0){
                    this.packDuoDialog.servs[index].items=servs;
                }else{
                    this.packDuoDialog.servs.push({
                        items:servs,
                        price:'',
                        pprice:'',
                        num:'',
                        type:'1',
                        is_gift:'',
                        sdcode:'',
                        sdname:''
                    });
                }
                this.levelCancel(1);
            },
            deleteDuoServ(i){
                this.packDuoDialog.servs.splice(i,1);
            },
            delDuoServ(i,j){
                if(this.packDuoDialog.servs && this.packDuoDialog.servs[i] && this.packDuoDialog.servs[i].items){
                    this.packDuoDialog.servs[i].items.splice(j,1);
                }
            },
            openDuoGood(){
                this.duoflag=true;
                this.goodAddDialog.visible = true;
                this.goodAddDialog.index = -1;
                this.goodAddDialog.branch = '';
                this.goodAddDialog.branchs = [];
                this.goodAddDialog.checkbox= false;
                this.packAddDialog.branch.forEach(item =>{
                    this.goodAddDialog.branchs.push({...item})
                })
                this.goodAddDialog.products.forEach(item =>{
                    item.type=false;
                })
            },
            addDuoGood(index,rows){
                this.duoflag=true;
                this.goodAddDialog.visible = true;
                this.goodAddDialog.index = index;
                this.goodAddDialog.branch = '';
                this.goodAddDialog.branchs = [];
                this.goodAddDialog.checkbox= false;
                this.packAddDialog.branch.forEach(item =>{
                    this.goodAddDialog.branchs.push({...item})
                })
                this.goodAddDialog.products.forEach(item =>{
                    item.type=false;
                    rows.forEach(row =>{
                        if(item.pid==row.pid){
                            item.type=true;
                        }
                    })
                })
            },
            addDuoGoods(index){
                const that=this;
                const products=[];
                this.goodAddDialog.products.forEach(item =>{
                    if(item.type && (!that.goodAddDialog.branch || item.branch==that.goodAddDialog.branch)){
                        products.push({
                            pid:item.pid,
                            pcode:item.sdcode,
                            pname:item.sdname,
                        });
                    }
                })
                if(index>=0){
                    this.packDuoDialog.products[index].items=products;
                }else{
                    this.packDuoDialog.products.push({
                        items:products,
                        price:'',
                        pprice:'',
                        type:'2',
                        num:'',
                        is_gift:'',
                        sdcode:'',
                        sdname:''
                    });
                }
                this.levelCancel(2);
            },
            deleteDuoGood(i){
                this.packDuoDialog.products.splice(i,1);
            },
            delDuoGood(i,j){
                if(this.packDuoDialog.products && this.packDuoDialog.products[i] && this.packDuoDialog.products[i].items){
                    this.packDuoDialog.products[i].items.splice(j,1);
                }
            },
            saveDuoPack(formName){
                const that=this;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let i=0;
                        if(that.packDuoDialog.servs && that.packDuoDialog.servs.length>0){
                            i+=that.packDuoDialog.servs.length;
                        }
                        if(that.packDuoDialog.products && that.packDuoDialog.products.length>0){
                            i+=that.packDuoDialog.products.length;
                        }
                        if(i==0){
                            yid.util.error("没有选择项目或产品")
                            return
                        }
                        if(that.packDuoDialog.expiryType && that.packDuoDialog.expiryType=='1' && !that.packDuoDialog.expirtyMonth){
                            yid.util.error("请输入有效期有多少个月")
                            return
                        }
                        if(that.packDuoDialog.expiryType && that.packDuoDialog.expiryType=='2' && !that.packDuoDialog.expirydate){
                            yid.util.error("请输入有效期到固定日期")
                            return
                        }
                        let pprice=0, message='';
                        that.packDuoDialog.servs.forEach((item,index) =>{
                            if(!item.items || item.items.length==0){
                                message+='项目第'+(index+1)+'行没有选择项目 ';
                            }else{
                                item.sdcode='';
                                item.items.forEach(each =>{
                                    item.sdcode+=each.servcode+",";
                                })
                                if(item.sdcode){
                                    item.sdcode=item.sdcode.substr(0,item.sdcode.length-1)
                                }
                            }
                            if(!item.sdname){
                                message+='项目第'+(index+1)+'行没有填项目组标题 ';
                            }
                            if(!item.selNum){
                                message+='项目第'+(index+1)+'行没有填可选项目次数 ';
                            }
                            if(!item.totalNum){
                                message+='项目第'+(index+1)+'行没有填套餐总次数 ';
                            }
                            if(item.isGift){
                                item.isGift=1
                            }else if(!item.pprice){
                                item.isGift=0
                                message+='项目第'+(index+1)+'行没填单次套餐价 ';
                            }else{
                                item.isGift=0
                            }
                            if(item.totalNum && item.pprice){
                                item.price=Number(item.pprice)/Number(item.totalNum).toFixed(2)
                                pprice+=item.pprice
                            }
                        })
                        that.packDuoDialog.products.forEach((item,index) =>{
                            if(!item.items || item.items.length==0){
                                message+='产品第'+(index+1)+'行没有选择产品 ';
                            }else{
                                item.sdcode='';
                                item.items.forEach(each =>{
                                   item.sdcode+=each.pcode+",";
                                })
                                if(item.sdcode){
                                    item.sdcode=item.sdcode.substr(0,item.sdcode.length-1)
                                }
                            }
                            if(!item.sdname){
                                message+='产品第'+(index+1)+'行没有填产品组标题 ';
                            }
                            if(!item.selNum){
                                message+='产品第'+(index+1)+'行没有填可选产品次数 ';
                            }
                            if(!item.totalNum){
                                message+='产品第'+(index+1)+'行没有填套餐总次数 ';
                            }
                            if(item.isGift){
                                item.isGift=1
                            }else if(!item.pprice){
                                item.isGift=0
                                message+='产品第'+(index+1)+'行没填单次套餐价 ';
                            }else{
                                item.isGift=0
                            }
                            if(item.totalNum && item.pprice){
                                item.price=Number(item.totalNum)/Number(item.price).toFixed(2)
                                pprice+=item.pprice
                            }
                        })
                        if(message){
                            yid.util.error(message)
                            return
                        }
                        if(that.packDuoDialog.cost && Number(that.packDuoDialog.cost)>pprice){
                            yid.util.error("成本价:"+that.packDuoDialog.cost+"大于套餐价:"+pprice)
                            return
                        }
                        that.packDuoDialog.totalprice=pprice;
                        that.packDuoDialog.sdate=(that.packDuoDialog.date[0]);
                        that.packDuoDialog.edate=(that.packDuoDialog.date[1]);
                        if(that.packDuoDialog.expirydate){
                            that.packDuoDialog.expirydate=(that.packDuoDialog.expirydate);
                        }
                        that.packDuoDialog.isMultiple='1';
                        service.servicepackage.saveServDuoPack(that.packDuoDialog).then(res =>{
                            if(res.resp_code=="200"){
                                that.levelCancel(3);
                                that.init();
                                yid.util.success(res.resp_msg);
                            }else{
                                yid.util.error(res.resp_msg);
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            checkProd(val){
                this.goodAddDialog.products.forEach(item =>{
                    if(!this.goodAddDialog.branch){
                        item.type=val;
                    }else if(this.goodAddDialog.branch==item.branch){
                        item.type=val;
                    }
                })
            },
            deleteServ(id){
                yid.util.confirm('确定删除服务项目？', '','', ()=> {
                    this.packAddDialog.servs.forEach((item,index) =>{
                        if(id==item.servid){
                            this.packAddDialog.servs.splice(index,1)
                        }
                    })
                })

            },
            deleteProd(id){
                yid.util.confirm('确定删除产品？', '','', ()=> {
                    this.packAddDialog.products.forEach((item,index) =>{
                        if(id==item.pid){
                            this.packAddDialog.products.splice(index,1)
                        }
                    })
                })
            },
            savePack(formName){
                const that=this;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        let i=0;
                        if(that.packAddDialog.servs && that.packAddDialog.servs.length>0){
                            i+=that.packAddDialog.servs.length;
                        }
                        if(that.packAddDialog.products && that.packAddDialog.products.length>0){
                            i+=that.packAddDialog.products.length;
                        }
                        if(i==0){
                            yid.util.error("没有选择项目或产品")
                            return
                        }
                        if(that.packAddDialog.expiryType && that.packAddDialog.expiryType=='1' && !that.packAddDialog.expirtyMonth){
                            yid.util.error("请输入有效期有多少个月")
                            return
                        }
                        if(that.packAddDialog.expiryType && that.packAddDialog.expiryType=='2' && !that.packAddDialog.expirydate){
                            yid.util.error("请输入有效期到固定日期")
                            return
                        }
                        if(that.packAddDialog.expiryType == "0"){
                            that.packAddDialog.expirtyMonth=""
                            that.packAddDialog.expirydate=""
                        }
                        let pprice=0;let message='';
                        that.packAddDialog.servs.forEach(item =>{
                            if(!item.num){
                                message+=item.sdname+':次数没填 ';
                            }
                            if(item.isGift){
                                item.isGift=1
                            }else if(!item.pprice){
                                item.isGift=0
                                message+=item.sdname+':套餐价没填 ';
                            }else{
                                item.isGift=0
                            }
                            if(item.num && item.pprice){
                                item.price=Number(item.pprice)/Number(item.num).toFixed(2)
                                pprice+=Number(item.pprice)
                            }
                        })
                        that.packAddDialog.products.forEach(item =>{
                            if(!item.num){
                                message+=item.sdname+':次数没填 ';
                            }
                            if(item.isGift){
                                item.isGift=1
                            }else if(!item.pprice){
                                item.isGift=0
                                message+=item.sdname+':套餐价没填 ';
                            }else{
                                item.isGift=0
                            }
                            if(item.num && item.pprice){
                                item.price=Number(item.pprice)/Number(item.num).toFixed(2)
                                pprice+=item.pprice
                            }
                        })
                        if(message){
                            yid.util.error(message)
                            return
                        }
                        if(that.packAddDialog.cost && Number(that.packAddDialog.cost)>pprice){
                            yid.util.error("成本价:"+that.packAddDialog.cost+"大于套餐价:"+pprice)
                            return
                        }
                        that.packAddDialog.totalprice=pprice;
                        that.packAddDialog.sdate=(that.packAddDialog.date[0]);
                        that.packAddDialog.edate=(that.packAddDialog.date[1]);
                        if(that.packAddDialog.expirydate){
                            that.packAddDialog.expirydate=(that.packAddDialog.expirydate);
                        }
                        service.servicepackage.saveServPack(that.packAddDialog).then(res =>{
                            if(res.resp_code=="200"){
                                that.levelCancel(0);
                                that.init();
                                yid.util.success(res.resp_msg);
                            }else{
                                yid.util.error(res.resp_msg);
                            }
                        })
                    } else {
                        return false
                    }
                })
            },
            changGift(row){
                if(row.isGift){
                    row.price=0;
                    row.pprice=0;
                }else{
                    row.price='';
                    row.pprice='';
                }
            },
            handleServicesChange(val){
                this.spids = val;
            },
            delServPack(){
                if(!this.spids || this.spids.length==0){
                    yid.util.error("请选择套餐");
                    return;
                }
                const than=this;
                yid.util.confirm('确定删除套餐？', '','', ()=> {
                    than.spids.forEach(item =>{
                        const params={
                            id:item.id,
                            revision:item.revision,
                            isDel:'1'
                        };
                        service.servicepackage.delServPack(params).then(res =>{
                            if(res.resp_code=="200"){
                                yid.util.success(res.resp_msg);
                                this.querylist();
                            }else{
                                yid.util.error(res.resp_msg);
                            }
                        })
                    })
                    than.init();
                })
            },
            querylist(){
                const fetch = service.servicepackage.findServPackList;
                const params = this.pagination
                this.$refs.tableData.reloadData({
                    fetch,
                    params
                });
            },
            init(){
                service.serviceInfo.findbranch({status:'1'}).then(res => {
                    this.packAddDialog.branch=res.data;
                });
                service.servicepackage.servinfo({status:'1'}).then(res => {
                    this.servAddDialog.services=res.data
                });
                service.servicepackage.product({status:'1'}).then(res => {
                    this.goodAddDialog.products=res.data
                });
                service.serviceInfo.findServiceType({status:'1'}).then(res => {
                    this.serviceAllType=res.data;
                })
                service.serviceInfo.findProductType({status:'1'}).then(res => {
                    this.productAllType=res.data;
                })
                this.querylist();
            },
            changeBranch(id,type){
                if(type == '1'){
                    this.servAddDialog.serviceType='';
                    this.servAddDialog.serviceTypes=[];
                    this.serviceAllType.forEach(item =>{
                        if(id == item.branch){
                            this.servAddDialog.serviceTypes.push(item);
                        }
                    })
                }
                if(type == '2'){
                    this.goodAddDialog.productType='';
                    this.goodAddDialog.productTypes=[];
                    this.productAllType.forEach(item =>{
                        if(id == String(item.bbid)){
                            this.goodAddDialog.productTypes.push(item);
                        }
                    })
                }
            }
        },
        mounted() {
            this.init();
        }
    }
</script>

<style scoped lang="scss">
    .serve-table {
        th, td {
            padding-left: 10px;
            text-align: left;
        }
        .el-checkbox {
            margin-right: 15px;
        }
    }
</style>