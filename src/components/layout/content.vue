<template>
  <div>
    <Row style="min-width: 1366px;">
      <!--子菜单-->
      <i-col :span="leftContentSpan" v-if="!isInsidePage">
        <div class="layout-options-menu">
          <div class="options-box c-f">
            <div class="options-title c-f-i">
              {{currentMenu.title}}
            </div>
            <div class="options-item c-f-i" :class="{'options-item-act': item.id === currentMenuItem.id}" v-for="item in currentMenu.authorities" :key="item.id" @click="selectItem(item)">
              {{item.title}}
            </div>
          </div>
        </div>
      </i-col>
      <i-col :span="centerContentSpan">
        <div class="layout-breadcrumb">
          <breadcrumb></breadcrumb>
        </div>
        <div class="layout-content" :style="{'min-height': contentHeight + 'px'}">
          <div class="layout-content-main">
            <keep-alive>
              <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
            <router-view v-if="!$route.meta.keepAlive"></router-view>
          </div>
        </div>
      </i-col>
    </Row>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import breadcrumb from '../layout/breadcrumb'
  export default {
    data () {
      return {
        contentHeight: 800,
        breadcrumb: [],
        routeObj: {},
        currentMenuItem: {},
        leftContentSpan: 2,
        centerContentSpan: 22,
        rightContentSpan: 2,
        isInsidePage: false,
        collapseValue: '1',
        noticeList: []
      }
    },
    computed: {
      ...mapGetters(['menuList', 'currentMenu'])
    },
    methods: {
      getContentSize () {
        let wh = document.documentElement.clientHeight
        let eh = 150
        this.contentHeight = (wh - eh)
      },
      toggleClick () {
        this.$emit('toggleClick')
      },
      selectItem (item) {
        this.currentMenuItem = item
        this.$router.push({path: item.path})
      },
      updataMenu () {
        if (JSON.stringify(this.currentMenu) !== '{}') {
          this.currentMenuItem = this.currentMenu.authorities[0]
          setTimeout(() => {
            if (this.$route.meta.level <= 2) {
              this.$router.push({path: this.currentMenu.authorities[0].path})
            }
          }, 100)
        }
      },
      updataSpan () {
        this.isInsidePage = this.$route.meta.level > 2
        // console.log('updataSpan', this.isInsidePage)
        if (this.isInsidePage) {
          this.leftContentSpan = 0
          this.centerContentSpan = 24
          this.rightContentSpan = 2
        } else {
          this.leftContentSpan = 2
          this.centerContentSpan = 22
          this.rightContentSpan = 2
        }
      },
      showNotice () {
        // 放大右侧的通知栏
        if (this.rightContentSpan === 4) {
          this.rightContentSpan = 2
          this.centerContentSpan = 20
        } else {
          this.rightContentSpan = 4
          this.centerContentSpan = 18
        }
      }
    },
    mounted () {
      window.addEventListener('resize', () => {
        this.getContentSize()
      })
      this.getContentSize()
      this.updataSpan()
      this.updataMenu()
    },
    watch: {
      currentMenu (val) {
        this.updataMenu()
      },
      '$route' (val) {
        this.updataSpan()
      }
    },
    components: {
      breadcrumb
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">

  .layout-breadcrumb {
    padding: 10px 15px 0;
  }

  .layout-content {
    min-height: 200px;
    margin: 10px 30px;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    /*padding: 25px 20px;*/
    padding: 25px 20px 20px 20px;
  }
  .layout-hide-text .layout-text {
    display: none;
  }
  .layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
  }
  .ivu-col {
    transition: width .2s ease-in-out;
  }
  /*副菜单样式*/
  .layout-options-menu {
    width: 100%;
    background: #fff;
    border-top: 1px solid #EFEFEF;
    border-right: 1px solid #EFEFEF;
  }
  .options-box {
    .options-title {
      height: 70px;
      justify-content: center;
      align-items: center;
    }
    .options-item {
      height: 50px;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      /*border-bottom: 1px solid #EFEFEF;*/
      font-size: 12px;
    }
    .options-item-act {
      background: #EDF6FF;
      color: #559de0;
    }
  }
  .hide-options {
    position: absolute;
    top: 18px;
    right: 0;
    height: 35px;
    width: 15px;
    background: #F5F7F9;
    text-align: center;
    border: 1px solid #EFEFEF;
    border-right: none;
    i {
      font-size: 10px;
      color: #c3c5c0;
      line-height: 35px;
    }
  }
  /*右侧通知栏样式*/
  .layout-notice-box {
    font-size: 12px;
    background: #fff;
    height: 800px;
    border-top: 1px solid #EFEFEF;
    border-left: 1px solid #EFEFEF;
    .layout-notice-item {
      min-height: 45px;
      line-height: 45px;
      .layout-notice-item-content {
        padding: 0 12px;
        background: #F9F9F9;
      }
    }
  }
  .show-notice-options {
    position: absolute;
    top: 0;
    left: -15px;
    height: 35px;
    width: 15px;
    background: #fff;
    text-align: center;
    border: 1px solid #EFEFEF;
    border-right: none;
    i {
      font-size: 10px;
      color: #c3c5c0;
      line-height: 35px;
    }
  }
  // 面包屑样式
  .layout-breadcrumb {
    background: #fff;
    padding: 20px;
    margin: 10px 30px 0 30px;
  }
</style>
<style>
  .ivu-collapse-content-box {
    padding: 0 !important;
  }
  .ivu-collapse-content {
    padding: 0 !important;
  }
  .ivu-collapse-header {
    padding-left: 15px !important;
    height: 40px !important;
    line-height: 40px !important;
  }
  .ivu-icon-arrow-right-b {
    margin-right: 5px !important;
  }
</style>
