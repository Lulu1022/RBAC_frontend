import { defineStore } from 'pinia'
import { ref, watch } from 'vue';



export const notification = defineStore('notification', () => {

  const notificationNumber = ref(0)
  watch(notificationNumber, (newValue, oldValue) => {
    if (newValue < 0) {
      notificationNumber.value = 0;
    }
  });

  const setNotificationNumber = (params) => {
    userPermissions.value = params
  }


  return {
    notificationNumber,
    setNotificationNumber
  }
},{
  persist: true
})
