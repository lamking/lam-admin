<template>
  <div>
    <Modal v-model="showModal"
           title="图片预览"
           width="960"
           :styles="{'z-index': 2000}"
           @on-cancel="close"
           :transfer="false">
      <img style="width: 100%;" :src="imgPreview.url" alt="">
      <div slot="footer">
        <Button type="primary" size="large" long @click="close">关闭</Button>
      </div>
    </Modal>
  </div>
</template>
<style scoped lang="less" rel="stylesheet/less">
</style>
<style>
</style>
<style>
</style>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'

  export default {
    props: [
      'value',
      'url'
    ],
    data () {
      return {
        showModal: this.value
      }
    },
    components: {},
    computed: {
      ...mapGetters([
        'imgPreview'
      ])
    },
    watch: {
      value (val) {
        this.showModal = val
      }
    },
    methods: {
      close () {
        this.$store.dispatch('closePreview')
      }
    },
    mounted () {
    }
  }
</script>
