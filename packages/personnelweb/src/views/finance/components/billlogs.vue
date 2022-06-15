<template>
    <div class="billlogs" v-if="logDialog.visible">
        <el-dialog
                v-if = 'logDialog.visible'
                :title="logDialog.title"
                :visible.sync="logDialog.visible"
                width="600px"
                center :close-on-click-modal ='false'>
            <yid-table :data="billlogs" height="600">
                <yid-table-column label="修改时间" min-width="140" prop="updatedTime"></yid-table-column>
                <yid-table-column label="修改人" min-width="100" prop="updatedBy"></yid-table-column>
                <yid-table-column label="操作内容" min-width="120"  prop="updatedInfo"></yid-table-column>
                <yid-table-column label="状态变更" min-width="100" prop="statusName"></yid-table-column>
            </yid-table>
        </el-dialog>
    </div>
</template>
<script>
    import yid from '@src/library'
    export default {
        name: "billlogs",
        data() {
            return {
                logDialog: {
                    title: '变更记录',
                    visible: false,
                },
                billlogs:[]
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>