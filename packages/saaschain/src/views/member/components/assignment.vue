<template>
    <div class="assignment">
        <div class="aside">
            <el-select @change="getEeList" v-model="shops" clearable filterable placeholder="请选择门店">
                <el-option
                        v-for="item in shopList"
                        :key="item.id"
                        :label="item.shopname"
                        :value="item.id">
                </el-option>
            </el-select>
            <div class="linkWrap">
                <el-button v-for="(item,key) in sortActionbutton" :key="key" @click="getMemByeeid(item.id)">
                    {{ item.eename + '(' +item.memNum + '位)' }}
                    <i class="el-icon-arrow-right el-icon--right"></i>
                </el-button>
            </div>
        </div>
        <div class="main">
            <el-form ref="searchForm" inline :model="searchForm">
                <el-form-item label="会员查询：">
                    <el-input clearable v-model="searchForm.memnametel" placeholder="姓名/手机号"  style="width: 180px;"></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom:0">
                    <el-button @click="search" type="primary">查询</el-button>
                    <el-button @click="turn" type="primary">会员批量转接</el-button>
                </el-form-item>
            </el-form>

            <yid-table pagination ref="table" style="margin-top: -5px; width: 100%;">
                <yid-table-column label="姓名" min-width="100" prop="memname"></yid-table-column>
                <yid-table-column label="手机号" min-width="150" prop="mobile"></yid-table-column>
                <yid-table-column label="性别" min-width="70" prop="sex">
                    <template slot-scope="scope">
                        {{scope.row.sex == '1' ? "男" : "女"}}
                    </template>
                </yid-table-column>
                <yid-table-column label="门店" min-width="150" prop="shopname"></yid-table-column>
                <yid-table-column label="客单价" min-width="150" prop="univalent"></yid-table-column>
                <yid-table-column label="消费总额" min-width="150" prop="servTotal"></yid-table-column>
                <yid-table-column label="消费次数" min-width="150" prop="servNum"></yid-table-column>
                <yid-table-column label="所属员工" min-width="150" prop="eename"></yid-table-column>
                <yid-table-column label="上次消费时间" min-width="150" prop="latelyTime"></yid-table-column>
                <yid-table-column label="操作" min-width="150" prop="content" fixed="right">
                    <template slot-scope="scope">
                        <el-link type="primary" style="margin: 0 10px 0 10px;" @click="editMem(scope.row)">编辑</el-link>
                    </template>
                </yid-table-column>
            </yid-table>
        </div>

        <yid-dialog :title="turnDialog.title" :visible.sync="turnDialog.visible" @close="" width="400px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="原所属员工：">
                    <el-select @change="findEenum" value-key="id" clearable v-model="turnForm.oldEmployeeObj" filterable placeholder="请选择" style="width: 160px;">
                        <el-option
                                v-for="item in employeeList"
                                :key="item.id"
                                :label="item.eename"
                                :value="item">
                        </el-option>
                    </el-select>
                   <div>会员合计数:{{this.oldNum}}位</div>
                </el-form-item>
                <el-form-item label="现所属员工：">
                    <el-select value-key="id" clearable v-model="turnForm.newEmployeeObj" filterable placeholder="请选择" style="width: 160px;">
                        <el-option
                                v-for="item in employeeList"
                                :key="item.id"
                                :label="item.eename"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="batchEdit" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="editDialog.title" :visible.sync="editDialog.visible" @close="" width="400px">
            <el-form label-width="140px" ref="copyForm">
                <el-form-item label="所属员工：">
                    <el-select value-key="id" clearable v-model="editForm.employeeObj" filterable placeholder="请选择" style="width: 160px;">
                        <el-option
                                v-for="item in employeeList"
                                :key="item.id"
                                :label="item.eename"
                                :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button @click="editEmployee" type="primary">提交</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import service from '@src/service'
    import yid from '@src/library'
    export default {
        name: "assignment",
        data() {
            return {
                turnDialog : {
                    title : "会员批量转接",
                    visible : false
                },
                editDialog : {
                    title : "管理所属会员",
                    visible : false
                },
                searchForm :{
                    memnametel:'',
                    shopid : '',
                    eeid: '',
                },
                pageInfo:{page:1,limit:10},
                employeeList : [],
                shopList : [],
                editForm : {
                    employeeObj : null,
                },
                turnForm : {
                    oldEmployeeObj: null,
                    newEmployeeObj: null,
                },
                shops : '',
                actionbutton: [],
                oldNum :'',
            }
        },
        mounted(){
            this.getCraftsmans();
            this.getShopList();
        },
        computed:{
            sortActionbutton:function() {
                return this.sortBykey(this.actionbutton, 'id')
            }
        },
        methods: {
            getData(reqParams){
                const fetch = service.member.userinfo.relationList
                const params = {...this.pageInfo,...reqParams}
                this.$refs.table.reloadData({
                    fetch,
                    params,
                });
            },
            //获取服务人员列表
            getCraftsmans(){
                service.employee.listAll({isDel:'0',status:'1'}).then(res=> {
                    if(res.resp_code == 200) {
                        this.employeeList = res.data;
                    }
                })
            },
            //获取门店列表
            getShopList(){
                service.shop.shopList().then(res=>{
                   if(res.resp_code == 200){
                        this.shopList = res.data;
                   }
                });
            },
            //通过门店ID查询员工分配个数
            getEeList(){
                if(this.shops != null && this.shops != ''){
                    this.actionbutton = [];
                    //获取未分配员工个数
                    service.member.userinfo.eelistApp({shopid:this.shops}).then(res=> {
                        if(res.resp_code == 200) {
                            let memnum = res.data.unassignedNum;
                            const nzdmem = {eename:"未分配顾客",memNum:memnum,id:'0'};
                            this.actionbutton.push(nzdmem);
                        }
                    });
                    //获取已分配员工个数
                    service.employee.geteeNum({isDel:'0',shopid:this.shops}).then(res=> {
                        if (res.resp_code == 200) {
                            res.data.forEach(item =>{
                                const eenum = {eename:item.eename,memNum:item.memNum,id:item.id};
                                this.actionbutton.push(eenum);
                            })
                        }
                    });
                }
            },
            findEenum(){
                let oldeeid = this.turnForm.oldEmployeeObj.id;
                if(oldeeid != null){
                    service.employee.geteeNum({isDel:'0',shopid:this.shops,id:oldeeid}).then(res=> {
                        if (res.resp_code == 200) {
                                this.oldNum = res.data[0].memNum;
                        }
                    });
                }
            },
            turn() {
                this.turnForm.oldEmployeeObj = null;
                this.turnForm.newEmployeeObj = null;
                this.getCraftsmans();
                this.turnDialog.visible = true;
            },
            editMem(row){
                this.editForm.employeeObj = null;
                this.getCraftsmans();
                this.editForm = row;
                this.editDialog.visible = true;
            },
            search(){
                this.pageInfo.page=1
                this.getData(this.searchForm);
            },
            getMemByeeid(eeid){
                this.pageInfo.page=1
                this.searchForm.eeid = eeid;
                this.getData(this.searchForm);
            },
            editEmployee(){
                if(this.editForm.employeeObj == null){
                    yid.util.alert("请选择员工");
                }
                this.editForm.eeid = this.editForm.employeeObj.id;
                this.editForm.eecode = this.editForm.employeeObj.eecode;
                this.editForm.eename = this.editForm.employeeObj.eename;
                console.log(this.editForm);
                service.member.userinfo.editEmployee(this.editForm).then(res=> {
                    if(res.resp_code == 200) {
                        this.getEeList();
                        this.search();
                        this.editDialog.visible = false;
                    }
                });
            },
            batchEdit(){
                if(this.turnForm.oldEmployeeObj == null){
                    yid.util.alert("请选择原所属员工");
                }
                if(this.turnForm.newEmployeeObj == null){
                    yid.util.alert("请选择现所属员工");
                }
                this.turnForm.oeeid = this.turnForm.oldEmployeeObj.id;
                this.turnForm.oeecode = this.turnForm.oldEmployeeObj.eecode;
                this.turnForm.oeename = this.turnForm.oldEmployeeObj.eename;
                this.turnForm.neeid = this.turnForm.newEmployeeObj.id;
                this.turnForm.neecode = this.turnForm.newEmployeeObj.eecode;
                this.turnForm.neename = this.turnForm.newEmployeeObj.eename;
                service.member.userinfo.batchEdit(this.turnForm).then(res=> {
                    if(res.resp_code == 200) {
                        this.getEeList();
                        this.search();
                        this.turnDialog.visible = false;
                    }
                });
            },
            sortBykey(ary, key) {
                return ary.sort(function (a, b) {
                    let x = a[key]
                    let y = b[key]
                    return ((x < y) ? -1 : (x > y) ? 1 : 0)
                })
            }
        }
    }
</script>

<style scoped lang="scss">
    .assignment {
        display: flex;
        .aside {
            width: 220px;
            .el-select {
                width: 100%;
            }
            .linkWrap {
                width: 100%;
                margin-top: 20px;
                button {
                    width: 100%;
                    display: block;
                    margin-bottom: 20px;
                    margin-left: 0;
                }
            }
        }
        .main {
            margin-left: 30px;
            overflow: auto;
        }
    }
</style>
