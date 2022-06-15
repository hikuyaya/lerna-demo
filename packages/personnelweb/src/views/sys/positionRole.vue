<template>
  <div class="positionlimits">
    <el-input clearable filterable  v-model="psearchPosition" placeholder="职位编码或名称" style="width: 150px;"></el-input>&nbsp;
    <el-button @click="getPositionList" type="primary">查询</el-button>&nbsp;
    <el-button @click="positionAdd" type="primary">添加</el-button>
    <yid-table pagination ref="table" :data="positionSetingData" style="margin-top: 12px;">
      <yid-table-column label="职务编码" min-width="80" prop="pscode"></yid-table-column>
      <yid-table-column label="职务名称" min-width="100" prop="psname"></yid-table-column>
      <yid-table-column label="分配角色" min-width="100" prop="roleName"></yid-table-column>
      <yid-table-column label="操作" min-width="100" prop="content">
        <template slot-scope="scope">
          <el-button type="text" @click="editposition(scope.row)"><i class="edit"></i>编辑</el-button>
          <el-button type="text" @click="deletePositionSetting(scope.row)"><i class="view"></i>删除</el-button>
        </template>
      </yid-table-column>
    </yid-table>

    <yid-dialog :title="positionDialog.title" :visible.sync="positionDialog.visible" width="800px">
      <el-form ref="positionForm" :model="positionForm"  label-width="450px" >
        <el-button @click="positionSelectType" type="primary">选择职务</el-button>
        <yid-table :data="positionData" style="margin-top: 15px;">
          <yid-table-column label="职务编码" min-width="100" prop="pscode"></yid-table-column>
          <yid-table-column label="职务名称" min-width="150" prop="psname"></yid-table-column>
          <yid-table-column label="操作" min-width="100" prop="content">
            <template slot-scope="scope">
              <el-link type="primary" @click="deleteSelectPosition(scope.row)">删除</el-link>
            </template>
          </yid-table-column>
        </yid-table>
        <el-button @click="roleSelectType" type="primary">选择角色</el-button>
        <yid-table :data="roleData" style="margin-top: 10px;">
          <yid-table-column label="角色名称" min-width="150" prop="name"></yid-table-column>
          <yid-table-column label="操作" min-width="100" prop="content">
            <template slot-scope="scope">
              <el-link type="primary" @click="deleteSelectRole(scope.row)">删除</el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </el-form>
      <el-row justify="space-between" class="margin5">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="savePosition()">确定</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="levelCancel">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog :title="editPositionDialog.title" :visible.sync="editPositionDialog.visible" width="800px">
      <el-form ref="editPositionForm" :model="editPositionForm"  label-width="450px" >
        <yid-table :data="positionData" style="margin-top: 15px;">
          <yid-table-column label="职务编码" min-width="100" prop="pscode"></yid-table-column>
          <yid-table-column label="职务名称" min-width="150" prop="psname"></yid-table-column>
        </yid-table>
        <el-button @click="roleSelectType" type="primary">选择角色</el-button>
        <yid-table :data="roleData" style="margin-top: 10px;">
          <yid-table-column label="角色名称" min-width="150" prop="name"></yid-table-column>
          <yid-table-column label="操作" min-width="100" prop="content">
            <template slot-scope="scope">
              <el-link type="primary" @click="deleteSelectRole(scope.row)">删除</el-link>
            </template>
          </yid-table-column>
        </yid-table>
      </el-form>
      <el-row justify="space-between" class="margin5">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="editPositionRole()">确定</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="levelCancel">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog :title="positionSelectDialog.title" :visible.sync="positionSelectDialog.visible" width="800px">
      <el-form ref="positionSelectForm" :model="positionSelectForm" label-width="100px" inline>
        <el-form-item label="同步业务组:">
          <el-select clearable filterable v-model="positionSelectForm.business" @change="changeBusiness"
                     style="width: 160px;">
            <el-option
                v-for="item in business"
                :key="item.id"
                :label="item.bname"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input clearable filterable v-model="positionSelectForm.psearch" placeholder="请输入职位编码或职位名称"
                    style="width: 160px;">
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0">
          <el-button @click="positionSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <yid-table pagination ref="pTable" :data="pData" style="margin-top: 15px;" @selection-change="pSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <yid-table-column label="职位编码" width="300" prop="pscode">
        </yid-table-column>
        <yid-table-column label="职位名称" width="500" prop="psname">
        </yid-table-column>
      </yid-table>
      <el-row justify="space-between" class="margin5">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="saveSelectPition()">确定</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="pitionCancel">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>

    <yid-dialog :title="roleSelectDialog.title" :visible.sync="roleSelectDialog.visible" width="800px">
      <el-form ref="roleSelectForm" :model="roleSelectForm" label-width="100px" inline>
        <el-form-item label="角色名称:">
          <el-input clearable filterable v-model="roleSelectForm.rsearch" placeholder="请输入角色名称"
                    style="width: 160px;"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0">
          <el-button @click="roleSearch" type="primary">查询</el-button>
        </el-form-item>
      </el-form>
      <yid-table pagination ref="rTable" :data="rData" style="margin-top: 15px;" @selection-change="rSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <yid-table-column label="角色名称" min-width="100" prop="name">
        </yid-table-column>
      </yid-table>
      <el-row justify="space-between" class="margin5">
        <el-col :span="2" :offset="10">
          <el-button type="primary" @click="saveSelectRole()">确定</el-button>
        </el-col>
        <el-col :span="2">
          <el-button @click="roleCancel">取消</el-button>
        </el-col>
        <el-col :span="10"></el-col>
      </el-row>
    </yid-dialog>
  </div>
