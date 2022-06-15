<template>
  <div class="dept">
    <el-form inline>
      <el-form-item>
        <el-page-header @back="backup()"></el-page-header>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="addPerfratioRule()">添加业绩比率规则</el-button>
      </el-form-item>
    </el-form>

    <yid-table ref="table" :data="perfratioData" style="margin-top: 12px;">
      <yid-table-column label="业务组" min-width="80" prop="bbname"></yid-table-column>
      <yid-table-column label="项目类别" min-width="100" prop="sname"></yid-table-column>
      <yid-table-column label="支付方式" min-width="100" prop="payname"></yid-table-column>
      <yid-table-column label="业绩比率" min-width="100" prop="perfratio"></yid-table-column>
      <yid-table-column label="操作" min-width="100" prop="content">
        <template slot-scope="scope">
          <el-button type="text" @click="editPerfratio(scope.row)"><i class="edit"></i>编辑</el-button>
          <el-button type="text" @click="deletePerfratio(scope.row)"><i class="view"></i>删除</el-button>
        </template>
      </yid-table-column>
    </yid-table>

    <yid-dialog :title="addPerfratio.title" :visible.sync="addPerfratio.visible" width="600px">
      <el-form label-width="100px" ref="selectPro">
        <el-form-item label="选择项目类别:">
          <el-select clearable v-model="addPerfratio.branch" @change="changeBranchType(addPerfratio.branch)"
                     placeholder="请选择项目" style="width: 140px;">
            <el-option v-for="item in branchs"
                       :key="item.id"
                       :value="item.id"
                       :label="item.bname"></el-option>
          </el-select>
          <el-select clearable v-model="addPerfratio.serviceType" placeholder="请选择分类" style="margin-left: 5px; width: 140px;">
            <el-option
                v-for="item in addPerfratio.serviceTypes"
                :key="item.id"
                :label="item.sname"
                :value="item.scode">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form label-width="100px" ref="selectPay">
        <el-form-item label="选择支付方式:">
          <el-select clearable v-model="addPerfratio.paytype" placeholder="请选择支付方式" style="width: 140px;">
            <el-option v-for="item in payDatas"
                       :key="item.payid"
                       :value="item.paycode"
                       :label="item.payname">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-form label-width="100px" ref="selectPay">
        <el-form-item label="业绩比率(%):" style="width: 240px;" prop="perfratio">
          <el-input type="number" min="0" max="100" placeholder="业绩比率"  v-model="addPerfratio.perfratio"/><br/>
        </el-form-item>
      </el-form>
      <div style="text-align: center">
        <el-button type="primary" @click="savePerfratio(addPerfratio.id)">确认添加</el-button>
        <el-button type="primary" @click="addPerfratio.visible = false" >取消</el-button>
      </div>
    </yid-dialog>
  </div>
</template>

<script>
import yid from '@src/library'
import service from '@src/service'
import YidAsk from "../../library/components/ask/src/index.vue";
import {addPerfratioData} from "@src/service/modules/config/servicePrice";

/**
 * 清空
 * @param obj
 */
function isClear(obj) {
  for (var i in obj) {
    if (obj[i] instanceof Array) {
      obj[i] = []
    } else {
      obj[i] = ''
    }
  }
}

