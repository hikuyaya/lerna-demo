<!--
 * @Author: wqy
 * @Date: 2022-08-12 11:32:53
 * @LastEditors: wqy
 * @LastEditTime: 2022-08-17 10:39:51
 * @FilePath: \personnelweb\src\views\staff-report\staff-info\staffInfo.vue
 * @Description: 
-->
<template>
  <div>
    <el-card shadow="never">
      <el-button v-print="printObj">nb打印</el-button>
      <el-button @click="onPrint">printJs打印</el-button>
      <table
        ref="printId"
        id="printId"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <thead>
          <tr>
            <td>名称1</td>
            <td>地点2</td>
            <td>时间3</td>
            <td>武汉4</td>
            <td>北京5</td>
            <td>上海6</td>
            <td>广州7</td>
            <td>深圳8</td>
            <td>杭州9</td>
            <td>香港10</td>
            <td class="class-width">名称11</td>
            <td>成都12</td>
          </tr>
        </thead>
        <tbody v-if="list.length">
          <tr v-for="item in list">
            <td>{{ item.name1 }}</td>
            <td>{{ item.name2 }}</td>
            <td>{{ item.name3 }}</td>
            <td>{{ item.name4 }}</td>
            <td>{{ item.name5 }}</td>
            <td>{{ item.name6 }}</td>
            <td>{{ item.name7 }}</td>
            <td>{{ item.name8 }}</td>
            <td>{{ item.name9 }}</td>
            <td>{{ item.name10 }}</td>
            <td>{{ item.name11 }}</td>
            <td>{{ item.name12 }}</td>
          </tr>
        </tbody>
      </table>
      <div v-if="!list.length" class="table-empty">
        <span class="table-empty-text">暂无数据</span>
      </div>
    </el-card>
  </div>
</template>
<script>
import html2canvas from 'html2canvas'
import printJs from 'print-js'
export default {
  name: '',
  data() {
    return {
      list: [],
      printObj: {
        id: 'printId',
        popTitle: ' ',
        extraHead:
          '<meta http-equiv="Content-Language" content="zh-cn"/>,<style>  #printId { width: 100%; !important; } <style>'
      },
      nameList: [
        '香蕉',
        '苹果',
        '梨子',
        '葡萄',
        '哈密瓜',
        '车厘子',
        '草莓',
        '榴莲',
        '石榴',
        '黄瓜',
        '圣女果'
      ]
    }
  },
  mounted() {
    const len = Math.ceil(Math.random() * 20)
    for (let i = 0; i < len; i++) {
      this.list.push({
        name1: this.createName(i),
        name2: this.createName(i),
        name3: this.createName(i),
        name4: this.createName(i),
        name5: this.createName(i),
        name6: this.createName(i),
        name7: this.createName(i),
        name8: this.createName(i),
        name9: this.createName(i),
        name10: this.createName(i),
        name11: this.createName(i) + '我很长' + new Date().getTime(),
        name12: this.createName(i)
      })
    }
  },
  methods: {
    createName(index) {
      const name = this.nameList[Math.ceil(Math.random() * 10)]
      return name + index + Math.ceil(Math.random() * 100)
    },
    // printJs转图片打印
    onPrint() {
      const printContent = this.$refs.printId
      // 获取dom 宽度 高度
      const width = printContent.clientWidth
      const height = printContent.clientHeight
      // 创建一个canvas节点
      const canvas = document.createElement('canvas')

      const scale = 4 // 定义任意放大倍数，支持小数；越大，图片清晰度越高，生成图片越慢。
      canvas.width = width * scale // 定义canvas 宽度 * 缩放
      canvas.height = height * scale // 定义canvas高度 *缩放
      canvas.style.width = width * scale + 'px'
      canvas.style.height = height * scale + 'px'
      canvas.getContext('2d').scale(scale, scale) // 获取context,设置scale

      const scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop // 获取滚动轴滚动的长度
      const scrollLeft =
        document.documentElement.scrollLeft || document.body.scrollLeft // 获取水平滚动轴的长度

      html2canvas(printContent, {
        canvas,
        backgroundColor: null,
        useCORS: true,
        windowHeight: document.body.scrollHeight,
        scrollX: -scrollLeft, // 解决水平偏移问题，防止打印的内容不全
        scrollY: -scrollTop
      })
        .then(canvas => {
          const url = canvas.toDataURL('image/png')
          printJs({
            printable: url,
            type: 'image',
            documentTitle: '', // 标题
            style: '@page{size:auto;margin: 0cm 1cm 0cm 1cm;}' // 去除页眉页脚
          })
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
table {
  font-family: Arial, sans-serif;
  font-size: 14px;
  background-color: #f0f2f5;
  border-collapse: collapse;
  color: #454545;
  table-layout: auto;
  width: 100%;
  text-align: center;
  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: #dadcde;
  thead {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #dadcde;
    line-height: 40px;
    font-weight: bold;
    color: #454c70;
  }
  tr {
    border-top-width: 1px;
    border-top-style: solid;
    border-top-color: #dadcde;
    line-height: 23px;
  }
  td {
    padding: 5px 10px;
    font-size: 14px;
    font-family: Verdana;
    width: 100px;
    word-break: break-all; // 元素换行
  }
  // 斑马纹效果stripe
  tr:nth-child(even) {
    background: #f5f7f9;
  }
  tr:nth-child(odd) {
    background: #fff;
  }
}
.table-empty {
  min-height: 60px;
  text-align: center;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
  .table-empty-text {
    line-height: 60px;
    width: 50%;
    color: #909399;
  }
}
</style>
