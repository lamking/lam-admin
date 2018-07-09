<!-- 图片上传 -->
<!--默认宽度 400 * 210-->
<template>
  <div>
    <div class="loading" v-if="loading">
      上传中...
    </div>
    <div class="imgs-upload-list" v-if="!isArr">
      <div v-if="value">
        <img :src="value">
      </div>
      <div v-if="!value">
        请上传图片
      </div>
      <div class="img-upload-list-cover">
        <Icon type="ios-eye-outline" @click.native="handleView(value)"></Icon>
        <Icon v-if="!onlyRead" type="ios-cloud-upload-outline" @click.native="updateImg"></Icon>
      </div>
    </div>
    <div v-if="isArr">
      <div v-if="isTitle" class="imgs-upload-list" v-for="(item, index) in value" :key="index">
        <!--多图带标题模式-->
        <div v-if="item.img">
          <img :src="item.img">
        </div>
        <div v-if="!item.img">
          请上传图片
        </div>
        <!--<img :src="item.img">-->
        <i-input v-model="item.title" placeholder="此处可输入相册标题"
                 style="position: absolute; bottom: 0;z-index: 1000; width: 400px;left: 0;"></i-input>
        <div class="img-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item.img)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item, index)"></Icon>
          <Icon v-if="!onlyRead" type="ios-cloud-upload-outline" @click.native="updateImg(index)"></Icon>
        </div>
      </div>
      <div v-if="!isTitle" class="imgs-upload-list" v-for="(item, index) in valueArr" :key="index">
        <img :src="item">
        <div class="img-upload-list-cover">
          <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
          <Icon type="ios-trash-outline" @click.native="handleRemove(item, index)"></Icon>
          <Icon v-if="!onlyRead" type="ios-cloud-upload-outline" @click.native="updateImg(index)"></Icon>
        </div>
      </div>
      <div class="imgs-upload-list">
        <div v-if="!onlyRead" style="height:210px;line-height: 210px;border: 1px solid #ddd; cursor: pointer" @click="updateImg">
          <Icon type="camera" size="42"></Icon>
        </div>
      </div>
    </div>

    <input
      ref="input"
      type="file"
      hidden
      @change="handleChange">
    <Modal v-model="cropperModal" title="图片裁剪" :width="1200" :mask-closable="false" class-name="cropperModal" :transfer="false">
      <cropper style="width: 1150px;height: 600px;"
               ref="cropper"
               :img="url"
               :outputSize="1"
               outputType="png"
               :fixed="true"
               :fixedNumber="fixedNumber"
               :original="true"
      ></cropper>
      <Button @click="startCrop">开始裁剪</Button>
      <Button @click="stopCrop">取消裁剪</Button>
      <div slot="footer">
        <Button @click="getCrop" type="primary" :loading="isUpload">确认裁剪</Button>
        <!--<Button type="error" size="large" long :loading="modal_loading" @click="del">Delete</Button>-->
      </div>
    </Modal>
  </div>
</template>
<style scoped lang="less" rel="stylesheet/less">
  .imgs-upload-list {
    display: inline-block;
    width: 400px;
    height: 210px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
    img {
      width: 100%;
      /*height: 100%;*/
    }
    .img-upload-list-cover {
      display: none;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba(0, 0, 0, .6);
    }
  }

  .imgs-upload-list:hover .img-upload-list-cover {
    display: block;
  }

  .img-upload-list-cover i {
    color: #fff;
    font-size: 32px;
    cursor: pointer;
    margin: 80px 12px;
  }

  .loading {
    background: #000;
    opacity: 0.5;
    position: absolute;
    top: 0;
    height: 210px;
    width: 400px;
    z-index: 100;
    text-align: center;
    font-size: 24px;
    color: #fff;
    line-height: 210px;
  }

  .ivu-modal-wrap {
    /*z-index: 2000 !important;*/
  }
  .ivu-modal-mask {
    /*z-index: 2000 !important;*/
  }
