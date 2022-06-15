<template>
  <div class="employeeSchedule">
    <el-form :model="ruleForm" ref="ruleForm" inline>
      <el-form-item
        label="门店："
        prop="shopid"
        :rules="[{ required: true, message: '请选择一个门店' }]">
        <el-select
          clearable
          v-model.trim="ruleForm.shopid"
          filterable
          :filter-method="filterShop"
          placeholder="请选择门店"
          style="width: 160px">
          <el-option
            :key="item.id"
            :label="item.shopname"
            :value="item.id"
            v-for="item in filterShopList">
            <span style="float: left">{{ item.shopcode }}</span>
            <span style="float: right; color: #8492a6; font-size: 13px">{{
              item.shopname
            }}</span>
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="选择月份：" prop="month">
        <el-date-picker
          :clearable="false"
          v-model="ruleForm.month"
          type="month"
          value-format="yyyy-MM"
          format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="职务：" prop="pscode">
        <el-select
          clearable
          filterable
          placeholder="请选择"
          v-model.trim="ruleForm.pscode"
          @change="getSearchFormPositionLevelList">
          <el-option
            style="width: 100px"
            :key="item.id"
            :label="item.psname"
            :value="item.pscode"
            v-for="item in searchFormPositionList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="级别：" prop="pslcode">
        <el-select
          clearable
          filterable
          placeholder="请选择"
          v-model.trim="ruleForm.pslcode">
          <el-option
            :key="item.id"
            :label="item.pslname"
            :value="item.pslcode"
            v-for="item in searchFormPositionLevelList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="人员：" prop="eename">
        <el-input
          style="width: 120px"
          clearable
          filterable
          placeholder="姓名/工号"
          v-model="ruleForm.eename"></el-input>
      </el-form-item>

      <el-form-item label="">
        <el-button @click="getScheduleList" type="primary">查询</el-button>
      </el-form-item>
      <el-form-item label="">
        <!--<el-button @click="batchSchedule" type="primary">批量排班</el-button>-->
      </el-form-item>
      <el-form-item label="">
        <!--<el-button @click="batchCopy">批量复制排班</el-button>-->
      </el-form-item>
    </el-form>
    操作提示：1、点击图表中的班次方格，每点击一次可快速切换班次；
    <el-table
      ref="multipleTable"
      style="width: 100%; overflow-x: auto; overflow-y: auto"
      height="470px"
      :data="tableData"
      @selection-change="handleSelectionChange">
      <yid-table-column type="selection" width="55"></yid-table-column>
      <el-table-column
        prop="eename"
        align="center"
        fixed
        label="员工姓名"
        width="100">
      </el-table-column>
      <el-table-column
        v-for="item in monthDayList"
        align="center"
        :prop="item.day"
        :label="item.dayWeek">
        <template slot-scope="scope">
          <div
            :style="[
              {
                background: scope.row[item.day]
                  ? getColor(scope.row[item.day].color)
                  : '#FFFFFF',
                cursor: 'pointer'
              }
            ]">
            {{ scope.row[item.day] ? scope.row[item.day].cname : '--' }}
          </div>

          <!-- :style="[{'background': getClassesColor(scope.row,item),'cursor':'pointer'}]">-->
          <!--                        {{getThisClasses(scope.row,item)}}-->
          <!--                    </div>-->
          <!-- {{ scope.row.employeeSchedules.find(e=>monthDayList[i].day==e.day)?scope.row.employeeSchedules.find(e=>monthDayList[i].day==e.day).classes:"&#45;&#45;" }}-->
        </template>
      </el-table-column>
    </el-table>
    <yid-dialog
      :title="pbDialog.title"
      :visible.sync="pbDialog.visible"
      width="450px">
      <el-form ref="pbForm" :model="pbForm" label-width="140px">
        <el-form-item
          label="排班人员："
          prop="eenames"
          :rules="[{ required: true, message: '排班人员不能为空' }]">
          {{ pbForm.eenames }}
        </el-form-item>
        <el-form-item label="日期范围：" prop="days">
          <el-date-picker
            v-model="pbForm.days"
            :picker-options="expireTimeOption"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item
          label="班次："
          prop="pccode"
          :rules="[{ required: true, message: '请选择班次' }]">
          <el-select
            value-key="id"
            placeholder="请选择班次"
            v-model.trim="pbForm.pccode">
            <el-option
              :key="item.code"
              :value="item.ccode"
              :label="item.cname"
              v-for="item in checkClassAll" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="batchPb" type="primary">保存</el-button>
          <el-button @click="batchPbCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
    <yid-dialog
      :title="copyDialog.title"
      :visible.sync="copyDialog.visible"
      width="450px">
      <el-form ref="copyForm" :model="copyForm" label-width="140px">
        <el-form-item
          label="排班人员："
          prop="eenames"
          :rules="[{ required: true, message: '排班人员不能为空' }]">
          {{ copyForm.eenames }}
        </el-form-item>
        <el-form-item
          label="历史排班："
          prop="omon"
          :rules="[{ required: true, message: '请选择历史排班' }]">
          <el-select
            value-key="id"
            placeholder="请选择班次"
            v-model.trim="copyForm.omon">
            <el-option
              :key="item.id"
              :value="item.id"
              :label="item.value"
              v-for="item in yearmonList" />
          </el-select>
        </el-form-item>
        <el-form-item
          label="应用到："
          prop="nmon"
          :rules="[{ required: true, message: '请选择历史排班' }]">
          <el-select
            value-key="id"
            placeholder="请选择班次"
            v-model.trim="copyForm.nmon">
            <el-option
              :key="item.id"
              :value="item.id"
              :label="item.value"
              v-for="item in yearmonList" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="batchPbCopy" type="primary">保存</el-button>
          <el-button @click="batchPbCopyCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from '@src/library'
