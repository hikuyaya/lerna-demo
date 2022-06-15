<template>
  <div class="no-data">
    <img :src="imgDictionary[type]" />
    <span>{{ text }}</span>
  </div>
</template>

<script>
const imgDictionary = {
  default: require('@src/assets/images/no-data.png')
}

export default {
  props: {
    type: {
      type: String,
      default() {
        return 'default'
      }
    },

    text: {
      type: String,
      default() {
        return '暂无记录'
      }
    }
  },

  data() {
    return {
      imgDictionary
    }
  }
}
</script>

<style lang="scss" scoped>
.no-data {
  height: 100%;
  min-height: 500px;

  display: flex;
  justify-content: center;
  align-items: center;

  flex-direction: column;

  span {
    margin: 20px 0 0 0;
    color: rgba(155, 155, 155, 1);
  }
}
</style>
