<template>
    <div>
        <el-row>
            <el-col :span="8">
                <el-tree
                        :data="norms"
                        show-checkbox
                        default-expand-all
                        node-key="prnid"
                        ref="tree"
                        highlight-current
                        @check-change="handleCheckChange"
                        :props="{label:'prnname'}"
                        style="max-height: 430px; overflow-y: scroll; margin-top: 10px; border-right: 1px #ebeef5 solid;">
                    <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span>{{ node.label }}</span>
                        <span>
                            <el-tooltip class="item" effect="dark" placement="right">
                                <div slot="content" v-html="data.memo"></div>
                                <i class="el-icon-question" v-if="data.isMemo=='1'"></i>
                            </el-tooltip>
                        </span>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="16" style="padding-left: 20px">
                <el-row>
                    <label>满足条件：</label>
                    <el-select v-model="condition" placeholder="请选择">
                        <el-option label="满足全部" value="1"></el-option>
                        <el-option label="满足其一" value="2"></el-option>
                    </el-select>
                </el-row>
                <yid-table ref="table" :data="subDescs" style="margin-top: 15px;">
                    <yid-table-column label="指标名称" prop="zbType">
                        <template slot-scope="scope">
                            <label>{{scope.row.prnname}}</label>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="指标逻辑" width="150" prop="zbCondition">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.pcondition" placeholder="请选择">
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="指标值" width="150" prop="zbValue">
                        <template slot-scope="scope">
                            <el-input type="text"
                                      placeholder="请输入指标值"
                                      v-model="scope.row.pvalue"
                                      clearable>
                            </el-input>
                        </template>
                    </yid-table-column>
                    <yid-table-column label="操作" width="150" prop="content">
                        <template slot-scope="scope">
                            <el-link :underline="false" @click="remove(scope.row.prnid,scope.$index)"><i
                                    class="el-icon-remove-outline"></i></el-link>
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-col>
        </el-row>
        <el-row style="text-align: center; margin-top:15px ">
            <el-button type="primary" @click="submit">确定</el-button>
        </el-row>
    </div>
</template>

<script>

    import service from '@src/service'

    export default {
        name: "panelTcSubDesc",
        props: ['func', 'pcondition', 'subDesc'],
        data: function () {
            return {
                condition: "",
                norms: [],
                subDescs: [],
                options: [{
                    value: '==',
                    label: '等于'
                },{
                    value: '!=',
                    label: '不等于'
                }, {
                    value: '>=',
                    label: '大于等于'
                }, {
                    value: '>',
                    label: '大于'
                }, {
                    value: '<=',
                    label: '小于等于'
                }, {
                    value: '<',
                    label: '小于'
                }, {
                    value: '#in',
                    label: '包含'
                }, {
                    value: '#notin',
                    label: '不包含'
                }],
            }
        },
        mounted() {
            service.tc.tcCon.normList().then(res => {
                this.norms = res.data
                this.condition = $yid.util.deepClone(this.pcondition)
                this.subDescs = $yid.util.deepClone(this.subDesc)
                let keys = []
                this.subDescs.map(e => {
                    keys.push(e.prnid)
                })
                this.$refs.tree.setCheckedKeys(keys, true)
                this.flag = true
            })
        },
        watch: {
            pcondition(v) {
                this.condition = $yid.util.deepClone(v)
            },
            subDesc(v) {
                this.subDescs = $yid.util.deepClone(v)
                let keys = []
                this.subDescs.map(e => {
                    keys.push(e.prnid)
                })
                this.$refs.tree.setCheckedKeys(keys, true)
            }
        },
        methods: {
            submit() {
                for (let i = 0; i < this.subDescs.length; i++) {
                    if ($yid.validate.isEmpty(this.subDescs[i].pvalue)) {
                        $yid.util.error("第" + (i + 1) + "项指标条件值不能为空")
                        return
                    }
                }
                if (this.func instanceof Function)
                    this.func(this.condition, this.subDescs)
                this.flag = false
            },
            handleCheckChange(data, checked) {
                if (checked) {
                    let flag = true
                    for (let i = 0; i < this.subDescs.length; i++) {
                        if (this.subDescs[i].prnid == data.prnid) {
                            flag = false
                            break
                        }
                    }
                    if (flag)
                        this.subDescs.push($yid.util.deepClone(data))
                } else {
                    for (let i = 0; i < this.subDescs.length; i++) {
                        if (this.subDescs[i].prnid == data.prnid) {
                            this.subDescs.splice(i, 1)
                            break
                        }
                    }
                }
            },
            remove(prnid, i) {
                this.subDescs.splice(i, 1)
                this.$refs.tree.setChecked(prnid, false)
            }
        }
    }

</script>