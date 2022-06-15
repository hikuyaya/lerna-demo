<template>
  <div class="packageType">
    <el-button @click="serveAlert(false, '')" type="primary">添加</el-button>
    <yid-table
      pagination
      ref="packagetable"
      style="margin-top: 15px"
      :data="serveData"
      :row-class-name="$yid.util.getTableClass">
      <yid-table-column
        label="类型编号"
        min-width="100"
        prop="pcode"></yid-table-column>
      <yid-table-column
        label="类型名称"
        min-width="150"
        prop="pname"></yid-table-column>
      <yid-table-column
        label="所属部门"
        min-width="150"
        prop="bname"></yid-table-column>
      <yid-table-column label="操作" min-width="250" prop="content">
        <template slot-scope="scope">
          <el-link type="primary" @click="serveAlert(true, scope.row)"
            >编辑</el-link
          >
          <el-link
            type="primary"
            style="margin: 0 10px 0 10px"
            @click="packageDelete(scope.row)"
            >删除</el-link
          >
        </template>
      </yid-table-column>
    </yid-table>

    <yid-dialog
      :title="packageDialog.title"
      :visible.sync="packageDialog.visible"
      width="450px">
      <el-form ref="packageForm" :model="packageForm" label-width="140px">
        <el-form-item
          label="套餐分类编号："
          prop="pcode"
          :rules="[{ required: true, message: '套餐分类编号为空' }]">
          {{ packageForm.pcode }}
        </el-form-item>
        <el-form-item
          label="套餐分类名称："
          prop="pname"
          :rules="[{ required: true, message: '套餐分类名称为空' }]">
          <el-input v-model="packageForm.pname" />
        </el-form-item>
        <el-form-item
          label="所属部门："
          prop="deptObj"
          :rules="[{ required: true, message: '请选择所属部门' }]">
          <el-select
            placeholder="请选择所属部门"
            v-model.trim="packageForm.deptObj">
            <el-option
              v-for="val in deptData"
              :key="val.id"
              :value="val.id"
              :label="val.bname" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="packageTypeSave" type="primary">确定</el-button>
          <el-button @click="canclePackage">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
export default {
  name: 'packageType',
  data() {
    return {
      activeName: 'package',
      packageForm: {
        pcode: '',
        pname: '',
        deptObj: '',
        isDel: '0'
      },
      pageInfo: { page: 1, limit: 10 },
      maxCode: 0,
      deptData: [{}],
      serveData: [{}],
      packageDialog: {
        title: '',
        visible: false
      }
    }
  },
  created() {},

  mounted() {
    /**获取部门列表**/
    this.getpackageTypeList()
  },
  methods: {
    getdeptListAll() {
      service.dept.deptAll({ isDel: '0', status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.deptData = res.data
        }
      })
    },
    getpackageTypeList() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.packagetable.Pagination.internalPageSize
      const fetch = service.dept.packageTypeList
      const params = this.pageInfo
      params.isDel = '0'
      this.$refs.packagetable.reloadData({
        fetch,
        params
      })
    },
    packageTypeMaxId() {
      service.dept.getPackageTypeMaxId().then(res => {
        this.packageForm.pcode = res.data
      })
    },
    serveAlert(tag = false, row) {
      this.packageDialog.visible = true
      this.packageDialog.title = tag ? '编辑套餐分类' : '添加套餐分类'
      this.getdeptListAll()
      if (tag == false) {
        this.packageForm.id = ''
        /**获取最大code+1**/
        this.packageTypeMaxId()
        this.$refs['packageForm'].resetFields()
        this.packageForm.pcode = ''
        this.packageForm.pname = ''
        this.packageForm.deptObj = ''
        this.packageForm.branch = ''
        this.packageForm.revision = '1'
        this.packageForm.status = '1'
        this.packageForm.isDel = '0'
        console.log(this.packageForm)
      } else {
        this.packageForm.id = row.id
        this.packageForm.pcode = row.pcode
        this.packageForm.pname = row.pname
        this.packageForm.deptObj = String(row.branch)
        this.packageForm.revision = row.revision
        this.packageForm.status = row.status
        this.packageForm.isDel = row.isDel
      }
    },
    packageTypeSave() {
      this.$refs['packageForm'].validate(valid => {
        if (valid) {
          //获取部门id
          this.packageForm.branch = this.packageForm.deptObj
          service.dept.savePackageType(this.packageForm).then(res => {
            if (res.resp_code == 200) {
              yid.util.success(res.resp_msg)
            } else {
              yid.util.error(res.resp_msg)
            }
            this.getpackageTypeList()
          })
          this.canclePackage()
        }
      })
    },
    canclePackage() {
      this.packageDialog.visible = false
    },
    packageDelete(row) {
      yid.util.confirm(
        '删除分类[' +
          row.pname +
          ']后，对应套餐上的所属分类也将被清空，确定要删除吗？',
        '',
        '',
        () => {
          const packageType = {}
          packageType.id = row.id
          packageType.pname = row.pname
          packageType.branch = row.branch
          if (row.isDel == '0') {
            packageType.isDel = '1'
          } else {
            yid.util.info('套餐分类' + row.pname + '状态异常')
            return
          }
          service.dept.updatePackageType(packageType).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('操作成功')
            } else {
              yid.util.error(res.resp_msg)
              return
            }
            this.status = '2'
            this.getpackageTypeList('1')
          })
        }
      )
    }
  }
}
</script>

<style scoped lang="scss">
.levelWrap {
  display: flex;
  width: 300px;
  flex-wrap: wrap;
  .box {
    width: 55px;
    height: 55px;
    border: 1px solid #969896;
    margin: 0 10px 10px 0;
  }
  .xiangm {
    width: 50px;
    height: 50px;
    border: 1px #999 solid;
    box-sizing: content-box;
    position: relative;
    border-radius: 4px;
    margin: 0 25px 25px 0;
    padding: 0;
    span {
      width: 100%;
      height: 100%;
      overflow: hidden;
      img {
        width: 120px;
        height: 150px;
        margin: 0;
        padding: 0;
      }
    }
    .gou {
      display: none;
    }

    .xmname {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #000;
      z-index: 2222;
    }
  }
  .xiangm.active {
    border: 5px rgba(255, 102, 0, 1) solid;

    .gou {
      width: 5px;
      height: 5px;
      border-radius: 1px;
      background-color: rgba(255, 102, 0, 1);
      position: absolute;
      top: -5px;
      right: -5px;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0;
      margin: 0;
      i {
        color: #fff;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}
</style>
