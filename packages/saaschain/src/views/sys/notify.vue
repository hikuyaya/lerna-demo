<template>
  <div class="sys-manage">
    <el-tabs v-model="activeName">


      <el-tab-pane label="在线客户端" name="first">


        <el-radio-group v-model="type" @change="typeChange">
          <el-radio label="2">门店</el-radio>
          <el-radio label="1">点对点</el-radio>
        </el-radio-group>


        <div class="infinite-list mlist" style="overflow:auto">
          <span v-for="i in data" class="infinite-list-item">{{ i }}</span>
        </div>

      </el-tab-pane>

      <el-tab-pane label="配置刷新" name="second">

        <el-form ref="form" :model="form" label-width="80px">

          <el-form-item label="门店">
            <el-input v-model="form.key" style="width: 180px;"></el-input>
          </el-form-item>

          <el-button type="primary" @click="onSubmitConfig">提交</el-button>

        </el-form>


      </el-tab-pane>
      <el-tab-pane label="发送通知" name="third">
        <el-form ref="form" :model="form2" label-width="80px">

          <el-form-item label="标题">
            <el-input v-model="form2.title"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="form2.msg" type="textarea"></el-input>
          </el-form-item>
          <el-button type="primary" @click="onSubmitNotify">提交</el-button>
        </el-form>


      </el-tab-pane>
      <el-tab-pane label="点对点" name="fourth">

        <el-form ref="form" :model="form3" label-width="80px">

          <el-form-item label="接收人">
            <el-input v-model="form3.key"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input v-model="form3.msg" type="textarea"></el-input>
          </el-form-item>
          <el-button type="primary" @click="onSubmitPoint">提交</el-button>
        </el-form>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import yid from '@src/library'

export default {
  name: "manage",
  components: {},
  data() {
    return {
      activeName: 'first',

      type: "2",

      data: [],
      form: {
        key: "",
        msg: ""
      },
      form2: {
        title: "系统公告",
        msg: ""
      },
      form3: {
        key: "",
        msg: ""
      }
    }
  },

  mounted() {

    this.getClients(this.type);
  },
  filters: {
    formatValue(str, stsList) {
      let label = ""
      stsList.map(m => {
        if (m.value == str) {
          label = m.name
        }
      })
      if (label) {
        return label
      } else {
        return str
      }
    }
  },
  methods: {

    async getClients(type) {

      let newVar = await yid.http.get(process.env.VUE_APP_SOCKET_API + "/clients?type=" + type);


      this.data = newVar.data;
    },
    typeChange() {
      this.getClients(this.type);
    },
    async onSubmitConfig() {

      let newVar = await yid.http.post(process.env.VUE_APP_SOCKET_API + "/notify?key=" + this.form.key + "&msg={\"content\":\"\",\"type\":\"13\"}");

      if (newVar.resp_code == 200) {
        yid.util.alert("成功");
      }

    },

    async onSubmitNotify() {

      if (this.form2.msg.length == 0) {
        yid.util.error("内容不能为空");
      }

      let newVar = await yid.http.post(process.env.VUE_APP_SOCKET_API + "/notify?msg={\"content\":\""+this.form2.msg+"\",\"type\":\"14\",\"title\":\""+this.form2.title+"\"}");

      if (newVar.resp_code == 200) {
        yid.util.alert("成功");
      }

    },
    async onSubmitPoint() {

      if (this.form3.msg.length == 0 || this.form3.key.length == 0) {
        yid.util.error("内容不能为空");
      }

      let newVar = await yid.http.post(process.env.VUE_APP_SOCKET_API + "?key=" + this.form3.key + "&msg=" + this.form3.msg);

      if (newVar.resp_code == 200) {
        yid.util.alert("成功");
      }

    }
  }
}
</script>

<style lang="scss" scoped>
.sys-index {
  /deep/ .el-divider--horizontal {
    margin: 0;
  }

  .box-card {
    .item {
      .static {
        font-size: 25px;
        line-height: 27px;
      }

      .bottom {
        height: 30px;
        line-height: 30px;
        margin-top: 10px;
      }
    }

    .menu {
      display: flex;
      flex-wrap: wrap;

      .box {
        width: 80px;
        height: 90px;
        border: 1px solid #999;
        color: #999;
        margin-right: 20px;
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        i {
          font-size: 40px;
          margin-bottom: 10px;
        }
      }
    }
  }
}

.el-table .DisableSelection .cell .el-checkbox__inner {
  display: none !important;
  position: relative;
}

.el-table .DisableSelection .cell:before {
  content: "";
  position: absolute;
  right: 11px;
}

.store-table {
  /deep/ .el-table__header-wrapper .el-table-column--selection .cell {
    display: none;
  }
}

.mlist {

  margin: 10px;
  padding: 5px;

  span {

    margin-top: 2px;
    display: block;
  }

  span:after {

    border: black solid 1px;
  }
}
</style>
