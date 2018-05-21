<template>
  <div>
    <div id="login">
      <div class="login-warpper">
        <div class="header">
          <strong class="title">后台管理系统</strong>
          <p>Management System</p>
        </div>
        <Form ref="form" @keyup.enter.native="handleSubmit('form')" :model="form" :rules="ruleCustom">
          <Form-item prop="username">
            <i-input type="text" placeholder="请输入账户" v-model="form.username"></i-input>
          </Form-item>
          <Form-item prop="password">
            <i-input type="password" placeholder="请输入密码" v-model="form.password"></i-input>
          </Form-item>
          <Form-item prop="code">
            <Row>
              <i-col span="16">
                <i-input type="text" placeholder="验证码" v-model="form.code"></i-input>
              </i-col>
              <i-col span="8">
                <img class="code" :src="codeUrl" @click="refreshCode" alt="">
              </i-col>
            </Row>
          </Form-item>
        </Form>
        <Button type="primary" :loading="$store.getters.busying" long @click="handleSubmit('form')">提交</Button>
        <p class="icp">粤ICP备 00000号</p>
      </div>
    </div>
  </div>
</template>
<style scoped lang='less' rel="stylesheet/less">
  #login {
    width: 100%;
    height: 100%;
    position: fixed;
    background: url("../../assets/login_bg_1.jpg");
    .login-warpper {
      height: 340px;
      width: 300px;
      background: transparent;
      position: absolute;
      top: 50%;
      right: 5%;
      transform: translateY(-50%);
      border-radius: 10px;
      box-shadow: 0 0 1px #f5f5f5;
      padding: 15px 25px 10px 25px;
      color: white;
      .code {
        height: 32px;
        width: 100%;
      }
      .header {
        text-align: center;
        margin-bottom: 15px;
        .title {
          font-size: 20px;
        }
      }
      .icp {
        text-align: center;
        padding: 10px 0;
      }
    }
  }
</style>
<script type="text/ecmascript-6">
  export default {
    data () {
      return {
        form: {
          username: '',
          password: '',
          code: ''
        },
        ruleCustom: {
          username: [
            {required: true, message: '账户不能为空', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '密码不能为空', trigger: 'blur'}
          ],
          code: [
            {required: true, message: '验证码不能为空', trigger: 'blur'}
          ]
        },
        codeUrl: ''
      }
    },
    methods: {
      refreshCode () {
        // (process.env.NODE_ENV !== 'production' ? '/api' : '') +
        let baseUrl = (process.env.NODE_ENV !== 'production' ? '/api' : '') + '/admin/code/getCode'
        baseUrl += ('?rand=' + Math.random(1))
        this.codeUrl = baseUrl
      },
      handleSubmit (name) {
        if (this.$store.getters.busying) {
          return
        }
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.$http.post('admin/login', Object.assign({}, this.form, {password: this.$rsa(this.form.password)})).then(res => {
              if (res.data) {
                this.$store.commit('SET_USER_INFO', res.data)
                this.$Message.success('登录成功!')
              }
            })
          } else {
            this.$Message.error('请输入登录信息!')
          }
        })
      },
      handleReset (name) {
        this.$refs[name].resetFields()
      }
    },
    mounted () {
      if (process.env.NODE_ENV !== 'production') {
        this.form = {
          username: '1',
          password: '123456',
          code: ''
        }
      }
      this.refreshCode()
    }
  }
</script>
