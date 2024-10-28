<template>

  <el-card>
    <ListHeader @create="openPopup" @refresh="getDataList" permissionToCheck="新增角色" />
    <div>
      <el-table :data="tableData" :default-sort="{ prop: 'roleId', order: 'descending' }">
        <el-table-column prop="roleId" label="編號" sortable />
        <el-table-column prop="roleName" label="角色" />
        <el-table-column prop="description" label="說明" />
        <el-table-column prop="roleId" label="操作">
          <template #default="scope">
            <el-button size="small" @click="handleSet(scope.row.roleId)">
              設定
            </el-button>
            <el-button size="small" @click="editRole(scope.row.roleId)">
              編輯
            </el-button>
            <el-popconfirm title="是否確定刪除?" @confirm="removeRole(scope.row.roleId)">
              <template #reference>
                <el-button size="small" type="danger">
                  刪除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>

      </el-table>
      <el-pagination small background layout="total, sizes, prev, pager, next" class="mt-4" :total="total"
        :page-sizes="[10, 20, 30, 40, 50, 100]" v-model:current-page="pageNumber" v-model:page-size="pageSize"
        @size-change="handleSizeChange(pageSize)" @current-change="handleCurrentChange(pageNumber)" />

      <!-- 抽屜設定權限 -->
      <el-drawer v-model="drawerEdit" title="設定權限" :plain="true">
        <template #header>
          <h4>設定權限</h4>
        </template>
        <el-tree ref="treeRef" style="max-width: 600px" :data="transformedData" show-checkbox default-expand-all
          node-key="id" :default-checked-keys="userPermission" highlight-current>
          <template #default="{ node, data }">
            <el-tag class="tag" :type="data.tag === '權限' ? 'warning' : 'primary'">{{ data.tag }}</el-tag>
            <span>{{ data.label }}</span>
          </template>
        </el-tree>
        <template #footer>
          <div style="flex: auto">
            <el-button @click="cancelClick">取消</el-button>
            <el-button type="primary" @click="submitPermission(editId)">確定</el-button>
          </div>

        </template>
      </el-drawer>

      <!-- 新增/編輯角色 -->
      <el-dialog v-model="dialogFormVisible" :title="isCreate == true ? '新增使用者' : '編輯使用者'" width="500">
        <el-form :model="formRole" ref="formRoleRef" :rules="rules">
          <el-form-item prop="roleName" label="角色" :label-width="formLabelWidth" required>
            <el-input v-model="formRole.roleName" autocomplete="off" />
          </el-form-item>
          <el-form-item prop="description" label="描述" :label-width="formLabelWidth" required>
            <el-input v-model="formRole.description" autocomplete="off" />
          </el-form-item>
        </el-form>
        <template #footer>
          <div class="dialog-footer">
            <el-button>取消</el-button>
            <el-button type="primary" @click="submitRole">
              確定
            </el-button>
          </div>
        </template>
      </el-dialog>

    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue'
import { useInitForm, useInitTable } from '../composables/useCommon'
import { fetchAllRoles, addRole, deleteRole, getRole, updateRole } from '../api/role';
import { getPermissionByUserid } from '../api/user';
import { getTreeleftnodes, getAllPermissions, assignPermission, getMenuPermissions, getPermissionsByRole, deletePermissionsByRole } from '../api/permission'
import { ElTree, ElMessage } from 'element-plus'
import { userPermissionsStore } from '../stores/userPermissions'
import ListHeader from '../layout/components/ListHeader.vue'


const {
  tableData,
  pageNumber,
  total,
  pageSize,
  getDataList,
  handleSizeChange,
  handleCurrentChange,
} = useInitTable({ getList: fetchAllRoles })
getDataList()

const {
  drawerEdit,
  editId,
  cancelClick
} = useInitForm({
  getDataList, getCertainData: getAllPermissions, form: {
  }
})

const formRoleRef = ref()
const isCreate = ref(true)
const formLabelWidth = '140px'
const dialogFormVisible = ref(false)
const userPermission = ref([])
const transformedData = ref([]);
const treeRef = ref(null)
const checkedPermissionId = ref([])
const checkedPermissionName = ref([])
const permissinStore = userPermissionsStore()
const formRole = reactive({
  roleName: '',
  description: ''
})