export default {
  components: {YidAsk},
  data() {
    return {
      activeName: 'project',
      myheaders:{},
      perfratioData: [],
      branch: [],
      payDatas: [],
      serviceType: [],
      serviceAllType: [],
      servids: [],
      form: {
        branch: '',
        scode: '',
        servname: '',
        status: '1',
      },
      addPerfratio: {
        title: '',
        id:null,
        visible: false,
        branchs: [],
        branch: '',
        paytype: '',
        serviceTypes: [],
        serviceType: '',
        perfratio: null,
        services: [],
        payDatas: []
      },
      perfratioObj: {
        id:null,
        pricecode: null,
        bbid: null,
        bbname: null,
        scode: null,
        sname: null,
        paycode: null,
        payname: null,
        perfratio:null
      },
      sptdata: null,
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      service.serviceInfo.findbranch().then(res => {
        this.branchs = res.data
        this.addPerfratio.branchs = res.data
      });
      service.serviceInfo.findServiceType().then(res => {
        this.serviceAllType = res.data;
      })
      service.pay.queryPays().then(res =>{
        this.payDatas = res.data;
        this.addPerfratio.payDatas = res.data
      })
      this.queryPerfratioData();
    },
    queryPerfratioData() {
      service.servicePrice.queryPerfratio(this.sptdata.spcode).then(res => {
        if (res.resp_code == "200") {
          this.perfratioData = res.data;
        } else {
          yid.util.error(res.resp_msg);
        }
      });
    },
    clear(data) {
      isClear(this.form)
      this.sptdata = data
      this.queryPerfratioData();
    },
    backup() {
      this.$emit('onClose');
    },
    //添加业绩比率规则
    addPerfratioRule() {
      this.addPerfratio.title = "添加业绩比率规则";
      this.addPerfratio.visible = true;
      this.perfratioObj.id = null;
      this.addPerfratio.id = null;
      this.addPerfratio.branch = null;
      this.addPerfratio.serviceType = null;
      this.addPerfratio.paytype = null;
      this.addPerfratio.perfratio = null;
    },
    //编辑业绩比率规则
    editPerfratio(row) {
      this.changeBranchType(row.bbid.toString());
      this.addPerfratio.branch = row.bbid.toString();
      this.addPerfratio.serviceType = row.scode;
      this.addPerfratio.paytype = row.paycode;
      this.addPerfratio.perfratio = row.perfratio;
      this.addPerfratio.id = row.id;
      this.addPerfratio.title = "编辑业绩比率规则";
      this.addPerfratio.visible = true;
    },
    //删除业绩比率规则
    deletePerfratio(row) {
      yid.util.confirm('即将删除该业绩规则，是否确定？', '', '', () => {
        service.servicePrice.deletePerfratio(row.id).then(res => {
          if (res.resp_code == "200") {
            yid.util.success("删除成功")
          } else {
            yid.util.error(res.resp_msg);
          }
        });
      })
      this.queryPerfratioData();
    },
    changeBranchType(id) {
      this.addPerfratio.serviceType = '';
      this.addPerfratio.serviceTypes = [];
      this.serviceAllType.forEach(item => {
        if (id == String(item.branch)) {
          this.addPerfratio.serviceTypes.push(item);
        }
      })
    },
    //添加
    savePerfratio() {
      if (this.addPerfratio.branch == '') {
        yid.util.error("项目类别不能为空!");
        return;
      }
      if (this.addPerfratio.serviceType == '') {
        yid.util.error("分类不能为空!");
        return;
      }
      if (this.addPerfratio.paytype == '') {
        yid.util.error("支付方式不能为空!");
        return;
      }
      if (this.addPerfratio.perfratio == null) {
        yid.util.error("业绩比率不能空!");
        return;
      } else {
        if (Number.isNaN(this.addPerfratio.perfratio)) {
          yid.util.error("请输入数字!");
          return;
        }
        var numReg = /^[0-9]*$/
        var numRe = new RegExp(numReg)
        if (!numRe.test(this.addPerfratio.perfratio)) {
          yid.util.error("请输入0到100整数!");
          return;
        }
        if (this.addPerfratio.perfratio < 0 || this.addPerfratio.perfratio > 100 ) {
            yid.util.error("请输入0到100整数!");
            return;
        }
      }
      this.addPerfratio.branchs.forEach(item => {
        if (item.id == this.addPerfratio.branch) {
            this.perfratioObj.bbid = item.id
            this.perfratioObj.bbname = item.bname
        }
      })
      this.addPerfratio.serviceTypes.forEach(item => {
        if (item.branch == this.addPerfratio.branch && item.scode == this.addPerfratio.serviceType) {
          this.perfratioObj.scode = item.scode
          this.perfratioObj.sname = item.sname
        }
      })
      this.addPerfratio.payDatas.forEach(item => {
        if (item.paycode == this.addPerfratio.paytype) {
          this.perfratioObj.paycode = item.paycode
          this.perfratioObj.payname = item.payname
        }
      })
      this.perfratioObj.perfratio = this.addPerfratio.perfratio
      this.perfratioObj.servcode = this.sptdata.spcode
      this.perfratioObj.servid = this.sptdata.sptid
      this.perfratioObj.status = this.sptdata.status;
      this.perfratioObj.id = this.addPerfratio.id;
      service.servicePrice.savePerfratio(this.perfratioObj).then(res => {
        if (res.resp_code == "200") {
          this.addPerfratio.visible = false;
        } else {
          yid.util.error(res.resp_msg);
        }
      })
        this.queryPerfratioData();
        this.getData();
    },
    async getData(){
      const fetch = service.servicePrice.queryPerfratio
      const params = {}
      params.ss = this.sptdata.spcode
      this.$refs.table.reloadData({
        fetch,
        params,
      });
    },
  },
}
</script>

<style scoped lang="scss">
.margin5 {
  margin: 3px 2px;
}

.mutirow {
  flex-wrap: wrap;

  .el-tag {
    width: 100%;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
