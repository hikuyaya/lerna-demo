<template>
    <div>
        <div>
            <el-date-picker
                    :clearable = true
                    v-model="dateRange"
                    type="daterange"
                    value-format="yyyy-MM-dd"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期">
            </el-date-picker>
        </div>
    </div>
</template>

<script>
    export default {
        name:"dateRange",
        props: ["srq","erq"],
        data(){
            return {
                dateRange:[],
            }
        },
        mounted() {},
        computed:{},
        watch:{
            dateRange(v){
                if(v){
                    this.$emit('update:srq',v[0]);
                    this.$emit('update:erq',v[1]);
                }else{
                    this.$emit('update:srq',"");
                    this.$emit('update:erq',"");
                }
            },
            srq(v,o){
              if(v==""&&v!=o)
                  this.dateRange=[]
            },
        },
        methods: {},
    }

</script>

<style scoped lang="scss">

</style>