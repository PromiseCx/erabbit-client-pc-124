<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <Form class="form" :validation-schema="mySchema" v-slot="{errors}" autocomplete="off" ref="formCom">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field name="account" v-model="form.account" :class="{error:errors.account}" type="text" placeholder="请输入用户名" />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning" />
            {{errors.account}}
        </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field name="password" v-model="form.password" :class="{error:errors.password}" type="password" placeholder="请输入密码" />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />
            {{errors.password}}
        </div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field name="mobile" v-model="form.mobile" :class="{error:errors.mobile}" type="text" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />
            {{errors.mobile}}
          </div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field name="code" v-model="form.code" :class="{error:errors.code}" type="text" placeholder="请输入验证码" />
            <span class="code" @click="send()">{{time === 0 ? '发送验证码':`${time}秒后发送`}}</span>
          </div>
          <div class="error" v-if="errors.code">
                <i class="iconfont icon-warning" />
                {{errors.code}}
           </div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree">
                <i class="iconfont icon-warning" />
                {{errors.isAgree}}
           </div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, ref, watch } from 'vue'
import { Form, Field } from 'vee-validate'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import schema from '@/utils/vee-validate-schema'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import Message from '@/components/library/Message'
// import QC from 'qc'

export default {
  name: 'LoginForm',
  components: {
    Form, Field
  },
  setup () {
    const isMsgLogin = ref(false)
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    /**
     * vee-validate校验规则步骤：
     * 1.导入Form Field组件，替换form，input，Field需要一个name属性，用来校验表单
     * 2.需要将每一个Field进行数据绑定,字段名称要和后台数据一致
     * 3.定义name属性指定的校验规则函数 ， Form的validation-schema用来接受校验规则对象
     * 4.自定义组件校验，需要支持v-model，Field 使用 as属性 可以解析为组件来校验
     */

    const mySchema = {
      //  校验函数规则，返回true则是校验成功，返回一个字符串就是校验失败（字符串：错误提示信息）
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 监听isMsgeLogin重置表单
    // 切换表单元素，还原数据和清除校验效果
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 还原数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 补充校验效果清除，Form组件提供resetForm()
      formCom.value.resetForm()
    })

    //  setup中拿到当前组件实例 proxy
    // const { proxy } = getCurrentInstance()

    /**
     * useRoute()： 用来获取路由信息
     * useRouter()：用来跳转路由
     */
    const route = useRoute()
    const router = useRouter()

    // 点击登录时，整体表单验证
    const store = useStore()
    const login = async () => {
      // Form组件提供了整体校验方法，validate，返回的是一个promise对象
      // setup不可使用async 但是里面的函数可以使用async，await
      const valid = await formCom.value.validate()
      //   proxy.$message({ type: 'success', text: '111' })
      //  Message({ type: 'success', text: '111' })
      if (valid) {
        try {
          let data = null
          if (isMsgLogin.value) {
          // 手机号登录
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          } else {
          // 账号登录
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          }
          // 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            // 进行跳转
            router.push(route.query.redirectUrl || '/')
            Message({ type: 'success', text: '登陆成功！' })
          })
        } catch (error) {
          Message({ type: 'error', text: error.response.data.message || '登陆失败！' })
        }
      }
    }

    let timer = null
    const time = ref(0)

    onMounted(() => {
      clearInterval(timer)
    })

    const send = () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        // 校验通过
        if (time.value === 0) {
          userMobileLoginMsg(form.mobile).then(() => {
            Message({ type: 'success', text: '发送验证码成功！' })
            time.value = 60
            clearInterval(timer)
            timer = setInterval(() => {
              time.value--
              if (time.value <= 0) clearInterval(timer)
            }, 1000)
          }).catch(e => {
            Message({ type: 'error', text: '发送验证码失败！' })
          })
        }
      } else {
        // 失败,触发vee的表单校验函数显示错误信息 setFieldError(字段名称，错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }

    //  初始化qq登录按钮（官方）
    // 1.准备一个span有id
    // 2. QC.Login({btnId:"qqLoginBtn"})
    // onMounted(() => {
    //   QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })

    return { isMsgLogin, form, mySchema, formCom, login, send, time }
  }
}
</script>

<style scoped lang="less">
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
