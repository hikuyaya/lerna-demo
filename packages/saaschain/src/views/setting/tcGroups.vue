<template>
    <div>
        <div class="groupDiv">
            <div style="width: 1000px;overflow-x: auto">
                <div class="groups" :style="{width:modelStyle.groupList.width + 'px'}">
                    <div :class="(currentGroup&&g.id==currentGroup.id)?'group1':'group'" v-for="(g,i) in groupList"
                         @click="chooseGroup(i)">
                        <el-row>名称：{{g.name}}</el-row>
                        <el-row style="height: 80px;">范围：{{ g.psList.joinField("psname","、",10) }}</el-row>
                        <el-row>
                            <el-button-group>
                                <el-button type="primary" icon="el-icon-edit" @click.stop="toEdttGroup(i)"></el-button>
                                <el-button type="primary" icon="el-icon-document-copy"
                                           @click.stop="doCopyGroup(i)"></el-button>
                                <el-button type="primary" icon="el-icon-delete" @click.stop="doDelete(i)"></el-button>
                            </el-button-group>
                        </el-row>
                    </div>
                </div>
            </div>
            <div class="plus">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="toAddGroup">新增子集</el-button>
            </div>
        </div>
        <el-divider class="divider"></el-divider>
        <el-tabs v-model="prtcode" value="prtcode" @tab-click="handleClick">
            <el-tab-pane :label="type.prtname" :name="type.prtcode" v-for="(type,i) in dt.rType"></el-tab-pane>

        </el-tabs>
        <tcDetail ref="tcd" v-show="prtcode!='0'" :structure="structure"></tcDetail>
        <yid-dialog :title="dialogs.group.title" :visible.sync="dialogs.group.show" @close="cancelAddGroup">
            <el-form label-width="100px" ref="formRg" :model="dialogs.group.model" :rules="dialogs.group.rules">
                <el-form-item label="子集名称：" prop="name">
                    <el-input clearable v-model="dialogs.group.model.name" placeholder="请输入子集名称"
                              :rules="dialogs.group.rules.name"
                    ></el-input>
                </el-form-item>
                <el-form-item label="适用人员：">
                    <el-cascader :options="stuffTree.data.tree" :props="stuffTree.props" :show-all-levels="false"
                                 clearable ref="rps"
                                 v-model="stuffTree.cascaderValue"
                                 style="min-width: 460px"></el-cascader>
                </el-form-item>
                <el-form-item style="text-align: center">
                    <el-button type="primary" @click="doAddGroup">确定</el-button>
                </el-form-item>
            </el-form>

        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import tcDetail from "./tcDetail"

    export default {
        name: "tcGroups",
        components: {
            tcDetail
        },
        data: function () {
            return {
                prtcode: '0',
                rManage: {},
                dialogs: {
                    group: {
                        show: false,
                        title: "提成子集",
                        model: {id: null, name: null},
                        rules: {name: {required: true, message: '请输入子集名称', trigger: 'blur'}},
                    },
                },
                dt: {
                    rType: [],
                },
                structure: {},
                groupList: [],
                currentGroup: null,
                stuffTree: {
                    data: [],
                    props: {multiple: true, value: 'treekey', checkStrictly: true},
                    cascaderValue: [],
                },
                modelStyle: {
                    groupList: {
                         width: 0
                    }
                },
            }
        },
        computed: {},
        mounted() {
            service.employee.stuffTree({status: '1',isDel: '0'}).then(res => {
                this.stuffTree.data = res.data;
            });
            service.tc.tcConfigCon.rType().then(res => {
                this.dt.rType = res.data
            });
            service.tc.tcCon.structure().then(res => {
                this.structure = res.data
            });
        },
        watch: {
            groupList:{
                handler:function(n){
                    this.modelStyle.groupList.width = n.length * 150;
                },
                deep: true
            }
        },
        methods: {
            goBack() {

            },
            refreshGroup(rItem){
                //提成明细保存后回填到页面子集缓存中
                const index = this.groupList.findIndex(group=>group.id==rItem.prgid);
                const index1 = this.groupList[index].itemList.findIndex(item=>item.prtcode==rItem.prtcode);
                if(index1 >= 0){
                    this.groupList[index].itemList[index1] = rItem;
                }else{
                    this.groupList[index].itemList.push(rItem);
                }
            },
            chooseGroup(index) {
                if (this.currentGroup) {
                    if (this.groupList[index].id == this.currentGroup.id)
                        return;
                    $yid.util.confirm('提成方案子集[' + this.currentGroup.name + ']正在编辑中，是否放弃', '', '', () => {
                        this.findFullVO(index);
                    })
                } else {
                    this.findFullVO(index);
                }
            },
            findFullVO(index) {
                $yid.service.tc.tcGroup.getById(this.groupList[index].id).then(res => {
                    this.groupList[index] = res.data;
                    this.currentGroup = this.groupList[index];
                    this.$refs.tcd.cleanRItem();
                    if(this.currentGroup.itemList&&this.currentGroup.itemList.length > 0){
                        this.prtcode = this.currentGroup.itemList[0].prtcode + "";
                        this.$refs.tcd.setRItem(this.currentGroup.itemList[0]);
                    }else{
                        this.prtcode = '0';
                    }
                })
            },
            handleClick(tab) {
                if (this.currentGroup) {
                    this.prtcode = tab.name;
                    this.setDetail();
                } else {
                    $yid.util.error("请先选择要修改的方案子集");
                    this.prtcode = '0';
                }
            },
            setDetail() {
                let items = this.currentGroup.itemList.filter(item => item.prtcode == this.prtcode)
                if (items.length > 0) {
                    this.$refs.tcd.setRItem(items[0]);
                } else {
                    const type = this.dt.rType.filter(t => t.prtcode == this.prtcode)[0]
                    let item = {
                        prtid: type.id,
                        prtcode: type.prtcode,
                        prtname: type.prtname,
                        prgid: this.currentGroup.id,
                        status: '1',
                        descList: []
                    }
                    this.$refs.tcd.setRItem(item);
                }
            },
            doDelete(i) {
                const group = this.groupList[i];
                $yid.util.confirm('是否删除提成方案子集[' + group.name + ']', '', '', () => {
                    $yid.service.tc.tcGroup.deleteGroup(group.id).then(res => {
                        this.initGroupList(this.rManage.id);
                    })
                })
            },
            initGroupList(prmid) {
                service.tc.tcGroup.getList(prmid).then(res => {
                    this.groupList = res.data;
                    this.currentGroup = null;
                    this.prtcode = '0';
                    this.$refs.tcd.cleanRItem()
                })
            },
            doCopyGroup(i) {
                const group = this.groupList[i];
                $yid.util.confirm('是否复制提成方案子集[' + group.name + ']', '', '', () => {
                    $yid.service.tc.tcGroup.copy({id: group.id, rowindex: this.groupList.length}).then(res => {
                        this.initGroupList(this.rManage.id);
                    })
                })
            },
            toAddGroup() {
                this.dialogs.group.show = true;
                this.dialogs.group.model.rowindex = this.groupList.length + 1;
                this.dialogs.group.model.prmid = this.rManage.id;
            },
            toEdttGroup(i) {
                this.dialogs.group.model = this.groupList[i];
                this.setCascaderValue(this.dialogs.group.model.psList);
                this.dialogs.group.show = true;
            },
            cancelAddGroup() {
                this.stuffTree.cascaderValue = [];
                this.dialogs.group.show = false;
                this.dialogs.group.model = {id: null, name: null};
            },
            doAddGroup() {
                this.$refs['formRg'].validate(valid => {
                    if (valid) {
                        let psList = this.$refs.rps.getCheckedNodes();
                        if (psList.length < 1) {
                            $yid.util.error("请勾选适用人员")
                            return false
                        }
                        this.dialogs.group.model.psList = []
                        psList.map((p, index) => {
                            this.dialogs.group.model.psList.push({
                                psid: p.data.node.id,
                                type: p.data.type,
                                treekey: p.data.treekey,
                                psname: p.data.label,
                                treepath: this.stuffTree.cascaderValue[index].toString()
                            })
                        })
                        service.tc.tcGroup.save(this.dialogs.group.model).then(res => {
                            if(this.groupList[res.data.rowindex - 1]){
                                this.groupList[res.data.rowindex - 1] = res.data;
                            }else{
                                this.groupList.push(res.data)
                            }
                            if (res.data.rowindex == this.groupList.length) {
                                this.currentGroup = res.data;
                                this.$refs.tcd.cleanRItem()
                                this.prtcode = this.dt.rType[0].prtcode;
                                this.setDetail();
                            }
                            this.cancelAddGroup();
                            $yid.util.success("保存完成")
                        })
                    } else {
                        return false;
                    }
                });

            },
            setCascaderValue(psList) {
                if (psList instanceof Array) {
                    this.stuffTree.cascaderValue = [];
                    psList.map(ps => {
                        if (ps.treepath)
                            this.stuffTree.cascaderValue.push(ps.treepath.split(","))
                    })
                }
            }
        },
    }
</script>

<style scoped lang="scss">
    .groupDiv {
        display: flex;
        flex-direction: row;

        .groups {
            display: flex;
            overflow-x: auto;
            flex-wrap: nowrap;

            .group, .group1 {
                width: 140px;
                height: 100px;
                display: flex;
                flex-direction: column;
                margin-left: 10px;

            }

            .group1 {
                background-color: #00c6ae;
            }
        }

        .plus {
            width: 140px;
            height: 100px;
            margin-left: 20px;
        }
    }

    .divider {
        margin: 5px 0;
    }
</style>