<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:18:09
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-05 17:19:01
 * @FilePath: \personnelweb\src\components\business\staffProfile\StaffProfile.vue
 * @Description: 员工资料
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
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="chooseStationVisible = true"></el-button>
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
            <el-select v-model="info.code" :disabled="operateType === 'detail'">
              <el-option
                v-for="(item, index) in sexOptions"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="info.birth"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="timestamp"
              style="width: calc(100% - 80px)">
            </el-date-picker>
            <el-input-number
              v-model="info.age"
              :controls="false"
              :min="1"
              :max="120"
              style="width: 50px; margin-left: 4px"></el-input-number
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
          <el-form-item label="证件类型" prop="cardType">
            <el-select
              v-model="info.cardType"
              filterable
              :disabled="operateType !== 'add'">
              <el-option
                v-for="item in cardTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件号" prop="idCard">
            <el-input v-model="info.idCard"></el-input>
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
            <el-date-picker
              v-model="info.date"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="timestamp">
            </el-date-picker>
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
            <el-radio-group v-model="info.date">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
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
            <el-select
              v-model="info.code"
              filterable
              :disabled="operateType !== 'add'">
              <el-option
                v-for="item in educationData"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
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
            <el-date-picker
              v-model="info.date"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同生效日期" prop="date">
            <el-date-picker
              v-model="info.date"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同结束日期" prop="code">
            <el-date-picker
              v-model="info.date"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同有效期" prop="code">
            <el-date-picker
              v-model="info.date"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="试用结束日期" prop="date">
            <el-date-picker
              v-model="info.date"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入职日期" prop="code">
            <el-date-picker
              v-model="info.date"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="timestamp">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="附件信息" />
      <div class="flex mg-t-12">
        <img-item title="大头照" :url.sync="url"></img-item>
        <img-item title="身份证正面"></img-item>
        <img-item title="身份证反面"></img-item>
        <img-item title="银行卡正面"></img-item>
        <img-item title="健康证"></img-item>
        <img-item title="毕业证"></img-item>
      </div>
    </el-form>
    <el-dialog
      title="选择岗位"
      :visible.sync="chooseStationVisible"
      :close-on-click-modal="false"
      append-to-body
      width="800px">
      <choose-station
        v-if="chooseStationVisible"
        @select="handleSelectStation"></choose-station>
    </el-dialog>
  </div>
</template>

<script>
import TitleHeader from '@src/components/base/TitleHeader'
import ChooseStation from '@src/components/business/ChooseStation'
import ImgItem from './ImgItem'
import { getAge } from '@src/library/helper/util'
export default {
  components: { TitleHeader, ImgItem, ChooseStation },
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
    treeData: {
      type: Array
    },
    educationData: {
      type: Array
    }
  },
  data() {
    const validateIdCard = (rule, value, callback) => {
      // 等于身份证时进行身份证合法性校验
      if (this.info.cardType === 1) {
        const reg = new RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/)
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('身份证格式不正确'))
        }
      } else {
        callback()
      }
    }
    return {
      chooseStationVisible: false,
      info: {},
      rules: {
        code: [{ required: true, message: '请输入机构编码' }],
        name: [{ required: true, message: '请输入机构名称' }],
        date: [{ required: true, message: '请输入机构名称' }],
        idCard: [{ validator: validateIdCard, trigger: 'blur' }]
      },
      cardTypeOptions: [
        { label: '身份证', value: 1 },
        { label: '护照', value: 2 },
        { label: '其他', value: 3 }
      ],
      sexOptions: [
        { label: '男', value: 1 },
        { label: '女', value: 0 },
        { label: '未知', value: '' }
      ],
      url: 'http://file.yidmall.com//group1/M00/00/0C/eHdu-2K1LgOASHIHAABfDv2ET_Y837.png'
    }
  },
  methods: {
    handleSelectStation(selectRow) {
      console.log(selectRow)
      this.chooseStationVisible = false
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    },
    'info.birth': {
      handler: function (val) {
        if (!val) {
          // 点击清空时
          this.$set(this.info, 'age', undefined)
        } else {
          // 正常选择时
          const birth = new Date(val).formatDate().split('-')
          console.log(birth)
          const age = getAge(birth)?.[0]
          this.$set(this.info, 'age', age)
        }
      }
    }
  }
}
</script>
