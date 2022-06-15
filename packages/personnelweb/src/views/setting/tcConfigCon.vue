<template>
    <div class="tcConfigCon">
        <el-collapse-transition>
            <div v-show="listShow">
                <el-button @click="showDialogCk" type="primary">新增</el-button>
                <el-button @click="goBack" type="primary">返回</el-button>
                <el-row style="margin: 15px 0">
                    <el-col :span="6">方案名称：{{rManage.prmname}}</el-col>
                    <el-col :span="6">状态：{{rManage.status=="1"?"启用":"停用"}}</el-col>
                </el-row>
                <yid-table pagination ref="table" :data="rItemList" style="margin-top: 15px">
                    <yid-table-column label="提成分类" width="150" prop="prtname"></yid-table-column>
                    <yid-table-column label="适用人员">
                        <template slot-scope="scope">
                            <el-row style="margin: 15px 0">{{ scope.row.psList.joinField("psname","、") }}</el-row>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="状态" width="160">
                        <template slot-scope="scope">
                            <el-switch
                                    v-model="scope.row.status"
                                    inactive-color="#DCDFE6"
                                    active-color="#409EFF"
                                    active-text="启用"
                                    inactive-text="停用"
                                    active-value="1"
                                    inactive-value="2"
                                    @change="handleSwitch($event,scope.row.id,scope.row.revision)">
                            </el-switch>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" width="150" prop="content">
                        <template slot-scope="scope">
                            <el-link type="primary" @click="showTcCon(scope.row.id)">编辑</el-link>
                            <el-link type="primary" style="margin: 0 20px">复制</el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
                <!--提成分类选择-->
                <yid-dialog :title="dialogType.title" :visible.sync="dialogType.visible" @close="cancelType"
                            width="300px">
                    <div class="rtrtr">
                        <div v-for="(type,i) in dt.rType">
                            <el-radio v-model="rTypeRadio" :label="i" border>{{ type.prtname }}</el-radio>
                        </div>
                    </div>
                    <el-row style="text-align: center">
                        <el-button type="primary" @click="checkedType">确定</el-button>
                    </el-row>

                </yid-dialog>
            </div>
        </el-collapse-transition>
        <el-collapse-transition>
            <div v-show="!listShow">
                <tcCon :ps="dt.tree.tree" ref="tccon"></tcCon>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import service from '@src/service'
    import tcCon from "./tcCon"

    export default {
        components: {
            tcCon
        },
        name: "tcConfigCon",
        data: function () {
            return {
                listShow: true,
                rManage: {},
                rItemList: [
                    {
                        prtname: "测试静态数据",
                        status: "1",
                        psList: [
                            {
                                pscode: "001",
                                psname: "设计师"
                            },
                            {
                                pscode: "002",
                                psname: "助理"
                            },
                        ],
                    }
                ],
                dt: {
                    rType: [],
                    tree: [],
                },
                rTypeRadio: "",
                dialogType: {
                    visible: false,
                    title: '选择提成分类类型',
                },
                dialogPerson: {
                    visible: false,
                    title: '适用人员',
                },
            }
        },
        methods: {
            goBack() {
                this.$parent.visibleList.manage = true
                this.$parent.visibleList.item = false
                this.rManage = {}
                this.rItemList = []
            },
            getItems() {
                service.tc.tcConfigCon.itemList(this.rManage.id).then(res => {
                    this.rItemList = res.data
                })
            },
            initDt() {
                service.tc.tcConfigCon.rType().then(res => {
                    this.dt.rType = res.data
                })
            },
            showDialogCk() {
                this.rTypeRadio = ''
                this.dialogType.visible = true
                this.dialogPerson.visible = false
            },
            checkedType() {
                if (this.rTypeRadio === '') {
                    $yid.util.error("请选择提成分类类型")
                    return false
                }
                let item = {
                    prmid: this.rManage.id,
                    prtid: this.dt.rType[this.rTypeRadio].id,
                    prtname: this.dt.rType[this.rTypeRadio].prtname,
                    status: '1'
                }
                service.tc.tcConfigCon.addItem(item).then(res => {
                    $yid.util.alert(res.resp_msg)
                    this.getItems()
                    this.dialogType.visible = false
                })
            },
            showTcCon(id) {
                this.listShow = false
                this.$refs.tccon.getFullItem(id)
            },
            cancelType() {
                this.dialogType.visible = false
            },
            handleSwitch(nstatus, id, revision) {
                let param = {id: id, status: nstatus, revision: revision}
                service.tc.tcConfigCon.updateItemStatus(param).then(res => {
                    $yid.util.alert(res.resp_msg)
                })
            },
            check(v, k) {
                console.log(v)
                console.log(k)
            }
        },
        mounted() {
            this.initDt();
        },
    }

</script>

<style scoped lang="scss">
    .rtrtr label {
        display: block;
        margin-bottom: 20px;
        height: 40px;
        padding: 12px 40px 0 20px;
    }

    .el-radio.is-bordered + .el-radio.is-bordered {
        margin-left: 0;
    }

    .rtrtr .el-radio {
        margin-right: 0;
    }

</style>