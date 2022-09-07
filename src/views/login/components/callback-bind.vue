<template>
  <Form ref="formCom" class="xtx-form" :validation-schema="mySchema" autocomplete="off" v-slot="{errors}">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi,{{nickname}} 欢迎来小兔鲜,完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err:errors.mobile}" v-model="form.mobile" name="mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div v-if="errors.mobile" class="error">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err:errors.code}" v-model="form.code" name="code" class="input" type="text" placeholder="短信验证码" />
        <span class="code" @click="send()">{{time === 0?'发送验证码':`${time}秒后发送`}}</span>
      </div>
      <div v-if="errors.code" class="error">{{errors.code}}</div>
    </div>
    <a @click="submit()" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { reactive, ref } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

export default {
  name: 'CallbackBind',
  components: {
    Form, Field
  },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 需要 openId（unionId），头像，昵称
    const nickname = ref('null')
    const avatar = ref('null')

    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_1
        nickname.value = res.data.nickname
      })
    }
    // 表单的校验

    // 表单数据对象
    const form = reactive({
      mobile: null,
      code: null
    })
    // 表单规则对象
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }
    // 发送验证码
    let timer = null
    const formCom = ref(null)
    const time = ref(0)
    const send = () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (time.value === 0) {
          time.value = 60
          userQQBindCode(form.mobile).then(() => {
            clearInterval(timer)
            Message({ type: 'success', text: '发送验证码成功!' })
            timer = setInterval(() => {
              time.value--
              if (time.value === 0) clearInterval(timer)
            }, 1000)
          }).catch(e => {
            Message({ type: 'error', text: e.response.data.message })
          })
        }
      } else {
        formCom.value.setFieldError('mobile', valid)
      }
    }
    // 进行绑定，绑定成功就是登录成功
    const store = useStore()
    const router = useRouter()

    const submit = () => {
      const valid = formCom.value.validate()
      if (valid) {
        userQQBindLogin({
          unionId: props.unionId,
          ...form
        }).then(data => {
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(() => {
            // 进行跳转
            router.push(store.state.user.redirectUrl)
            Message({ type: 'success', text: 'QQ绑定成功!' })
          })
        }).catch(e => {
          Message({ type: 'error', text: '绑定失败！' })
        })
      }
    }

    return { nickname, avatar, form, mySchema, send, time, submit, formCom }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
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
