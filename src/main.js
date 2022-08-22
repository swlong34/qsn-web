// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/index'
import ElementUI from "element-ui"
import {Message} from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
import ConstVal from './util/const-val'
import VueParticles from 'vue-particles'
import axios from "axios"
import qs from 'qs'

Vue.use(ElementUI)
Vue.use(VueParticles)
Vue.prototype.$qs = qs;
Vue.prototype.$axios = axios
Vue.prototype.QS_TYPE = ConstVal;
Vue.config.productionTip = false;
// 'http://114.115.222.34:81'
// 'http://localhost:81'
axios.defaults.baseURL = ConstVal.DEV_URL + ConstVal.DEV_PORT;
// axios.defaults.baseURL = ConstVal.PRO_URL + ConstVal.PRO_PORT;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token") || ''
    if (token) config.headers.Authorization = token
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
axios.interceptors.response.use(
  ({data}) => {
    const {msg,code} = data
    if(code === 200) {
      // 成功，直接弹出消息
      if(msg !== 'success') Message.success(msg)
    }
    if (code === 401) {
      // 用户身份相关，弹出消息并跳转到登录页
      Message.error(msg)
      router.push({name: 'login-register'})
    }
    return data
  },
  (error) => {
    return Promise.reject(error)
  }
)



/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
})
