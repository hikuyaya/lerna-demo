<template>
    <div class="messMbConfig">
        <el-row>
            <el-button type="primary" @click="create">新增消息模板</el-button>
            <el-button @click="getfwhfConfig">返回</el-button>
        </el-row>
        <yid-table pagination ref="table" :data="messData" style="margin-top: 15px">
            <yid-table-column label="编号" width="80" prop="id"></yid-table-column>
            <yid-table-column label="提醒类型" width="150" prop="stype">

                <template slot-scope="scope">
                    <span v-if='scope.row.stype==2'>顾客提醒</span>
                    <span v-if='scope.row.stype==1'>员工提醒</span>
                </template>
            </yid-table-column>
            <yid-table-column label="模板名称" width="150" prop="sname"></yid-table-column>
            <yid-table-column label="模板内容头" prop="first"></yid-table-column>
            <yid-table-column label="模板内容尾" prop="remask"></yid-table-column>
            <yid-table-column label="操作" width="150" prop="content">
                <template slot-scope="scope">
                    <el-link type="primary" @click="showDialogType(scope.row.id)">编辑</el-link>
                    <el-link type="primary" style="margin: 0 20px" @click="serveDelete(scope.row.id)">删除</el-link>
                </template>
            </yid-table-column>
        </yid-table>
        <!--添加/编辑消息模板弹出层-->
        <yid-dialog :title="dialogType.title" :visible.sync="dialogType.visible" @close="closeDialogType" width="750px">
           <div style="
           padding: 10px">
               <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
                   <el-form-item label="消息类型" prop="name">
                   <el-select v-model="stype" placeholder="请选择" style="width: 290px">
                       <el-option
                               v-for="item in options"
                               :key="item.value"
                               :label="item.label"
                               :value="item.value">
                       </el-option>
                   </el-select>
                   </el-form-item>
               <!--编辑顾客消息设置-->
               <div>
                   <el-form-item label="模板名称" prop="sname">
                       <el-input v-model="ruleForm.sname" style="width:70%"></el-input>
                   </el-form-item>

                   <el-form-item label="头消息模板"  v-if="stype==2"  prop="first">

                   <div style="margin:15px 0 15px 70px;">
                       <el-input
                               id="headtext"
                               type="textarea"
                               :autosize="{ minRows: 2, maxRows: 4}"
                               placeholder="请输入内容"
                               v-model="ruleForm.first" style="width: 400px; font-size: 12px">
                       </el-input>
                   </div>
                       <el-row>可选通配符：</el-row>
                       <div class="tongpf">
                           <ul @click="selmodel('[顾客昵称]')">[顾客昵称]</ul>
                           <ul @click="selmodel('[顾客手机号]')">[顾客手机号]</ul>

                       </div>
                   </el-form-item>
                   <el-form-item label="尾消息模板" prop="remask">
                   <div style="margin:15px 0 15px 70px;">
                       <el-input
                               id="remarktext"
                               type="textarea"
                               :autosize="{ minRows: 4, maxRows: 6}"
                               placeholder="请输入内容"
                               v-model="ruleForm.remask" style="width: 400px; font-size: 12px">
                       </el-input>

                   </div>
                       <el-row>可选通配符：</el-row>
                       <div class="tongpf">
                           <ul @click="selmodelremask('[顾客昵称]')">[顾客昵称]</ul>
                           <ul @click="selmodelremask('[顾客手机号]')">[顾客手机号]</ul>
                           <ul @click="selmodelremask('[顾客称谓]')">[顾客称谓]</ul>
                           <ul @click="selmodelremask('[顾客昵称]')">[顾客昵称]</ul>
                           <ul @click="selmodelremask('[门店名称]')">[门店名称]</ul>
                           <ul @click="selmodelremask('[提醒期]')">[提醒期]</ul>
                           <ul @click="selmodelremask('[项目名称]')">[项目名称]</ul>
                       </div>
                   </el-form-item>
                   <el-form-item label="微信模板ID" prop="tempid">
                       <el-input v-model="ruleForm.tempid" style="width:70%"></el-input>
                   </el-form-item>
               </div>

               </el-form>
           </div>

            <el-row style="text-align: center; margin-bottom: 15px">
                <el-button @click="closeDialogType">取消</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
            </el-row>
        </yid-dialog>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from "../../service";
    export default {

        name: "messMbConfig",

        data:function() {
            return {
                ruleForm: {
                    sname: '',
                    first: '',
                    remask:'',
                    tempid:'',
                    id:0
                },
                listShow:true,

                dialogType: {
                    visible: false,
                    title:'添加/编辑消息模板',
                },
                messData:[],
                options: [{
                    value: '1',
                    label: '服务人员提醒'
                },{
                    value: '2',
                    label: '顾客提醒'
                } ],
                stype: "1",

                id:-1,
                rules: {
                    sname: [{
                        required: true,
                        message: '请输入模板名称',
                        trigger: 'blur'
                    }],
                    first: [{
                        required: true,
                        message: '请输入头部内容',
                        trigger: 'blur'
                    }],
                    remask: [{
                        required: true,
                        message: '请输入模板内容',
                        trigger: 'blur'
                    }],
                    tempid:[{
                        required: true,
                        message: '请输入微信模板ID',
                        trigger: 'blur'
                    }]

                }
            }
        },
        mounted() {
            this.loadData()
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if(valid) {

                        console.log("ruleForm",this.ruleForm.sname)
                        console.log("first",this.ruleForm.first)
                        console.log("remask",this.ruleForm.remask)


                        let params={stype:this.stype,sname:this.ruleForm.sname,first:
                            this.ruleForm.first,
                            remask:this.ruleForm.remask,
                            tempid:this.ruleForm.tempid,
                        }

                        if(this.ruleForm.id!=0)
                        {
                            params.id=this.ruleForm.id
                        }
                        yid.service.wxTemplate.saveTemplate(params).then(res => {
                            // 存储登录信息到本地缓存
                            console.log("sssss",res.data)
                            this.dialogType.visible = false
                            this.loadData();
                        }).catch((res)=> {

                        });

                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            selmodel(val)
            {
                var elInput = document.getElementById('headtext'); //根据id选择器选中对象
                var startPos = elInput.selectionStart;// input 第0个字符到选中的字符
                var endPos = elInput.selectionEnd;// 选中的字符到最后的字符
                if (startPos === undefined || endPos === undefined) return
                var txt = elInput.value;
                // 将表情添加到选中的光标位置
                var result = txt.substring(0, startPos) + val + txt.substring(endPos)
                elInput.value = result;// 赋值给input的value
                this.ruleForm.first=result
                // 重新定义光标位置
                elInput.focus();
                elInput.selectionStart = startPos + val.length;
                elInput.selectionEnd = startPos + val.length;

            },
            selmodelremask(val)
            {
                var elInput = document.getElementById('remarktext'); //根据id选择器选中对象
                var startPos = elInput.selectionStart;// input 第0个字符到选中的字符
                var endPos = elInput.selectionEnd;// 选中的字符到最后的字符
                if (startPos === undefined || endPos === undefined) return
                var txt = elInput.value;
                // 将表情添加到选中的光标位置
                var result = txt.substring(0, startPos) + val + txt.substring(endPos)
                elInput.value = result;// 赋值给input的value
                this.ruleForm.remask=result
                // 重新定义光标位置
                elInput.focus();
                elInput.selectionStart = startPos + val.length;
                elInput.selectionEnd = startPos + val.length;

            },
            serveDelete(id) {

                $yid.util.confirm('你确定要删除此条数据吗？', '','', ()=> {
                    yid.service.wxTemplate.deleteTemplateByID(id).then(res => {
                        this.loadData();


                    }).catch((res)=> {

                    });

                });
            },
            loadData()
            {
                let params={page:1,limit:20}
                yid.service.wxTemplate.getTemplateList(params).then(res => {
                    // 存储登录信息到本地缓存
                    console.log("sssss",res.data)

                    this.messData=res.data

                }).catch((res)=> {

                });
            },
            closeDialogType()
            {
                this.dialogType.visible = false
            },
            create()
            {
                this.ruleForm.sname=""
                this.ruleForm.first=""
                this.ruleForm.remask=""
                this.ruleForm.tempid=""
                this.ruleForm.id=-1;
                this.dialogType.visible = true
            },
            showDialogType(id) {


                yid.service.wxTemplate.getTemplateByid(id).then(res => {
                    // 存储登录信息到本地缓存
                    console.log("d",res.data)
                    this.stype=res.data.stype;
                    this.ruleForm.sname=res.data.sname;
                    this.ruleForm.first=res.data.first;
                    this.ruleForm.remask=res.data.remask;
                    this.ruleForm.tempid=res.data.tempid;
                    this.ruleForm.id=res.data.id;
                    this.dialogType.visible = true

                }).catch((res)=> {

                });


            },
            getfwhfConfig(){
                this.$router.push("./fwhfConfig");
            }
        }
    }
</script>

<style scoped lang="scss">
.tongpf{
    display: flex;
    padding: 10px 0;
    flex-wrap: wrap;
   ul{
     width: auto;
       padding: 0 5px;
       background-color: #e4e4e4;
       margin:0 15px 10px 0;
       color: #333;
       cursor: pointer;
   }
}
    .guke{
        margin-top: 5px;
        ul{
            padding: 0;
            margin: 0;
        }
    }
</style>