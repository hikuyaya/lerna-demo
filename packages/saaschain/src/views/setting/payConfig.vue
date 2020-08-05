<template>
    <div class="dept">
        <el-form inline>
            <el-form-item label="">
                <el-button type="primary" @click="add()">新增自定义支付</el-button>
            </el-form-item>
        </el-form>

        <yid-table ref="table" :data="payDatas">
            <yid-table-column label="支付方式编码" min-width="60" prop="paycode"></yid-table-column>
            <yid-table-column label="支付方式名称" min-width="90" prop="payname"></yid-table-column>
            <yid-table-column label="支付类型" min-width="60" prop="ptname"></yid-table-column>
            <yid-table-column label="扣手续费率（%）" min-width="100" prop="freeRate"></yid-table-column>
            <yid-table-column label="业绩比率（%）" min-width="100" prop="yjRate"></yid-table-column>
            <yid-table-column label="操作" min-width="110" prop="content">
                <template slot-scope="scope">
                    <el-link type="primary" @click="edit(scope.row)">编辑</el-link>
                </template>
            </yid-table-column>
            <yid-table-column label="状态" min-width="110" prop="enable">
                <template slot-scope="scope">
                    <el-switch
                            @change="stop(scope.row)"
                            v-model="scope.row.enable=='1'?true:false"
                            active-color="#13ce66"
                            inactive-color="#ff4949">
                    </el-switch>
                </template>
            </yid-table-column>
        </yid-table>

        <yid-dialog :title="addDialog.title" :visible.sync="addDialog.visible" @close="closeDialog()" width="800px">
            <el-form :model="addDialog" :rules="payRules" label-width="150px" ref="addForm">
                <el-form-item label="支付名称：" prop="payname">
                    <el-input placeholder="支付名称" v-model="addDialog.payname"/><br/>
                </el-form-item>
                <el-form-item label="支付类型：" prop="ptid">
                    <el-select v-model="addDialog.ptid">
                        <el-option v-for="item in ptlist" :key="item.id" :value="item.id" :label="item.ptname"></el-option>
                    </el-select>
                    <br/>
                </el-form-item>
                <el-form-item label="自定义字段：" prop="memoname">
                    <el-input placeholder="自定义字段" v-model="addDialog.memoname"/><br/>
                </el-form-item>
                <el-form-item label="费率（%）：" prop="freeRate">
                    <el-input type="number" min="0" max="100" placeholder="费率" v-model="addDialog.freeRate"/><br/>
                </el-form-item>
                <el-form-item label="业绩比率（%）：" prop="yjRate">
                    <el-input type="number" min="0" max="100" placeholder="业绩比率"  v-model="addDialog.yjRate"/><br/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="save()">保存</el-button>
                    <el-button @click="closeDialog()">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

        <yid-dialog :title="editDialog.title" :visible.sync="editDialog.visible" @close="closeDialog()" width="800px">
            <el-form :model="editDialog" :rules="payRules"  label-width="150px" ref="eidtForm">
                <el-form-item label="支付名称：" prop="payname">
                    <label> {{editDialog.payname}}</label><br/>
                </el-form-item>
                <el-form-item label="支付类型：" prop="ptname">
                    <label> {{editDialog.ptname}}</label><br/>
                </el-form-item>
                <!--<el-form-item label="自定义字段：" prop="memoname">-->
                    <!--<el-input placeholder="自定义字段" v-model="editDialog.memoname"/><br/>-->
                <!--</el-form-item>-->
                <el-form-item label="费率（%）：" prop="freeRate">
                    <el-input type="number" min="0" placeholder="费率" v-model="editDialog.freeRate"/><br/>
                </el-form-item>
                <el-form-item label="业绩比率（%）：" prop="yjRate">
                    <el-input type="number" min="0"  placeholder="业绩比率"  v-model="editDialog.yjRate"/><br/>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="update()">保存</el-button>
                    <el-button @click="closeDialog()">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>

    </div>
</template>

