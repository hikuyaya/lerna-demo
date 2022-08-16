<!--
 * @Author: wqy
 * @Date: 2022-08-15 17:58:29
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-16 10:28:09
 * @FilePath: \personnelweb\src\views\salary-business\pay-approve\components\CancelApproveComp.vue
 * @Description: 
-->
<template>
  <div class="remove-wrapper">
    <el-form ref="form" :model="info" :rules="rules" label-width="80px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="门店编码" prop="shopCode">
            <el-input v-model="info.shopCode"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="11">
          <el-form-item label="年月" prop="date">
            <el-date-picker
              v-model="info.date"
              type="month"
              format="yyyy年M月"
              placement="bottom"
              value-format="yyyy-M"
              class="w90">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="onCheck">检测</el-button>
        </el-col>
      </el-row>
      <el-row> </el-row>
    </el-form>
    <div v-if="show" class="result-wrapper">
      <p class="mg-b-12">
        检测到单号 <span class="">{{ billCode }}</span> 可取消审核
      </p>
      <el-button type="primary" @click="handleOperate">确认取消审核</el-button>
    </div>
  </div>
</template>

<script>
import FormItem from '@src/components/base/FormItem.vue'
import service from '@src/service'

export default {
  props: {
    type: {
      type: String,
      default: function () {
        return 'approve' // approve 或者 remove
      }
    }
  },
  components: { FormItem },
  computed: {
    maxYear: function () {
      return new Date().getFullYear()
    }
  },
  mounted() {
    console.log('type', this.type)
  },
  data() {
    return {
      batchNo: '', // 批次号
      billCode: '',
      show: false,
      info: {
        reason: ''
      },
      rules: {
        shopCode: [{ required: true, message: '请输入门店编码' }],
        date: [{ required: true, message: '请选择年月' }]
      }
    }
  },
  methods: {
    async onCheck() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          const { date, shopCode } = this.info
          const params = new FormData()
          const [year, month] = date.split('-')
          params.append('year', year)
          params.append('month', month)
          params.append('shopCode', shopCode)
          const { data } = await service.salaryBusiness.payApprove
            .checkCancelCensorBill(params)
            .catch(() => {
              this.billCode = ''
              this.show = false
            })
          this.billCode = data
          this.show = true
        }
      })
    },
    handleOperate() {
      this.$confirm(
        `您确认要取消还原单号 ${this.billCode} 打款审核信息吗？`,
        `审核确认`,
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        }
      )
        .then(async () => {
          const params = new FormData()
          params.append('billCode', this.billCode)
          await service.salaryBusiness.payApprove.cancelCensorBills(params)
          this.$message.success('操作成功')
          this.$emit('refresh')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.remove-wrapper {
  min-height: 150px;
  display: flex;
  flex-direction: column;
  .result-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    .red {
      color: red;
    }
  }
}
</style>
