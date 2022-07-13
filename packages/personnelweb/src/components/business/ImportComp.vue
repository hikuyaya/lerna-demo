<!--
 * @Author: wqy
 * @Date: 2022-07-12 17:34:11
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-13 16:36:13
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
            :action="importAction"
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
      >条数据 效验成功<span class="red">{{ successData.length }}</span
      >条数据 效验失败<span class="red">{{ failData.length }}</span
      >条数据
      <el-button type="text" class="red" @click="onShowFail"
        >查看上传失败数据>></el-button
      >
    </p>
    <yid-table :data="tableData" ref="table" v-if="uploaded" height="500">
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
    <el-dialog
      :title="fromSave ? '温馨提醒' : '上传失败数据'"
      :visible.sync="failVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <div v-if="fromSave">
        <p class="orange">
          <i class="el-icon-warning"></i>
          您导入的数据中存在效验失败数据，请修改完数据模板值再重新上传
        </p>
        <p class="mg-t-12 mg-b-12">
          效验失败数据共 <span class="red">{{ failData.length }}</span> 条
        </p>
      </div>
      <yid-table :data="failData">
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
    importAction: String,
    downloadUrl: String,
    downloadParams: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      uploaded: false, // 是否上传过
      fromSave: false, // 查看失败列表时是否从点击保存、保存并审核处来的
      failVisible: false,
      authHeader: {
        authorization:
          'Bearer ' + this.$yid.cache.get(this.$yid.type.USER.TOKEN),
        'x-appid-header': this.$yid.cache.get(this.$yid.type.USER.APPID)
      },
      successNum: -1,
      failNum: -1,
      successData: [],
      failData: []
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
      download(this.downloadUrl, this.downloadParams)
    },
    async handleSave(type) {
      if (this.failData.length) {
        this.fromSave = true
        this.failVisible = true
        return
      }
      if (!this.successData.length) {
        this.$message.error('没有能保存的数据，请重新上传')
        return
      }
      if (type) {
        this.$emit('save', this.successData)
      } else {
        this.$emit('approve', this.successData)
      }
    },
    handleBeforeUpload(file) {
      const isExcel =
        file.type.indexOf('sheet') !== -1 || file.type.indexOf('excel') !== -1
      const limitSize = file.size / 1024 / 1024 < 10
      if (!isExcel) {
        this.$yid.util.error('上传excel只能是 xls 或 xlsx 格式')
      }
      if (!limitSize) {
        this.$yid.util.error('上传excel大小不能超过10MB，请调整后重试')
      }

      return isExcel && limitSize
    },
    handleUploadSuccess(res, file) {
      //
      console.log(res, file)
      const {
        data: {
          employeeContractMaintenances,
          failureList,
          errorList,
          successList
        },
        resp_code,
        resp_msg
      } = res
      if (resp_code !== 200) {
        this.$message.error(resp_msg)
        return
      }
      this.uploaded = true
      this.successData = employeeContractMaintenances || successList
      this.failData = failureList || errorList
    },
    onShowFail() {
      this.fromSave = false
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
