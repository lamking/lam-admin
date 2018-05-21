/**
 * Created by Deboy on 2017/5/3.
 */
const state = {
  show: false,
  url: ''
}

const mutations = {
  PUSH_PREVIEW (state, payload) {
    state.show = true
    state.url = payload
  },
  SHIFT_PREVIEW (state) {
    state.show = false
    state.url = ''
  }
}
const getters = {
  imgPreview (state) {
    return state
  }
}
const actions = {
  openPreview (contaxt, playload) {
    console.log('open')
    contaxt.commit('PUSH_PREVIEW', playload)
  },
  closePreview (contaxt) {
    console.log('close')
    contaxt.commit('SHIFT_PREVIEW')
  }
}
export default {
  state,
  mutations,
  getters,
  actions
}
