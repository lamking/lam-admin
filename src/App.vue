<template>
  <div id="app">
    <template v-if="!isLogin">
      <login></login>
    </template>
    <template v-if="isLogin">
      <Layout>
        <!--<Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed">-->
        <!--<sideBar @collapsedSider="collapsedSider" :isCollapsed="isCollapsed"></sideBar>-->
        <!--</Sider>-->
        <!--<Layout>-->
        <!--<Header>-->
        <!--<headerBox></headerBox>-->
        <!--</Header>-->
        <!--<Content>-->
        <!--&lt;!&ndash;<router-view/>&ndash;&gt;-->
        <!--<mineContent></mineContent>-->
        <!--</Content>-->
        <!--<Footer>-->
        <!--<div class="footer">-->
        <!--<p>创购商城-平台管理端 V1.0</p>-->
        <!--<p>粤ICP备15004674号</p>-->
        <!--</div>-->
        <!--</Footer>-->
        <!--</Layout>-->
      </Layout>
    </template>
    <!--<img-preview v-model="imgPreview.show" :url="imgPreview.url"></img-preview>-->
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import login from './components/layout/login'

  export default {
    name: 'App',
    computed: {
      ...mapGetters([
        'isLogin'
      ])
    },
    components: {
      login
    }
  }
</script>

<style>
  #app {
  }
</style>
