<template>

  <el-card>
    <div class="flex gap-2 pendingTag">
      <el-tag type="danger" v-if="showReviewText">待審核</el-tag>
    </div>
    <el-form :model="form" label-width="auto" style="max-width: 600px" :disabled="formDisabled">

      <el-form-item label="活動名稱">
        <el-input v-model="form.activityName" />
      </el-form-item>

      <el-form-item label="活動區域">
        <el-input v-model="form.activityRegion" />
      </el-form-item>

      <el-form-item label="活動時間">
        <el-col :span="11">
          <el-date-picker v-model="form.activityDate" type="date" placeholder="選擇日期" style="width: 100%" />
        </el-col>
      </el-form-item>

      <el-form-item label="活動類型">
        <el-radio-group v-model="form.activityType">
          <el-radio value="online" name="type">
            線上活動
          </el-radio>
          <el-radio label="promotion" name="type">
            促銷活動
          </el-radio>
          <el-radio label="offline" name="type">
            線下活動
          </el-radio>
          <el-radio label="brand" name="type">
            簡單品牌曝光
          </el-radio>
        </el-radio-group>
      </el-form-item>


      <el-form-item label="活動形式">
        <el-input v-model="form.activityDescription" type="textarea" />
      </el-form-item>
      <el-form-item label="活動檔案" size="normal">
        <el-upload 
    :limit="1"
    :on-exceed="handleExceed"
  
        ref="uploadRef" 
        class="upload-demo"
        v-model:file-list="fileList"
          action="#" 
          :auto-upload="false">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">
            Drop file here or <em>click to upload</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              jpg/png files with a size less than 500kb
            </div>
          </template>
        </el-upload>
      </el-form-item>


      <el-form-item>
        <el-button type="primary" @click="next">送出</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>

  </el-card>

</template>


<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { addForm, getFormsByUserIdAndReviewStatus } from '../api/form';
import {getFileInfo} from '../api/file'
import { notification } from '../stores/notification';
import { upload } from '../api/file';
import { genFileId } from 'element-plus'
import type { UploadProps, UploadRawFile } from 'element-plus'
import { userPermissionsStore } from '../stores/userPermissions';

const uploadRef = ref()
const formDisabled = ref(false)
const showReviewText = ref(false)
const fileList = ref([])

const form = reactive({
  id: 0,
  activityName: "",
  activityRegion: "",
  activityDate: "",
  activityType: "string",
  activityDescription: "",
  reviewStatus: "",
  createdAt: "",
  updatedAt: "",
  userId: 0
})

const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  uploadRef.value!.handleStart(file)
}

const next = async () => {
  formDisabled.value = true
  showReviewText.value = true

  const userid = userPermissionsStore().userId;
  const formId = (await addForm(form, userid)).data.data;



  let formData = new FormData();
  formData.append('file', fileList.value[0].raw)
  await upload(formData, formId)
  notification().notificationNumber++
}

const getFile = async() => {
  const respone = await getFileInfo(28)
}

const getForm = async () => {
  try {
    const res = await getFormsByUserIdAndReviewStatus(userPermissionsStore().userId, "pending");
    const data = res.data.data;
    form.id = data[0].id
    form.activityName = data[0].activityName
    form.activityRegion = data[0].activityRegion
    form.activityDate = data[0].activityDate
    form.activityType = data[0].activityType
    form.activityDescription = data[0].activityDescription
    form.reviewStatus = data[0].reviewStatus
    console.log(form.reviewStatus)

    const respone = await getFileInfo(form.id)
    const filename = respone.data.data.fileName
    fileList.value.push({name: filename})



    if (form.reviewStatus == "pending") {
      formDisabled.value = true
      showReviewText.value = true
    }
  } catch (error) {
    console.error('取得表單失敗:', error);
  }
};

getForm()

</script>

<style>
.pendingTag{
  margin-bottom: 30px
}
</style>
