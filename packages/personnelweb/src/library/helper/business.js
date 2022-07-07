/*
 * @Author: wqy
 * @Date: 2022-07-07 10:20:08
 * @LastEditors: wqy
 * @LastEditTime: 2022-07-07 10:50:41
 * @FilePath: \personnelweb\src\library\helper\business.js
 * @Description:
 */

/**
 * form validate失败后滚动到失败的dom元素处
 */
export function scrollToError() {
  // 滚动到报错位置
  let isError = document.getElementsByClassName('is-error')
  isError[0]?.scrollIntoView({
    // 滚动到指定节点
    // start、center、end、nearest
    block: 'center',
    // 缓动动画：auto、instant、smooth
    behavior: 'smooth'
  })
}
