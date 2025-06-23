<template>
  <el-dialog
    :visible.sync="showDialog"
    :title="errorTitle"
    :width="dialogWidth"
    :center="true"
    :close-on-click-modal="false"
    :show-close="true"
    @close="handleClose"
    class="error-toast-dialog"
  >
    <div class="error-content">
      <div class="error-icon">
        <i :class="errorIcon" :style="{ color: errorColor }"></i>
      </div>
      <div class="error-details">
        <p class="error-message">{{ currentError.message }}</p>
        <div class="error-meta" v-if="showDetails">
          <p><strong>类型:</strong> {{ currentError.type }}</p>
          <p><strong>来源:</strong> {{ currentError.source }}</p>
          <p><strong>时间:</strong> {{ formatTime(currentError.timestamp) }}</p>
          <div v-if="currentError.stack" class="error-stack">
            <p><strong>堆栈信息:</strong></p>
            <pre>{{ currentError.stack }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button @click="toggleDetails" type="text">
        {{ showDetails ? '隐藏详情' : '显示详情' }}
      </el-button>
      <el-button
        @click="handleReload"
        type="primary"
        v-if="currentError.level === 'critical'"
      >
        重新加载页面
      </el-button>
      <el-button
        @click="handleRetry"
        type="warning"
        :loading="retrying"
        v-if="currentError.type === 'network'"
      >
        {{ retrying ? '重试中...' : '重试请求' }}
      </el-button>
      <el-button @click="handleClose" type="default"> 关闭 </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ErrorToast',
  data() {
    return {
      showDetails: false,
      retrying: false
    };
  },
  computed: {
    ...mapGetters('errors', ['currentError', 'showErrorToast']),

    showDialog: {
      get() {
        return this.showErrorToast && this.currentError;
      },
      set(value) {
        if (!value) {
          this.handleClose();
        }
      }
    },

    errorTitle() {
      if (!this.currentError) return '';
      const levelMap = {
        info: '信息',
        warning: '警告',
        error: '错误',
        critical: '严重错误'
      };
      return levelMap[this.currentError.level] || '错误';
    },

    errorIcon() {
      if (!this.currentError) return '';
      const iconMap = {
        info: 'el-icon-info',
        warning: 'el-icon-warning',
        error: 'el-icon-error',
        critical: 'el-icon-error'
      };
      return iconMap[this.currentError.level] || 'el-icon-error';
    },

    errorColor() {
      if (!this.currentError) return '';
      const colorMap = {
        info: '#909399',
        warning: '#E6A23C',
        error: '#F56C6C',
        critical: '#F56C6C'
      };
      return colorMap[this.currentError.level] || '#F56C6C';
    },

    dialogWidth() {
      return this.showDetails ? '600px' : '400px';
    }
  },
  methods: {
    ...mapActions('errors', ['dismissError']),

    handleClose() {
      this.showDetails = false;
      this.dismissError();
    },

    handleReload() {
      window.location.reload();
    },

    async handleRetry() {
      if (this.retrying) return;
      
      this.retrying = true;
      
      try {
        // 根据错误上下文重新发送请求
        const errorContext = this.currentError.context;
        
        if (errorContext && errorContext.url) {
          // 重新构造请求
          const request = (await import('@/network/request')).default;
          
          const config = {
            url: errorContext.url,
            method: errorContext.method || 'GET'
          };
          
          // 如果有参数，添加参数
          if (errorContext.params) {
            config.params = errorContext.params;
          }
          
          if (errorContext.data) {
            config.data = errorContext.data;
          }
          
          // 发送重试请求
          const response = await request(config);
          
          // 重试成功
          this.$message({
            message: '重试成功',
            type: 'success'
          });
          
          // 通知父组件重试成功，可以刷新数据
          this.$emit('retry-success', {
            originalError: this.currentError,
            response: response
          });
          
          this.handleClose();
        } else {
          throw new Error('无法重试：缺少请求信息');
        }
      } catch (error) {
        // 重试失败
        this.$message({
          message: '重试失败：' + (error.message || '未知错误'),
          type: 'error'
        });
        
        // 可以选择更新错误信息或保持当前错误
        console.error('重试失败:', error);
      } finally {
        this.retrying = false;
      }
    },

    toggleDetails() {
      this.showDetails = !this.showDetails;
    },

    formatTime(timestamp) {
      if (!timestamp) return '';
      return new Date(timestamp).toLocaleString('zh-CN');
    }
  }
};
</script>

<style scoped>
.error-toast-dialog {
  .error-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
  }

  .error-icon {
    font-size: 24px;
    margin-top: 4px;
  }

  .error-details {
    flex: 1;
  }

  .error-message {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 12px 0;
    line-height: 1.4;
  }

  .error-meta {
    font-size: 14px;
    color: #666;

    p {
      margin: 4px 0;
    }

    strong {
      color: #333;
    }
  }

  .error-stack {
    margin-top: 12px;

    pre {
      background: #f5f5f5;
      padding: 8px;
      border-radius: 4px;
      font-size: 12px;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
    }
  }

  .dialog-footer {
    text-align: right;

    .el-button {
      margin-left: 8px;
    }
  }
}
</style>
