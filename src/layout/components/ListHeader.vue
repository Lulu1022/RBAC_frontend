<template>
<div class="listHeader">
    <el-button type="primary" @click="$emit('create')" v-if="hasPermission(permissionToCheck)">
        新增
    </el-button>
    <el-tooltip class="box-item" effect="dark" content="Top Center prompts info" placement="top">
        <el-button text @click="$emit('refresh')"> <el-icon :size="20">
                <Refresh />
            </el-icon></el-button>
    </el-tooltip>
</div>

</template>

<script  setup>
import { userPermissionsStore } from '../../stores/userPermissions'


const props = defineProps({
  permissionToCheck: String
});

const hasPermission = (permission) => {
  return userPermissionsStore().userPermissionsName.includes(permission);
}


defineEmits(['create','refresh'])


</script>

<style>
.listHeader{
    display: flex;
    justify-content:space-between;
}
</style>