import './assets/main.css';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'
import App from './App.vue';
import router from './router';
import 'windi.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './assets/css/tailwind.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import vue3GoogleLogin from 'vue3-google-login'


const app = createApp(App);
const pinia = createPinia();
pinia.use(piniaPluginPersistedstate)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}



app.use(pinia);
app.use(router);
app.use(ElementPlus);
app.use(vue3GoogleLogin,{
  clientId: '592736168384-hv30tfgngmnugbrla2ob365to3njlp74.apps.googleusercontent.com'
});
app.mount('#app');
