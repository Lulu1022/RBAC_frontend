import { defineStore } from 'pinia'
import { ref } from 'vue';

export const userPermissionsStore = defineStore('userPermissions', () => {
   // 使用者 ID
   const userId = ref(0)
   // 使用者名字
   const userName = ref('')
  // 角色 ID
  const userRole = ref(0)
  // 角色名稱
  const roleName = ref('')
  // 權限清單名稱
  const userPermissionsName = ref([])
  // 權限清單ID
  const userPermissionsId = ref([])

  
  const setUserPermissionsName = (params) => {
    userPermissionsName.value = params
  }

  const setUserPermissionsId = (params) => {
    userPermissionsId.value = params
  }

  const setUserId = (id) => {
    userId.value = id;
  }
  const setUserName = (name) => {
    userName.value = name;
  }

  const setUserRole = (role) => {
    userRole.value = role;
  }

  const setRoleName = (role) => {
    roleName.value = role;
  }

  const hasPermissionByName = (permissionName) => {
    return userPermissionsName.value.includes(permissionName);
  };

  return {
    userPermissionsName,
    userPermissionsId,
    userId,
    userRole,
    userName,
    roleName,
    setUserPermissionsId,
    setUserPermissionsName,
    setUserId,
    setUserName,
    setUserRole,
    setRoleName,
    hasPermissionByName
  }
},{
  persist: true
})