import { isEmpty } from '../../library/helper/validate'
const weeks = new Array('日', '一', '二', '三', '四', '五', '六')
let classkey = 0
export default {
  name: 'employeeSchedule',
  data: function () {
    return {
      awardDictList: [],
      tableData: [],
      ruleForm: {
        month: '',
        psid: '',
        pslid: '',
        pscode: '',
        pslcode: '',
        eename: '',
        isDel: '0',
        status: '1',
        shopid: ''
      },
      mutiImportDialog: {
        title: '',
        visible: false,
        importData: []
      },
      monthDayList: [],
      searchFormPositionList: [], //职务list
      searchFormPositionLevelList: [], //级别list 搜索表单用
      pbDialog: {
        title: '批量排班',
        visible: false
      },
      copyDialog: {
        title: '批量复制排班',
        visible: false
      },
      pbForm: {
        eeids: '',
        eenames: '',
        days: [],
        pccode: '',
        dayMin: '',
        dayMax: ''
      },
      copyForm: {
        eeids: '',
        eenames: '',
        omon: '',
        nmon: ''
      },
      checkClassAll: [],
      employeeVOs: [],
      yearmonList: [],
      allShopList: [],
      filterShopList: []
    }
  },
  props: {
    expireTimeOption: {
      // 具体请参考 element-ui pick-option
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  computed: {},
  mounted() {
    let d = new Date()
    let year = d.getFullYear()
    let month = d.getMonth() + 1
    if (Number(month) < 10) {
      month = '0' + month
    }
    let date1 = year + '-' + month
    this.ruleForm.month = date1

    //yearmonList 年月下拉列表
    this.yearmonList = [
      { id: year + '-01', value: '1月' },
      { id: year + '-02', value: '2月' },
      { id: year + '-03', value: '3月' },
      { id: year + '-04', value: '4月' },
      { id: year + '-05', value: '5月' },
      { id: year + '-06', value: '6月' },
      { id: year + '-07', value: '7月' },
      { id: year + '-08', value: '8月' },
      { id: year + '-09', value: '9月' },
      { id: year + '-10', value: '10月' },
      { id: year + '-11', value: '11月' },
      { id: year + '-12', value: '12月' }
    ]

    this.getSearchFormPositionList()
    this.getCheckClassAll()
    this.getDayWeeks()
    //   this.getScheduleList();
    this.getShopList({ status: '1' })
  },
  methods: {
    getScheduleList() {
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          this.monthDayList = []

          this.getDayWeeks()
          /*     if(this.ruleForm.shopid=="")
                             {
                                 yid.util.error("请选择门店信息");
                                 return;
                             }
             */
          if (isEmpty(this.ruleForm.month)) {
            yid.util.error('查询条件[年月]不能为空')
            return
          }

          if (this.ruleForm.month instanceof Date)
            this.ruleForm.month = this.ruleForm.month.formatDate('yyyy-MM')

          this.tableData = []
          let that = this
          service.pers.employeeSchedule
            .employeeScheduleList(this.ruleForm)
            .then(res => {
              if (res.resp_code == 200) {
                //this.tableData = res.data
                res.data.forEach(item => {
                  let tmp = item
                  item.employeeSchedules.forEach(item2 => {
                    tmp[item2.day] = item2
                  })

                  that.tableData.push(tmp)
                })

                /*const checkVOs = [];
                                   for(let i=0 ; i<this.tableData.length ;i++){
                                       this.employeeVOs.forEach(res=>{
                                           if(res.eecode === this.tableData[i].eecode){
                                               checkVOs.push(this.tableData[i]);
                                           }
                                       })
                                   }
                                   this.$nextTick(()=> {
                                       this.toggleSelection(checkVOs)
                                   })*/
              }
            })
        }
      })
    },
    getSearchFormPositionLevelList(pscode) {
      this.ruleForm.pslcode = null
      service.positionLevel.listByPscode({ pscode: pscode }).then(res => {
        if (res.resp_code == 200) {
          this.searchFormPositionLevelList = res.data
        }
      })
    },
    getSearchFormPositionList() {
      service.position.list({ status: '1', isDel: '0' }).then(res => {
        if (res.resp_code == 200) {
          this.searchFormPositionList = res.data
        }
      })
    },
    getCheckClassAll() {
      service.pers.checkClass.checkClassAll({ status: '1' }).then(res => {
        if (res.resp_code == 200) {
          this.checkClassAll = res.data
        }
      })
    },
    getDayWeeks() {
      //获取选中月的第一和最后一天遍历出每一天
      var ruleYear = this.ruleForm.month.substr(0, 4)
      var ruleMonth = Number(this.ruleForm.month.substr(5, 2))
      var ruleMonthShow = ''
      if (Number(ruleMonth) < 10) {
        ruleMonthShow = '0' + ruleMonth
      } else {
        ruleMonthShow = String(ruleMonth)
      }

      //本月的结束时间
      var monthEndDay = new Date(ruleYear, ruleMonth, 0).getDate()
      var maxDay = Number(monthEndDay)

      for (var i = 1; i <= maxDay; i++) {
        var iShow = ''
        if (i < 10) {
          iShow = '0' + i
        } else {
          iShow = String(i)
        }
        let weekday = new Date(ruleYear, ruleMonth - 1, i).getDay()
        let dayWeek = ruleMonth + '月' + i + '日' + ' ' + weeks[weekday]
        let day = ruleYear + '-' + ruleMonthShow + '-' + iShow

        const monthDay = { dayWeek: dayWeek, day: day }
        this.monthDayList.push(monthDay)
      }
    },
    getThisClasses(row, item) {
      let result = '--'
      if (row.employeeSchedules.length > 0) {
        for (var i = 0; i < row.employeeSchedules.length; i++) {
          if (row.employeeSchedules[i].day === item.day) {
            result = row.employeeSchedules[i].classes
          }
        }
      }
      return result
      //return row.employeeSchedules.find(e=>item.day==e.day)?row.employeeSchedules.find(e=>item.day==e.day).classes:"--"
    },
    getClassesColor(row, item) {
      let color = ''
      if (row.employeeSchedules.length > 0) {
        for (var i = 0; i < row.employeeSchedules.length; i++) {
          if (row.employeeSchedules[i].day === item.day) {
            color = row.employeeSchedules[i].color
          }
        }
      }

      if (!isEmpty(color)) {
        var wz = color.indexOf('#')
        color = color.substr(wz, color.length - 1)
      }
      return color
      //let color = row.employeeSchedules.find(e=>item.day==e.day)?row.employeeSchedules.find(e=>item.day==e.day).color : "";
    },
    handleSelectionChange(rows) {
      this.employeeVOs = rows
    },
    getnowDate() {
      var ruleYear = this.ruleForm.month.substr(0, 4)
      var ruleMonth = Number(this.ruleForm.month.substr(5, 2))
      let d = new Date()
      let year = d.getFullYear()
      let month = d.getMonth() + 1
      let day = d.getDate()
      if (Number(month) < 10) {
        month = '0' + month
      }
      if (Number(day) < 10) {
        day = '0' + day
      }
      let datenow = ruleYear + '-' + ruleMonth + '-01'
      if (ruleYear == year && ruleMonth == month) {
        datenow = ruleYear + '-' + ruleMonth + '-' + day
      }
      return datenow
    },
    getMaxDate() {
      //获取30天之后的日期
      var ruleYear = this.ruleForm.month.substr(0, 4)
      var ruleMonth = Number(this.ruleForm.month.substr(5, 2))
      //本月的结束时间
      var monthEndDay = new Date(ruleYear, ruleMonth, 0).getDate()
      var maxDay = Number(monthEndDay)
      return ruleYear + '-' + ruleMonth + '-' + maxDay
    },
    getTimeByDay(today, num) {
      return today + 60 * 60 * 1000 * 24 * num
    },
    formatTime(time) {
      //new Date(time).toISOString()    => 2019-02-23T08:40:35.825Z
      return new Date(time).toISOString().split('T')[0]
    },
    batchSchedule() {
      if (this.employeeVOs.length == 0) {
        yid.util.info('请选中批量排班员工!')
        return false
      }
      if (this.employeeVOs.length > 5) {
        yid.util.info('请选中最多5个员工批量排班!')
        return false
      }
      //设置时间范围和人员姓名
      this.pbDialog.visible = true
      this.pbForm.eeids = ''
      this.pbForm.eenames = ''
      this.pbForm.days = []
      this.pbForm.pccode = ''
      this.pbForm.dayMin = ''
      this.pbForm.dayMax = ''

      let nowDate = this.getnowDate()
      let maxDate = this.getMaxDate()
      this.pbForm.days.push(maxDate)
      this.pbForm.days.unshift(nowDate)

      let eeids = ''
      let eenames = ''
      for (var i = 0; i < this.employeeVOs.length; i++) {
        eeids = eeids + this.employeeVOs[i].id + ','
        eenames = eenames + this.employeeVOs[i].eename + ','
      }
      eenames = eenames.substr(0, eenames.length - 1)
      eeids = eeids.substr(0, eeids.length - 1)
      this.pbForm.eeids = eeids
      this.pbForm.eenames = eenames
    },
    batchPbCancel() {
      this.pbDialog.visible = false
    },
    batchPb() {
      this.$refs['pbForm'].validate(valid => {
        if (valid) {
          this.pbForm.dayMin = this.pbForm.days[0]
          this.pbForm.dayMax = this.pbForm.days[1]
          if (this.pbForm.dayMin < this.getnowDate()) {
            yid.util.info('开始日期不能在当前日期之前')
            return false
          }
          //调用批量排班接口
          service.pers.employeeSchedule.batchPb(this.pbForm).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('操作成功')
              this.batchPbCancel()
              this.getScheduleList()
            }
          })
        }
      })
    },
    batchCopy() {
      if (this.employeeVOs.length == 0) {
        yid.util.info('请选中批量复制排班员工!')
        return false
      }
      if (this.employeeVOs.length > 5) {
        yid.util.info('请选中最多5个员工批量复制!')
        return false
      }
      //设置人员姓名
      this.copyDialog.visible = true
      this.copyForm.eeids = ''
      this.copyForm.eenames = ''
      this.copyForm.omon = ''
      this.copyForm.nmon = ''

      let eeids = ''
      let eenames = ''
      for (var i = 0; i < this.employeeVOs.length; i++) {
        eeids = eeids + this.employeeVOs[i].id + ','
        eenames = eenames + this.employeeVOs[i].eename + ','
      }
      eenames = eenames.substr(0, eenames.length - 1)
      eeids = eeids.substr(0, eeids.length - 1)
      this.copyForm.eeids = eeids
      this.copyForm.eenames = eenames
    },
    batchPbCopyCancel() {
      this.copyDialog.visible = false
    },
    batchPbCopy() {
      this.$refs['copyForm'].validate(valid => {
        if (valid) {
          if (this.copyForm.omon >= this.copyForm.nmon) {
            yid.util.info('历史排班月不能大于或等于应用月份')
            return false
          }
          //调用批量复制排班接口
          service.pers.employeeSchedule.batchPbCopy(this.copyForm).then(res => {
            if (res.resp_code == 200) {
              yid.util.success('复制成功')
              this.batchPbCopyCancel()
              this.getScheduleList()
            }
          })
        }
      })
    },
    getRandomNumberByRange(start, end) {
      return Math.floor(Math.random() * (end - start) + start)
    },
    chageBc(row, item) {
      //改变排班表信息
      const scheduleparam = {
        pccode: this.checkClassAll[classkey].ccode,
        dayStr: item.day,
        eeid: row.id,
        eecode: row.eecode,
        eename: row.eename
      }

      let that = this
      service.pers.employeeSchedule.changePb(scheduleparam).then(res => {
        if (res.resp_code == 200) {
          //if(yid.util.isEmpty(row[item.day])){
          var cell = {}
          cell.eecode = row.eecode
          cell.day = item.day
          that.$set(row, item.day, cell)
          if (row[item.day].day === item.day) {
            row[item.day].cname = this.checkClassAll[classkey].cname
            row[item.day].color = this.checkClassAll[classkey].color
          }
          //}else{
          //    if(row[item.day].day === item.day){

          //        row[item.day].cname = this.checkClassAll[classkey].cname;
          //        row[item.day].color = this.checkClassAll[classkey].color;
          //    }
          //}
          classkey = classkey + 1

          if (classkey > this.checkClassAll.length - 1) {
            classkey = 0
          }
        }
      })
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    getShopList(params) {
      service.chain.shop.shopList(params).then(res => {
        if (res.resp_code == 200) {
          this.filterShopList = res.data
          this.allShopList = Object.assign(this.filterShopList) //保留原数据
        }
      })
    },
    filterShop(v) {
      this.filterShopList = this.allShopList.filter(item => {
        // 如果直接包含输入值直接返回true
        if (item.shopname.indexOf(v) !== -1) return true
        if (item.shopcode.indexOf(v) !== -1) return true
      })
    },
    getColor(color) {
      let index = color.lastIndexOf('#')
      return color.substring(index, color.length)
    }
  }
}
</script>

<style scoped></style>
