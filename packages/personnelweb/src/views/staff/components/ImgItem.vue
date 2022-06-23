<!--
 * @Author: wqy
 * @Date: 2022-06-23 16:55:05
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-23 17:50:44
 * @FilePath: \personnelweb\src\views\staff\components\ImgItem.vue
 * @Description: 
-->
<template>
  <div>
    <!-- <img src="" :alt="title" /> -->
    <el-upload
      class="avatar-uploader"
      :action="action"
      :show-file-list="false"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload">
      <div v-if="imageUrl">
        <img
          class="el-upload-list__item-thumbnail"
          width="148px"
          height="148px"
          :src="imageUrl"
          alt="" />
        <!-- <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)">
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)">
            <i class="el-icon-delete"></i>
          </span>
        </span> -->
      </div>
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
    <p class="tac mg-t-4">{{ title }}</p>
    <el-button type="text" class="tac">重新上传</el-button>
    <el-dialog :title="title" :visible.sync="dialogVisible" append-to-body>
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  },
  data() {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      action: `${this.$yid.config.API.BASE}api-file/files-anon`,
      imageUrl: ''
    }
  },
  mounted() {
    console.log(this.action, 'action')
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.imageUrl = res?.data?.url
      this.$emit('input', this.imageUrl)
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
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader {
  margin-right: 12px;
  /deep/ .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    &:hover {
      border-color: #409eff;
    }
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
</style>
