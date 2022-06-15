<template>
    <div class="productBrand">
        <el-button @click="alertBrand" type="primary">添加</el-button>
        <yid-table pagination ref="brandtable" :data="brandData" style="margin-top: 15px;">
            <yid-table-column label="品牌编码" min-width="100" prop="bcode"></yid-table-column>
            <yid-table-column label="品牌名称" min-width="150" prop="bname"></yid-table-column>
            <yid-table-column label="业务组" min-width="150" prop="brname"></yid-table-column>
            <yid-table-column label="操作" min-width="250" prop="content">
                <template slot-scope="scope">
                    <el-link type="primary" @click="editBrand(scope.row)">编辑</el-link>
                    <el-link type="primary" style="margin: 0 10px 0 10px;" @click="deleteBrand(scope.row)">删除</el-link>
                </template>
            </yid-table-column>
        </yid-table>
        <yid-dialog :title="brandDialog.title" :visible.sync="brandDialog.visible" width="450px">
            <el-form ref="brandForm" :model="brandForm" label-width="140px">
                <el-form-item label="品牌编号：" prop="bcode" :rules="[{ required: true, message: '品牌编号为空'}]">
                    {{brandForm.bcode}}
                </el-form-item>
                <el-form-item label="品牌名称：" prop="bname" :rules="[{ required: true, message: '品牌名称为空'}]">
                    <el-input v-model="brandForm.bname"></el-input>
                </el-form-item>
                <el-form-item label="所属业务组: " prop="branch">
                    <el-select value-key="id" filterable placeholder="请选择" clearable v-model.trim="brandForm.branch">
                        <el-option :key="item.id" :label="item.bname" :value="item"
                                   v-for="item in branchList"></el-option>
                    </el-select>
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
        name: "productBrand",
        data() {
            return {
                activeName: 'productBrand',
                brandForm: {
                    bcode: '',
                    bname: '',
                    branch: '',
                    isDel: '0',
                },
                pageInfo: {page: 1, limit: 10},
                BrandData: [],
                branchList: [],
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
            this.getdeptListAll();
        },
        methods: {
            getdeptListAll() {
                service.dept.deptAll({isDel: '0', status: '1'}).then(res => {
                    if (res.resp_code == 200) {
                        this.branchList = res.data;
                    }
                })
            },
            getbrandList() {
                const fetch = service.productBrand.productbrandList
                const params = this.pageInfo
                params.isDel = '0'
                this.$refs.brandtable.reloadData({
                    fetch,
                    params
                });
            },
            getBrandMaxId() {
                service.productBrand.getBrandMaxId().then(res => {
                    this.brandForm.bcode = res.data;
                })
            },
            alertBrand() {
                this.brandDialog.visible = true;
                this.brandDialog.title = '添加品牌';
                this.brandForm.id = ''
                /**获取最大部门id+1**/
                this.getBrandMaxId();
                this.$refs['brandForm'].resetFields();
                this.brandForm.bcode = '';
                this.brandForm.bname = '';
                this.brandForm.branch = '';
                this.brandForm.isDel = '0';
                console.log(this.brandForm);
            },
            editBrand(row) {
                this.brandDialog.visible = true;
                this.brandDialog.title = '编辑品牌';
                this.brandForm.id = row.id;
                this.brandForm.bcode = row.bcode;
                this.brandForm.bname = row.bname;
                this.brandForm.isDel = row.isDel;
                this.brandForm.branch = '';
                this.branchList.forEach(each => {
                    if (each.bcode == row.brcode) {
                        this.brandForm.branch=each;
                    }
                })
                console.log(this.brandForm);
            },
            cancleBrand() {
                this.brandDialog.visible = false;
            },
            saveBrand() {
                this.$refs['brandForm'].validate((valid) => {
                    if (valid) {
                        console.log(this.brandForm);
                        if(this.brandForm.branch){
                            this.brandForm.brcode=this.brandForm.branch.bcode;
                            this.brandForm.brname=this.brandForm.branch.bname;
                        }else{
                            this.brandForm.brcode='';
                            this.brandForm.brname='';
                        }
                        service.productBrand.saveBrand(this.brandForm).then(res => {
                            if (res.resp_code == 200) {
                                yid.util.success(res.resp_msg)
                            } else {
                                yid.util.error(res.resp_msg)
                            }
                            this.getbrandList();
                        });
                        this.cancleBrand();
                    }
                })
            },
            deleteBrand(row) {
                yid.util.confirm('你确定要删除【' + row.bname + '】品牌吗？', '', '', () => {
                    row.isDel = '1';
                    service.productBrand.saveBrand(row).then(res => {
                        if (res.resp_code == 200) {
                            yid.util.success(res.resp_msg)
                        } else {
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