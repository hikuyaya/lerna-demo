<template>


    <div>
        <el-form  inline >



            <el-form-item  v-for="col in search" :label="col.label">




                <el-input v-if="col.type =='input' "  clearable  :placeholder="col.placeholder"
                          :style="col.style">

                </el-input>
            </el-form-item>


            <!--<el-form-item label="会员状态：">-->
            <!--<el-select clearable v-model.trim="searchForm.tags" filterable placeholder="请选择" style="width: 160px;">-->
            <!--<el-option :key="item.id" :label="item.mdsname" :value="item.mdscode"-->
            <!--v-for="item in dictStatusList"></el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item style="margin-bottom:0">-->
            <!--<el-button @click="search" type="primary">查询</el-button>-->
            <!--<el-button @click="seniorSearch" type="primary">高级查询</el-button>-->
            <!--<el-button @click="exportUsers" type="primary">导出</el-button>-->
            <!--</el-form-item>-->
        </el-form>
        <yid-table>

            <yid-table-column
                    v-for="col in cols"
                    :prop="col.prop" :label="col.label" :min-width="col.minWith">
                <!--<template slot-scope="scope">-->
                    <!--{{scope.row.sex == '1' ? "男" : "女"}}-->
                <!--</template>-->

            </yid-table-column>


            <!--<yid-table-column label="姓名" min-width="100" prop="memname"></yid-table-column>-->
            <!--<yid-table-column label="手机号" min-width="150" prop="mobile"></yid-table-column>-->
            <!--<yid-table-column label="性别" min-width="70">-->
            <!--<template slot-scope="scope">-->
            <!--{{scope.row.sex == '1' ? "男" : "女"}}-->
            <!--</template>-->
            <!--</yid-table-column>-->
            <!--<yid-table-column label="门店" min-width="150" prop="shopname"></yid-table-column>-->
            <!--<yid-table-column label="总卡金余额" min-width="150" prop="money"></yid-table-column>-->
            <!--<yid-table-column label="客单价" min-width="150" prop="univalent"></yid-table-column>-->
            <!--<yid-table-column label="消费总额" min-width="150" prop="servTotal"></yid-table-column>-->
            <!--<yid-table-column label="消费次数" min-width="150" prop="servNum"></yid-table-column>-->
            <!--<yid-table-column label="消费频次" min-width="150" prop="serviceRate"></yid-table-column>-->
            <!--<yid-table-column label="上次消费时间" min-width="150" prop="latelyTime"></yid-table-column>-->
            <!--<yid-table-column label="上次服务员工" min-width="150" prop="lastEename"></yid-table-column>-->
            <!--<yid-table-column label="会员状态" min-width="150" prop="tags">-->
            <!--<template slot-scope="scope">-->
            <!--{{getStatusName(scope.row)}}-->
            <!--</template>-->
            <!--</yid-table-column>-->
            <!--<yid-table-column label="操作" min-width="100" prop="content" fixed="right">-->
            <!--<template slot-scope="scope">-->
            <!--<el-link type="primary" style="margin: 0 10px 0 10px;" @click="removeMem(scope.row)">移除</el-link>-->
            <!--</template>-->
            <!--</yid-table-column>-->
        </yid-table>
    </div>
</template>

<script>
    import yid from '@src/library'
    import {error} from "../../library/helper/util";
    import service from "../../service";







    var getChildrenTextContent = function (children) {
        return children.map(function (node) {
            return node.children
                ? getChildrenTextContent(node.children)
                : node.text
        }).join('')
    }


    export default {
        data() {
            return {

                cols: [{label: "aa", minWith: 30,prop:"aa"}],
                search:[{label:"会员姓名:",type:"input",placeholder:"姓名",style:"width: 160px;"}

                ]
            }
        },
        created() {
        },
        mounted() {
        },
        // render(h) {
        //     return h('div', [
        //
        //         h('el-form', {
        //                 props: {
        //                     ref: 'searchForm',
        //                     model: "searchForm"
        //                 }
        //             }, Array.apply(null, {length: 20}).map(function () {
        //                 return h('el-form-item', {
        //                     props: {
        //                         label: "会员查询"
        //
        //                     }
        //                 }, [h('el-input')])
        //             })
        //         )
        //
        //     ]);
        //
        // },

        methods: {},

        validateForm() {

        }
    }
</script>
