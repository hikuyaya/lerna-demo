<template>
    <div>
        <el-row type="flex" justify="space-between">
            <el-form inline>
                <el-form-item label="员工：">
                    <el-input clearable v-model="queryModel.eename" placeholder="名称/工号"
                              style="width: 160px;"></el-input>
                </el-form-item>
                <el-form-item label="职务：">
                    <el-select clearable v-model="queryModel.psid" @clear="clearPs">
                        <el-option v-for="item in dt.psList" :label="item.psname" :key="item.id"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职务级别：">
                    <el-select clearable v-model="queryModel.pslid">
                        <el-option v-for="item in pslList" :label="item.pslname" :key="item.id"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="">
                    <el-button type="primary" @click="queryEmployee()">查询</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <el-col :span="14">
                <yid-table pagination ref="leftTable" style="margin-top: 10px;"
                           @selection-change="handleSelectionChange" :data="leftData">
                    <el-table-column type="selection" width="55"></el-table-column>
                    <yid-table-column label="员工编码" min-width="60" prop="eecode"></yid-table-column>
                    <yid-table-column label="员工名称" min-width="100" prop="eename"></yid-table-column>
                    <yid-table-column label="职务" min-width="60" prop="psname"></yid-table-column>
                    <yid-table-column label="级别" min-width="120" prop="pslname"></yid-table-column>
                </yid-table>
            </el-col>
            <el-col :span="1" style="padding: 60px 0px">
                <div>
                    <el-button @click="transfer()" type="primary" size="mini"><i class="el-icon-right"></i></el-button>
                </div>
            </el-col>
            <el-col :span="8" style="margin-left: 5px;">
                <yid-table ref="rightTable" style="margin-top: 10px;" :data="rightData">
                    <yid-table-column label="员工编码" min-width="60" prop="eecode"></yid-table-column>
                    <yid-table-column label="员工名称" min-width="100" prop="eename"></yid-table-column>
                    <yid-table-column label="操作" min-width="80">
                        <template slot-scope="scope">
                            <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteDataRow(scope.$index)">
                                删除
                            </el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-col>
        </el-row>
        <el-row justify="space-between" style="margin-top: 10px;">
            <el-col :span="2" :offset="10">
                <el-button type="primary" @click="doConfirm">确定</el-button>
            </el-col>
            <el-col :span="2">
                <el-button @click="goBack">取消</el-button>
            </el-col>
            <el-col :span="10"></el-col>
        </el-row>
    </div>
</template>

<script>

    import service from '@src/service'

    export default {
        name: "panelEmployee",
        props: {
            confirmFunc: {
                type: Function
            },
            defaultRightData: {
                type: Array
            },
            isNull: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                queryModel: {
                    eename: null,
                    psid: null,
                    pslid: null,
                    status: '1',
                    isDel: '0',
                    page: 1,
                    limit: 10,
                    count: 0
                },
                dt: {psList: [], pslList: []},
                pslList: [],
                chosenEmployees: [],
                rightData: [],
                leftData: [],
            }
        },
        mounted() {
            service.chain.position.list({status: '1'}).then(res => {
                this.dt.psList = res.data;
            })
            service.chain.positionLevel.list({status: '1'}).then(res => {
                this.dt.pslList = res.data;
            })
            this.rightData = this.defaultRightData;
        },
        computed: {},
        watch: {
            "queryModel.psid"() {
                this.pslList = this.dt.pslList.filter(psl =>
                    psl.psid == this.queryModel.psid
                );
            },
            "defaultRightData"(v){
                this.rightData = v;
            }
        },
        methods: {
            queryEmployee() {
                const fetch = service.employee.list
                const params = {...this.queryModel}
                this.$refs['leftTable'].reloadData({
                    fetch,
                    params,
                });
            },
            handleSelectionChange(rows) {
                this.chosenEmployees = rows;
            },
            transfer() {
                this.chosenEmployees.map(m => {
                let isAdd = true;
                    this.rightData.map(p =>{
                        if(p.id == m.id){
                            $yid.util.error("已被选择："  + p.eename);
                            isAdd = false;
                        }
                    });
                    if(isAdd){
                        this.rightData.push(m)
                    }
                })
            },
            deleteDataRow(index) {
                this.rightData.splice(index, 1)
            },
            goBack() {
                this.queryModel = {
                    eename: null,
                    psid: null,
                    pslid: null,
                    status: '1',
                    isDel: '0',
                    page: 1,
                    limit: 10,
                    count: 0
                };
                this.pslList = [];
                this.chosenEmployees = [];
                this.rightData = [];
                this.leftData = [];
                this.$parent.$parent.$emit('close');
            },
            doConfirm() {
                if (this.isNull && $yid.util.isEmpty(this.rightData)) {
                    $yid.util.error("所选员工不能为空！");
                    return;
                }
                if (this.confirmFunc)
                    this.confirmFunc(this.rightData);

                this.goBack()
            },
            clearPs() {
                this.queryModel.pslid = null;
            }
        },
    }
</script>

<style scoped>

</style>