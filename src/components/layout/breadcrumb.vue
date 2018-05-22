<template>
  <div>
    <Breadcrumb v-if="breadcrumbList[0]">
      <BreadcrumbItem v-for="item in breadcrumbList" :to="item.path" :key="item.name">{{item.name}}</BreadcrumbItem>
    </Breadcrumb>
  </div>
</template>
<style scoped lang="less" rel="stylesheet/less">
</style>
<script type="text/ecmascript-6">
  import { mapGetters } from 'vuex'

  export default{
    data () {
      return {}
    },
    computed: {
      ...mapGetters(['breadcrumbList'])
    },
    methods: {},
    mounted () {}
  }
</script>
