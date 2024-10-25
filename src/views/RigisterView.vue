<template>
  <div class="flexbox">
  <el-text class="mx-1 title" size="large" tag="b">註冊</el-text>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    style="max-width: 600px"
    status-icon
    label-width="auto"
    class="demo-ruleForm"
    label-position="top"
  >
  <el-form-item label="帳號" prop="username">
      <el-input v-model.username="ruleForm.username" />
    </el-form-item>
    <el-form-item label="Email" prop="email">
      <el-input v-model.email="ruleForm.email" />
    </el-form-item>
    <el-form-item label="密碼" prop="password">
      <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
    </el-form-item>
    <el-form-item label="確認密碼" prop="checkPass">
      <el-input
        v-model="ruleForm.checkPass"
        type="password"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item>
      <div class="recaptcha-container">
        <GoogleReCaptchaV2  @verify="onVerify"/>
      </div>
    </el-form-item>
    <el-form-item>
        <el-button class="submitbutton" type="primary" @click="submitForm(ruleFormRef)">
          送出
        </el-button>
    </el-form-item>
  </el-form>

    <el-divider content-position="center"></el-divider>
    <div>
      <span>已經有帳號?</span><el-button class="button" type="text" @click="loginPage">登入</el-button>
    </div>
</div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import {register} from '../api/register.js'
import {captcha} from "../api/google.js";
import {ElMessage} from "element-plus";
import GoogleReCaptchaV2 from "../layout/components/GoogleReCaptchaV2.vue";

const ruleFormRef = ref()
const googleToken = ref()
const router = useRouter()

const ruleForm = reactive({
  username: '',
  email: '',
  password: '',
  checkPass: ''
})

// 跳轉到登入頁面
const loginPage = () => {
  router.push("/login");
}

const onVerify = async (token) => {
  return googleToken.value = token;
}
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('請設定密碼'));
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField('checkPass', () => {
        callback();
      });
    } else {
      callback();
    }
  }
};

const validatePass2 = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('請再次設定密碼'));
  } else if (value !== ruleForm.password) {
    callback(new Error('兩次密碼必須相同'));
  } else {
    callback();
  }
};


const rules = reactive({
  username: [{ required: true, message: '必填', trigger: 'blur'}],
  email: [{ required: true, message: '必填', trigger: 'blur'}],
  password: [{ required: true, validator: validatePass, trigger: 'blur'}],
  checkPass: [{ required: true, validator: validatePass2, trigger: 'blur' }]
})



const submitForm = (ruleFormRef) => {
  if (!ruleFormRef) return
  ruleFormRef.validate(async(valid) => {
    if (valid) {
      // Goolge 前端回應結果已存到 googleToken.value
      const { data: success } = await captcha(googleToken.value);
      if(success === true){
        const { code: registerCode, msg: registerSuccess } = await register(ruleForm).then(res => res.data);
        if(registerCode === 0){
          ElMessage({
            message: registerSuccess,
            type: 'error',
          });
        }else{
        }
      }


    } else {
      console.log('表單驗證失敗')
    }
  })
}

const resetForm = (ruleFormRef) => {
  if (!ruleFormRef) return
  ruleFormRef.resetFields()
}
</script>

<style scoped>
.flexbox {
  width: 300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  margin: 24px;
}

.submitbutton{
  display: flex;
  flex-grow: 1;
}

</style>