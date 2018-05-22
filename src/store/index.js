/**
 * Created by Deboy on 2016/10/12.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import state from './states'
// modules
import user from './modules/user'
import menu from './modules/menu'
import config from './modules/config'
import imgPreview from './modules/imgPreview'
import breadcrumb from './modules/breadcrumb'

// global actions
import actions from './actions'
// global mutations
import mutations from './mutations'

Vue.use(Vuex)
export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    user,
    menu,
    config,
    imgPreview,
    breadcrumb
  }
})
