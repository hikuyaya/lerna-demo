<template>
    <div class="productBrand">
        <el-button @click="alertBrand" type="primary">添加</el-button>
        <yid-table :data="brandData" style="margin-top: 15px;">
            <yid-table-column label="品牌编码" min-width="100" prop="code"></yid-table-column>
            <yid-table-column label="品牌名称" min-width="150" prop="name"></yid-table-column>
            <yid-table-column label="备注" min-width="150" prop="memo"></yid-table-column>
            <yid-table-column label="操作" min-width="250" prop="content">
                <template slot-scope="scope">
                    <el-link type="primary" @click="editBrand(scope.row)">编辑</el-link>
                    <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteBrand(scope.row)">删除</el-link>
                </template>
            </yid-table-column>
        </yid-table>
        <yid-dialog :title="brandDialog.title" :visible.sync="brandDialog.visible" width="450px">
            <el-form ref="brandForm" :model="brandForm"  label-width="100px" >
                <el-form-item label="品牌编号：">
                    <el-input disabled="disabled" value="自动生成"></el-input>
                </el-form-item>
                <el-form-item label="品牌名称：" prop="name" :rules="[{ required: true, message: '品牌名称为空'}]">
                    <el-input placeholder="请填写" v-model="brandForm.name"></el-input>
                </el-form-item>
                <el-form-item label="备注：" prop="memo">
                    <el-input
                            v-model="brandForm.memo"
                            type="textarea"
                            :rows="3"
                            placeholder="请填写"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button @click="saveBrand" type="primary">保存</el-button>
                    <el-button @click="cancleBrand">取消</el-button>
                </el-form-item>
            </el-form>
        </yid-dialog>
    </div>
</template>

<script>
    import yid from '@src/library'
    import service from '@src/service'
    export default {
        name: "brand",
        data() {
            return {
                activeName: 'brand',
                brandForm:{
                    code : '',
                    name :'',
                    isDel : '0',
                    memo : '',
                },
                brandData : [],
                brandDialog: {
                    title: '',
                    visible: false,
                },
            }
        },
        created() {

        },
        mounted() {
            /**获取品牌列表**/
            this.getbrandList();
        },
        methods: {
            getbrandList(){
               service.chain.brand.brandList({isDel:'0'}).then(res=>{
                   if(res.resp_code == 200) {
                        this.brandData = res.data;
                   }
               })
            },
            alertBrand() {
                this.brandDialog.visible = true;
                this.brandDialog.title = '添加品牌';
                this.brandForm.id = ''
                this.$refs['brandForm'].resetFields();
                /**获取最大部门id+1**/
                this.brandForm.code='';
                this.brandForm.name='';
                this.brandForm.memo='';
                this.brandForm.isDel='0';
                this.brandForm.revision = '1';
                console.log(this.brandForm);
            },
            editBrand(row){
                this.brandDialog.visible = true;
                this.brandDialog.title = '编辑品牌';
                this.brandForm.id = row.id;
                this.brandForm.code=row.code;
                this.brandForm.name= row.name;
                this.brandForm.memo= row.memo;
                this.brandForm.isDel= "0";
                this.brandForm.revision = row.revision
                console.log(this.brandForm);
            },
            cancleBrand() {
                this.brandDialog.visible = false;
            },
            saveBrand(){
                this.$refs['brandForm'].validate((valid) => {
                    if(valid){
                        console.log(this.brandForm);
                        service.chain.brand.saveBrand(this.brandForm).then(res=> {
                            if(res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            }else{
                                yid.util.error(res.resp_msg)
                            }
                            this.getbrandList();
                        });
                        this.cancleBrand();
                    }
                })
            },
            deleteBrand(row) {
                yid.util.confirm('你确定要删除【'+row.name+'】品牌吗？', '','', ()=> {
                    row.isDel = '1';
                    service.chain.brand.saveBrand(row).then(res=> {
                        if(res.resp_code == 200) {
                            yid.util.success("删除成功")
                        }else{
                            yid.util.error(res.resp_msg)
                        }
                        this.getbrandList();
                    });
                })
            },
        }
    }
</script>

<style scoped>

</style>