<!--
 * @Author: wqy
 * @Date: 2022-07-05 17:18:09
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-21 11:05:05
 * @FilePath: \personnelweb\src\components\business\staffProfile\StaffProfile.vue
 * @Description: 员工资料
-->

<template>
  <div>
    <el-form ref="form" :model="info" :rules="rules" label-width="100px">
      <title-header title="岗位信息" />
      <el-row class="mg-t-12" v-if="from === STAFF_PROFILE_TYPE.ENTRY">
        <el-col :span="8">
          <el-form-item label="组织架构" prop="regionName">
            <el-input disabled v-model="info.regionName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职务名称" prop="psname">
            <el-input disabled v-model="info.psname"></el-input>
          </el-form-item>
        </el-col>
        <el-col v-if="operateType !== 'detail'" :span="4" class="mg-l-16">
          <el-button
            type="primary"
            icon="el-icon-search"
            circle
            @click="chooseStationVisible = true"></el-button>
        </el-col>
      </el-row>
      <el-row class="mg-t-12" v-else>
        <el-col :span="8">
          <el-form-item label="机构编码">
            {{ info.bbCode }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="机构名称">
            {{ info.bbName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="职务">
            {{ info.positionName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="级别1">
            {{ info.positionLevelName }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="级别2">
            {{ info.levelClevel1Name }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="连续工龄"> {{ info.servyear }} </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="延续工龄"> {{ info.curservyear }} </el-form-item>
        </el-col>
      </el-row>
      <title-header title="基本信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item
            label="姓名"
            prop="userName"
            v-if="from === STAFF_PROFILE_TYPE.ENTRY">
            <el-input
              v-model="info.userName"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
          <el-form-item
            label="姓名"
            prop="eeName"
            v-else-if="from === STAFF_PROFILE_TYPE.PROFILE">
            <el-input
              v-model="info.eeName"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="别名" prop="aliasName">
            <el-input
              v-model="info.aliasName"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="性别" prop="sex">
            <el-select
              v-model="info.sex"
              :disabled="operateType === 'detail'"
              class="w100">
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
          <el-form-item label="籍贯" prop="origin">
            <el-input
              v-model="info.origin"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="出生日期" prop="birthday">
            <el-date-picker
              v-model="info.birthday"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              style="width: calc(100% - 80px)"
              :disabled="operateType === 'detail'">
            </el-date-picker>
            <el-input-number
              v-model="info.age"
              :controls="false"
              :min="1"
              :max="120"
              style="width: 50px; margin-left: 4px"
              :disabled="operateType === 'detail'"></el-input-number
            >&nbsp;岁
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="民族" prop="ethnic">
            <el-input
              v-model="info.ethnic"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="证件类型" prop="cardType">
            <el-select
              v-model="info.cardType"
              filterable
              :disabled="operateType === 'detail'"
              class="w100">
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
          <el-form-item label="证件号" prop="cardNumber">
            <el-input
              v-model="info.cardNumber"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="证件有效期" prop="cardTermValidity">
            <el-date-picker
              v-model="info.cardTermValidity"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              :disabled="operateType === 'detail'"
              class="w100">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="家庭地址" prop="address">
            <el-input
              v-model="info.address"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="手机" prop="mobile">
            <el-input
              v-model="info.mobile"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="紧急联系人" prop="emcontacts">
            <el-input
              v-model="info.emcontacts"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="常用邮箱" prop="email">
            <el-input
              v-model="info.email"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="健康证有效期" prop="healthdate">
            <el-date-picker
              v-model="info.healthdate"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              :disabled="operateType === 'detail'"
              class="w100">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="紧急人电话" prop="emtel">
            <el-input
              v-model="info.emtel"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row v-if="from === STAFF_PROFILE_TYPE.PROFILE">
        <el-col :span="8">
          <el-form-item label="标签">
            <el-select
              v-model="info.inductionwayCode"
              filterable
              :disabled="operateType === 'detail'"
              class="w100">
              <el-option
                v-for="item in inductionwayData"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="账户信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="开户银行" prop="bankCode">
            <el-select
              v-model="info.bankCode"
              filterable
              :disabled="operateType === 'detail'"
              class="w100">
              <el-option
                v-for="item in bankData"
                :key="item.code"
                :label="item.name"
                :value="item.code">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="银行卡号" prop="bankAccount">
            <el-input
              v-model="info.bankAccount"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="开户人" prop="accountname">
            <el-input
              v-model="info.accountname"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="社保卡号" prop="ssaccount">
            <el-input
              v-model="info.ssaccount"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="是否股东" prop="shareholder">
            <el-radio-group
              v-model="info.shareholder"
              :disabled="operateType === 'detail'">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="分红帐号" prop="fhaccount">
            <el-input
              v-model="info.fhaccount"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="教育信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="学历" prop="educode">
            <el-select
              v-model="info.educode"
              filterable
              :disabled="operateType === 'detail'"
              class="w100">
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
          <el-form-item label="毕业院校" prop="graduated">
            <el-input
              v-model="info.graduated"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="专业" prop="professional">
            <el-input
              v-model="info.professional"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="资格证书" prop="certificate">
            <el-input
              v-model="info.certificate"
              :disabled="operateType === 'detail'"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="合同信息" />
      <el-row class="mg-t-12">
        <el-col :span="8">
          <el-form-item label="签订日期" prop="contdatesigned">
            <el-date-picker
              v-model="info.contdatesigned"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              :disabled="operateType === 'detail'"
              class="w100">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同生效日期" prop="contdatestart">
            <el-date-picker
              v-model="info.contdatestart"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              :disabled="operateType === 'detail'"
              class="w100">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="合同结束日期" prop="contdateend">
            <el-date-picker
              v-model="info.contdateend"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              :disabled="operateType === 'detail'"
              class="w100">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="合同有效期" prop="htdate">
            <el-date-picker
              v-model="info.htdate"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              :disabled="operateType === 'detail'"
              class="w100">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="试用结束日期" prop="trainingdate">
            <el-date-picker
              v-model="info.trainingdate"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              :disabled="operateType === 'detail'"
              class="w100">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="入职日期" prop="entrydate">
            <el-date-picker
              v-model="info.entrydate"
              type="date"
              format="yyyy年MM月dd日"
              placement="bottom"
              value-format="yyyy-MM-dd"
              :disabled="operateType === 'detail'"
              class="w100">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <title-header title="附件信息" />
      <div class="flex mg-t-12">
        <!-- <img-item title="大头照" :url.sync="url"></img-item> -->
        <template v-if="!hasPhoto && operateType === 'detail'">
          未上传附件
        </template>
        <template v-else>
          <img-item
            title="大头照"
            v-if="!(operateType === 'detail' && !info.photo)"
            :operateType="operateType"
            :url.sync="info.photo"></img-item>
          <img-item
            title="身份证正面"
            v-if="!(operateType === 'detail' && !info.idphoto1)"
            :operateType="operateType"
            :url.sync="info.idphoto1"></img-item>
          <img-item
            title="身份证反面"
            v-if="!(operateType === 'detail' && !info.idphoto2)"
            :operateType="operateType"
            :url.sync="info.idphoto2"></img-item>
          <img-item
            title="银行卡正面"
            v-if="!(operateType === 'detail' && !info.idphoto3)"
            :operateType="operateType"
            :url.sync="info.idphoto3"></img-item>
          <img-item
            title="健康证"
            v-if="!(operateType === 'detail' && !info.idphoto4)"
            :operateType="operateType"
            :url.sync="info.idphoto4"></img-item>
          <img-item
            title="毕业证"
            v-if="!(operateType === 'detail' && !info.idphoto5)"
            :operateType="operateType"
            :url.sync="info.idphoto5"></img-item>
        </template>
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
import ChooseStation from '@src/components/business/ChooseSingleStation'
import ImgItem from './ImgItem'
import { getAge } from '@src/library/helper/util'
import { STAFF_PROFILE_TYPE } from '@src/type'
import { scrollToError } from '@src/library/helper/business'

export default {
  components: { TitleHeader, ImgItem, ChooseStation },
  props: {
    value: {
      type: Object,
      default: function () {
        return {}
      }
    },
    from: {
      type: String,
      default: function () {
        return STAFF_PROFILE_TYPE.ENTRY
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
    },
    bankData: {
      type: Array
    },
    inductionwayData: {
      type: Array
    }
  },
  computed: {
    hasPhoto: function () {
      return (
        this.info.photo ||
        this.info.idphoto1 ||
        this.info.idphoto2 ||
        this.info.idphoto3 ||
        this.info.idphoto4 ||
        this.info.idphoto5
      )
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
    const validateMobile = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入手机号'))
      } else {
        const reg = new RegExp(/^1[3456789]\d{9}$/)
        if (reg.test(value)) {
          callback()
        } else {
          callback(new Error('请输入11位手机号'))
        }
      }
    }
    return {
      STAFF_PROFILE_TYPE,
      chooseStationVisible: false,
      info: {},
      station: {}, // 岗位相关
      rules: {
        regionName: [{ required: true, message: '请选择岗位信息' }],
        psname: [{ required: true, message: '请选择岗位信息' }],
        userName: [{ required: true, message: '请输入姓名' }],
        eeName: [{ required: true, message: '请输入姓名' }],
        sex: [{ required: true, message: '请选择性别' }],
        origin: [{ required: true, message: '请输入籍贯' }],
        birthday: [{ required: true, message: '请选择出生日期' }],
        ethnic: [{ required: true, message: '请输入名族' }],
        cardType: [{ required: true, message: '请选择证件类型' }],
        cardNumber: [{ required: true, validator: validateIdCard }],
        cardTermValidity: [{ required: true, message: '请选择证件有效期' }],
        address: [{ required: true, message: '请输入家庭地址' }],
        mobile: [{ required: true, validator: validateMobile }],
        educode: [{ required: true, message: '请选择学历' }],
        graduated: [{ required: true, message: '请输入毕业院校' }],
        shareholder: [{ required: true, message: '请选择' }],
        entrydate: [{ required: true, message: '请选择入职日期' }]
      },
      cardTypeOptions: [
        { label: '身份证', value: 1 },
        { label: '护照', value: 2 },
        { label: '其他', value: 3 }
      ],
      sexOptions: [
        { label: '男', value: 1 },
        { label: '女', value: 2 }
      ],
      url: 'http://file.yidmall.com//group1/M00/00/0C/eHdu-2K1LgOASHIHAABfDv2ET_Y837.png'
    }
  },
  methods: {
    handleSelectStation(selectRow) {
      this.chooseStationVisible = false
      this.station = Object.assign({}, selectRow)
      this.info = {
        ...this.info,
        regionCode: selectRow.bbCode,
        regionName: selectRow.bbName,
        psname: selectRow.positionName,
        pscode: selectRow.positionCode,
        postcode: selectRow.postCode,
        postname: selectRow.postName,
        otype: selectRow.otype
      }
    },
    async getData() {
      const result = await this.$refs.form.validate().catch(err => {
        scrollToError()
      })
      if (result) {
        return {
          ...this.info
        }
      }
    },
    bankValidate() {
      if (!this.rules.hasOwnProperty('bankAccount')) {
        const bankAccount = [{ required: true, message: '请输入银行卡号' }]
        this.$set(this.rules, 'bankAccount', bankAccount)
      }
      if (!this.rules.hasOwnProperty('bankCode')) {
        const bankCode = [{ required: true, message: '请选择开户银行' }]
        this.$set(this.rules, 'bankCode', bankCode)
      }
    }
  },
  watch: {
    value: {
      immediate: true,
      handler: function (val) {
        this.info = JSON.parse(JSON.stringify(val))
      }
    },
    'info.birthday': {
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
    },
    'info.bankCode': {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.bankValidate()
        }
      }
    },
    'info.bankAccount': {
      immediate: true,
      handler: function (val) {
        if (val) {
          this.bankValidate()
        }
      }
    }
  }
}
</script>
