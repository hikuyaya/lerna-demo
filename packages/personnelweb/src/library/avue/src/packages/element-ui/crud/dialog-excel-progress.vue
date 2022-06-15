<template>
  <el-dialog title="导出进度"
             lock-scroll
             :modal-append-to-body="false"
             append-to-body
             class="avue-dialog"
             :visible.sync="box"
             :close-on-press-escape="false"
             :show-close="false"
             center
             :destroy-on-close="true"
             width="30%">

    <el-progress :text-inside="true" :stroke-width="26" :percentage.sync="percentage"></el-progress>

    <span slot="footer"
          class="dialog-footer"></span>
  </el-dialog>
</template>
<script>
export default {

  data() {
    return {
      box: false,
      percentage: 0
    }
  },
  methods: {

    show() {

      this.box = true
      this.percentage = 0;
    },
    hide() {
      this.present = 0;
      this.box = false
      this.$destroy(true);
    },
    setPercentage(percentage) {
      this.percentage = percentage
    }
  }

}

</script>
