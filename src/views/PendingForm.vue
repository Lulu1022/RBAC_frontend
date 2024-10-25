<template>
  <el-card>
    <div>
      <el-table :data="tableData" :default-sort="{ prop: 'roleId', order: 'descending' }">
        ">
        <template #empty>無待審核資料</template>
        <el-table-column prop="id" label="表單編號" sortable />
        <el-table-column prop="activityName" label="活動名稱" />
        <el-table-column prop="reviewStatus" label="審核狀態">
          <template #default="scope">
            <el-tag effect="dark" round :type="{
              'pending': 'danger',
              'approved': 'success',
              'rejected': 'info'
            }[scope.row.reviewStatus]" disable-transitions>{{
              scope.row.reviewStatus === 'pending' ? '待審核' :
                scope.row.reviewStatus === 'approved' ? '通過' :
                  scope.row.reviewStatus === 'rejected' ? '拒絕' :
                    scope.row.reviewStatus
              }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="roleId" label="操作">
          <template #default="scope">
            <el-popconfirm title="確認核准?" confirm-button-text="確認" cancel-button-text="取消" @confirm="approve(scope.row)">
              <template #reference>
                <el-button size="small" type="primary" confirm-button-text="確認" cancel-button-text="取消"
                  v-if="scope.row.reviewStatus === 'pending' ? true : false">
                  核准
                </el-button>
              </template>
            </el-popconfirm>

            <el-popconfirm title="確認拒絕?" confirm-button-text="確認" cancel-button-text="取消" @confirm="reject(scope.row)">
              <template #reference>
                <el-button size="small" confirm-button-text="確認" cancel-button-text="取消"
                  v-if="scope.row.reviewStatus === 'pending' ? true : false">
                  拒絕
                </el-button>
              </template>
            </el-popconfirm>
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
import { notification } from '../stores/notification'
import { getForms, changeReviewStatus } from '../api/form';

const {
  tableData,
  pageNumber,
  total,
  pageSize,
  getDataList,
  handleSizeChange,
  handleCurrentChange
} = useInitTable({ getList: getForms })
getDataList("pending")

const approve = async (param) => {
  console.log(param)
  await changeReviewStatus(param.id, 'approved')
  await getDataList("pending")
  notification().notificationNumber--

}


const reject = async (param) => {
  console.log(param)
  console.log(param)
  await changeReviewStatus(param.id, 'rejected')
  await getDataList("pending")
  notification().notificationNumber--

}

const filterTag = (value, row) => {
  return row.reviewStatus === value
}

</script>

<style scoped></style>