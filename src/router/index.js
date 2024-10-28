import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import UsersView from '../views/UsersView.vue'
import AuthView from '../views/AuthView.vue'
import FormListView from '../views/FormListView.vue'
import FormSubmissionView from '../views/FormSubmissionView.vue'
import PendingForm from '../views/PendingForm.vue'
import RigisterView from '../views/RigisterView.vue'
import NoAccessView from '../views/NoAccessView.vue'
import admin from '../layout/admin.vue'
import { userPermissionsStore } from '../stores/userPermissions.js'
import { getPermissionPathByUserid } from '../api/user.js'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin/users'
    },
    {
      path: '/no-access',
      name: 'NoAccess',
      component: NoAccessView
    },

    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path:'/register',
      name: 'register',
      component: RigisterView
    },
    {
      path: '/admin',
      component: admin,
      children: [
        {
          path: 'users',
          component: UsersView
        },
        {
          path: 'permission-management',
          component: AuthView
        },
        {
          path: 'form-list',
          component: FormListView
        },
        {
          path: 'form-submission',
          component: FormSubmissionView
        },
        {
          path:'pending-forms',
          component: PendingForm
        }
        
      ]

    }

  ]
})



router.beforeEach(async (to, from, next) => {
  const store = userPermissionsStore();

  // 不需要權限檢查的路徑
  const publicPaths = ['/no-access', '/login', '/register'];

  // 如果當前路徑在 publicPaths 中，直接放行
  if (publicPaths.includes(to.path)) {
    return next();
  }

  const token = localStorage.getItem('token');

  let permissionPaths = [];
  // 如果有 token
  if (token) {
    try {
      const userId = store.userId;
      const response = await getPermissionPathByUserid(userId);
      const permissions = response.data.data;

      // 檢查當前路徑是否包含在權限路徑中
      if (!permissions.includes(to.path)) {
        // 如果沒有權限，跳轉到權限不足的頁面
        return next('/no-access');
      } else {
        // 如果有權限，放行
        next();
      }

    } catch (error) {
      console.error("獲取權限失敗", error);
      next('/login');  // 如果權限獲取失敗，重新導向到登入頁
      return;
    }
  }
  if(!token){
    next('/login');
  }
})


export default router


