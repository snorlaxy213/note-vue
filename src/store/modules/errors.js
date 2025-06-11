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