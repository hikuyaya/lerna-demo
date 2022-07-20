<!--
 * @Author: wqy
 * @Date: 2022-06-23 16:55:05
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-20 16:22:35
 * @FilePath: \personnelweb\src\components\business\staffProfile\ImgItem.vue
 * @Description: 
-->
<template>
  <div>
    <div class="avatar-uploader">
      <img
        class="avatar"
        v-if="imageUrl"
        :src="imageUrl"
        alt=""
        @click="handlePictureCardPreview" />
      <i
        v-else
        class="el-icon-plus avatar-uploader-icon"
        @click="onShowUpload"></i>
    </div>
    <p class="tac mg-t-4">{{ title }}</p>
    <el-button
      type="text"
      v-if="reloadVisible"
      class="mg-center block"
      @click="onShowUpload"
      >重新上传</el-button
    >
    <el-dialog :title="title" :visible.sync="dialog.detail" append-to-body>
      <img width="100%" :src="imageUrl" alt="" />
    </el-dialog>
    <el-dialog
      :title="title"
      :visible.sync="dialog.upload"
      width="440px"
      append-to-body>
      <el-upload
        ref="upload"
        class="tac mg-center"
        drag
        list-type="picture"
        :action="action"
        :auto-upload="false"
        :on-change="handleAvatarChange"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">
          只能上传图片文件，且不超过10mb
        </div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">确 定</el-button>
        <el-button @click="onCancel">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    url: String,
    operateType: String
  },
  data() {
    return {
      dialog: {
        detail: false,
        upload: false
      },
      disabled: false,
      reloadVisible: false,
      action: `${this.$yid.config.API.BASE}api-file/files-anon`,
      imageUrl: '',
      newImageUrl: ''
    }
  },
  mounted() {},
  methods: {
    onShowUpload() {
      this.dialog.upload = true
    },
    // 限制只能传1张 后面上传的替换前面的
    handleAvatarChange(file, fileList) {
      if (file.status === 'ready') {
        if (fileList.length === 2) {
          fileList.shift()
        }
      }
      this.$refs['upload'].submit()
    },
    handleAvatarSuccess(res, file) {
      this.newImageUrl = res?.data?.url
      this.$emit('input', this.newImageUrl)
    },
    beforeAvatarUpload(file) {
      console.log(file.type)
      const isJPG = file.type.indexOf('image') > -1
      const isLt2M = file.size / 1024 / 1024 < 10

      if (!isJPG) {
        this.$message.error('上传文件必须是图片!')
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 10MB!')
      }
      return isJPG && isLt2M
    },
    handleRemove(file) {
      this.imageUrl = ''
    },
    handlePictureCardPreview(file) {
      this.dialog.detail = true
    },
    onSubmit() {
      this.$emit('update:url', this.newImageUrl)
      this.reloadVisible = true
      this.dialog.upload = false
    },
    onCancel() {
      this.dialog.upload = false
    }
  },
  watch: {
    url: {
      immediate: true,
      handler: function (val) {
        if (!val) {
          return
        }
        this.imageUrl = val
        if (this.operateType !== 'detail') {
          this.reloadVisible = true
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  margin-right: 12px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  &:hover {
    border-color: #409eff;
    .item-actions {
      z-index: 1;
    }
  }
  .item-actions {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
    color: white;
    font-size: 20px;
    margin: 60px 0;
    text-align: center;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 148px;
    height: 148px;
    line-height: 148px;
    text-align: center;
  }
  .avatar {
    width: 148px;
    height: 148px;
    display: block;
  }
}
.disabled {
  display: none;
}
</style>
