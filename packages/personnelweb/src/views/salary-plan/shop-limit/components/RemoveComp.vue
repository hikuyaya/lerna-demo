<!--
 * @Author: wqy
 * @Date: 2022-07-14 10:02:10
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-14 14:24:01
 * @FilePath: \personnelweb\src\views\staff\status\components\RemoveComp.vue
 * @Description: 批量审批、删除
-->

<template>
  <div class="remove-wrapper">
    <form-item label="批次号" prefix="：" labelWidth="60px">
      <el-input
        v-model="batchNo"
        placeholder="请输入批次号"
        class="w80 mg-r-8"></el-input>
      <el-button type="primary" @click="onCheck">检测</el-button>
    </form-item>
    <div v-if="show" class="result-wrapper">
      <template v-if="num > 0">
        <p class="mg-b-12">
          当前批次号中共有 <span class="red">{{ num }}</span> 条数据为待审批
        </p>
        <el-button type="primary" @click="handleOperate"
          >确认{{ type === 'approve' ? '审核' : '移除' }}</el-button
        >
      </template>
      <template v-else-if="num === 0">
        <p class="mg-b-12">当前批次号无数据</p>
      </template>
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
  mounted() {
    console.log('type', this.type)
  },
  data() {
    return {
      batchNo: '', // 批次号
      num: -1,
      show: false,
      info: {
        reason: ''
      },
      rules: {
        reason: [{ required: true, message: '请输入批次号' }]
      }
    }
  },
  methods: {
    async onCheck() {
      if (!this.batchNo) {
        this.$message.error('请输入批次号')
        return
      }
      const { data } = await service.staff.status.getBillsByBatchNo({
        batchNo: this.batchNo
      })
      this.num = data
      this.show = true
    },
    handleOperate() {
      if (this.type === 'approve') {
        this.$confirm(
          `确认要对此批次的所有单据进行审核吗？审核后会立即生效`,
          `审核确认`,
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            cancelButtonClass: 'btn-custom-cancel',
            type: 'warning'
          }
        )
          .then(async () => {
            await service.staff.status.censorBillByBatchNo({
              batchNo: this.batchNo
            })
            this.$message.success('操作成功')
            this.$emit('refresh')
          })
          .catch(() => {})
      } else {
        this.$confirm(`您确认要移除此批次中所有数据吗？`, `移除确认`, {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          cancelButtonClass: 'btn-custom-cancel',
          type: 'warning'
        })
          .then(async () => {
            await service.staff.status.deleteBillByBatchNo({
              batchNo: this.batchNo
            })
            this.$message.success('操作成功')
            this.$emit('refresh')
          })
          .catch(() => {})
      }
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