<script>
    import service from '@src/service'

    function copyObj(obj,bean) {
        if(!obj || !bean){
            return
        }
        for(let v in bean){
            if(obj[v]){
                bean[v]=obj[v]
            }
        }
    }

    function cleanObj(obj) {
        if(!obj){
            return
        }
        Object.keys(obj).forEach(key =>{
            if(key != "title"){
                obj[key]=''
            }
        });
    }

    export default {
        name: "cardconfig",
        data(){
            var checkRate = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('不能为空'));
                }
                setTimeout(() => {
                    if (Number.isNaN(value)) {
                        callback(new Error('请输入数字值'));
                    } else {
                        if (value < 0 || value > 100 ) {
                            callback(new Error('必须在0到100之间'));
                        } else {
                            callback();
                        }
                    }
                }, 100);
            };
            return {
                payDatas:[],
                ptlist:[{id:1,ptcode:'01',ptname:'现金'}],
                addDialog:{
                    title:"新增自定义支付",
                    visible:false,
                    payname:"",
                    ptid:"",
                    memoname:"",
                    yjRate:"",
                    freeRate:""
                },
                editDialog:{
                    id:'',
                    title:"支付设置",
                    visible:false,
                    payid:"",
                    paycode:"",
                    payname:"",
                    ptid:"",
                    ptname:"",
                    memoname:"",
                    yjRate:"",
                    freeRate:"",
                    revision:""
                },
                payRules:{
                    payname:[{required: true, message:'请填写支付名称'}, {min: 0, max: 10, message: '支付名称在10个字符以内'}],
                    ptid:[{required: true, message:'请选择支付类型'}],
                    yjRate:[{validator:checkRate,trigger: 'blur'}],
                    freeRate:[{validator:checkRate,trigger: 'blur'}]
                }
            }
        },
        methods:{
            search(){
                service.pay.queryPays().then(res =>{
                    this.payDatas=res.data;
                })
            },
            add(){
                cleanObj(this.addDialog);
                this.addDialog.visible=true;
            },
            save(){
                const that= this;
                this.payDatas.map(m =>{
                    if(m.payname == this.addDialog.payname){
                        $yid.util.error("支付名称:"+this.addDialog.payname+" 已存在");
                        return
                    }
                })
                this.$refs['addForm'].validate(valid => {
                    if (valid) {
                        that.ptlist.forEach(item =>{
                            if(item.id == that.addDialog.ptid){
                                that.addDialog.ptcode=item.ptcode;
                                that.addDialog.ptname=item.ptname;
                            }
                        })
                        service.pay.savePay(that.addDialog).then(res =>{
                            that.result(res)
                        })
                    }
                })
            },
            stop(row){
                const params={
                    id:row.id,
                    revision:row.revision
                };
                if(row.enable=="1"){
                    params.enable='0';
                }else{
                    params.enable='1';
                }
                service.pay.stopPay(params).then(res =>{
                    this.result(res)
                })
            },
            edit(row){
                this.editDialog.visible=true;
                copyObj(row,this.editDialog);
            },
            update(){
                const that= this;
                this.$refs['eidtForm'].validate(valid => {
                    if (valid) {
                        const params={
                            id:this.editDialog.id,
                            revision:this.editDialog.revision,
                            yjRate:this.editDialog.yjRate,
                            freeRate:this.editDialog.freeRate
                        };
                        service.pay.savePay(params).then(res =>{
                            that.result(res)
                        })
                    }
                })
            },
            closeDialog(){
                cleanObj(this.addDialog);
                cleanObj(this.editDialog);
                this.addDialog.visible=false;
                this.editDialog.visible=false;
            },
            init(){
                service.pay.queryPaysMolds().then(res =>{
                    this.ptlist=res.data;
                })
            },
            result(res){
                if(res.resp_code=="200"){
                    this.closeDialog()
                    this.search()
                    $yid.util.success(res.resp_msg);
                }else{
                    $yid.util.error(res.resp_msg);
                }
            }
        },
        mounted(){
            this.search();
            this.init();
        }
    }
</script>
<style scoped>
</style>
