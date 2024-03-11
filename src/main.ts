import { createApp } from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
import Lew from 'lew-ui';
import './styles/reset.scss';
import 'lew-ui/style';
import './styles/index.scss';
import './styles/seti/index.less';

// 创建vue实例

// 获取 url 参数
const setToken = () => {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split('=');
        if (pair[0] == 'token') {
            delToken();
            const token = pair[1].replace(/%20/g, ' ');
            localStorage.setItem('token', token);
            return;
        }
    }
    return false;
};

// 去除token
const delToken = () => {
    const url = window.location.protocol + '//' + window.location.host;
    window.location.replace(url);
};

// 设置token

setToken();
const app = createApp(App);

app.use(Lew);
app.use(store);
app.use(router);

// 挂载实例
app.mount('#app');
