<!--
 * @Author: wqy
 * @Date: 2022-06-23 10:04:15
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-23 17:30:53
 * @FilePath: \personnelweb\src\views\staff\components\AddComp.vue
 * @Description: 
-->
<template>
  <div>
    <el-form :model="info" :rules="rules" label-width="90px">
      <title-header title="岗位信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="组织架构" prop="code">
            <el-input disabled v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职务名称" prop="parentCode">
            <el-input disabled v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" class="mg-l-16">
          <el-button type="primary" icon="el-icon-search" circle></el-button>
        </el-col>
      </el-row>
      <title-header title="基本信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="姓名" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="别名" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="籍贯" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出生日期" prop="date">
            <el-input
              v-model="info.date"
              style="width: calc(100% - 80px)"></el-input>
            <el-input
              v-model="info.age"
              style="width: 50px; margin-left: 4px"></el-input
            >&nbsp;岁
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="民族" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="证件类型" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件号" prop="date">
            <el-input v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件有效期" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="家庭地址" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机" prop="date">
            <el-input v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="紧急联系人" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="常用邮箱" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="健康证有效期" prop="date">
            <el-input v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="紧急人电话" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="账户信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="开户银行" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银行卡号" prop="date">
            <el-input v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户人" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="社保卡号" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否股东" prop="date">
            <el-input v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分红帐号" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="教育信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="学历" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="毕业院校" prop="date">
            <el-input v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专业" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="资格证书" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="合同信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="签订日期" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同生效日期" prop="date">
            <el-input v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同结束日期" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同有效期" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="试用结束日期" prop="date">
            <el-input v-model="info.date"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入职日期" prop="code">
            <el-input v-model="info.code"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="附件信息" />
      <div class="flex mg-t-12">
        <img-item title="大头照"></img-item>
        <img-item title="身份证正面"></img-item>
        <img-item title="身份证反面"></img-item>
        <img-item title="银行卡正面"></img-item>
        <img-item title="健康证"></img-item>
        <img-item title="毕业证"></img-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import TitleHeader from '@src/components/base/TitleHeader'
import ImgItem from './ImgItem'
export default {
  components: { TitleHeader, ImgItem },
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    operateType: {
      type: String
    },
    treeData: Array
  },
  data() {
    return {
      info: {},
      rules: {
        code: [{ required: true, message: '请输入机构编码' }],
        name: [{ required: true, message: '请输入机构名称' }],
        date: [{ required: true, message: '请输入机构名称' }]
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    }
  }
}
</script>
