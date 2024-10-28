<template>
  <div class="flexbox">
    <el-text class="mx-1 title" size="large" tag="b">RBAC 權限管理系統</el-text>
    <el-form
    label-position="top" 
    :rules="rules" 
    ref="formRef"
    style="max-width: 600px"
    :model="form" status-icon
      label-width="auto" 
      class="form">
      <el-form-item  label="名稱" prop="username">
        <el-input v-model.number="form.username" />
        <span style="color: rgb(115.2, 117.6, 122.4);">提示：Lulu</span>
      </el-form-item>
      <el-form-item label="密碼" prop="password">
        <el-input v-model="form.password" type="password" autocomplete="off" show-password />
        <span style="color: rgb(115.2, 117.6, 122.4);">提示：123456</span>
      </el-form-item>
      <el-form-item>
        <div class="loginbuttons">
          <el-button class="loginbutton" type="primary" @click="submitForm">登入</el-button>
        </div>
      </el-form-item>
    </el-form>
    <div>
      <span>沒有帳號?</span><el-button class="button" type="text" @click="registerPage">註冊</el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { login } from '../api/login'
import { useRouter } from 'vue-router';
import { userPermissionsStore } from '../stores/userPermissions'
import { notification } from '../stores/notification';
import { ElMessage } from 'element-plus'
import {decodeCredential, googleLogout} from "vue3-google-login";


const formRef = ref(null)
const profile = ref(null)
const router = useRouter()
const form = reactive({
  username: '',
  password: ''
})
const rules = reactive({
  username: [
    { required: true, message: '必填', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '必填', trigger: 'blur' },
  ]
})
const permissinStore = userPermissionsStore()

const callback = (response) => {
  profile.value = decodeCredential(response.credential)
}

const logout = () => {
    googleLogout();
}
const registerPage = () => {
  router.push("/register");
}

const submitForm = async () => {

  // 1. 驗證表單
  const isValid = await new Promise((resolve) => {
    // 使用 Promise 封裝表單驗證函數，等待驗證完成
    formRef.value.validate((valid) => {
      resolve(valid);
    });
  });

  // 2. 如果表單驗證不通過，提前返回
  if (!isValid) {
    return false;
  }

  // 3. 如果表單驗證通過，進行登錄操作
  try {
    const loginUser = await login(form);

    // 4. 檢查登錄結果
    if (loginUser.data.code === 1) {
      console.log("驗證通過: ", loginUser.data.data);
      const { token, user, userPermissionId, userPermissionName } = loginUser.data.data;
      const { userId, role, username, roleName } = user;
      const permissionStore = userPermissionsStore();
      permissionStore.setUserId(userId);
      permissionStore.setUserRole(role);
      permissionStore.setUserName(username);
      permissinStore.setUserPermissionsId(userPermissionId);
      permissinStore.setUserPermissionsName(userPermissionName)
      permissinStore.setRoleName(roleName);
      localStorage.setItem('token', token);


      router.push('/admin/users');
      ElMessage({
        message: '登入成功',
        type: 'success',
      });
    }
    else if (loginUser.data.msg == '使用者未啟用') {
      ElMessage({ message: '使用者未啟用', type: 'error', });
    }
    else {
      ElMessage({ message: '登入失敗', type: 'error', });
    }

  }


  catch (error) {
    console.error("登入出錯:", error);

  }
};
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

.form {
  width: 100%;
}

.title {
  width: 100%;
  text-align: center;
  font-size: 20px;
  font-family: Inter, 'Helvetica Neue', Helvetica, 'PingFang SC',
    'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
  margin: 24px;
}
.loginbuttons{
  display: flex;
  flex-grow: 1;
}
.loginbutton{
  display: flex;
  flex-grow: 1;
}
</style>
