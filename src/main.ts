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

// 获取 url 参数
const setToken = () => {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
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
    var url = window.location.protocol + '//' + window.location.host;
    window.location.replace(url);
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
