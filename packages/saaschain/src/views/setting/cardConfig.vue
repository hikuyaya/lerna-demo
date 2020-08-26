<template>
    <div>
        <el-collapse-transition>
            <div v-show="showList">
                <el-button @click="showCardSystemSettingPage" type="primary">新增</el-button>
            </div>
        </el-collapse-transition>

        <el-collapse-transition>
            <div v-show="showCardSystemSetting">
                <CardSystemSetting ref="cardSystemSetting" @onClose="closeCardSystemSettingPage"/>
            </div>
        </el-collapse-transition>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    import CardSystemSetting from  "./components/cardSystemSetting"
    export default {
        name: "cardconfig",
        components:{
            CardSystemSetting
        },
        data(){
            return{
                showList:true,
                showCardSystemSetting:false
            }
        },
        methods:{
            closeCardSystemSettingPage(){
                this.showCardSystemSetting = false
                this.showList = true
            },
            showCardSystemSettingPage(){
                this.showCardSystemSetting = true
                this.showList = false
                this.$refs.cardSystemSetting.initData();
            },
        }

    }
</script>

<style scoped lang="scss">

</style>