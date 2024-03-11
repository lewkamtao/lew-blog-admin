import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import Lew from 'lew-ui';
import 'lew-ui/style';
import './styles/reset.scss';
import './styles/index.scss';
import './styles/seti/index.less';
import { VMdEditor } from '../src/utils/v-markdown';
// 创建vue实例

// 获取 url 参数
const setToken = () => {
    // 原始链接
    const url = window.location.href;
    // 找到token参数的索引位置
    const url_arr = url.split('?token=');

    // 如果找到了token参数
    if (url_arr.length === 2) {
        const newUrl = url_arr[0];
        const token = url_arr[1].replace(/%20/g, ' ').replace(/#\//g, ' ');
        localStorage.setItem('token', token);
        window.location.replace(newUrl);
    }
};

// 设置token
setToken();

const app = createApp(App);

app.use(Lew);
app.use(store);
app.use(router);
app.use(VMdEditor);

// 挂载实例
app.mount('#app');
