<template>
  <el-row class="tac">
    <el-col :span="24">
      <el-menu router="true" :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen"
        @close="handleClose">
        <el-sub-menu v-for="(item, index) in menu" :key="index" :index="index">
          <template #title>
            <el-icon>
              <component :is="item.icon" />
            </el-icon>
            <span>{{ item.name }}</span>
          </template>

          <template v-if="item.children && item.children.length > 0">
            <el-menu-item v-for="(sub, subIndex) in item.children" :key="subIndex" :index="sub.path">
              {{ sub.name }}
            </el-menu-item>
          </template>

        </el-sub-menu>
      </el-menu>
    </el-col>
  </el-row>

</template>

<script setup>
import { getMenu } from '../../api/menu';
import { ref, watch} from 'vue';
import { userPermissionsStore } from '../../stores/userPermissions'


// 監聽 permissinStore.userPermissions 的變動
watch(() => userPermissionsStore().userPermissionsId, async (newValue, oldValue) => {
  // 在這裡可以添加額外的邏輯，比如檢查變動的內容，然後再呼叫 fetchMenu()
  console.log('permissinStore.userPermissionsId changed:', newValue);
  await fetchMenu(); // 確保 fetchMenu 是異步函數
});

const menu = ref([])

const fetchMenu = async () => {
  try {
    const res = await getMenu();
    menu.value = res.data;

    menu.value = menu.value.map(section => ({
      ...section,
      children: section.children
          .filter(child => userPermissionsStore().userPermissionsId.includes(child.id))
    }));

    menu.value = menu.value.filter(section => section.children.length > 0);

  } catch (error) {
    console.error('Error fetching menu:', error);
  }
};
fetchMenu()

</script>
<style scoped>
.tac{
  height: 100%;
}
.el-menu-vertical-demo {
  height: 100%;
}

</style>
