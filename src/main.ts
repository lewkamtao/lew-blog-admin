import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import Lew from 'lew-ui';
import './styles/reset.scss';
import 'lew-ui/dist/style.css';
import './styles/index.scss';
import { VMdEditor } from '../src/utils/v-markdown';

// 创建vue实例
const app = createApp(App);

app.use(Lew);
app.use(store);
app.use(router);
app.use(VMdEditor);

// 挂载实例
app.mount('#app');
