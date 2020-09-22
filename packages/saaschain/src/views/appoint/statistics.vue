<template>


    <div class="statistics">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="门店" name="store">
                <el-form inline ref="model" :model="model">
                    <el-form-item label="统计时间：">
                        <el-date-picker
                                placeholder
                                v-model="model.createdTime1"
                                value-format="yyyy-MM-dd"
                        ></el-date-picker>
                        <span class="character"></span>
                        <el-date-picker placeholder v-model="model.createdTime2"
                                        value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="预约渠道：">
                        <el-select clearable filterable placeholder="请选择" style="width: 160px;" v-model="model.yccode">
                            <el-option
                                    v-for="item in channel"
                                    :key="item.id"
                                    :label="item.ycname"
                                    :value="item.yccode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <br/>
                    <el-form-item label="门店：">

                        <el-select clearable v-model.trim="model.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="getStatisShopList" type="primary">查询</el-button>
                        <el-button @click="excel" type="primary">导出</el-button>
                    </el-form-item>
                </el-form>
                <!-- <el-divider/>-->
                <yid-table ref="table" style="margin-top: 15px;" :data="dataList" :summary-method="getSummaries"
                           show-summary>
                    <yid-table-column label="门店编码" min-width="100" prop="shopcode"></yid-table-column>
                    <yid-table-column label="门店名称" min-width="150" prop="shopname"></yid-table-column>
                    <yid-table-column label="预约渠道" min-width="70" prop="ycname"></yid-table-column>
                    <yid-table-column label="预约次数" min-width="150" prop="yyNum"></yid-table-column>
                    <yid-table-column label="到店次数" min-width="150" prop="doneNum"></yid-table-column>
                    <yid-table-column label="服务客次" min-width="150" prop="serviceNum"></yid-table-column>
                    <yid-table-column label="到店率" min-width="150" prop="doneRate">
                        <template slot-scope="scope">
                            {{scope.row.doneRate*100}}%
                        </template>

                    </yid-table-column>
                    <yid-table-column label="爽约率" min-width="150" prop="missRate">
                        <template slot-scope="scope">
                            {{scope.row.missRate*100}}%
                        </template>
                    </yid-table-column>

                    <yid-table-column label="预约率" min-width="150" prop="yyRate">
                        <template slot-scope="scope">
                            {{scope.row.yyRate*100}}%
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
            <el-tab-pane label="员工" name="staff">
                <el-form inline ref="model2" :model="model2">
                    <el-form-item label="统计时间：">
                        <el-date-picker
                                placeholder
                                v-model="model2.createdTime1"
                                value-format="yyyy-MM-dd"
                        ></el-date-picker>
                        <span class="character"></span>
                        <el-date-picker placeholder v-model="model2.createdTime2"
                                        value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="预约渠道：">
                        <el-select clearable filterable placeholder="请选择" style="width: 160px;" v-model="model2.yccode">
                            <el-option
                                    v-for="item in channel"
                                    :key="item.id"
                                    :label="item.ycname"
                                    :value="item.yccode">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <br/>
                    <el-form-item label="门店：">

                        <el-select clearable v-model.trim="model2.shopid"  filterable :filter-method="filterShop" placeholder="请选择门店" style="width: 160px;">
                            <el-option :key="item.id" :label="item.shopname" :value="item.id" v-for="item in filterShopList">
                                <span style="float: left">{{ item.shopcode }}</span>
                                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.shopname }}</span>
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="margin-bottom:0">
                        <el-button @click="getStatisEmployeeList" type="primary">查询</el-button>
                        <el-button @click="excel2" type="primary">导出</el-button>
                    </el-form-item>
                </el-form>
                <!--                <el-divider/>-->
                <yid-table ref="table" style="margin-top: 15px;" :data="dataList2" :summary-method="getSummaries"
                           show-summary>
                    <yid-table-column label="员工编码" min-width="100" prop="eecode"></yid-table-column>
                    <yid-table-column label="员工姓名" min-width="150" prop="eename"></yid-table-column>
                    <yid-table-column label="预约渠道" min-width="70" prop="ycname"></yid-table-column>
                    <yid-table-column label="预约次数" min-width="150" prop="yyNum"></yid-table-column>
                    <yid-table-column label="到店次数" min-width="150" prop="doneNum"></yid-table-column>
                    <yid-table-column label="服务客次" min-width="150" prop="serviceNum"></yid-table-column>
                    <yid-table-column label="到店率" min-width="150" prop="doneRate">
                        <template slot-scope="scope">
                            {{scope.row.doneRate*100}}%
                        </template>

                    </yid-table-column>
                    <yid-table-column label="爽约率" min-width="150" prop="missRate">
                        <template slot-scope="scope">
                            {{scope.row.missRate*100}}%
                        </template>
                    </yid-table-column>

                    <yid-table-column label="预约率" min-width="150" prop="yyRate">
                        <template slot-scope="scope">
                            {{scope.row.yyRate*100}}%
                        </template>
                    </yid-table-column>
                </yid-table>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    import download from '@src/library/http/download'

    import DyTable from '../components/Table'

    export default {
        name: "statistics",
        components:{DyTable:DyTable},
        data() {
            return {
                activeName: 'store',
                model: {
                    createdTime1: '2020-06-01',
                    createdTime2: '2020-06-03',
                    yccode: '',
                    shopid:""


                },
                model2: {
                    createdTime1: '2020-06-01',
                    createdTime2: '2020-06-03',
                    yccode: '',
                    shopid:""


                },
                channel: [],
                dataList: [],
                dataList2: [],
                allShopList:[],
                filterShopList:[],
            }
        },
        mounted() {

            this.initChannel();
            this.getShopList({status:"1"});

        },
        methods: {
            excel() {
                this.$refs['model'].validate((valid) => {
                        if (valid) {

                            if (this.model.createdTime1 == '' && this.model.createdTime1.length == 0) {
                                yid.util.alert("开始时间不能为空");
                                return false;
                            }
                            if (this.model.createdTime2 == '' && this.model.createdTime2.length == 0) {
                                yid.util.alert("结束时间时间不能为空");
                                return false;
                            }
                            download($yid.config.API.BASE + '/api-yy/statisshop/list/excel', this.model)

                        }
                    }
                )
            },
            excel2() {
                this.$refs['model'].validate((valid) => {
                        if (valid) {



                            if (this.model.createdTime1 == '' && this.model.createdTime1.length == 0) {
                                yid.util.alert("开始时间不能为空");
                                return false;
                            }
                            if (this.model.createdTime2 == '' && this.model.createdTime2.length == 0) {
                                yid.util.alert("结束时间时间不能为空");
                                return false;
                            }
                            download($yid.config.API.BASE + '/api-yy/statisemployee/list/excel', this.model)

                        }
                    }
                )
            },
            initChannel() {


                service.yy.statis.channelList().then(res => {
                    if (res.resp_code == 200) {
                        // yid.util.alert("保存成功")


                        this.channel = res.data;

                    }
                })
            },
            getStatisShopList() {
                this.$refs['model'].validate((valid) => {
                    if (valid) {

                        if (this.model.createdTime1 == '' && this.model.createdTime1.length == 0) {
                            yid.util.alert("开始时间不能为空");
                            return false;
                        }
                        if (this.model.createdTime2 == '' && this.model.createdTime2.length == 0) {
                            yid.util.alert("结束时间时间不能为空");
                            return false;
                        }

                        //保存规则设置
                        service.yy.statis.statisShopList(this.model).then(res => {
                            if (res.resp_code == 200) {
                                // yid.util.alert("保存成功")
                                this.dataList = res.data;

                            } else {
                                this.$message({
                                    message: res.resp_msg,
                                    type: 'warning'
                                });
                            }
                        })
                    }
                })


            },
            getStatisEmployeeList() {
                this.$refs['model2'].validate((valid) => {
                    if (valid) {


                        if (this.model2.createdTime1 == '' && this.model2.createdTime1.length == 0) {
                            yid.util.alert("开始时间不能为空");
                            return false;
                        }
                        if (this.model2.createdTime2 == '' && this.model2.createdTime2.length == 0) {
                            yid.util.alert("结束时间时间不能为空");
                            return false;
                        }

                        //保存规则设置
                        service.yy.statis.statisEeployeeList(this.model2).then(res => {
                            if (res.resp_code == 200) {
                                // yid.util.alert("保存成功")
                                this.dataList2 = res.data;

                            } else {
                                this.$message({
                                    message: res.resp_msg,
                                    type: 'warning'
                                });
                            }
                        })
                    }
                })


            },
            getSummaries(param) {
                const {columns, data} = param;
                const sums = [];
                columns.forEach((column, index) => {
                    if (index === 0) {
                        sums[index] = '合计';
                        return;
                    }


                    const values = data.map(item => Number(item[column.property]));
                    if (!values.every(value => isNaN(value))) {
                        sums[index] = values.reduce((prev, curr) => {
                            const value = Number(curr);
                            if (!isNaN(value)) {
                                return prev + curr;
                            } else {
                                return prev;
                            }
                        }, 0);


                        if (index >= 6) {
                            var a = sums[index] / data.length;

                            a = new Number(a * 100).toFixed(2);
                            a += '%';
                            sums[index] = a;
                        }
                    } else {
                        sums[index] = '';
                    }
                });

                return sums;

            },
            getStatisEeployeeList() {

            },
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

<style scoped lang="scss">
    .statistics {

    }
</style>
