import {createApp} from "vue";
import App from "./App.vue";
import router from "./router";
import ElementPlus from 'element-plus';
import 'element-plus/theme-chalk/index.css';
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import localeZH from 'element-plus/es/locale/lang/zh-cn'

const app = createApp(App)

app.use(router)
app.use(scroll)
app.use(ElementPlus, {localeZH})
app.mount("#app");
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}