<template>
    <div>
        <el-collapse-transition>
            <div v-show="visible">
                <el-row type="flex" justify="space-between">
                    <el-form inline>
                        <el-form-item label="员工：">
                            <el-input clearable v-model="queryModel.pcodename" placeholder="名称/工号"
                                      style="width: 160px;"></el-input>
                        </el-form-item>
                        <el-form-item label="门店：">
                            <el-select @clear="clearFormShop" @blur="clearFormShop" clearable v-model.trim="queryModel.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                                <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                    <span style="float: left">{{ item.shopcode }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button type="primary" @click="queryEmployee()">查询</el-button>
                        </el-form-item>
                    </el-form>
                </el-row>
                <el-row>
                    <el-col>
                        <yid-table pagination ref="pageTable" style="margin-top: 5px;" height="300">
                            <yid-table-column label="员工编码" min-width="60" prop="eecode"></yid-table-column>
                            <yid-table-column label="员工名称" min-width="100" prop="eename"></yid-table-column>
                            <yid-table-column label="职务" min-width="60" prop="psname"></yid-table-column>
                            <yid-table-column label="级别" min-width="120" prop="pslname"></yid-table-column>
                            <yid-table-column label="操作" min-width="80">
                                <template slot-scope="scope">
                                    <el-link type="primary" style="margin: 0 10px 0 10px;"
                                             @click="getEeTc(scope.row)">
                                        查看提成方案明细
                                    </el-link>
                                </template>
                            </yid-table-column>
                        </yid-table>
                    </el-col>
                </el-row>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-if="!visible">
                <el-row>
                    <el-button type="primary" @click="visible = !visible">返回</el-button>
                </el-row>
                <el-row>
                    <el-form inline>
                        <el-form-item label="员工编码：">
                            <el-input disabled v-model="model.eecode"/>
                        </el-form-item>
                        <el-form-item label="员工姓名：">
                            <el-input disabled v-model="model.eename"/>
                        </el-form-item>
                        <el-form-item label="职务：">
                            <el-input disabled v-model="model.psname"/>
                        </el-form-item>
                        <el-form-item label="级别：">
                            <el-input disabled v-model="model.pslname"/>
                        </el-form-item>
                        <el-form-item label="方案名称：">
                            <el-input disabled v-model="model.tcname"/>
                        </el-form-item>
                    </el-form>
                </el-row>
                <el-row v-for="item in model.itemList">
                    <el-row style="color: #303133; margin: 10px 0; font-weight:bold;">{{ item.prtname }}</el-row>
                    <el-table
                            :data="item.descList"
                            border
                            style="width: 100%">
                        <el-table-column v-if="item.descList[0].isPosition=='1'"
                                         label="工位"
                                         width="80">
                            <template slot-scope="scope">
                                {{ scope.row.position=="1"?"第一工位":(scope.row.position=="2"?"第二工位":"第三工位") }}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="提成项"
                                width="180">
                            <template slot-scope="scope">
                                {{ scope.row.descitemList.joinField("itemname","，") }}
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="提成方式"
                                width="80">
                            <template slot-scope="scope">
                                {{ scope.row.normType=="1"?"按数量":"按业绩" }}
                            </template>
                        </el-table-column>
                        <el-table-column v-if="item.descList[0].isCost=='1'"
                                         prop="address"
                                         label="成本"
                                         width="80">
                            <template slot-scope="scope">
                                {{ scope.row.costType=="1"?(scope.row.cost + "%"):(scope.row.cost + "元") }}
                            </template>
                        </el-table-column>
                        <el-table-column v-if="item.isPay"
                                         label="支付方式"
                                         width="180">
                            <template slot-scope="scope">
                                {{ scope.row.payList.joinField("payname","，") }}
                            </template>
                        </el-table-column>
                        <el-table-column label="指标" v-if="item.descList[0].isSubdesc=='1'">
                            <el-table-column
                                    label="级别"
                                    width="60">
                                <template slot-scope="scope">
                                    <el-row v-for="level in scope.row.levelList" style="height: 40px;">
                                        <el-col>
                                            {{level.level}}
                                        </el-col>
                                    </el-row>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="条件"
                                    width="200">
                                <template slot-scope="scope">
                                    <el-row v-for="level in scope.row.levelList" style="height: 40px;">
                                        <el-col>
                                            {{showLevelMemo(level)}}
                                        </el-col>
                                    </el-row>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="指定提成"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-row v-for="level in scope.row.levelList" style="height: 40px;">
                                        <el-col>
                                            {{ level.normType=="1"?(level.norm+"元"):(level.norm+"%") }}
                                        </el-col>
                                    </el-row>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="不指定提成"
                                    width="100">
                                <template slot-scope="scope">
                                    <el-row v-for="level in scope.row.levelList" style="height: 40px;">
                                        <el-col>
                                            {{ level.normType=="1"?(level.norm2+"元"):(level.norm2+"%") }}
                                        </el-col>
                                    </el-row>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column v-if="item.descList[0].isSubdesc=='0'"
                                         width="100"
                                         label="指定提成">
                            <template slot-scope="scope">
                                {{ scope.row.normType=="1"?(scope.row.norm+"元"):(scope.row.norm+"%") }}
                            </template>
                        </el-table-column>
                        <el-table-column
                                width="100"
                                label="不指定提成"
                                v-if="item.descList[0].isSubdesc=='0'">
                            <template slot-scope="scope">
                                {{ scope.row.normType=="1"?(scope.row.norm2+"元"):(scope.row.norm2+"%") }}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>

    import service from '@src/service'

    export default {
        name: "tcQuery",
        data() {
            return {
                queryModel: {
                    pcodename: null,
                    status: '1',
                    orderbyasc: "eecode",
                    shopid:null,
                    isDel: '0',
                    page: 1,
                    limit: 10,
                    count: 0
                },
                model: {
                    tcname: null,
                    eeid: null,
                    eecode: null,
                    eename: null,
                    psname: null,
                    pslname: null,
                    itemList: null,
                },
                visible: true,
                allShopList:[],
                filterShopList:[],
            }
        },
        methods: {
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
            },
            queryEmployee() {

                if(!this.queryModel.shopid && !this.queryModel.pcodename){
                    $yid.util.error("必须输入一个查询条件");
                    return
                }
                const fetch = service.chain.employee.list
                const params = {...this.queryModel}
                this.$refs['pageTable'].reloadData({
                    fetch,
                    params,
                });
            },
            getEeTc(employee) {
                service.chain.royaltyGroup.getByEmployee(employee).then(res => {
                    console.log(res);
                    this.model.eeid = employee.id;
                    this.model.eecode = employee.eecode;
                    this.model.eename = employee.eename;
                    this.model.psname = employee.psname;
                    this.model.pslname = employee.pslname;
                    this.model.tcname = res.data.prmname;
                    this.model.itemList = res.data.itemList;
                    this.visible = !this.visible;
                })
            },
            showLevelMemo(level) {
                let memo = ""
                let cond = level.pcondition == "1" ? "且" : "或"
                for (let i = 0; i < level.subdescList.length; i++) {
                    memo = memo + level.subdescList[i].prnname + " " + level.subdescList[i].pcondition + " " + level.subdescList[i].pvalue + "\n" + (i == level.subdescList.length - 1 ? " " : cond) + "\n"
                }
                return memo
            },
            clearFormShop(){
                setTimeout(() =>{
                    if(this.queryModel.shopid == ''){
                        this.queryModel.shopid= "";
                        this.filterShopList = Object.assign(this.allShopList);
                    }

                },300)
            }
        },
        mounted(){
            this.getShopList()
        }
    }
</script>

<style scoped>

</style>