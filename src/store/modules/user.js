const state = {
  user: Object.assign({}, JSON.parse(window.sessionStorage.getItem('user')) || {})
}
const getters = {
  isLogin (state) {
    return (state.user && state.user.id) || false
  },
  menuList (state) {
    if (state.user) {
      return state.user.role && state.user.role.authorities.length > 0 ? state.user.role.authorities : []
    }
  },
  authorities (state) {
    let user = state.user || {}
    let authoritiesList = []
    if (user.role) {
      user.role.authorities.map(levelOne => {
        levelOne.authorities.forEach(levelTwo => {
          levelTwo.authorities.forEach(levelThree => {
            // 第三级菜单是权限操作菜单
            authoritiesList.push(levelThree.permission)
          })
        })
      })
    }
    return authoritiesList
  },
  userInfo (state) {
    return state.user || {}
  }
}
const mutations = {
  SET_USER_INFO (state, payload) {
    state.user = payload
    window.sessionStorage.setItem('user', JSON.stringify(state.user))
  },
  LOGOUT () {
    window.sessionStorage.setItem('user', JSON.stringify({}))
    window.location.reload()
  }
}
export default {
  state,
  getters,
  mutations
}
