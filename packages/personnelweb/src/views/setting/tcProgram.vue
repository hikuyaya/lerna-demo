<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane label="门店提成方案设置" name="shop">
        <tc-management type="1"></tc-management>
      </el-tab-pane>
      <el-tab-pane label="员工个人提成设置" name="employee">
        <tc-ee-management type="2"></tc-ee-management>
      </el-tab-pane>
      <el-tab-pane label="员工提成设置查询" name="query">
        <tc-query></tc-query>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tcManagement from './tcManagement'
import tcEeManagement from './tcEeManagement'
import tcQuery from './tcQuery'

export default {
  name: 'tcProgram',
  components: {
    tcManagement,
    tcEeManagement,
    tcQuery
  },
  data() {
    return {
      activeName: 'shop'
    }
  }
}
</script>

<style scoped></style>
