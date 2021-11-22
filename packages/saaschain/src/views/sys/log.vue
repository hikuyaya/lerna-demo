<template>
    <div class="sys-log">
        <el-form :model="model" inline>
            <el-form-item label="选择日期：">
                <el-date-picker
                        placeholder
                        v-model="model.startTime"
                        value-format="yyyy-MM-dd"
                ></el-date-picker>
                <span class="character"></span>
                <el-date-picker  placeholder v-model="model.endTime" value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="操作类型：">
              <el-input clearable placeholder="请输入操作类型" v-model.trim="model.operType" style="width: 180px;"></el-input>
<!--                <el-select clearable filterable placeholder="请选择" style="width: 160px;" v-model.trim="model.operType">-->
<!--                    <template v-if="typeMap.length>0">-->
<!--                        <el-option :key="'type' + item.value" :label="item.text" :value="item.text" v-for="item in typeMap"></el-option>-->
<!--                    </template>-->
<!--                </el-select>-->
            </el-form-item>
            <el-form-item label="用户名：">
                <el-input clearable placeholder="请输入用户名" v-model.trim="model.userName" style="width: 180px;"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="get()">查询</el-button>
            </el-form-item>
        </el-form>
        <yid-table pagination ref="table">
<!--            <el-table-column-->
<!--                    type="selection"-->
<!--                    width="55">-->
<!--            </el-table-column>-->
            <yid-table-column label="操作员" min-width="50" prop="userName"></yid-table-column>
          <yid-table-column label="终端" min-width="50" prop="clientId"></yid-table-column>
          <yid-table-column label="应用" min-width="50" prop="applicationName"></yid-table-column>
            <yid-table-column label="时间" min-width="50" prop="createdTime">
                <template slot-scope="scope">
                    {{$yid.util.formatDate(scope.row.createdTime)}}
                </template>
            </yid-table-column>
            <yid-table-column label="操作类型" min-width="70" prop="operType"></yid-table-column>
            <yid-table-column label="内容" min-width="150" prop="operation"></yid-table-column>
        </yid-table>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    export default {
        name: "log",
        components: {

        },
        data() {
            return {
                model: {
                    startTime: '',
                    endTime: '',
                    operType: '',
                    userName: ''
                },
                typeMap: [
                    {
                        value: 1,
                        text: '登录ip记录'
                    },
                    {
                        value: 2,
                        text: '修改会员卡信息'
                    },
                    {
                        value: 3,
                        text: '修改会员资料'
                    },
                    {
                        value: 4,
                        text: '删除用户'
                    },
                    {
                        value: 5,
                        text: '修改开支记录'
                    },
                    {
                        value: 6,
                        text: '修改营业记录'
                    },
                    {
                        value: 7,
                        text: '其它'
                    }
                ]
            }
        },
        created() {

        },
        mounted() {
            this.get();
        },
        methods: {
            get() {
                const fetch = service.base.log.list
                const params = this.model
                this.$refs.table.reloadData({
                    fetch,
                    params
                });
            }
        }
    }
</script>

<style scoped lang='scss'>

</style>
