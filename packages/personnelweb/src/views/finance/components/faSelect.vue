<template>
  <div>
    <el-select
      style="width: 100px"
      :disabled="disabled"
      v-model="selectedOption"
      clearable
      placeholder="请选择">
      <el-option
        v-for="item in list"
        :key="item.id"
        :label="item.name"
        :value="item.code">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import service from '@src/service'

export default {
  name: 'faSelect',
  props: ['code', 'disabled'],
  data() {
    return {
      list: [],
      selectedOption: ''
    }
  },
  mounted() {
    this.getDiclist()
    if (this.code) this.selectedOption = this.code
  },
  computed: {},
  watch: {
    selectedOption(v) {
      this.$emit('update:code', v)
    },
    code(v) {
      if (this.selectedOption != v) this.selectedOption = v
    }
  },
  methods: {
    getDiclist() {
      service.finance.dicFinancialArea
        .financeAreaAll({ isDel: '0', status: '1' })
        .then(res => {
          if (res.resp_code == 200) this.list = res.data
        })
    }
  }
}
</script>

<style scoped lang="scss"></style>
