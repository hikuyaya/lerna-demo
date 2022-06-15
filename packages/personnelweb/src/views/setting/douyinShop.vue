<template>
  <yid-table pagination ref="mtkeystable" :data="mtkeysData" style="margin-top: 15px;">
    <yid-table-column label="抖音poi_id" min-width="100" prop="poi_id"></yid-table-column>
    <yid-table-column label="抖音店名" min-width="100" prop="poi_name"></yid-table-column>
    <yid-table-column label="抖音地址" min-width="100" prop="address"></yid-table-column>
  </yid-table>

</template>

<script>
import service from '@src/service'
import {douyinList} from "@src/service/modules/mtkeysConfig";

export default {
  name: "mtkeysConfig",
  data() {
    return {
      mtkeysData: [],
      pageInfo: {page: 1, limit: 10},
    }
  },
  mounted() {
    this.getMtKeysList();

  },
  methods: {

    getMtKeysList() {
      this.pageInfo.page = 1
      this.pageInfo.limit = this.$refs.mtkeystable.Pagination.internalPageSize;
      const fetch = service.mtkeysConfig.douyinList
      const params = this.pageInfo
      this.$refs.mtkeystable.reloadData({
        fetch,
        params
      });
    },

  }
}
</script>

<style scoped>

</style>
