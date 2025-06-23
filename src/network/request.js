import axios from 'axios';
import store from '../store';

// 创建axios实例
const service = axios.create({
  baseURL: '/api',
  timeout: 60 * 60 * 1000 // 60分钟
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可以在这里添加token等认证信息
    return config;
  },
  error => {
    // 请求错误处理
    store.dispatch('errors/captureError', {
      type: 'network',
      level: 'error',
      message: '请求发送失败',
      source: 'request-interceptor',
      context: {
        config: error.config,
        code: error.code
      }
    });
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    let errorMessage = '网络请求失败';
    let errorLevel = 'error';
    let errorContext = {
      url: error.config?.url,
      method: error.config?.method,
      params: error.config?.params,
      data: error.config?.data,
      headers: error.config?.headers,
      status: error.response?.status,
      statusText: error.response?.statusText,
      timestamp: Date.now()
    };

    // 根据错误类型设置不同的错误信息
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMessage = '请求参数错误';
          break;
        case 401:
          errorMessage = '未授权，请重新登录';
          errorLevel = 'warning';
          break;
        case 403:
          errorMessage = '拒绝访问';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 408:
          errorMessage = '请求超时';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          errorLevel = 'critical';
          break;
        case 502:
          errorMessage = '网关错误';
          errorLevel = 'critical';
          break;
        case 503:
          errorMessage = '服务不可用';
          errorLevel = 'critical';
          break;
        case 504:
          errorMessage = '网关超时';
          break;
        default:
          errorMessage = `服务器错误 (${status})`;
      }
      
      // 尝试从响应中获取更详细的错误信息
      if (error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.request) {
      errorMessage = '网络连接失败，请检查网络设置';
      errorLevel = 'warning';
    } else {
      errorMessage = '请求配置错误';
    }

    // 生成更详细的堆栈信息
    let stackTrace = error.stack;
    if (!stackTrace && error.response) {
      // 为网络错误生成伪堆栈信息
      stackTrace = `NetworkError: ${errorMessage}\n` +
                  `    at ${error.config?.method?.toUpperCase()} ${error.config?.url}\n` +
                  `    Status: ${error.response?.status} ${error.response?.statusText}\n` +
                  `    Response: ${JSON.stringify(error.response?.data, null, 2)}`;
    }

    // 捕获网络错误到全局错误管理
    store.dispatch('errors/captureError', {
      type: 'network',
      level: errorLevel,
      message: errorMessage,
      source: 'response-interceptor',
      context: errorContext,
      stack: stackTrace
    });

    return Promise.reject(error);
  }
);

// 创建请求函数（保持向后兼容）
function request(config) {
  return service(config);
}

// 添加便捷方法
request.get = function(url, params) {
  return service({
    method: 'get',
    url,
    params
  });
};

request.post = function(url, data) {
  return service({
    method: 'post',
    url,
    data
  });
};

request.put = function(url, data) {
  return service({
    method: 'put',
    url,
    data
  });
};

request.delete = function(url, params) {
  return service({
    method: 'delete',
    url,
    params
  });
};

// 导出请求函数
export default request;
