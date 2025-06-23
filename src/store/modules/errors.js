const state = {
  // 错误列表
  errors: [],
  // 当前显示的错误
  currentError: null,
  // 错误显示状态
  showErrorToast: false,
  // 错误统计
  errorStats: {
    network: 0,
    component: 0,
    javascript: 0,
    total: 0
  }
};

const mutations = {
  ADD_ERROR(state, error) {
    // 检查是否存在相似的错误（在最近5秒内）
    const now = Date.now();
    const recentErrors = state.errors.filter(e => 
      now - new Date(e.timestamp).getTime() < 5000 // 5秒内
    );
    
    // 查找相似错误
    const similarError = recentErrors.find(e => {
      // 如果是网络错误和组件错误的组合
      if ((error.type === 'network' && e.type === 'component') ||
          (error.type === 'component' && e.type === 'network')) {
        // 检查错误消息是否相关
        const networkKeywords = ['网络', '请求', '服务器', '连接', 'network', 'request', 'failed', '500', '502', '503', '504'];
        const hasNetworkKeyword = networkKeywords.some(keyword => 
          error.message.toLowerCase().includes(keyword) || 
          e.message.toLowerCase().includes(keyword)
        );
        return hasNetworkKeyword;
      }
      
      // 检查完全相同的错误
      return e.type === error.type && 
             e.message === error.message && 
             e.source === error.source;
    });
    
    if (similarError) {
      // 确定哪个错误有更详细的堆栈信息
      const componentError = error.type === 'component' ? error : similarError;
      const networkError = error.type === 'network' ? error : similarError;
      
      // 合并错误信息，优先保留组件错误的堆栈
      const mergedError = {
        ...similarError,
        type: 'network', // 统一为网络错误
        level: error.level === 'critical' || similarError.level === 'critical' ? 'critical' : 'error',
        message: networkError.message, // 使用网络错误的消息，更准确
        // 优先使用组件错误的堆栈，如果没有则使用网络错误的堆栈
        stack: componentError.stack || networkError.stack || '',
        source: 'network-component-merged',
        context: {
          ...networkError.context, // 保留网络错误的上下文（包含请求信息）
          ...componentError.context, // 保留组件错误的上下文
          mergedFrom: [similarError.type, error.type],
          originalMessages: [similarError.message, error.message],
          // 保留原始堆栈信息用于调试
          originalStacks: {
            network: networkError.stack,
            component: componentError.stack
          }
        },
        timestamp: similarError.timestamp // 保持原始时间戳
      };
      
      // 更新现有错误
      const index = state.errors.findIndex(e => e.id === similarError.id);
      if (index > -1) {
        state.errors.splice(index, 1, mergedError);
      }
      
      // 更新当前错误显示
      if (state.currentError && state.currentError.id === similarError.id) {
        state.currentError = mergedError;
      }
      
      return; // 不添加新错误
    }
    
    // 如果没有相似错误，正常添加
    const errorWithId = {
      ...error,
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString()
    };
    
    state.errors.unshift(errorWithId);
    
    // 限制错误列表长度
    if (state.errors.length > 100) {
      state.errors = state.errors.slice(0, 100);
    }
    
    // 更新统计
    state.errorStats[error.type]++;
    state.errorStats.total++;
    
    // 设置当前错误用于显示
    if (error.level === 'error' || error.level === 'critical') {
      state.currentError = errorWithId;
      state.showErrorToast = true;
    }
  },
  
  CLEAR_CURRENT_ERROR(state) {
    state.currentError = null;
    state.showErrorToast = false;
  },
  
  CLEAR_ALL_ERRORS(state) {
    state.errors = [];
    state.currentError = null;
    state.showErrorToast = false;
    state.errorStats = {
      network: 0,
      component: 0,
      javascript: 0,
      total: 0
    };
  },
  
  REMOVE_ERROR(state, errorId) {
    const index = state.errors.findIndex(error => error.id === errorId);
    if (index > -1) {
      const removedError = state.errors[index];
      state.errors.splice(index, 1);
      
      // 更新统计
      state.errorStats[removedError.type]--;
      state.errorStats.total--;
      
      // 如果移除的是当前错误，清除显示
      if (state.currentError && state.currentError.id === errorId) {
        state.currentError = null;
        state.showErrorToast = false;
      }
    }
  }
};

const actions = {
  captureError({ commit }, errorInfo) {
    // 标准化错误对象
    const standardError = {
      type: errorInfo.type || 'javascript',
      level: errorInfo.level || 'error',
      message: errorInfo.message || '未知错误',
      stack: errorInfo.stack || '',
      source: errorInfo.source || 'unknown',
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: errorInfo.userId || null,
      context: errorInfo.context || {}
    };
    
    commit('ADD_ERROR', standardError);
    
    // 控制台输出（开发环境）
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Global Error Captured');
      console.error('Error:', standardError.message);
      console.error('Type:', standardError.type);
      console.error('Level:', standardError.level);
      console.error('Source:', standardError.source);
      if (standardError.stack) {
        console.error('Stack:', standardError.stack);
      }
      console.error('Context:', standardError.context);
      console.groupEnd();
    }
  },
  
  dismissError({ commit }) {
    commit('CLEAR_CURRENT_ERROR');
  },
  
  clearAllErrors({ commit }) {
    commit('CLEAR_ALL_ERRORS');
  },
  
  removeError({ commit }, errorId) {
    commit('REMOVE_ERROR', errorId);
  }
};

const getters = {
  allErrors: state => state.errors,
  currentError: state => state.currentError,
  showErrorToast: state => state.showErrorToast,
  errorStats: state => state.errorStats,
  recentErrors: state => state.errors.slice(0, 10),
  errorsByType: state => type => state.errors.filter(error => error.type === type),
  errorsByLevel: state => level => state.errors.filter(error => error.level === level)
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};