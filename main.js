
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
// 按需导入网络请求的包 ($http 对象)
import { $http } from '@escook/request-miniprogram'
uni.$http = $http // 挂载到顶级对象uni上
// 设置请求的根路径
$http.baseUrl = 'https://autumnfish.cn/wx'

// 请求拦截器 请求开始之前做一些事情
$http.beforeRequest = function (options) {
  uni.showLoading({
      title: '数据加载中...', // 展示登录效果
    })
}
// 响应拦截器 请求完成之后做一些事情
$http.afterRequest = function () {
  uni.hideLoading()  // 隐藏登录效果
}

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif