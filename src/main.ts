import { createApp } from 'vue'
import App from './App.vue'
import 'virtual:windi.css'
import router from "./router";

const app=createApp(App)

app.use(router)
app.mount('#app')
