<template>
  <Form ref="formCom" class="xtx-form" :validation-schema="mySchema" autocomplete="off" v-slot="{errors}">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field :class="{err:errors.account}" v-model="form.account" name="account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div v-if="errors.account" class="error">{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}" v-model="form.code" name="code" class="input" type="text" placeholder="请输入验证码" />
        <span class="code" @click="send()">{{time===0?'发送验证码':`${time}秒后发送`}}</span>
      </div>
          <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.password}" v-model="form.password" name="password" class="input" type="password" placeholder="请输入密码" />
      </div>
        <div v-if="errors.password" class="error">{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field :class="{err:errors.rePassword}" v-model="form.rePassword" name="rePassword" class="input" type="password" placeholder="请确认密码" />
      </div>
         <div v-if="errors.rePassword" class="error">{{errors.rePassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit()">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { reactive } from '@vue/reactivity'
import schema from '@/utils/vee-validate-schema'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'
import { ref } from 'vue'
import Message from '@/components/library/Message'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  name: 'CallbackPatch',
  components: {
    Form,
    Field
  },
  prosp: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 1.表单校验（用户名是否存在，两次密码是否一致）
    const form = reactive({
      account: null,
      password: null,
      code: null,
      rePassword: null,
      mobile: null
    })
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      password: schema.password,
      code: schema.code,
      rePassword: schema.rePassword
    }
    // 2.发送验证码
    let timer = null
    const formCom = ref(null)
    const time = ref(0)
    const send = () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (time.value === 0) {
          time.value = 60
          userQQPatchCode(form.mobile).then(() => {
            clearInterval(timer)
            Message({ type: 'success', text: '发送验证码成功!' })
            timer = setInterval(() => {
              time.value--
              if (time.value === 0) clearInterval(timer)
            }, 1000)
          }).catch(e => {
            time.value = 0
            Message({ type: 'error', text: e.response.data.message })
          })
        }
      } else {
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // 3.完善信息,立即提交
    const router = useRouter()
    const store = useStore()
    const submit = () => {
      const valid = formCom.value.validate()
      if (valid) {
        userQQPatchLogin({
          mobile: form.mobile,
          code: form.code,
          account: form.account,
          password: form.password
        }).then(data => {
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          router.push(store.user.state.redirectUrl || '/')
          Message({ type: 'success', text: '登录成功!' })
        }).catch(e => {
          Message({ type: 'error', text: e.response.data.message })
        })
      }
    }

    return { form, mySchema, send, time, formCom, submit }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
