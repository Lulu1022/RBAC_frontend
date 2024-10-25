<template #content>
    <div class="flex">
        <el-badge :value="notification().notificationNumber"
        v-if="notification().notificationNumber == 0 ? false : true" 
        :max="99" class="item">
    <el-button @click="redirectToPendingForms">待審核</el-button>
  </el-badge>
        <el-dropdown>
            <span class="el-dropdown-link">
                <span class="text-large font-600 mr-3"> {{ permissinStore.userName }}</span>
                <span>
                    <el-tag> {{ permissinStore.roleName }}</el-tag>
                </span>
                <el-icon class="el-icon--right">
                    <arrow-down />
                </el-icon>
            </span>
            <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item @click="logoutHandler">登出</el-dropdown-item>
                </el-dropdown-menu>
            </template>
        </el-dropdown>



    </div>
</template>


<script setup lang="ts">
import { useRouter } from 'vue-router';
import { userPermissionsStore } from '../../stores/userPermissions';
import { ref } from 'vue';
import { notification } from '../../stores/notification';
import { getFormsByUserIdAndReviewStatus } from '../../api/form'
const router = useRouter();
const permissinStore = userPermissionsStore()
const pendingList = ref([])



const logoutHandler = () => {
    localStorage.removeItem('token');
    router.push('/login');
}

const getPendingList = async () => {
    const respone = await getFormsByUserIdAndReviewStatus(userPermissionsStore().userId,"pending")
    pendingList.value = respone.data.data
}
getPendingList()

const redirectToPendingForms = () => {
    router.push('/admin/pending-forms');
}



</script>
<style scoped>
.example-showcase .el-dropdown-link {
    cursor: pointer;
    color: var(--el-color-primary);

}

.el-dropdown-link {
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.flex {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 20px;
}
</style>