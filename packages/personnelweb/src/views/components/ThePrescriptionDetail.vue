<template>
  <div class="the-prescription-detail">
    <div class="no">
      <span>No.{{ internalData.prescriptionNo }}</span>
    </div>

    <div class="title">
      <div>{{ internalData.hospitalName }}</div>
      <div>
        <span style="color: #00c6ae;">{{ internalData.prescriptionType === '1' ? '西药' : '中药' }}</span>
        <span>处方笺</span>
      </div>
    </div>

    <div class="content">
      <el-row>
        <el-col :span="12">
          <label class="label justify">
            <span>姓名</span>
          </label>
          <span class="value">{{ internalData.userName }}</span>
        </el-col>
        <el-col :span="12">
          <label class="label justify">
            <span>性别</span>
          </label>
          <span class="value">{{ internalData.sex }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <span class="label">住院(门诊号)</span>
          <span class="value"></span>
        </el-col>
        <el-col :span="12">
          <label class="label justify">
            <span>科别</span>
          </label>
          <span class="value">{{ internalData.department }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <label class="label justify">
            <span>临床诊断</span>
          </label>
          <span class="value">{{ internalData.diagnosis }}</span>
        </el-col>
        <el-col :span="12">
          <label class="label justify">
            <span>病历号</span>
          </label>
          <span class="value">{{ internalData.casNo }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <label class="label justify">
            <span>年龄</span>
          </label>
          <span class="value">{{ internalData.age }}岁</span>
        </el-col>
        <el-col :span="12">
          <label class="label justify">
            <span>就诊时间</span>
          </label>
          <span class="value">{{ internalData.recordsTime }}</span>
        </el-col>
      </el-row>
    </div>

    <div class="rp">
      <h4 class="rp-title">Rp</h4>

      <div :key="drug.medicalName" class="rp-item" v-for="drug in internalData.prescriptionInfoVo">
        <div class="rp-item-title">
          <div>
            <strong>{{ drug.medicalName }}</strong>
            <span>{{ drug.consumption }}</span>
          </div>
          <div>
            <strong>x{{ drug.countNumber }}</strong>
          </div>
        </div>
        <div class="rp-item-use-way">
          <span style="margin: 0 10px 0 0;">用法用量:</span>
          <span>{{ drug.theWay }}</span>
        </div>
      </div>
    </div>

    <div class="content doctor">
      <el-row>
        <el-col :span="12">
          <label class="label justify">
            <span>医师</span>
          </label>
          <span class="value">{{ internalData.doctor }}</span>
        </el-col>
        <el-col :span="12">
          <label class="label justify">
            <span>审方药师</span>
          </label>
          <span class="value">{{ internalData.pharmacistCheck }}</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <label class="label justify">
            <span>调配药师</span>
          </label>
          <span class="value">{{ internalData.dispensing }}</span>
        </el-col>
        <el-col :span="12">
          <label class="label justify">
            <span>发药药师</span>
          </label>
          <span class="value">{{ internalData.distribute }}</span>
        </el-col>
      </el-row>
    </div>

    <div class="content">
      <el-row>
        <el-col :span="24">
          <span class="label">处方有效天数</span>
          <span class="value">{{ $yid.util.getDuration(new Date(internalData.recordsTime), new Date(internalData.prescriptionTerm) ).dd }} 天</span>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <span class="label">备注</span>
          <span class="value">{{ internalData.note }}</span>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import yid from '@src/library'

export default {
  props: {
    id: [String, Number]
  },

  data() {
    return {
      internalData: undefined
    }
  },

  watch: {
    id() {
      this.get()
    }
  },

  created() {
    this.get()
  },

  methods: {
    get() {
      const params = { id: this.id }

      yid.service.healthData.getPrescriptionInfo(params).then(res => {
        this.internalData = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.the-prescription-detail {
  .no {
    font-size: 14px;
    margin-bottom: 5px;
  }

  .title {
    font-size: 22px;
    padding-bottom: 25px;
    margin-bottom: 20px;
    border-bottom: 1px dashed #bfbfbf;
    line-height: 25px;
    font-weight: bold;
    text-align: center;
  }

  .content {
    &.doctor {
      border-bottom: 1px solid #f3f3f3;
      padding: 0 0 10px 0;
      margin: 0 0 10px 0;
    }

    .el-row {
      margin: 0 0 5px 0;
    }

    .label {
      &.justify {
        span {
          width: 4em;
          display: inline-block;
          text-align: justify;
          text-align-last: justify;
        }
      }

      &::after {
        content: ':';
        margin: 0 10px;
      }
    }

    .value {
      color: rgba(51, 51, 51, 1);
      font-weight: bold;
    }
  }

  .rp {
    .rp-title {
      margin: 10px 0 20px 0;
      padding-bottom: 8px;
      font-size: 18px;
      border-bottom: 1px solid #f3f3f3;
    }

    .rp-item {
      margin: 0 0 20px 0;

      .rp-item-title {
        display: flex;
        justify-content: space-between;
        margin: 0 0 5px 0;

        strong {
          font-size: 16px;
          font-weight: bold;
          color: rgba(51, 51, 51, 1);
          margin: 0 10px 0 0;
        }
      }
      .rp-item-use-way {
      }
    }
  }
}
</style>
