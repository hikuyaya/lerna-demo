<template>
    <div>
        <el-form ref="searchForm" inline :model="searchForm">
            <el-form-item label="门店：">
                <el-select clearable v-model.trim="searchForm.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                    <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                        <span style="float: left">{{ item.shopcode }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-button @click="search" type="primary">查询</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import service from '@src/service'
    export default {
        name: "projectPriceSearch",
        data() {
            return {
                searchForm :{
                    shopid:""
                },
                allShopList:[],
                filterShopList:[]
            }
        },
        mounted(){
            this.getShopList({status:"1"});
        },
        methods:{
            getShopList(params){
                service.chain.shop.shopList(params).then(res=> {
                    if(res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                    }
                })
            },
            filterShop(v){
                this.filterShopList = this.allShopList.filter((item) => {
                    // 如果直接包含输入值直接返回true
                    if (item.shopname.indexOf(v) !== -1) return true
                    if (item.shopcode.indexOf(v) !== -1) return true

                })
            }
        }
    }
</script>

<style scoped>

</style>