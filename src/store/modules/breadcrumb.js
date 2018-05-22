// import Vue from 'vue'
const state = {
  breadcrumbList: JSON.parse(window.sessionStorage.getItem('breadcrumbList' || []))
}
const getters = {
  breadcrumbList (state) {
    return state.breadcrumbList
  }
}
const mutations = {
  PUSH_BREADCRUMB (state, payload) {
    // 判断是否为第二级
    if (payload.meta.level === 2) {
      let one = state.breadcrumbList[0]
      state.breadcrumbList = [
        one,
        payload
      ]
    } else {
      state.breadcrumbList.push(payload)
      // 去重
      let exist = false
      state.breadcrumbList.forEach(val => {
        if (val.path === payload.path) {
          exist = true
          return true
        }
      })
      if (!exist) {
        state.breadcrumbList.push(payload)
      }
    }
    this.commit('_HANDLER_DATA')
  },
  SET_LEVEL_ONE (state, payload) {
    let currentMenu = this.getters.currentMenu
    currentMenu.name = currentMenu.title
    // 提取出当前菜单的第一个二级菜单
    let currentLevelTwo = this.getters.currentMenu.authorities[0]
    currentLevelTwo.name = currentLevelTwo.title
    state.breadcrumbList = [
      currentMenu,
      currentLevelTwo
    ]
    this.commit('_HANDLER_DATA')
  },
  REMOVE_BREADCRUMB (state, payload) {
    state.breadcrumbList.pop()
    this.commit('_HANDLER_DATA')
  },
  _HANDLER_DATA () {
    // 处理数据 并且存入
    let newArr = []
    state.breadcrumbList.forEach(val => {
      newArr.push({
        meta: val.meta,
        path: val.path,
        name: val.name
      })
    })
    window.sessionStorage.setItem('breadcrumbList', JSON.stringify(newArr))
  }
}
const actions = {}
export default {
  state,
  getters,
  mutations,
  actions
}
