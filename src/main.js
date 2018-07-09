// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import http from './http'
import store from './store'
import BaseMixin from './mixins/base'
import rsa from './http/rsa'
import AppTable from './components/common/appTable.vue'
import UploadImg from './components/common/uploadImg.vue'
// 引入iView
import iView from 'iview'
import 'iview/dist/styles/iview.css'
// 引入全局样式
import './style/base.less'

Vue.config.productionTip = false
Vue.use(iView)
Vue.use(http)
Vue.use(rsa)
Vue.mixin(BaseMixin)
Vue.component('AppTable', AppTable)
Vue.component('UploadImg', UploadImg)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
