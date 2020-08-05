<template>
    <div>
        <el-row style="max-height: 330px; overflow-y: scroll; margin-top: 10px">
            <el-tree
                    :data="pays"
                    show-checkbox
                    default-expand-all
                    node-key="payid"
                    ref="tree"
                    :default-checked-keys="defaultCheckedKeys"
                    highlight-current
                    :props="{id:'payid',label:'payname'}">
            </el-tree>
        </el-row>
        <el-row style="text-align: center; margin-top:15px ">
            <el-button type="primary" @click="submit">确定</el-button>
        </el-row>
    </div>
</template>

<script>

    import service from '@src/service'

    export default {
        name: "panelPay",
        props:['defaultCheckedKeys','func'],
        data: function () {
            return {
                pays:[]
            }
        },
        watch:{
            defaultCheckedKeys(v){
                this.$refs.tree.setCheckedKeys(v,true)
            }
        },
        mounted(){
            service.payType.payTypeList().then(res => {
                this.pays = res.data
            })
        },
        methods:{
            submit(){
                if(this.func instanceof Function)
                    this.func(this.$refs.tree.getCheckedNodes())
            },
        }
    }

</script>