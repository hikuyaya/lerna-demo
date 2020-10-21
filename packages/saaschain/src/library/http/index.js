/*
 * @Author: leejee
 * @Date: 2017-12-21 18:55:33
 * @Description: axios 拦截器, 集成 download and retry
 */
import axios from 'axios'
import download from './download'
import retry from './retry'

import router from '@src/router'

import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import de from "element-ui/src/locale/lang/de";

// 记录 http 请求次数
let httpCount = 0

// 挂载实例方法
axios.download = download

// 定义 http request 拦截器
axios.interceptors.request.use(
  function(request) {
    httpCount++
    nprogress.start()
    // 基于 mock , 直接发送请求
    if (request.url.indexOf('http://mock.eolinker.com/') !== -1) {
      return request
    }

    // 其他请求，验证 token
    else {
      // 配置 content-type


       //request.headers['content-type'] = 'application/x-www-form-urlencoded';
      // 配置 header.token
     if($yid.cache.get($yid.type.USER.TOKEN)) {
         request.headers.authorization = 'Bearer ' + $yid.cache.get($yid.type.USER.TOKEN)
         request.headers['x-tenant-header'] =  $yid.cache.get($yid.type.USER.TENANTID);
         // request.headers['saas-version'] = 'barry2020'
     }
    if($yid.cache.get($yid.type.USER.APPID)) {
        if(!request.headers['x-appId-header']) {
            request.headers['x-appId-header'] =  $yid.cache.get($yid.type.USER.APPID);
        }
    }

      // 配置 base url
      const isUrl = /^((https|http|ftp|rtsp|mms)?:\/\/)[^\s]+/
      if (!isUrl.test(request.url)) {
        request.url = $yid.config.API.BASE + request.url
      }

      return request
    }
  },

  function(error) {
    httpCount--
    if (httpCount === 0) {
      nprogress.done(false)
    }
    console.log('reject')
    return Promise.reject(error)
  }
)

// 定义 http response 拦截器
axios.interceptors.response.use(
  function(response) {
    httpCount--
    if (httpCount === 0) {
      nprogress.done(false)
    }

    // 基于 mock , 直接返回数据
    if (response.config.url.indexOf('http://mock.eolinker.com/') !== -1) {
      return response.data
    }

    // 基于 downloadFile ，直接返回成功请求，由 download.js 接管
    else if (response.config.isDownload) {
      return response
    }

    // 成功处理
    else if (response) {
      // 请求正常，并且逻辑验证成功
      //  console.log(response)
      if (response.data && parseInt(response.data.resp_code) === 200) {
        return response.data
      }

      // 请求正常，鉴权失败
      else if (response.data && parseInt(response.data.resp_code) === 401) {
          $yid.cache.clear();
          router.replace($yid.config.SYSTEM.ROUTER_LOGIN)
          //$yid.util.alert('授权失败', '提示', 'error')
        // 清空所有缓存

        // 跳转提示页
       // router.replace($yid.config.SYSTEM.ROUTER_LOGIN)

        return Promise.reject(response)
      }

      // 请求正常，逻辑验证失败
      else if (response.data && parseInt(response.data.resp_code) === 500) {
        $yid.util.alert(response.data.resp_msg, null, $yid.type.SYSTEM.MESSAGE.ERROR)
        debugger
        return Promise.reject(response)
      }
    }

    // 其他返回状态码处理
    return Promise.reject(response)
  },

  function(error) {
    httpCount--
    if (httpCount === 0) {
      nprogress.done(false)
    }

    // 超时处理
    if (error.code === 'ECONNABORTED') {
      if (!error.config.__isRetryComplete) {
        return retry(error)
      } else {
        return Promise.reject(error)
      }
    }
    //debugger
    //console.log('error',error)
    console.log('errorMessage', error.response);
    // 未知错误
    if (error.response && error.response.status) {
      switch (error.response.status) {
        case 401:
            $yid.util.alert('token失效，请重新登录', null, $yid.type.SYSTEM.MESSAGE.ERROR)
            // 清空所有缓存
            $yid.cache.clear();
            setTimeout(()=> {
                router.replace($yid.config.SYSTEM.ROUTER_LOGIN)
            }, 500)
            break;
        default:
          //$yid.util.alert('Uncaught (in promise) Error: Request failed with status code ', '提示', 'error')
          $yid.util.error(error.response.data.resp_msg)

          break
      }
    } else {
        //console.log('error', error.response)
        //$yid.util.alert('Uncaught (in promise) Error ' + error.message, '提示', 'error')
          $yid.util.error(error.response.data.resp_msg)
    }

    return Promise.reject(error)
  }
)

export default axios
