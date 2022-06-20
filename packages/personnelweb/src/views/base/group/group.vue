<!--
 * @Author: wqy
 * @Date: 2022-06-15 17:09:48
 * @LastEditors: wqy
 * @LastEditTime: 2022-06-17 16:22:45
 * @FilePath: \personnelweb\src\views\base\group\group.vue
 * @Description: 
-->
<template>
  <avue-crud :option="option" :search.sync="search" :data="data"> </avue-crud>
</template>

<script>
export default {
  data() {
    return {
      data: [
        {
          text1: '文本1',
          text2: '文本2'
        }
      ],
      option: {
        searchIndex: 3,
        searchIcon: true,
        column: [
          {
            label: '内容1',
            prop: 'text1',
            search: true
          },
          {
            label: '内容2',
            prop: 'text2',
            search: true
          },
          {
            label: '内容3',
            prop: 'text3',
            search: true
          },
          {
            label: '内容4',
            prop: 'text4',
            search: true
          },
          {
            label: '内容5',
            prop: 'text5',
            search: true
          },
          {
            label: '内容6',
            prop: 'text6',
            search: true
          },
          {
            label: '内容7',
            prop: 'text7',
            search: true
          }
        ]
      }
    }
  }
}
</script>
