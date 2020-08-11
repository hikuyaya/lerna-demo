<template>
    <div class="dept">
        <el-form :inline="true"   label-position="left">
            <!--<el-form-item label="所属门店：">{{shopname}}</el-form-item>-->
            <el-form-item label="选择业务部门：">
                <el-select  clearable placeholder="请选择部门" v-model="searchForm.bbid" style="width: 140px">
                    <el-option v-for="item in branch" :key="item.id" :label="item.bname" :value="item.id"></el-option>
                </el-select>&nbsp;
            </el-form-item><br/>
            <el-form-item label="姓名：">
                <el-input clearable v-model="searchForm.eename" placeholder="姓名"  style="width: 120px;"></el-input>
            </el-form-item>
            <el-form-item label="工号：">
                <el-input clearable v-model="searchForm.eecode" placeholder="工号"  style="width: 120px;"></el-input>
            </el-form-item>
            <el-form-item label="手机号：">
                <el-input clearable v-model="searchForm.mobile" placeholder="手机号"  style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="门店：">
                <el-select clearable v-model.trim="searchForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label=""><el-button type="primary" @click="queryEmpData()">查询</el-button></el-form-item><br/>
        </el-form>
        <el-row><el-col><i class="el-icon-question"></i> 可拖动列表的每一行进行排序，该排序将显示在顾客端设计师列表</el-col></el-row>
        <el-table :data="tableData" border row-key="id">
            <el-table-column label="预约序号" type="index" width="80"></el-table-column>
            <el-table-column label="头像"  prop="photo" width="140" >
                <template slot-scope="scope">
                    <div><img style="width: 60%; border-radius:50%" :src="scope.row.photo"/></div>
                </template>
            </el-table-column>
            <el-table-column label="员工姓名"  prop="eename" width="120" ></el-table-column>
            <el-table-column label="员工编号"  prop="eecode" width="120" ></el-table-column>
            <el-table-column label="手机号"  prop="mobile" width="140" ></el-table-column>
            <el-table-column label="昵称"  prop="nickname" width="120" ></el-table-column>
            <el-table-column label="所属部门"  prop="bname" width="120" ></el-table-column>
            <el-table-column label="职务"  prop="psname" width="120" ></el-table-column>
            <el-table-column label="职务级别"  prop="pslname" width="120" ></el-table-column>
            <el-table-column label="开启预约"  prop="isyy" width="120" >
                <template slot-scope="scope">
                    <el-switch
                            @change="stop(scope.row)"
                            v-model="scope.row.yystatus=='1'?true:false"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import Sortable from 'sortablejs'
    import service from '@src/service'

    export default {
        data() {
            return {
                shopname:'',
                searchForm:{
                    orderid:'0',
                    status:'1',
                },
                branch:[],
                tableData: [],
                allShopList:[],
                filterShopList:[],
            }
        },
        mounted() {
            this.shopname=$yid.cache.get($yid.type.USER.INFO)
            this.rowDrop()
            this.queryBranch()
            this.getShopList({status:"0"});
        },
        methods: {
            queryBranch(){
                service.branch.list({status:'1'}).then(res =>{
                    this.branch=res.data
                })
            },
            queryEmpData(){
                service.employee.listAll(this.searchForm).then(res =>{
                    if(res.resp_code=="200"){
                        this.tableData=res.data;
                        this.tableData.map(m =>{
                            if(m.isyy == '1'){
                                m.yystatus=true
                            }else{
                                m.yys=false
                            }
                        })
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            stop(row){
                const params={
                    id:row.id,
                    revision:row.revision
                }
                if(row.yystatus){
                    params.isyy='0'
                }else{
                    params.isyy='1'
                }
                service.employee.editYystatus(params).then(res =>{
                    if(res.resp_code=="200"){
                        $yid.util.info(res.resp_msg);
                        this.queryEmpData();
                    }else{
                        $yid.util.error(res.resp_msg);
                    }
                })
            },
            rowDrop () {//行拖拽
                const tbody = document.querySelector('.el-table__body-wrapper tbody');
                const _this = this;
                Sortable.create(tbody, {
                    draggable: ".el-table__row",
                    onEnd ({ newIndex, oldIndex }) {
                        const currRow = _this.tableData.splice(oldIndex, 1)[0];
                        _this.tableData.splice(newIndex, 0, currRow);
                        const params=[];
                        _this.tableData.forEach((each,index) =>{
                            params.push({
                                id:each.id,
                                revision:each.revision,
                                orderid:(index+1)
                            })
                        })
                        service.employee.saveOrderids(params).then(res =>{
                            if(res.resp_code=="200"){
                                $yid.util.info(res.resp_msg);
                            }else{
                                $yid.util.error(res.resp_msg);
                            }
                        })
                    }
                });
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