<template>
    <el-card>
        <div>
            <ListHeader @create="handleCreate" @refresh="getDataList" permissionToCheck="新增使用者" />
            <el-table :data="tableData" :default-sort="{ prop: 'userId', order: 'descending' }">
                <el-table-column prop="userId" label="編號" sortable />
                <el-table-column prop="username" label="名字" />
                <el-table-column prop="department" label="部門" />
                <el-table-column label="角色">
                    <template #default="{ row }">
                        {{  getRoleText(row.role) }}
                    </template>
                </el-table-column>

                <el-table-column prop="status" label="狀態">
                    <template #default="scope">
                        <el-switch v-model="scope.row.status" :active-value=1 :inactive-value="0" class="ml-2"
                            @change="changeStatus(scope.row)" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" v-if="userPermissionsStore().hasPermissionByName('編輯使用者') || userPermissionsStore().hasPermissionByName('刪除使用者')">
                    <template #default="scope">
                      <template v-if="userPermissionsStore().hasPermissionByName('編輯使用者')">
                          <el-button size="small" @click="handleEdit(scope.row)">
                              編輯
                          </el-button>
                      </template>

                    <template v-if="userPermissionsStore().hasPermissionByName('刪除使用者')">
                        <el-popconfirm title="是否確定刪除?" @confirm="handleDelete(scope.row)">
                            <template #reference>
                                <el-button size="small" type="danger">
                                    刪除
                                </el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination small background layout="total, sizes, prev, pager, next" class="mt-4" :total="total"
                :page-sizes="[10, 20, 30, 40, 50, 100]" v-model:current-page="pageNumber" v-model:page-size="pageSize"
                @size-change="handleSizeChange(pageSize)" @current-change="handleCurrentChange(pageNumber)" />

            <!-- 抽屜 編輯使用者 -->
            <el-drawer v-model="drawerEdit" title="編輯使用者" :plain="true">
                <template #header>
                    <h4>編輯使用者</h4>
                </template>
                <template #default>
                    <div>
                        <el-form :model="form" ref="formRef" :rules="rules">
                            <el-form-item label="姓名" prop="username">
                                <el-input autocomplete="off" v-model="form.username" />
                            </el-form-item>
                            <el-form-item label="部門" prop="department">
                                <el-select v-model="form.department">
                                    <el-option label="Department A" value="Department A" />
                                    <el-option label="Department B" value="Department B" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="角色" prop="role">
                                <el-select v-model="form.role">
                                    <el-option v-for="item in roles" :key="item.roleId" :label="item.roleName"
                                        :value="item.roleId" />
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </template>
                <template #footer>
                    <div style="flex: auto">
                        <el-button @click="cancelClick">取消</el-button>
                        <el-button type="primary" @click="handleSubmit('edit')">確定</el-button>
                    </div>
                </template>
            </el-drawer>

            <!-- 抽屜 新增使用者 -->
            <el-drawer v-model="drawerAdd" title="新增" :plain="true">
                <template #header>
                    <h4>新增使用者</h4>
                </template>
                <template #default>
                    <div>
                        <el-form :model="formAdd" ref="formRef" :rules="rules">
                            <el-form-item label="姓名" prop="username">
                                <el-input autocomplete="off" v-model="formAdd.username" />
                            </el-form-item>
                            <el-form-item label="部門" prop="department">
                                <el-select v-model="formAdd.department">
                                    <el-option label="Department A" value="Department A" />
                                    <el-option label="Department B" value="Department B" />
                                </el-select>
                            </el-form-item>
                            <el-form-item label="角色" prop="role">
                                <el-select v-model="formAdd.role">
                                    <el-option v-for="role in roles" :key="role.roleId" :label="role.roleName"
                                        :value="role.roleId" />
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </template>
                <template #footer>
                    <div style="flex: auto">
                        <el-button @click="cancelClick">取消</el-button>
                        <el-button type="primary" @click="handleSubmit('add')">確定</el-button>
                    </div>
                </template>
            </el-drawer>


        </div>
    </el-card>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { useInitTable } from '../composables/useCommon'