</template>

<script>
import service from '@src/service'
import yid from "@src/library";

export default {
  name: "position",
  data() {
    return {
      activeName: 'position',
      psearchPosition: '',
      positionForm: {
        id:"",
        pscode: '',
        psname: '',
        roleIds: '',
        bbid: '',
        bname: ''
      },
      editPositionForm :{
        id:"",
        pscode: '',
        psname: '',
        roleIds: '',
        bbid: '',
        bname: ''
      },
      positionSetingData: [],
      positionSelectDialog:{
        title: '',
        visible: false
      },
      positionList: [],
      positionSelectForm:{
        business:[],
        psearch:'',
        id:''
      },
      business:[],
      roleSelectDialog:{
        title: '',
        visible: false
      },
      roleList: [],
      roleSelectForm:{
        rsearch:''
      },

      positionDialog:{
        title: '',
        visible: false
      },

      editPositionDialog:{
        title: '',
        visible: false
      },

      pData:[],

      rData:[],

      editPositionData:[],

      positionData:[],

      roleData:[],

      editRoleData:[],

      pageInfo:{
        page:1,
        limit:10
      },
    }
  },
  mounted() {
    //获取职务权限配置
    this.getPositionList();
    this.init();
  },
  methods: {
    getPositionList() {
      this.pageInfo.page=1
      this.pageInfo.limit = this.$refs.table.Pagination.internalPageSize;
      const params = this.pageInfo
      params.psearchPosition = this.psearchPosition;
      const fetch = service.positionRole.positionRoleList
      this.$refs.table.reloadData({
        fetch,
        params,
      });
    },

    //初始化职位
    init() {
      service.serviceInfo.findbranch({"status": "1"}).then(res => {
        this.business = res.data
      });
    },

    //添加
    positionAdd() {
      this.positionDialog.visible = true;
      this.positionDialog.title = '添加职务配置权限';
      this.positionData = [];
      this.roleData = [];
    },

    //编辑
    editposition(row) {
      this.editPositionDialog.visible = true;
      this.editPositionDialog.title = '编辑职务配置权限';
      this.positionData = [];
      this.roleData = [];
      this.positionData.push(row);
      this.map =new Map()
      this.map.set("roleIds",row.roleIds)
      service.sysRole.roleListById({"roleIds":row.roleIds}).then(res=> {
        console.log(res);
        if(res.resp_code == 200) {
          this.roleData = res.data;
        }
      });
    },
    //删除职位权限配置
    deletePositionSetting(row) {
      yid.util.confirm('你确定要删除该条配置?', '', '', () => {
        service.positionRole.deletePositionRole(row.id).then(res => {
          if (res.resp_code == 200) {
            yid.util.success("删除成功")
          } else {
            yid.util.error(res.resp_msg)
          }
          this.getPositionList();
        });
      })
    },

    //删除职位
    deleteSelectPosition(row) {
      let num = -1;
      this.positionData.forEach((item, index) => {
        if (row.pscode == item.pscode ) {
          num = index;
        }
      })
      if (num >= 0) {
        this.positionData.splice(num, 1);
      }
    },

    //删除角色
    deleteSelectRole(row) {
      let num = -1;
      this.roleData.forEach((item, index) => {
        if (row.id == item.id ) {
          num = index;
        }
      })
      if (num >= 0) {
        this.roleData.splice(num, 1);
      }
    },

    //保存
    savePosition() {
      if (this.positionData.length <= 0) {
        yid.util.error("请至少选择一个职务");
        return;
      }
      if (this.roleData.length <= 0) {
        yid.util.error("请至少选择一个角色");
        return;
      }
      var params = [];
      if (this.roleData.length > 0) {
        this.positionData.forEach(pdata=> {
          pdata.roleIds = "";
          this.roleData.forEach(rdata => {
            pdata.roleIds += rdata.id + ","
          })
          if (pdata.roleIds.length > 0) {
            pdata.roleIds = pdata.roleIds.substr(0, pdata.roleIds.length - 1);
          }
        })
      } else {
        this.positionData.forEach(pdata => {
          pdata.roleIds = "";
        })
      }
      this.positionData.forEach(pdata => {
        var position = {};
        position.psname = pdata.psname;
        position.pscode = pdata.pscode;
        position.roleIds = pdata.roleIds;
        position.bbid = pdata.bbid;
        position.id = pdata.id
        position.bbname = pdata.bname;
        params.push(position)
      })
      service.positionRole.savePositionRole(params).then(res => {
        if (res.resp_code == 200) {
          yid.util.success("保存成功！")
          this.getPositionList();
          this.levelCancel();
        }
      })
    },

    //编辑确定
    editPositionRole() {
      if (this.roleData.length <= 0) {
        yid.util.error("请至少选择一个角色");
        return;
      }
      var params = [];
      if (this.roleData.length > 0) {
        this.positionData.forEach(pdata => {
          pdata.roleIds = "";
          this.roleData.forEach(rdata => {
            pdata.roleIds += rdata.id + ","
          })
          if (pdata.roleIds.length > 0) {
            pdata.roleIds = pdata.roleIds.substr(0, pdata.roleIds.length - 1);
          }
        })
      } else {
        this.positionData.forEach(pdata => {
          pdata.roleIds = "";
        })
      }
      this.positionData.forEach(pdata => {
        var position = {};
        position.psname = pdata.psname;
        position.pscode = pdata.pscode;
        position.roleIds = pdata.roleIds;
        position.bbid = pdata.bbid;
        position.id = pdata.id
        position.bbname = pdata.bbname;
        params.push(position)
      })
      service.positionRole.editPositionRole(params).then(res => {
        if (res.resp_code == 200) {
          yid.util.success("编辑成功！")
          this.getPositionList();
          this.levelCancel();
        }
      })
    },

    //选择职位按钮
    async positionSelectType() {
      this.positionSelectDialog.visible = true;
      this.positionSelectDialog.title = "选择职位";
      this.$forceUpdate();
      const params = this.pageInfo
      params.status = 1
      params.isDel = '0'
      const fetch = await service.dept.jobList;
      this.$refs.pTable.reloadData({
        fetch,
        params
      });
    },

    //选择角色按钮
    async roleSelectType() {
      this.roleSelectDialog.visible = true;
      this.roleSelectDialog.title = "选择角色"
      this.$forceUpdate();
      const params = this.pageInfo
      const fetch = await service.sysRole.list
      this.$refs.rTable.reloadData({
        fetch,
        params,
      });
    },

    //取消选择
    levelCancel() {
      this.positionDialog.visible = false;
      this.editPositionDialog.visible = false;
    },

    //选择分组
    changeBusiness(id) {
      console.log(this.business)
      this.positionSelectForm.id = id;
    },

    //查询职位
    positionSearch() {
      const fetch = service.dept.jobList
      const params = this.pageInfo
      params.status = 1
      params.isDel = '0'
      params.codeName = this.positionSelectForm.psearch
      params.bbid = this.positionSelectForm.id
      this.$refs.pTable.reloadData({
        fetch,
        params
      });
    },

    //职位复选框
    pSelectionChange(val) {
      this.positionList = val;
    },

    //确定职位选择
    saveSelectPition() {
      this.positionData = this.positionList;
      if (this.positionData.length <=0) {
        yid.util.error("请至少选择一个职务");
        return;
      }
      this.positionSelectDialog.visible = false;
    },

    //取消选择
    pitionCancel() {
      this.positionSelectDialog.visible = false;
    },

    //查询角色
    roleSearch() {
      const params = this.pageInfo
      const fetch =  service.sysRole.list
      params.rsearchName = this.roleSelectForm.rsearch
      this.$refs.rTable.reloadData({
        fetch,
        params,
      });
    },

    //角色复选框
    rSelectionChange(val) {
      this.roleList = val;
    },

    //确定角色选择
    saveSelectRole() {
      this.roleData = this.roleList
      this.roleSelectDialog.visible = false;
    },

    roleCancel() {
      this.roleSelectDialog.visible = false;
    }
  }
}
</script>

<style scoped>

</style>
