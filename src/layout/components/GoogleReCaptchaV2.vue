<script setup>
import { reactive } from 'vue';
import vueRecaptcha from 'vue3-recaptcha2';
const instance_vueRecaptchaV2 = reactive({
  data_v2SiteKey: '6LdOBSIqAAAAAPrerkPETXat8huZ2AoXJ3nF87uR',
  recaptchaVerified: (response_token) => {
    console.log(response_token);
  },
  recaptchaExpired: () => {
    // 驗證過期後進行的動作
    console.log('驗證過期啦QAQ');
  },
  recaptchaFailed: () => {
    // 驗證失敗進行的動作
  },
});
</script>

<template>
  <vue-recaptcha
      :sitekey="instance_vueRecaptchaV2.data_v2SiteKey"
      size="normal"
      theme="light"
      hl="zh-TW"
      @verify="instance_vueRecaptchaV2.recaptchaVerified"
      @expire="instance_vueRecaptchaV2.recaptchaExpired"
      @fail="instance_vueRecaptchaV2.recaptchaFailed"
  />
</template>

<style scoped>

</style>