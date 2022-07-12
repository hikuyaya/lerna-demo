<!--
 * @Author: wqy
 * @Date: 2022-07-12 17:34:11
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-12 18:11:31
 * @FilePath: \personnelweb\src\components\business\ImportComp.vue
 * @Description: 
-->

<template>
  <div>
    <div class="operate-row">
      <div class="flex">
        <div class="icon-box" @click="onDownload">
          <i class="el-icon-download c-pointer"></i>
          <p>下载模板</p>
        </div>
        <div class="icon-box">
          <el-upload
            ref="upload"
            class="upload-demo"
            accept=".xls, .xlsx"
            :show-file-list="false"
            :headers="authHeader"
            :action="`${$yid.config.API.BASE}api-pers/employeeLevelMaintenance/import`"
            :before-upload="handleBeforeUpload"
            :on-success="handleUploadSuccess">
            <i class="el-icon-upload c-pointer"></i>
            <p>上传数据</p>
          </el-upload>
        </div>
      </div>
      <div v-if="uploaded">
        <el-button type="primary" @click="handleSave">保存</el-button>
        <el-button type="primary" @click="handleSave('approve')"
          >保存并审核</el-button
        >
      </div>
    </div>
    <p class="result-row" v-if="uploaded">
      数据源共<span class="red">{{ tableData.length }}</span
      >条数据 成功上传<span class="red">{{ successData.length }}</span
      >条数据
      <el-button type="text" @click="onShowFail">查看上传失败数据>></el-button>
    </p>
    <yid-table :data="tableData" ref="table" v-if="uploaded" height="500">
      <yid-table-column
        label="单号"
        prop="billNo"
        width="130px"></yid-table-column>
      <yid-table-column label="员工姓名" prop="eeName" width="80px">
      </yid-table-column>
      <yid-table-column
        label="员工编码"
        prop="eeCode"
        width="80px"></yid-table-column>
      <yid-table-column label="原状态" prop="beStatus" width="80px">
        <template slot-scope="scope">
          {{
            scope.row.beStatus == 1
              ? '有效'
              : scope.row.beStatus == 2
              ? '无效'
              : scope.row.beStatus == 3
              ? '到期'
              : scope.row.beStatus == 4
              ? '其他'
              : '其他'
          }}
        </template>
      </yid-table-column>
      <yid-table-column label="新状态" prop="status2" width="80px">
        <template slot-scope="scope">
          {{
            scope.row.status2 == 1
              ? '有效'
              : scope.row.status2 == 2
              ? '无效'
              : scope.row.status2 == 3
              ? '到期'
              : scope.row.status2 == 4
              ? '其他'
              : '其他'
          }}
        </template>
      </yid-table-column>
      <yid-table-column label="备注" prop="remark"></yid-table-column>
      <yid-table-column
        label="合同结束日期"
        prop="contdateend"
        width="100px"></yid-table-column>
    </yid-table>
    <el-dialog
      title="上传失败数据"
      :visible.sync="failVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <yid-table :data="failData">
        <yid-table-column
          label="单号"
          prop="billNo"
          width="130px"></yid-table-column>
        <yid-table-column label="员工姓名" prop="eeName" width="80px">
        </yid-table-column>
        <yid-table-column
          v-for="column in columns"
          :key="column.prop"
          :label="column.label"
          :width="column.width"
          :prop="column.prop">
          <template slot-scope="scope">
            <span v-if="column.render">
              {{ column.render(scope.row) }}
            </span>
            <span v-else>
              {{ scope.row[column.prop] }}
            </span>
          </template>
        </yid-table-column>
      </yid-table>
    </el-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import download from '@src/library/http/download'

export default {
  props: {
    columns: {
      type: Array
    },
    importAction: String
  },
  data() {
    return {
      uploaded: true, // 是否上传过
      failVisible: false,
      authHeader: {
        authorization:
          'Bearer ' + this.$yid.cache.get(this.$yid.type.USER.TOKEN),
        'x-appid-header': this.$yid.cache.get(this.$yid.type.USER.APPID)
      },
      successNum: -1,
      failNum: -1,
      successData: [],
      failData: [{ status: 1 }]
      //   failData: []
    }
  },
  computed: {
    tableData: function () {
      return [...this.successData, ...this.failData]
    }
  },
  methods: {
    onDownload() {
      download(this.$yid.config.API.BASE + 'api-pers/template/downExcel', {
        templateName: '级别维护模板.xls'
      })
    },
    async handleSave(type) {
      if (!this.successData.length) {
        this.$message.error('没有能保存的数据，请重新上传')
        return
      }
      const params = this.successData.map(v => {
        return {
          ...v,
          regionCode: v.regionCode
        }
      })
      if (type) {
        await service.staff.contract.saveBillsAndCensor({
          employeeContractMaintenances: params
        })
      } else {
        await service.staff.contract.save({
          employeeContractMaintenances: params
        })
      }
      this.$message.success('操作成功')
      this.$emit('refresh')
    },
    handleBeforeUpload(file) {
      const isExcel =
        file.type.indexOf('sheet') !== -1 || file.type.indexOf('excel') !== -1
      const limitSize = file.size / 1024 / 1024 < 10
      if (!isExcel) {
        yid.util.error('上传excel只能是 xls 或 xlsx 格式')
      }
      if (!limitSize) {
        yid.util.error('上传excel大小不能超过10MB，请调整后重试')
      }

      return isExcel && limitSize
    },
    handleUploadSuccess(res, file) {
      //
      console.log(res, file)
      const {
        data: { employeeContractMaintenances, failureList },
        resp_code,
        resp_msg
      } = res
      if (resp_code !== 200) {
        this.$message.error(resp_msg)
        return
      }
      this.uploaded = true
      this.successData = employeeContractMaintenances
      this.failData = failureList
    },
    onShowFail() {
      this.failVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.operate-row {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #eee;
  padding-bottom: 12px;
  .icon-box {
    display: flex;
    flex-direction: column;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: #00aaee;
    }
    &:nth-child(1) {
      margin-right: 22px;
    }
    i {
      font-size: 22px;
    }
  }
}
.result-row {
  margin: 12px 0;
  .red {
    color: red;
  }
}
</style>
