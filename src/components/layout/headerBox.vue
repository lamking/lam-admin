<template>
  <div>
    <Row>
      <i-col span="23">
        <div class="menu-box r-f">
          <div class="menu-item r-f-i" @click="home">
            <Tooltip content="首页" placement="bottom">
              <i class="iconfont icon-home home-icon"></i>
            </Tooltip>
          </div>
          <div class="menu-item r-f-i item-end" @click="returnBack" v-if="$route.meta.level >= 3">
            <Tooltip content="返回" placement="bottom">
              <i class="iconfont icon-fanhui3 home-icon"></i>
            </Tooltip>
          </div>
        </div>
      </i-col>
      <i-col span="1">
        <Dropdown style="margin-left: 20px" @on-click="dropdownOnClick">
          <Avatar :src="userInfo.headImg" size="large"/>
          <DropdownMenu slot="list">
            <DropdownItem name="updatePwd">修改密码</DropdownItem>
            <DropdownItem name="logout">退出登录</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </i-col>
    </Row>
    <Modal v-model="updatePwdModal" title="修改密码">
      <Form :label-width="80">
        <FormItem label="旧密码">
          <i-input type="password" v-model="updatePwd.oldPassword" placeholder="请输入旧密码"></i-input>
        </FormItem>
        <FormItem label="新密码">
          <i-input type="password" v-model="updatePwd.password" placeholder="请输入新密码"></i-input>
        </FormItem>
        <FormItem label="确认新密码">
          <i-input type="password" v-model="updatePwd.confirmPassword" placeholder="请再次输入新密码"></i-input>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="primary" size="large" @click="updatePswOk">确认修改</Button>
      </div>
    </Modal>
  </div>
</template>
<style scoped lang="less" rel="stylesheet/less">
  .home-icon {
    font-size: 18px;
  }

  .menu-box {
    height: 60px;
    align-items: center;
    .menu-item {
      padding: 0 20px;
      max-width: 100px;
      border-right: 1px solid #ccc;
      height: 30px;
      line-height: 30px;
      cursor: pointer;
    }
    .item-end {
      border-right: 0;
    }
  }
</style>
<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default {
    data () {
      return {
        updatePwdModal: false,
        updatePwd: {
          oldPassword: '',
          password: '',
          confirmPassword: ''
        }
      }
    },
    computed: {
      ...mapGetters(['userInfo', 'menuList'])
    },
    methods: {
      returnBack () {
        window.history.go(-1)
      },
      home () {
        this.$store.commit('SET_CURRENT_MENU', this.menuList[0])
      },
      dropdownOnClick (name) {
        switch (name) {
          case 'logout':
            this.$http.post('user/logout').then(res => {})
            this.$store.commit('LOGOUT')
            break
          case 'updatePwd':
            this.updatePwdModal = true
            break
        }
      },
      updatePswOk () {
        if (this.updatePwd.confirmPassword !== this.updatePwd.password) {
          this.$Message.error('新密码与确认密码不相符')
          return false
        }
        this.$http.post('admin/updatePassword', this.updatePwd).then(res => {
          this.$Message.success('修改成功')
          this.updatePwdModal = false
        })
      }
    },
    mounted () {
    }
  }
</script>
