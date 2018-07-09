<template>
  <div>
  <Menu ref="menu" active-key="1" theme="dark" width="auto" @on-select="selectItem" :active-name="currentMenu.id">
    <div class="layout-logo-left"><span v-if="!isCollapsed">百运通平台管理系统</span></div>
    <div class="trigger" @click="collapsedSider">
      <i class="iconfont icon-shousuo"></i>
    </div>
    <template v-for="menu in menuList">
      <Menu-item :name="menu.id" :key="menu.id">
        <Icon type="ios-navigate" :size="iconSize"></Icon>
        <span v-if="!isCollapsed" class="layout-text">{{menu.title}}</span>
      </Menu-item>
    </template>
  </Menu>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'sidebar',
    props: {
      isCollapsed: {}
    },
    computed: {
      ...mapGetters(['menuList', 'currentMenu', 'breadcrumbList']),
      iconSize () {
        return this.isCollapsed ? 30 : 15
      }
    },
    methods: {
      collapsedSider () {
        this.$emit('collapsedSider')
      },
      selectItem (id) {
        if (this.$route.meta.level >= 3) {
          this.$router.push({path: this.breadcrumbList[1].path})
        }
        let obj = this.findMenu(id)
        this.$store.commit('SET_CURRENT_MENU', obj)
        this.$store.commit('SET_LEVEL_ONE', obj)
      },
      findMenu (id) {
        let find = {}
        this.menuList.forEach(val => {
          if (val.id === id) {
            find = val
            return true
          }
        })
        return find
      }
    },
    mounted () {
      if (JSON.stringify(this.currentMenu) === '{}') {
        this.$store.commit('SET_CURRENT_MENU', this.menuList[0])
      }
    }
  }
</script>

<style scoped>
  .layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
    text-align: center;
    font-size: 14px;
    color: #fff;
    line-height: 28px;
  }
  .layout-hide-text .layout-text {
    display: none;
  }

  .ivu-col {
    transition: width .2s ease-in-out;
  }
  .ivu-menu-dark {
   background: #24303C;
  }
  .trigger {
    height: 30px;
    line-height: 30px;
    background: #28394A;
    text-align: center;
    color: #fff;
    font-size: 18px;
  }
</style>
