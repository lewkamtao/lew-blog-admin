import axios from 'axios';
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// 获取 url 参数
const getToken = () => {
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
// 去除URL指定参数
function delToken() {
    var url = window.location.href; //页面url
    var urlParam = window.location.search.substr(1); //页面参数
    var beforeUrl = url.substr(0, url.indexOf('?')); //页面主地址（参数之前地址）
    var nextUrl = '';

    var arr = new Array();
    if (urlParam != '') {
        var urlParamArr = urlParam.split('&'); //将参数按照&符分成数组
        for (var i = 0; i < urlParamArr.length; i++) {
            var paramArr = urlParamArr[i].split('='); //将参数键，值拆开
            //如果键雨要删除的不一致，则加入到参数中
            if (paramArr[0] != 'token') {
                arr.push(urlParamArr[i]);
            }
        }
    }
    if (arr.length > 0) {
        nextUrl = '?' + arr.join('&');
    }
    url = beforeUrl + nextUrl;
    history.pushState('', '', url); // 不刷新页面
}

//将axios封装到类中
class xwlRequest {
    instance: AxiosInstance; //axios的实例将被保存到这里
    constructor(config: AxiosRequestConfig) {
        //构造器里的config包括baseURL，timeout等
        this.instance = axios.create(config); //创建axios实例
        this.instance.interceptors.request.use(
            //实例中的请求拦截器
            (config: AxiosRequestConfig) => {
                //请求成功的拦截
                const token = getToken() || localStorage.getItem('token');

                if (token) {
                    config.headers = {
                        Authorization: `${token}`
                    };
                }
                return config;
            },
            (error) => {
                //请求失败的拦截
                return Promise.reject(error);
            }
        );
        this.instance.interceptors.response.use(
            //实例中的响应拦截器
            (response: AxiosResponse) => {
                //响应成功的拦截
                const res: any = response.data;
                if (res.code != 200) {
                    if (res.code == 401) {
                        var redirectUrl = window.location.href;
                        window.location.replace(
                            `https://sso.kamtao.com?redirectUrl=${redirectUrl}`
                        );
                    } else {
                        LewMessage.error(response?.data?.message);
                    }
                }
                return response.data;
            },
            (error) => {
                //响应失败的拦截
                return Promise.reject(error);
            }
        );
    }
    request<T>(config: AxiosRequestConfig): Promise<T> {
        //再次封装request方法
        return new Promise((resolve, reject) => {
            this.instance
                .request<any>(config)
                .then((res) => {
                    resolve(res); //将结果返回出去
                })
                .catch((err) => {
                    reject(err);
                    return err;
                });
        });
    }
    get<T>(config: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'GET' });
    }
    post<T>(config: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'POST' });
    }
    put<T>(config: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'PUT' });
    }
    delete<T>(config: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'DELETE' });
    }
    patch<T>(config: AxiosRequestConfig): Promise<T> {
        return this.request<T>({ ...config, method: 'PATCH' });
    }
}
export default xwlRequest;
