<template>
  <div class="monthday"
        v-bind:class="['normal_state',{ active_state:myfocus ,error_state:errorstate }]" >
<!--       v-bind:style="{'border':myfocus?'1px solid #00AAEE':'1px solid #DCDFE8','border-radius': '5px'}">-->
    <el-row type="flex" justify="start">

      <el-col :span="5" class="typeSelect">
        <el-select v-model="mtype" @change="selectChange" popper-class="aaa" @blur="myfocus=false" :readonly="readonly"
                   @focus="myfocus=true">
          <el-option
              label="按月"
              :value="true">
          </el-option>
          <el-option

              label="按日"
              :value="false">
          </el-option>
        </el-select>
      </el-col>
      <el-col>

        <avue-date :type="mytype"
                   v-model="text"
                   @blur="myfocus=false"
                   size="small"
                   @focus="myfocus=true"
                   placeholder="请选择时间"
                   :readonly="readonly"
                   start-placeholder="开始时间"
                   end-placeholder="结束时间"
                   :picker-options="pickerOptions"
                   :value-format="valueFormat"
                   clearable
                   popper-class="custompop"
                   :disabled="disabled"></avue-date>
        <!--        <el-date-picker :type="mytype"-->
        <!--                        v-model="date"-->
        <!--                        @blur="focus=false"-->
        <!--                        size="small"-->
        <!--                        @focus="focus=true"-->
        <!--                        placeholder="请选择时间"-->
        <!--                        :readonly="readonly"-->
        <!--                        start-placeholder="开始时间"-->
        <!--                        end-placeholder="结束时间"-->
        <!--                        :picker-options="pickerOptions"-->
        <!--                        value-format="yyyy-MM-dd HH:mm:ss"-->
        <!--                        @change="change"-->
        <!--                        :disabled="disabled"></el-date-picker>-->
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
      myfocus: false,
      date: "",
      text: ["", ""],
      mytype: "monthrange",
      mtype: true,
      tmp: ["", "", true],
      errorstate:false
    };
  },
  created() {

    //  this.text = this.tmp;
    console.log(this.defaultValue)
    if (this.defaultValue && this.defaultValue.month && this.defaultValue.day) {

      if (this.defaultValue.mtype) {

        this.tmp[0] = this.defaultValue.month[0];
        this.tmp[1] = this.defaultValue.month[1];
        this.mytype = "monthrange"

      } else if (this.defaultValue.day != undefined) {
        this.tmp[0] = this.defaultValue.day[0];
        this.tmp[1] = this.defaultValue.day[1];
        this.mytype = "daterange"
      }
      this.tmp[2] = this.defaultValue.mtype
      this.mtype = this.defaultValue.mtype
      this.text = [this.tmp[0], this.tmp[1]];
      // this.text[1] =
      this.$emit('input', this.tmp);
      this.$emit('change', this.tmp);

    }

  },
  mounted() {

    // if (this.tmp[0] && this.tmp[1]) {
    //   this.mychange(this.tmp);
    // }

    let timeout = setTimeout(() => {
      this.mychange(this.tmp);
      clearTimeout(timeout)
    }, 500);


  }
  ,
  watch: {
    // value(value) {
    //   if (value.value) {
    //     this.date = value.value;
    //     this.defaultTime = value.value;
    //     this.mtype = value.mtype;
    //   } else {
    //     this.date = undefined;
    //   }
    // }
    text: {
      handler(n) {
        this.mychange(n)
      }
    },
    value: {
      handler() {
        this.initVal();
      }
    }
  },
  computed: {
    pickerOptions: function () {
      let that = this;
      return {
        disabledDate: (time) => {

          if (that.timeLimit&&that.timeLimit.currentLimit) {
            if (that.mtype) {
              let months = moment().subtract(that.timeLimit.month, "months").toDate().getMonth() + 1
              months = months > 9 ? months : '0' + months;
              let month_temp = moment().subtract(that.timeLimit.month, "months").toDate().getFullYear() + '-' + months + '-01 00:00:00'
              return time.getTime() < new Date(month_temp).getTime() || time.getTime() > Date.now();
            } else {
              return time.getTime() < moment().subtract(that.timeLimit.day, "days").toDate().getTime() || time.getTime() > Date.now();
            }
          }

          return time.getTime() > Date.now();
        },

        onPick: ({maxDate, minDate}) => {
          if (maxDate && minDate && this.timeLimit) {
            let maxDateMoment = moment(maxDate.toDate());
            let minDateMoment = moment(minDate.toDate());
            if (that.mtype) {


              let diff = maxDateMoment.diff(minDateMoment, "months");
              if (diff >= that.timeLimit.month) {
                //this.$refs.crud.vaildErrorItem(columnData.fieldName, '时间范围不能超过' + this.timeLimit + '天');
                that.$parent.$parent.validateMessage='时间范围不能超过' + that.timeLimit.month + '月';
                that.$parent.$parent.validateState='error';
                that.$parent.$parent.error=that.$parent.$parent.validateMessage;
                that.errorstate=true;
                throw new Error("时间超过范围");
              }
            } else {
              let diff = maxDateMoment.diff(minDateMoment, "days");
              if (diff >= that.timeLimit.day) {
                //this.$refs.crud.vaildErrorItem(columnData.fieldName, '时间范围不能超过' + this.timeLimit + '天');
                that.$parent.$parent.validateMessage='时间范围不能超过' + that.timeLimit.day + '天';
                that.$parent.$parent.validateState='error';
                that.$parent.$parent.error=that.$parent.$parent.validateMessage;
                that.errorstate=true;
                throw new Error("时间超过范围");
              }


            }


          }
          that.errorstate=false;
        },

      }
    },
    valueFormat: function () {
      if (this.mtype) {
        return this.valueFormats[0]
      }
      if (this.mtype != undefined) {
        return this.valueFormats[1];
      }

      return "yyyy-MM-dd HH:mm:ss";
    }
  },
  methods:
      {

        initVal() {
          if (this.value & this.value != '') {
          } else if (this.value && this.value == '') {
            this.tmp = [];
            this.tmp[2] = true
            this.text = this.tmp;
            this.mtype = true
          }
        },
        mychange(value) {
          if (value == this.tmp) {
            this.$emit('input', this.tmp);
            this.$emit('change', this.tmp);
            return;
          }
          //   let result = [...this.text, this.mtype];
          if (value && value != '' && value.length > 0) {

            this.tmp[0] = value[0];
            this.tmp[1] = value[1];
            this.tmp[2] = value[2] || this.mtype;
            this.$emit('input', this.tmp);
            this.$emit('change', this.tmp);
          }
        }
        ,
        selectChange(value) {
          this.mtype = value;
          this.tmp[2] = value
          // if (this.text && this.text.length == 2)
          //   this.mychange([this.text[0], this.text[1], value]);
          if (this.defaultValue && this.defaultValue.month && this.defaultValue.day) {
            if (value) {
              this.text[0] = this.defaultValue.month[0]
              this.text[1] = this.defaultValue.month[1];
              this.mychange([this.defaultValue.month[0], this.defaultValue.month[1], value]);
            } else if (this.defaultValue.day != undefined) {
              this.text = this.defaultValue.day

              this.mychange([this.defaultValue.day[0], this.defaultValue.day[1], value]);
            }
          }


          if (value) {
            this.mytype = "monthrange"
          } else {
            this.mytype = "daterange"
          }


        }

      }
  ,
  props: {

    // value:{
    // },
    // value:{
    //   type: Array,
    //   default:()=>{
    //
    //     return[]
    //   }
    //
    // },
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
    valueFormats: {
      type: Array,
      default: () => ["yyyy-MM-dd HH:mm:ss", "yyyy-MM-dd HH:mm:ss"]
    },
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
    defaultValue: {
      type: Object
    },
    value: {}
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
.active_state{
  border: 1px solid #00AAEE !important;
}
.normal_state{
  border: 1px solid #DCDFE8;
border-radius: 5px
}

.error_state{
  border: 1px solid  #f56c6c !important;

}
</style>

