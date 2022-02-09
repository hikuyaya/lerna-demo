<template>
  <div class="monthday" v-bind:style="{'border':focus?'1px solid #00AAEE':'1px solid #DCDFE8','border-radius': '5px'}">
    <el-row type="flex" justify="start">

      <el-col :span="5" class="typeSelect">
        <el-select v-model="mtype" @change="selectChange" popper-class="aaa" @blur="focus=false" :readonly="readonly"
                   @focus="focus=true">
          <el-option
              label="按月"
              value="month">
          </el-option>
          <el-option

              label="按日"
              value="day">
          </el-option>
        </el-select>
      </el-col>
      <el-col>
        <el-date-picker :type="mytype"
                        v-model="date"
                        @blur="focus=false"
                        size="small"
                        @focus="focus=true"
                        placeholder="请选择时间"
                        :readonly="readonly"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        @change="change"
                        :disabled="disabled"></el-date-picker>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import create from "../../../core/create";
import moment from 'moment';

moment.locale();
export default create({
  name: "monthday",
  data() {
    return {
      focus: false,
      date: "",
      mytype: "monthrange",
      mtype: "month",
    };
  }, mounted() {


  },
  watch: {
    value(value) {
      if (value.value) {
        this.date = value.value;
        this.defaultTime = value.value;
        this.mtype = value.mtype;
      }
    }
  },
  computed: {
    pickerOptions: function () {
      let that = this;
      return {
        disabledDate: (time) => {

          if (that.mtype == "month") {
            return time.getTime() < moment().subtract(that.timeLimit.month, "months").toDate().getTime() || time.getTime() > Date.now();
          }
          if (that.mtype == "day") {
            return time.getTime() < moment().subtract(that.timeLimit.day, "days").toDate().getTime() || time.getTime() > Date.now();
          }
          return false;
        }
      }
    }
  },
  methods:
      {
        change(value) {
          let result = [...value, this.mtype];
          if (value.length > 0) {
            this.$emit('input', result);
            this.$emit('change', result);
          }
        }
        ,
        selectChange(value) {

          this.stype = value;

          if (value == "month") {
            this.mytype = "monthrange"
          } else {
            this.mytype = "daterange"
          }
        }

      }
  ,
  props: {
    readonly: {
      type: Boolean,
      default:
          false
    }
    ,
    disabled: {
      type: Boolean,
      default:
          false
    }
    ,
    timeLimit: {
      type: Object,
      default:

          function () {
            return {
              month: 12,
              day: 30
            }
          }
    }
    ,
    value: {}
    ,
    defaultValue: {
      type: [String, Array]
    }
    ,
  }
})
;
</script>
<style lang="scss">
.monthday {

  .el-input__suffix {

    display: none;
  }

  .el-input__icon {
    display: none;
  }

  .el-select {
    width: auto !important;
    padding: 0;
    border: none;
    width: auto;

  }

  .el-input {
    padding: 0;
    border: none;
    width: auto;
    margin: 0;
  }

  .el-input input {
    padding-left: 5px;
    margin: 0;
  }

  .el-input__inner {
    border: none;
    padding-left: 5px;
  }

  .el-select .el-input__inner {
    padding-right: 0;
    padding-left: 5px;
    border-radius: 0;
    margin-left: 1px;
  }

  .unfoucs {
    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }

  .foucs {

    border-radius: 4px;
    border: 1px solid #dcdfe6;
  }

  input {
    padding-left: 5px;
  }

  .typeSelect {
    padding: 1px;
    border-right: 1px solid #DCDFE8;
  }
}
</style>