</style>
<script type="text/ecmascript-6">
  import cropper from 'vue-cropper'

  export default {
    data () {
      return {
        loading: false,
        valueArr: [],
        currentIndex: null,
        cropperModal: false,
        url: '',
        isUpload: false
      }
    },
    props: {
      value: {
        default: () => {
          return ''
        }
      },
      isArr: {
        type: Boolean,
        default: () => {
          return false
        }
      },
      isCropper: {
        // 是否需要裁剪
        default: () => {
          return true
        }
      },
      fixedNumber: {
        // 裁剪比例
      },
      isTitle: {
        // 带标题格式
        type: Boolean,
        default: () => {
          return false
        }
      },
      onlyRead: {
        // 是否只读
        type: Boolean,
        default: () => {
          return false
        }
      }
    },
    components: {
      cropper
    },
    methods: {
      handleView (item) {
        // 预览图片
        this.$store.dispatch('openPreview', item)
      },
      updateImg (index) {
        // console.log(typeof index, index)
        if (typeof index === 'number') {
          this.currentIndex = index
        } else {
          this.currentIndex = -1
        }
        this.$refs.input.click()
      },
      handleChange (e) {
        if (this.isCropper) {
          // 裁剪的操作处理
          let reader = new FileReader()
          let file = e.target.files[0]
          reader.readAsDataURL(file)
          reader.onload = (e) => {
            this.cropperModal = true
            this.url = e.target.result
          }
        } else {
          this.loading = true
          const file = e.target.files[0]
          if (!file) {
            return
          }
          this.$refs.input.value = null
          let formData = new FormData()
          formData.append('file', file)
          this.$http.post('upload/file', formData).then(res => {
            if (this.isArr) {
              if (typeof this.currentIndex === 'number' && this.currentIndex >= 0) {
                this.valueArr[this.currentIndex] = res.data[0]
              } else {
                this.valueArr.push(res.data[0])
              }
            } else {
              this.$emit('input', res.data[0])
            }
            this.loading = false
          })
        }
      },
      handleRemove (item, index) {
        if (this.isTitle) {
          this.value.splice(index, 1)
        } else {
          this.valueArr.splice(index, 1)
        }
      },
      handlerRender () {
        if (this.value && !this.isTitle) {
          this.valueArr = this.value.split(',')
        }
      },
      startCrop () {
        this.$refs.cropper.startCrop()
      },
      stopCrop () {
        this.$refs.cropper.stopCrop()
      },
      getCrop () {
        this.$refs.cropper.getCropBlob(data => {
          this.isUpload = true
          let fd = new FormData()
          fd.append('file', data)
          fd.append('token', this.qiniuToken)
          this.$http.post('upload/file', fd)
            .then(response => {
              if (this.isTitle) {
                // 带标题模式
                if (this.isArr) {
                  // 多图模式
                  if (typeof this.currentIndex === 'number' && this.currentIndex >= 0) {
                    this.value[this.currentIndex]['img'] = response.data[0]
                  } else {
                    this.value.push({title: '', img: response.data[0]})
                  }
                } else {
                  this.$emit('input', response.data[0])
                }
              } else {
                if (this.isArr) {
                  // 多图模式
                  if (typeof this.currentIndex === 'number' && this.currentIndex >= 0) {
                    this.valueArr[this.currentIndex] = response.data[0]
                  } else {
                    this.valueArr.push(response.data[0])
                  }
                } else {
                  this.$emit('input', response.data[0])
                }
              }
              this.isUpload = false
              this.cropperModal = false
            })
        })
      }
    },
    watch: {
      valueArr () {
        this.$emit('input', this.valueArr.join(','))
      },
      value () {
        this.handlerRender()
      }
    },
    mounted () {
      if (this.isArr) {
        this.handlerRender()
      }
    }
  }
</script>
