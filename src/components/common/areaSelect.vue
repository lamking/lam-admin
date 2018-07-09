<!--组件名：地址选择器-->
<!--
    说明：地址二级联动选择
    三级联动请使用 areaSelectDistrict 组件
-->
<template>
  <div>
    <Row>
      <i-col span="11">
        <Select v-model="provinceId" clearable placeholder="请选择省份" @on-change="provinceOnChange">
          <Option v-for="(area) in areaList" :value="area.value" :key="area.value">{{area.label}}</Option>
        </Select>
      </i-col>
      <i-col span="11" offset="1">
        <Select v-model="cityId" clearable placeholder="请选择城市">
          <Option v-for="(area) in cityList" :value="area.value" :key="area.value">{{area.label}}</Option>
        </Select>
      </i-col>
    </Row>
  </div>
</template>
<style scoped lang="less" rel="stylesheet/less">
</style>
<script type="text/ecmascript-6">
  import area from '../../../static/area-wuliu'

  export default {
    data () {
      return {
        areaList: area,
        cityList: [],
        cityId: '',
        provinceId: '',
        provinceName: '',
        name: '',
        options: [],
        isInit: true
      }
    },
    props: {
      currentAreaObj: {
        default () {
          return {
            id: '',
            level: 2,
            name: '',
            parentId: '',
            province: '',
            provinceId: ''
          }
        }
      },
      isBMap: {
        // 为BMAP组件特殊优化
        type: Boolean,
        default: () => {
          return false
        }
      }
    },
    watch: {
      cityList (val) {
        // this.cityList = this.deepCp(val)
        console.log('watch cityList', this.cityList)
      },
      provinceId: {
        deep: true,
        handler: function (val) {
          if (this.isBMap) {
            if (this.isInit) {
              if (!this.currentAreaObj) {
                this.cityId = ''
              }
            } else {
              this.cityId = ''
            }
          } else {
            this.cityId = ''
          }
          let provinceIdObj = this.areaList.find(val => {
            return val.value === this.provinceId
          })
          this.cityList = []
          this.cityList = this.deepCp(provinceIdObj.children)
          this.provinceName = provinceIdObj.label
          this.syncArea()
          this.isInit = false
        }
      },
      cityId () {
        let cityObj = this.cityList.find(val => {
          return val.value === this.cityId
        })
        this.name = cityObj ? cityObj.label : ''
        this.syncArea()
      },
      currentAreaObj () {
        this.cityId = this.currentAreaObj.id
        this.provinceId = this.currentAreaObj.parentId
        this.provinceId = this.currentAreaObj.provinceId
        this.name = this.currentAreaObj.name
        this.provinceName = this.currentAreaObj.province
      }
    },
    computed: {},
    methods: {
      syncArea () {
        // 对象里面的属性不好监听 所以在选择完之后进行同步操作
        this.currentAreaObj.id = this.cityId
        this.currentAreaObj.parentId = this.provinceId
        this.currentAreaObj.provinceId = this.provinceId
        this.currentAreaObj.name = this.name
        this.currentAreaObj.province = this.provinceName
        this.$emit('selectAreaEvent', this.currentAreaObj)
        // console.log('emit', this.currentAreaObj)
      },
      provinceOnChange (e) {
        // console.log(e)
      }
    },
    mounted () {
    }
  }
</script>
