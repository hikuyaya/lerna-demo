<template>
  <div class="record" v-if="internalData">
    <div class="record-no">No.{{ internalData.casNo }}</div>
    <div class="record-title">
      <span>{{ internalData.hospitalName }}</span>
      <br />
      <span>门(急)诊病历</span>
    </div>
    <div class="record-info">
      <div class="info-row two-cols">
        <div class="info-row-label">
          <span>姓名</span>
        </div>
        <div class="info-row-content">{{ internalData.userName }}</div>
        <div class="info-row-label">
          <span>性别</span>
        </div>
        <div class="info-row-content">{{ internalData.sex }}</div>
      </div>
      <div class="info-row two-cols">
        <div class="info-row-label">
          <span>年龄</span>
        </div>
        <div class="info-row-content">{{ internalData.age }}岁</div>
        <div class="info-row-label">
          <span>科别</span>
        </div>
        <div class="info-row-content">{{ internalData.department }}</div>
      </div>
    </div>
    <div class="record-info">
      <div class="info-row">
        <div class="info-row-label">
          <span>就诊时间</span>
        </div>
        <div class="info-row-content">{{ internalData.recordsTime }}</div>
      </div>
      <div class="info-row">
        <div class="info-row-label">
          <span>主诉</span>
        </div>
        <div class="info-row-content">{{ internalData.mainSuit }}</div>
      </div>
      <div class="info-row">
        <div class="info-row-label">
          <span>现病史</span>
        </div>
        <div class="info-row-content">
          {{ internalData.historyPresent || '无' }}
        </div>
      </div>
      <div class="info-row">
        <div class="info-row-label">
          <span>过敏史</span>
        </div>
        <div class="info-row-content">
          <template v-if="internalData.historyAllergy">
            <el-tag
              :key="item"
              style="margin: 0px 5px 0 0"
              type="info"
              v-for="item in internalData.historyAllergy.split(',')"
              >{{ item }}</el-tag
            >
          </template>
          <template v-else>
            <span>无</span>
          </template>
        </div>
      </div>
      <div class="info-row">
        <div class="info-row-label">
          <span>既往史</span>
        </div>
        <div class="info-row-content">
          <template v-if="internalData.historyPast">
            <el-tag
              :key="item"
              style="margin: 0px 5px 0 0"
              type="info"
              v-for="item in internalData.historyPast.split(',')"
              >{{ item }}</el-tag
            >
          </template>
          <template v-else>
            <span>无</span>
          </template>
        </div>
      </div>
      <div class="info-row">
        <div class="info-row-label">
          <span>体检指标</span>
        </div>
        <div class="info-row-content spec-row">
          <div class="info-row two-cols">
            <div class="info-row-label">体温</div>
            <div class="info-row-content">
              {{ internalData.temperature || '- ' }} 度
            </div>
            <div class="info-row-label">体重</div>
            <div class="info-row-content">
              {{ internalData.weight || '- ' }} kg
            </div>
          </div>
          <div class="info-row two-cols">
            <div class="info-row-label">心率</div>
            <div class="info-row-content">
              {{ internalData.heartRate || '- ' }} bpm
            </div>
            <div class="info-row-label">血压</div>
            <div class="info-row-content">
              {{ internalData.bloodPressure || '- ' }} mmHg
            </div>
          </div>
        </div>
      </div>
      <div class="info-row">
        <div class="info-row-label">
          <span>辅助检查</span>
        </div>
        <div class="info-row-content">
          {{
            (internalData.Inspection_index &&
              internalData.Inspection_index.More) ||
            '无'
          }}
        </div>
      </div>
      <div class="info-row">
        <div class="info-row-label">
          <span>诊断</span>
        </div>
        <div class="info-row-content">
          <!--          <el-tag>{{internalData.diagnosis}}</el-tag>-->
          <template v-if="internalData.diagnosis">
            <template v-if="internalData.diagnosis.split(',').length > 0">
              <el-tag
                :key="item"
                style="margin: 0px 5px 0 0"
                type="info"
                v-for="item in internalData.diagnosis.split(',')"
                >{{ item }}</el-tag
              >
            </template>
            <template v-else>
              <el-tag>{{ internalData.diagnosis }}</el-tag>
            </template>
          </template>
          <template v-else>
            <span>无</span>
          </template>
        </div>
      </div>
      <div class="info-row">
        <div class="info-row-label">
          <span>医嘱小结</span>
        </div>
        <div class="info-row-content">
          <div v-html="internalData.advice || '无'"></div>
        </div>
      </div>
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

      yid.service.healthData.getMedicalRecordInfo(params).then(res => {
        this.internalData = res.data
        console.log('data', this.internalData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.small-text {
  font-size: 12px;
}

.info-row {
  margin-top: 4px;
  font-size: 0;
  display: flex;
  &-label,
  &-content {
    font-size: 14px;
    line-height: 20px;
    display: inline-block;
    vertical-align: middle;
  }
  &-label {
    & > span {
      width: 4em;
      display: inline-block;
      text-align-last: justify;
      text-align: justify;
      text-justify: distribute-all-lines;
    }
    &.t-6 > span {
      width: 6em;
    }
    &.t-6 + .info-row-content {
      width: calc(100% - 7em);
    }
    &:after {
      content: '：';
    }
  }
  &-content {
    padding-left: 2px;
    width: calc(100% - 5em);
    font-weight: bold;
    word-break: break-all;
    & > img {
      height: 20px;
      display: block;
    }
  }
  &.two-cols {
    .info-row-label.t-6 + .info-row-content {
      width: calc(50% - 7em);
    }
    .info-row-content {
      width: calc(50% - 5em);
    }
  }
}

.spec-row {
  padding: 10px 20px;
  border-radius: 4px;
  background-color: #f8f8f8;
  .info-row {
    font-size: 0;
    border-bottom: 1px solid #e5e5e5;
    &:last-of-type {
      padding-top: 10px;
      border-bottom: 0;
    }
    &-content {
      font-size: 12px;
    }
  }
}

.record {
  position: relative;
  padding: 7px 30px;
  &-no {
    padding-left: 11px;
    font-size: 14px;
    line-height: 22px;
  }
  &-title {
    margin-top: 2px;
    padding: 0 11px 35px 11px;
    font-size: 22px;
    line-height: 25px;
    font-weight: bold;
    text-align: center;
  }
  &-info {
    padding: 0 11px 5px 11px;
    border-bottom: 1px dashed #bfbfbf;
  }
}
</style>
