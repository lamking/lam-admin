const state = {
  currentMenu: Object.assign({}, JSON.parse(window.sessionStorage.getItem('currentMenu')) || {})
}
const getters = {
  currentMenu (state) {
    return state.currentMenu && state.currentMenu
  }
}
const mutations = {
  SET_CURRENT_MENU (state, payload) {
    state.currentMenu = payload
    window.sessionStorage.setItem('currentMenu', JSON.stringify(state.currentMenu))
  }
}
export default {
  state,
  getters,
  mutations
}