const rules = reactive({
  roleName: [{ required: true, message: '必填', trigger: 'change' }],
  description: [{ required: true, message: '必填', trigger: 'change' }]
})



// 點擊新增打開 dialog
const openPopup = () => {
  isCreate.value = true;
  formRole.roleName = ' '
  formRole.description = ' '
  dialogFormVisible.value = true;
}

// 新增/編輯角色
const submitRole = async () => {
  dialogFormVisible.value = true;
  formRole.roleName = formRole.roleName.trim(); // 修剪輸入值
  formRole.description = formRole.description.trim(); // 修剪輸入值

  await formRoleRef.value.validate(async (valid, fields) => {
    if (valid) {
      if (isCreate.value == true) {
        try {
          await addRole(formRole)
          ElMessage({
            message: '新增角色成功',
            type: 'success',
          });

          dialogFormVisible.value = false;
          await getDataList()
        } catch (error) {
          ElMessage({
            message: '新增角色失敗',
            type: 'error',
          });
        }
      }
      else {
        try {
          updateRole(editId.value, formRole)
          getDataList()

          ElMessage({
            message: '編輯角色成功',
            type: 'success',
          });

          dialogFormVisible.value = false;
          await getDataList()

        } catch (error) {
          ElMessage({
            message: '編輯角色失敗',
            type: 'error',
          });
        }
      }
    }
    else {
      console.log("驗證失敗")
    }
  })
}

// 刪除角色
const removeRole = async (id) => {

    const res = await deleteRole(id)
    const code = res.data.code
    if(code == 1){
      getDataList()
    dialogFormVisible.value = false;
    ElMessage({
      message: '刪除角色成功',
      type: 'success',
    });
    }else{
      ElMessage({
      message: '該角色被使用中',
      type: 'error',
    });
    }


}

// 點擊編輯角色 取得角色資訊
const editRole = async (id) => {
  isCreate.value = false
  editId.value = id;
  const res = await getRole(id)
  formRole.roleName = res.data.data.roleName
  formRole.description = res.data.data.description
  dialogFormVisible.value = true;
}

//抽屜中 tree menu 資料
const fetchOriginalData = async () => {
  try {
    const res = await getMenuPermissions();
    transformedData.value = res.data.data;
  } catch (error) {
    console.error('Error fetching original data:', error);
  }
};
fetchOriginalData()

//預設勾選權限
const handleSet = async (id) => {
  userPermission.value = [];
  editId.value = id;
  try {
    const res = await getTreeleftnodes(id);
    const checkedNodes = res.data.data

    var checkedId = []
    checkedNodes.map(item => checkedId.push(item.permissionId))

    drawerEdit.value = true;
    await nextTick()
    treeRef.value!.setCheckedKeys(checkedId)


  } catch (error) {
    console.error('設置角色權限失敗:', error);
  }
};

//更改權限
const submitPermission = async (id) => {
  const fullCheckedId = treeRef.value.getCheckedKeys()
  const halfCheckedId = treeRef.value.getHalfCheckedKeys()
  checkedPermissionId.value = [...fullCheckedId, ...halfCheckedId]

  const fullCheckedName = treeRef.value.getCheckedNodes()
  const halfCheckedName = treeRef.value.getHalfCheckedNodes()
  checkedPermissionName.value = [...fullCheckedName, ...halfCheckedName].map(item => item.label)

  // 刪除 api
  await deletePermissionsByRole(editId.value)
  // 賦予角色權限 api
  await assignPermission(editId.value, checkedPermissionId.value)

  // 取新權限 api
  const userID = permissinStore.userId;
  const res = await getPermissionByUserid(userID);
  const permissionNames = res.data.data
      .map(item => item.permissionName) // 提取 permissionName
      .filter(name => name !== null && name !== undefined); // 過濾掉 null 或 undefined 值
  const permissionIds = res.data.data
      .map(item => item.permissionId) // 提取 permissionId
      .filter(name => name !== null && name !== undefined); // 過濾掉 null 或 undefined 值

   permissinStore.setUserPermissionsId(permissionIds)
   permissinStore.setUserPermissionsName(permissionNames)


  ElMessage({
    message: '設定成功',
    type: 'success',
  });

  drawerEdit.value = false;
}

</script>

<style scoped>

.tag {
  margin-right: 6px;
}
</style>
