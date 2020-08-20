<template>

    <div class="member-relation">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="服务项目" name="servInfo">
                <serveConfig/>
            </el-tab-pane>
            <el-tab-pane label="门店项目价格设置" name="shopServ">
                <servShopConfig/>
            </el-tab-pane>
            <el-tab-pane label="门店项目价格查看" name="shopLookServ">
                <projectPriceSearch/>
            </el-tab-pane>
            <el-tab-pane label="员工价格设置" name="empServ">
                <empServConfing/>
            </el-tab-pane>
        </el-tabs>
    </div>

</template>

<script>
    import serveConfig from './serveConfig.vue'
    import empServConfing from './empServConfig.vue'
    import projectPriceSearch from './components/projectPriceSearch.vue'
    import servShopConfig from './servShopConfig.vue'

    export default {
        data() {
            return {
                activeName: 'servInfo',
            }
        },
        methods: {
            handleClick(tab) {
                if (tab.name == 'servInfo') {
                    //this.search();
                } else if (tab.name == 'shopServ') {
                    //this.getjobList();
                } else if (tab.name == 'empServ') {
                    //ServiceLog.methods.searchLog()
                }
            }
        },
        components: {
            serveConfig,
            empServConfing,
            projectPriceSearch,
            servShopConfig
        }
    }
</script>
<style scoped>
</style>
