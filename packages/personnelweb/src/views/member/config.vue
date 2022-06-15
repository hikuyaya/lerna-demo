<template>
    <div class="member-config">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="会员状态" name="memberStatus">
                <yid-table pagination ref="table" style="margin-top: 15px;">
                    <yid-table-column label="状态编码" min-width="100" prop="operator"></yid-table-column>
                    <yid-table-column label="状态名称" min-width="150" prop="time"></yid-table-column>
                    <yid-table-column label="未来店（天数）" min-width="70" prop="type"></yid-table-column>
                    <yid-table-column label="操作" min-width="150" prop="content"></yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="会员等级" name="memberLevel">
                <el-form inline>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="get" type="primary">添加会员等级</el-button>
                    </el-form-item>
                </el-form>
                <yid-table pagination ref="table" style="margin-top: 15px;">
                    <yid-table-column label="等级名称" min-width="100" prop="operator"></yid-table-column>
                    <yid-table-column label="等级图片" min-width="150" prop="time"></yid-table-column>
                    <yid-table-column label="近一年消费金额≥（元）" min-width="70" prop="type"></yid-table-column>
                    <yid-table-column label="操作" min-width="150" prop="content"></yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    export default {
        name: "config",
        data() {
            return {
                activeName : 'memberStatus'
            }
        }
    }
</script>

<style scoped>
    .member-config {

    }
</style>
