<template>
    <div class="checkClass">
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
                <el-button @click="seachRecords" type="primary">查询</el-button>
            </el-form-item>
        </el-form>
        <el-button @click="addCheckClass" type="primary">新增</el-button>
        <yid-table pagination ref="checkClassTable" style="margin-top: 15px;" :row-class-name="$yid.util.getPersCheckClass">
            <yid-table-column label="编码" min-width="80" prop="ccode"></yid-table-column>
            <yid-table-column label="班次名称" min-width="100" prop="cname"></yid-table-column>
            <yid-table-column label="班次时间" min-width="120" prop="time"></yid-table-column>
            <yid-table-column label="班次代表颜色" min-width="100" prop="color">
                <template slot-scope="scope">
                    <div :style="[{'background': getbgcolor(scope.row.color),'width':'20px','height':'20px'}]"></div>
                </template>
            </yid-table-column>
            <yid-table-column label="状态" min-width="70" prop="status">
                <template slot-scope="scope">
                    <el-switch v-model="scope.row.status" active-value="1" inactive-value="2" active-color="#339933" inactive-color="#DCDFE6" @change="updateStatus(scope.row)">
                    </el-switch>
                </template>
            </yid-table-column>
            <yid-table-column label="操作" min-width="100" prop="content">
                <template slot-scope="scope">
                    <el-link type="primary" @click="editCheckClass(scope.row)">编辑</el-link>
                </template>
            </yid-table-column>
        </yid-table>
        <yid-dialog :title="checkClassDialog.title" :visible.sync="checkClassDialog.visible" width="500px">
            <el-form ref="checkClassForm" :model="checkClassForm"  label-width="160px" >
                <el-form-item label="班次名称：" prop="cname" :rules="[{ required: true, message: '班次名称为空'}]">
                    <el-input v-model="checkClassForm.cname" style="width: 250px"></el-input>
                </el-form-item>
                <el-form-item label="上班时段：">
                    <el-time-select
                            :clearable = true
                            @change="setAstime"
                            style="width: 120px"
                            v-model="checkClassForm.stime"
                            :picker-options="{
                                start: '00:00',
                                step: '00:01',
                                end: '23:59'
                             }"
                            format='HH:mm'
                            value-format="HH:mm"
                            placeholder="开始时间">
                    </el-time-select>~
                    <el-time-select
                            :clearable = true
                            @change="setPetime"
                            style="width: 120px"
                            v-model="checkClassForm.etime"
                            :picker-options="{
                                start: '00:00',
                                step: '00:01',
                                end: '23:59'
                             }"
                            format='HH:mm'
                            value-format="HH:mm"
                            placeholder="结束时间">
                    </el-time-select>
                </el-form-item>
                <br/>
                <el-form-item label="上午上班时间：">
                    <el-time-select
                            :clearable = true
                            :disabled="true"
                            style="width: 120px"
                            v-model="checkClassForm.astime"
                            :picker-options="{
                                start: '00:00',
                                step: '00:01',
                                end: '23:59'
                             }"
                            format='HH:mm'
                            value-format="HH:mm"
                            placeholder="开始时间">
                    </el-time-select>~
                    <el-time-select
                            :clearable = true
                            style="width: 120px"
                            v-model="checkClassForm.aetime"
                            :picker-options="{
                                start: '00:00',
                                step: '00:01',
                                end: '23:59'
                             }"
                            format='HH:mm'
                            value-format="HH:mm"
                            placeholder="结束时间">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="下午上班时间：">
                    <el-time-select
                            :clearable = true
                            style="width: 120px"
                            v-model="checkClassForm.pstime"
                            :picker-options="{
                                start: '00:00',
                                step: '00:01',
                                end: '23:59'
                             }"
                            format='HH:mm'
                            value-format="HH:mm"
                            placeholder="开始时间">
                    </el-time-select>~
                    <el-time-select
                            :clearable = true
                            :disabled="true"
                            style="width: 120px"
                            v-model="checkClassForm.petime"
                            :picker-options="{
                                start: '00:00',
                                step: '00:01',
                                end: '23:59'
                             }"
                            format='HH:mm'
                            value-format="HH:mm"
                            placeholder="结束时间">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="班次代表颜色：" prop="color" :rules="[{ required: true, message: '班次代表颜色为空'}]">
                    <div :style="[{'background': getbgcolor(this.checkClassForm.color),'width':'20px','height':'20px'}]"></div>
                    <el-radio-group v-model="checkClassForm.color" @change="changeColor">
                        <el-radio label="1#ff0000"><div style="background-color: #ff0000;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="2#cb3939"><div style="background-color: #cb3939;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="3#00b6ff"><div style="background-color: #00b6ff;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="4#3373f3"><div style="background-color: #3373f3;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="5#be00ee"><div style="background-color: #be00ee;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="6#65007e"><div style="background-color: #65007e;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="7#2407ff"><div style="background-color: #2407ff;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="8#0c0064"><div style="background-color: #0c0064;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="9#07f6ff"><div style="background-color: #07f6ff;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="10#008a8f"><div style="background-color: #008a8f;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="11#07ff4d"><div style="background-color: #07ff4d;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="12#008425"><div style="background-color: #008425;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="13#abf007"><div style="background-color: #abf007;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="14#618900"><div style="background-color: #618900;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="15#ffde00"><div style="background-color: #ffde00;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="16#b29b00"><div style="background-color: #b29b00;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="17#ff4e00"><div style="background-color: #ff4e00;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="18#812700"><div style="background-color: #812700;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="19#ff5353"><div style="background-color: #ff5353;width: 20px;height: 20px"/></el-radio>
                        <el-radio label="20#ff1e00"><div style="background-color: #ff1e00;width: 20px;height: 20px"/></el-radio>
                    </el-radio-group>
                </el-form-item>
                备注：班次代表颜色主要应用在“员工排班表”里
                <el-form-item>
                    <el-button @click="saveCheckClass" type="primary">保存</el-button>
                    <el-button @click="cancleCheckClass">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    import {isEmpty} from "../../library/helper/validate";
    export default {
        name: "checkClass",
        data() {
            return {
                checkClassDialog : {
                    title : '',
                    visible : false,
                },
                checkClassForm : {
                    cname : '',
                    stime : '',
                    etime : '',
                    astime : '',
                    aetime : '',
                    pstime : '',
                    petime : '',
                    color : '',

                },
                searchForm : {
                    shopid : '',
                },
                allShopList:[],
                filterShopList:[],
                pageInfo:{page:1,limit:10},
            }
        },
        mounted(){
            this.getcheckClassList();
            this.getShopList({status:"0"});
        },
        methods : {
            getcheckClassList(){
                const fetch = service.pers.checkClass.checkClassList
                const params = this.pageInfo
                params.shopid=this.searchForm.shopid
                this.$refs.checkClassTable.reloadData({
                    fetch,
                    params
                });
            },
            setAstime(){
                this.checkClassForm.astime = this.checkClassForm.stime;
            },
            setPetime(){
                this.checkClassForm.petime = this.checkClassForm.etime;
            },
            addCheckClass(){
                this.checkClassDialog.title = '新增班次';
                this.checkClassDialog.visible = true;
                this.checkClassForm.id = '';
                //this.$refs['checkClassForm'].resetFields();
                this.checkClassForm.cname = '';
                this.checkClassForm.stime = '';
                this.checkClassForm.etime = '';
                this.checkClassForm.astime = '';
                this.checkClassForm.aetime = '';
                this.checkClassForm.pstime = '';
                this.checkClassForm.petime = '';
                //自动分配颜色
                //获取最大的颜色标记
                service.pers.checkClass.getMaxColor({}).then(res=>{
                    if(res.resp_code == 200) {
                        this.checkClassForm.color = String(res.data);
                    }else{
                        this.checkClassForm.color = '';
                    }
                })
            },
            editCheckClass(row){
                if(row.ccode == '0001' || row.ccode == '0002'){
                    yid.util.info("休息和学习班次不允许编辑");
                    return false;
                }
                this.checkClassDialog.title = '编辑班次';
                this.checkClassDialog.visible = true;
                this.checkClassForm.id = row.id;
                this.checkClassForm.cname = row.cname;
                this.checkClassForm.stime = row.stime;
                this.checkClassForm.etime = row.etime;
                this.checkClassForm.astime = row.astime;
                this.checkClassForm.aetime = row.aetime;
                this.checkClassForm.pstime = row.pstime;
                this.checkClassForm.petime = row.petime;
                this.checkClassForm.color = row.color;
                this.checkClassForm.status = row.status;
            },
            saveCheckClass(){
                this.$refs['checkClassForm'].validate((valid) => {
                    if(valid){
                        console.log(this.checkClassForm);
                        if(this.checkClassForm.status == null || this.checkClassForm.status.length == 0){
                            this.checkClassForm.status = '1';
                        }
                        if(this.checkClassForm.stime == null || this.checkClassForm.stime.length == 0 || this.checkClassForm.etime == null || this.checkClassForm.etime.length == 0){
                            yid.util.info("请选择上班时间");
                            return false;
                        }
                        if(this.checkClassForm.astime == null || this.checkClassForm.astime.length == 0 || this.checkClassForm.aetime == null || this.checkClassForm.aetime.length == 0){
                            yid.util.info("请选择上午上班时间");
                            return false;
                        }
                        if(this.checkClassForm.pstime == null || this.checkClassForm.pstime.length == 0 || this.checkClassForm.petime == null || this.checkClassForm.petime.length == 0){
                            yid.util.info("请选择下午上班时间");
                            return false;
                        }

                        if(this.checkClassForm.aetime > this.checkClassForm.pstime){
                            yid.util.info("下午上班开始时间不得早于上午上班结束时间");
                            return false;
                        }
                        //判断颜色是否已经存在，如果存在给出提示
                        service.pers.checkClass.getColorList({id:this.checkClassForm.id,color:String(this.checkClassForm.color)}).then(res=> {
                            if(res.resp_code == 200) {
                                if(res.data.length > 0){
                                    yid.util.confirm('您所选颜色已被班次['+res.data[0].cname+']使用，是否重复使用', '','', ()=> {
                                        service.pers.checkClass.saveCheckClass(this.checkClassForm).then(res=> {
                                            if(res.resp_code == 200) {
                                                yid.util.success("保存成功");
                                            }else{
                                                yid.util.error(res.resp_msg)
                                            }
                                            this.getcheckClassList();
                                        })
                                        this.cancleCheckClass();
                                    })
                                }else{
                                    service.pers.checkClass.saveCheckClass(this.checkClassForm).then(res=> {
                                        if(res.resp_code == 200) {
                                            yid.util.success("保存成功");
                                        }else{
                                            yid.util.error(res.resp_msg)
                                        }
                                        this.getcheckClassList();
                                    })
                                    this.cancleCheckClass();
                                }
                            }else{
                                return;
                            }
                        })
                    }
                })
            },
            cancleCheckClass(){
                this.checkClassDialog.visible = false;
            },
            changeColor(){
                let color = this.checkClassForm.color;
                console.log(color);
            },
            updateStatus(row){
                if(row.ccode == '0001'){
                    yid.util.info("休息班次不允许更改状态");
                    this.getcheckClassList();
                    return false;
                }
                const checkClass = {};
                checkClass.id = row.id;
                checkClass.ccode = row.ccode;
                checkClass.status = row.status;
                service.pers.checkClass.saveCheckClass(checkClass).then(res=>{
                    if(res.resp_code == 200) {
                        this.getcheckClassList();
                    }else{
                        yid.util.error(res.resp_msg);
                        this.getcheckClassList();
                    }
                })
            },
            getbgcolor(color){
                if(!isEmpty(color)){
                    var wz = color.indexOf("#");
                    color = color.substr(wz,color.length-1);
                }else{
                    return '';
                }
                return color;
            },
            getShopList(params){
                service.chain.shop.shopList(params).then(res=> {
                    if(res.resp_code == 200) {
                        this.filterShopList = res.data;
                        this.allShopList = Object.assign(this.filterShopList);//保留原数据
                    }
                })
            },
            seachRecords(){
              this.getcheckClassList();

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