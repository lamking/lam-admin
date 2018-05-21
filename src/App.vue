<template>
  <div id="app">
    <template v-if="!isLogin">
      <login></login>
    </template>
    <template v-if="isLogin">
      <Layout>
        <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">
          <sideBar @collapsedSider="collapsedSider" :isCollapsed="isCollapsed"></sideBar>
        </Sider>
        <Layout>
        <Header>
          <headerBox></headerBox>
        </Header>
        <Content>
          <mineContent></mineContent>
        </Content>
        <Footer>
        <div class="footer">
        <p>{{STSTEM_CONFIG.WEBSITE_NAME}} {{STSTEM_CONFIG.VERSION}}</p>
        <p>{{STSTEM_CONFIG.ICP}}</p>
        </div>
        </Footer>
        </Layout>
      </Layout>
    </template>
    <img-preview v-model="imgPreview.show" :url="imgPreview.url"></img-preview>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import login from './components/layout/login'
  import sideBar from './components/layout/sidebar'
  import headerBox from './components/layout/headerBox'
  import mineContent from './components/layout/content'
  import imgPreview from './components/common/img-preview.vue'

  export default {
    name: 'App',
    data () {
      return {
        isCollapsed: false
      }
    },
    computed: {
      ...mapGetters([
        'isLogin',
        'STSTEM_CONFIG',
        'imgPreview'
      ])
    },
    components: {
      login,
      sideBar,
      headerBox,
      mineContent,
      imgPreview
    },
    methods: {
      collapsedSider () {
        this.$refs.side1.toggleCollapse()
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  @import url('//at.alicdn.com/t/font_562743_ptbsjvq23dmzehfr.css');

  .ivu-layout-header {
    background: #fff;
    padding-left: 0;
  }
  .ivu-layout-sider {
    background: #24303C;
    max-width: 50px !important;
  }
  .layout {
    border: 1px solid #d7dde4;
    background: #F5F7F9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  .layout-menu-left {
    background: #464c5b;
  }

  .layout-ceiling-main a {
    color: #9ba7b5;
  }

  .layout-hide-text .layout-text {
    display: none;
  }
  .footer {
    border-top: 1px solid #ddd;
    padding-top: 20px;
    p {
      text-align: center;
      line-height: 28px;
      color: #ababab;
    }
  }
</style>
