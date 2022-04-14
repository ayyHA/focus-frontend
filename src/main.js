import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './common/css/font.scss'
import VueCropper from 'vue-cropper'
import './assets/icon/iconfont.css'
import animated from 'animate.css'

Vue.use(VueCropper)
Vue.use(animated)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
