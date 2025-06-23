import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import ErrorToast from './components/ErrorToast.vue';

Vue.config.productionTip = false;

// 注册ElementUI
Vue.use(ElementUI);

// 注册mavonEditor
Vue.use(mavonEditor);

// 全局注册ErrorToast组件
Vue.component('ErrorToast', ErrorToast);

// Vue全局错误处理器
Vue.config.errorHandler = (err, vm, info) => {
  // 捕获Vue组件错误
  store.dispatch('errors/captureError', {
    type: 'component',
    level: 'error',
    message: err.message || '组件运行时错误',
    source: 'vue-error-handler',
    stack: err.stack,
    context: {
      componentName: vm?.$options.name || 'Unknown',
      errorInfo: info,
      props: vm?.$props,
      route: vm?.$route?.path
    }
  });
};

// 全局未捕获的JavaScript错误
window.addEventListener('error', (event) => {
  store.dispatch('errors/captureError', {
    type: 'javascript',
    level: 'error',
    message: event.message || '未知JavaScript错误',
    source: 'window-error-handler',
    stack: event.error?.stack,
    context: {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      userAgent: navigator.userAgent
    }
  });
});

// 全局未处理的Promise拒绝
window.addEventListener('unhandledrejection', (event) => {
  store.dispatch('errors/captureError', {
    type: 'javascript',
    level: 'warning',
    message: event.reason?.message || '未处理的Promise拒绝',
    source: 'unhandled-promise-rejection',
    stack: event.reason?.stack,
    context: {
      reason: event.reason,
      userAgent: navigator.userAgent
    }
  });
  
  // 阻止默认的控制台错误输出
  event.preventDefault();
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
