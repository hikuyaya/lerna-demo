<template>
    <div>
        <el-select style="width: 100px" v-model="cData" clearable placeholder="请选择" change="changeHandle">
            <el-option
                    v-for="item in faList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.code">
            </el-option>
        </el-select>
    </div>
</template>

<script>

    import service from '@src/service'

    export default {
        name:"faSelect",
        props: ["fa"],
        data(){
            return {
                faList:[],
                cData:"",
            }
        },
        mounted() {
            this.getDicFaList();
        },
        computed:{

        },
        watch:{
            cData(v){
                const filter = this.faList.filter(f=>f.code==v);
                this.$emit('update:fa',filter.length>0?filter[0]:{});
            }
        },
        methods: {
            getDicFaList(){
                service.finance.dicFinancialArea.financeAreaAll({"isDel":"0","status":"1"}).then(res => {
                    if (res.resp_code == 200)
                        this.faList = res.data;
                });
            },
            changeHandle(v){
                console.log(v);
            }
        },
    }

</script>

<style scoped lang="scss">

</style>