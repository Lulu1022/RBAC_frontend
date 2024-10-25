<template>
  <el-card>
    <ListHeader @create="handleCreate" @refresh="getDataList"  permissionToCheck="新增角色"/>
    <div>
      <el-table :data="tableData" :default-sort="{ prop: 'roleId', order: 'descending' }">
        <el-table-column prop="id" label="表單編號" sortable />
        <el-table-column prop="activityName" label="活動名稱" />
        <el-table-column
      prop="reviewStatus"
      label="審核狀態"
    >
      <template #default="scope">
        <el-tag
        effect="dark"
        round
          :type="{
    'pending': 'danger',
    'approved': 'success',
    'rejected': 'info'
  }[scope.row.reviewStatus]"
          disable-transitions
          >{{ 
  scope.row.reviewStatus === 'pending' ? '待審核' : 
  scope.row.reviewStatus === 'approved' ? '通過' : 
  scope.row.reviewStatus === 'rejected' ? '拒絕' : 
  scope.row.reviewStatus 
}}</el-tag
        >
      </template>
    </el-table-column>

      </el-table>
      <el-pagination small background layout="total, sizes, prev, pager, next" class="mt-4" :total="total"
        :page-sizes="[10, 20, 30, 40, 50, 100]" v-model:current-page="pageNumber" v-model:page-size="pageSize"
        @size-change="handleSizeChange(pageSize)" @current-change="handleCurrentChange(pageNumber)" />



    </div>
  </el-card>
  <form-submission-view></form-submission-view>
</template>

<script lang="ts" setup>
import { useInitTable } from '../composables/useCommon'
import {notification} from '../stores/notification'
import { getForms,changeReviewStatus } from '../api/form';
import emitter from '../utils/emitter';
import {ref, reactive, defineProps } from 'vue';
import ListHeader from '../layout/components/ListHeader.vue'

const {
  tableData,
  pageNumber,
  total,
  pageSize,
  getDataList,
  handleSizeChange,
  handleCurrentChange
} = useInitTable({ getList: getForms })
getDataList()

const drawerAdd = ref(false); //控制開關抽屜
const drawerEdit = ref(false); //控制開關抽屜


//編輯角色的 form
const form = reactive({
    roleId:0,
    roleName: 0,
    description: "",
});

//新增角色的 form
const formAdd = reactive({
  roleId:0,
  roleName: 0,
  description: ""
})


const handleCreate = () => {
    drawerAdd.value = true;
    for (const key in form) {
        form[key] = form[key]
    }
};


const approve = async(param) => {
  console.log(param)
  await changeReviewStatus(param.id,'approved')
  await getDataList()
  notification().notificationNumber--

}


const reject = async(param) => {
  console.log(param)
  console.log(param)
  await changeReviewStatus(param.id,'rejected')
  await getDataList()
  notification().notificationNumber--

}

const filterTag = (value, row) => {
  return row.reviewStatus === value
}

</script>

<style scoped></style>
