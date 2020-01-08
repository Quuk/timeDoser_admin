import axios from 'axios'
import store from '@/store'
import {getToken} from '@/libs/util'

/**
 * 添加错误日志
 *
 * @param errorInfo
 */
const addErrorLog = errorInfo => {
    const {statusText, status, request: {responseURL}} = errorInfo;
    let info = {
        type: 'ajax',
        code: status,
        mes: statusText,
        url: responseURL
    };
    if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
};

class HttpRequest {
    constructor(baseUrl = baseURL) {
        this.baseUrl = baseUrl;
        this.queue = {};
    }

    getInsideConfig() {
        return {
            baseURL: this.baseUrl,
            headers: {
                "X_Auth_Token": getToken()
            }
        }
    }

    destroy(url) {
        delete this.queue[url];
    }

    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
            this.queue[url] = true;
            return config
        }, error => {
            return Promise.reject(error)
        });

        // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url);
            const {data, status} = res;
            return {data, status};
        }, error => {
            this.destroy(url);
            let errorInfo = error.response;
            if (!errorInfo) {
                const {request: {statusText, status}, config} = JSON.parse(JSON.stringify(error));
                errorInfo = {
                    statusText,
                    status,
                    request: {responseURL: config.url}
                }
            }
            addErrorLog(errorInfo);
            return Promise.reject(error)
        })
    }

    request(options) {
        const instance = axios.create();
        options = Object.assign(this.getInsideConfig(), options);
        this.interceptors(instance, options.url);
        return instance(options)
    }
}

// 如果未登录,则强制跳转到登录页面
if (window.location.pathname !== "/login" && !getToken()) {
    window.location.replace("/login")
}
export default HttpRequest