import ListHeader from '../layout/components/ListHeader.vue'
import { fetchAllRoles } from '../api/role';
import { getUserList, getUser, addUser, deleteUser, editUser, updateUserStatus } from '../api/user';
import { ElMessage } from 'element-plus';
import { userPermissionsStore } from '../stores/userPermissions';
import { getPermissionsByRole } from '../api/permission'
const {
    tableData,
    pageNumber,
    total,
    pageSize,
    getDataList,
    handleSizeChange,
    handleCurrentChange,
    changeStatus,
} = useInitTable({ getList: getUserList })


getDataList()


const roles = ref([]); //角色下拉選單
const drawerAdd = ref(false); //控制開關抽屜
const drawerEdit = ref(false); //控制開關抽屜
const formRef = ref(null); //獲取編輯表單 component
const editId = ref(0) //當前編輯的使用者

//編輯使用者的 form
const form = reactive({
    username: "",
    department: "",
    role: 0,
});

//新增使用者的 form
const formAdd = reactive({
    username: "",
    department: "",
    role: ""
});


// 定義表單驗證規則
const rules = ref({
    username: [
        { required: true, message: '必填', trigger: 'blur' }
    ],
    department: [
        { required: true, message: '必填', trigger: 'blur' }
    ],
    role: [
        { required: true, message: '必填', trigger: 'blur' }
    ]
});


//取得角色下拉選單
const fetchRoles = async () => {
    try {
        const res = await fetchAllRoles();
        roles.value = res.data.data.rows;
        console.log("角色下拉選單: ", roles.value)
    } catch (error) {
        console.error('取得角色失敗:', error);
    }
};
fetchRoles()


const getRoleText = (roleId) => {

        const array = roles.value
        const roleMap = new Map();

        array.forEach(element => {
            roleMap.set(element.roleId, element.roleName);
        });

        const roleText = roleMap.get(roleId);
        return roleText;
};



const handleCreate = () => {
    drawerAdd.value = true;
    for (const key in form) {
        form[key] = form[key]
    }
};

//點擊編輯
const handleEdit = async (row) => {
    console.log("編輯的使用者 id：", row.userId)
    for (const key in row) {
        form[key] = row[key]

    }
    console.log("編輯後的使用者 : ", form)
    editId.value = row.userId;
    drawerEdit.value = true;
};

/**
 * 點擊確定(送出)
 * 新增和編輯後 都需要點擊確定
 */
const handleSubmit = async (actionType) => {

    try {
        let resultMessage = '';
        //進行表單驗證
        formRef.value.validate(async (valid) => {
            if (valid) {
                // 表單驗證通過
                switch (actionType) {
                    case 'edit':
                        await editUser(editId.value, form);
                        resultMessage = '更新成功';
                        drawerEdit.value = false;
                        //如果當前編輯的使用者是登入的使用者 再更改 userPermissionsStore
                        if(editId.value == userPermissionsStore().userId){
                            userPermissionsStore().setUserRole(form.role)
                        // 拿到新角色的權限
                        const res = await getPermissionsByRole(userPermissionsStore().userRole)
                        const array = res.data.data
                        const permissionsId = [];
                        const permissionsName = [];
                        array.map((item) => {
                            permissionsId.push(item.permissionId)
                            permissionsName.push(item.permissionName)
                        })
                       
                        userPermissionsStore().setUserPermissionsId(permissionsId)
                        userPermissionsStore().setUserPermissionsName(permissionsName)
                       
                        }
                    
                        break;
                    case 'add':
                        await addUser(formAdd);
                        resultMessage = '新增成功.';
                        drawerAdd.value = false;
                        break;
                }

                //重新整理表格
                await getDataList();

                ElMessage({
                    message: '表單更新成功',
                    type: 'success',
                });

            } else {
                // 表單驗證失敗
                ElMessage({
                    message: '表單驗證失敗',
                    type: 'error',
                });
            }
        });
    } catch (error) {
        console.error(`${actionType} failed`, error);
        ElMessage({
            message: `${actionType} failed`,
            type: 'error',
        });
    }
};

//刪除使用者
const handleDelete = async (row) => {
    try {
        console.log("刪除的使用者 id : ", row.userId)
        await deleteUser(row.userId);
        await getDataList();
        ElMessage({
            message: '成功刪除',
            type: 'success',
        });

    } catch (error) {
        console.error('Delete failed', error);
        ElMessage({
            message: '刪除失敗',
            type: 'error',
        });
    }
};

//關閉抽屜
const cancelClick = () => {
    drawerAdd.value = false;
    drawerEdit.value = false;
};


</script>

<style scoped></style>
