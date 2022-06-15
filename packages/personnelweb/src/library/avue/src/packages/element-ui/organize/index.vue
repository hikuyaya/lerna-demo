<template>
  <div class="monthday"
       v-bind:style="{'border':myfocus?'1px solid #00AAEE':'1px solid #DCDFE8','border-radius': '5px'}">
    <el-row type="flex" justify="start">

      <el-col :span="5" class="typeSelect">
        <el-select v-model="mtype" @change="selectChange" popper-class="aaa" @blur="myfocus=false"
                   :disabled="readonly1"
                   @focus="myfocus=true">
          <el-option
              label="美发"
              value="1">
          </el-option>
          <el-option

              label="美容"
              value="2">
          </el-option>
        </el-select>
      </el-col>
      <el-col>
        <avue-cascader v-model="text" :dic.sync="dic" :checkStrictly="true"
                       :disabled="readonly2"
                       @blur="myfocus=false" @focus="myfocus=true"
                       placeholder="请选择组织架构"></avue-cascader>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import axios from 'axios'
import create from "../../../core/create";

let baseUrl = 'api-chain/datamanager/getManageOrg'

export default create({
  name: "organize",
  // mixins: [props(), event()],
  // mixins: [event()],
  data() {
    return {
      myfocus: false,
      text: undefined,
      readonly1: true,
      readonly2: false,
      dic: [],
      mtype: "1",
      mydata: {
        "1": undefined,
        "2": undefined
      }
    }
  },
  created() {


    if (this.defaultValue && this.defaultValue.length >= 1) {

      if (this.defaultValue[0]) {
        this.mtype = this.defaultValue[0].value;
        this.readonly1 = this.defaultValue[0].disabled;
      }
      if (this.defaultValue[1]) {
        this.text = this.defaultValue[1].value;
        this.readonly2 = this.defaultValue[1].disabled;

      }

    }

    this.selectChange(this.mtype);

  },
  mounted(){

    let timeout = setTimeout( ()=>{
      this.mychange([this.text])
      clearTimeout(timeout)
    },500);

  },
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
        console.log('look',n)
        let tempArr = []
        if(n.indexOf(',') != -1){        //区部处组织架构优化
          tempArr = n.split(',')
        }
        console.log(tempArr[tempArr.length - 1])
        this.mychange(tempArr[tempArr.length - 1])
      }
    },
    value: {
      handler() {
        this.initVal();
      }
    }
  },

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
    }, value: {},
    defaultValue: {
      type: [Object, Array],
      default: () => [{value: "1", disabled: false}, {value: "", disabled: false}]
    },
  },
  methods:
      {
        initVal() {
          if (this.readonly2 && this.value == '') {
            this.mychange(this.text)
          } else if (this.value instanceof Array || this.value == '')
            this.text = this.value;
        },
        mychange(value) {
          if (value instanceof Array) {
            let valueElement = value[value.length - 1];
            this.$emit('input', valueElement);
            this.$emit('change', valueElement);
          } else if (value != '') {
            this.$emit('input', value);
            this.$emit('change', value);
          }

        }
        ,
        myinput(value) {
          let valueElement = value[value.length - 1];
          this.$emit('input', valueElement);
          this.$emit('change', valueElement);
        },
        selectChange(value) {

          this.mtype = value;

          let that = this;
          if (this.mydata[value] == undefined) {
            axios.get(baseUrl, {params: {btype: value}}).then(function (res) {

              let data = res.data;
              if (data && data.length > 0) {
                that.mydata[value] = data;
                that.dic = data;
              } else {
                that.mydata[value] = [];
                that.dic = [];
              }

            }).catch(() => {
              that.mydata[value] = undefined;
            });
          } else {
            this.dic = this.mydata[value];
          }
        }
      }
})
;
</script>
