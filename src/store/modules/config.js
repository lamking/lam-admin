const state = {
  config: {
    WEBSITE_NAME: '物流助手管理员端',
    ICP: '粤ICP备 111号',
    VERSION: 'V4.0.0'
  }
}
const getters = {
  STSTEM_CONFIG (state) {
    return state.config
  }
}
const mutations = {}
export default {
  state,
  getters,
  mutations
}
