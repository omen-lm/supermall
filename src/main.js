import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import toast from './components/common/toast'
import VueLazyLoad from 'vue-lazyload'

import FastClick from 'fastclick'

Vue.config.productionTip = false
Vue.prototype.$bus = new Vue()

Vue.use(toast)
Vue.use(VueLazyLoad, {
  preLoad: 1,
  // loading: require('assets/img/common/placeholder.png')
})

FastClick.attach(document.body)


new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
