<template>
    <div class="sys-index">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>总销售额</span>
                    </div>
                    <div class="item">
                        <div class="static">
                            126,560
                        </div>
                        <div style="height: 80px; overflow:hidden;">
                            <!--              <el-progress :percentage="78" style="margin-top: 30px;"></el-progress>-->
                        </div>
                        <el-divider></el-divider>
                        <div class="bottom">
                            日均销售额 ¥ 12,423
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>今日客数</span>
                    </div>
                    <div class="item">
                        <div class="static">
                            8,846
                        </div>
                        <v-chart :options="line" autoresize style="width: 100%;height: 80px;"/>
                        <el-divider></el-divider>
                        <div class="bottom">
                            月总客数 12,423
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>支付笔数</span>
                    </div>
                    <div class="item">
                        <div class="static">
                            6,560
                        </div>
                        <v-chart :options="bar" autoresize style="width: 100%;height: 80px;"/>
                        <el-divider></el-divider>
                        <div class="bottom">
                            转换率 60%
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>好评率</span>
                    </div>
                    <div class="item">
                        <div class="static">
                            78%
                        </div>
                        <div style="height: 80px; overflow:hidden;">
                            <!--              <el-progress :percentage="78" stroke-width="20" style="margin-top: 30px;"></el-progress>-->
                        </div>
                        <el-divider></el-divider>
                        <div class="bottom">
                            转换率 60%
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <hr/>

        <el-row :gutter="20">
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>快捷菜单</span>
                    </div>
                    <div class="menu">
                        <div class="box">
                            <i class="el-icon-message"></i>
                            <span>最新消息</span>
                        </div>
                        <div class="box">
                            <i class="el-icon-trophy"></i>
                            <span>生日会员</span>
                        </div>
                        <div class="box">
                            <i class="el-icon-partly-cloudy"></i>
                            <span>库存预警</span>
                        </div>
                    </div>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span>系统公告</span>
                    </div>
                    <div v-for="item in sysMessages" :key="item" class="text item">
                        {{item.title}}
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import yid from '@src/library'
    import Vue from 'vue'
    import VueClipboard from 'vue-clipboard2'
    import service from "../../service";

    Vue.use(VueClipboard)

    import ECharts from 'vue-echarts';

    import 'echarts/lib/chart/bar';
    import 'echarts/lib/component/polar';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/chart/line';

    Vue.component('v-chart', ECharts);
    export default {
        data() {
            return {
                sysMessages: [],
                bar: {
                    color: ['#00c6ae', '#2f4554', '#61a0a8'],
                    xAxis: {
                        type: 'category',
                        show: false
                    },
                    yAxis: {
                        type: 'value',
                        show: false
                    },
                    series: [{
                        data: [120, 200, 150, 80, 70, 110, 150, 80, 130],
                        type: 'bar',
                        itemStyle: {
                            normal: {
                                //这里是重点
                                // color: function(params) {
                                //   //注意，如果颜色太少的话，后面颜色不会自动循环，最好多定义几个颜色
                                //   var colorList = ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83', '#ca8622'];
                                //   return colorList[params.dataIndex]
                                // }
                            }
                        }
                    }]
                },
                line: {
                    color: ['#00c6ae', '#2f4554', '#61a0a8'],
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                        show: false
                    },
                    yAxis: {
                        type: 'value',
                        show: false
                    },
                    series: [{
                        data: [820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320, 820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        areaStyle: {}
                    }]
                }
            }
        },

        created() {

        },

        mounted() {
            this.get()
        },

        methods: {
            get() {

                let parm = {page: 1, limit: 10}
                yid.service.index.getAdminMsg(parm).then(res => {
                    this.sysMessages = res.data;
                    console.log(res)
                })


            },

        }
    }
</script>

<style lang="scss" scoped>
    .sys-index {
        /deep/ .el-divider--horizontal {
            margin: 0;
        }

        .box-card {
            .item {
                .static {
                    font-size: 25px;
                    line-height: 27px;
                }

                .bottom {
                    height: 30px;
                    line-height: 30px;
                    margin-top: 10px;
                }
            }

            .menu {
                display: flex;
                flex-wrap: wrap;

                .box {
                    width: 80px;
                    height: 90px;
                    border: 1px solid #999;
                    color: #999;
                    margin-right: 20px;
                    border-radius: 4px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;

                    i {
                        font-size: 40px;
                        margin-bottom: 10px;
                    }
                }
            }
        }
    }
</style>
