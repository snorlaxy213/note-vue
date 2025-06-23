<template>
  <el-dialog
    :visible="showDialog"
    :title="errorTitle"
    width="500px"
    :center="true"
    :close-on-click-modal="false"
    :show-close="true"
    @close="handleClose"
    class="error-toast-dialog"
    custom-class="modern-error-dialog"
  >
    <div class="error-content" v-if="currentError">
      <div class="error-icon">
        <i :class="errorIcon" :style="{ color: errorColor }"></i>
      </div>
      <div class="error-details">
        <p class="error-message">{{ currentError.message }}</p>
        <div class="error-meta">
          <div class="meta-item">
            <span class="meta-label">类型:</span>
            <span class="meta-value">{{ currentError.type }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">来源:</span>
            <span class="meta-value">{{ currentError.source }}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">时间:</span>
            <span class="meta-value">{{ formatTime(currentError.timestamp) }}</span>
          </div>
          
          <!-- 显示请求信息（如果是网络错误） -->
          <div v-if="currentError.context && currentError.context.url" class="request-info">
            <div class="meta-item">
              <span class="meta-label">请求:</span>
              <span class="meta-value">{{ currentError.context.method }} {{ currentError.context.url }}</span>
            </div>
            <div v-if="currentError.context.status" class="meta-item">
              <span class="meta-label">状态:</span>
              <span class="meta-value">{{ currentError.context.status }} {{ currentError.context.statusText }}</span>
            </div>
          </div>
          
          <!-- 堆栈信息 -->
          <div v-if="currentError.stack" class="error-stack">
            <div class="stack-header">
              <span class="meta-label">堆栈信息:</span>
              <el-button 
                type="text" 
                size="mini" 
                @click="toggleStackExpanded"
                class="stack-toggle-btn"
              >
                {{ stackExpanded ? '收起' : '展开全部' }}
                <i :class="stackExpanded ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
              </el-button>
            </div>
            <div class="stack-content" :class="{ 'expanded': stackExpanded }">
              <pre>{{ currentError.stack }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div slot="footer" class="dialog-footer" v-if="currentError">
      <div class="action-buttons">
        <el-button
          @click="handleReload"
          type="primary"
          size="small"
          v-if="currentError.level === 'critical'"
        >
          <i class="el-icon-refresh"></i>
          重新加载页面
        </el-button>
        <el-button
          @click="handleRetry"
          type="warning"
          size="small"
          :loading="retrying"
          v-if="currentError.type === 'network'"
        >
          <i class="el-icon-refresh-right" v-if="!retrying"></i>
          {{ retrying ? '重试中...' : '重试请求' }}
        </el-button>
        <el-button @click="handleClose" type="default" size="small">
          <i class="el-icon-close"></i>
          关闭
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'ErrorToast',
  data() {
    return {
      retrying: false,
      stackExpanded: false
    };
  },
  computed: {
    ...mapGetters('errors', ['currentError', 'showErrorToast']),

    showDialog() {
      return Boolean(this.showErrorToast && this.currentError);
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
    }
  },
  methods: {
    ...mapActions('errors', ['dismissError']),

    toggleStackExpanded() {
      this.stackExpanded = !this.stackExpanded;
    },

    handleBeforeClose(done) {
      // 使用 before-close 钩子确保正确关闭
      this.stackExpanded = false;
      this.dismissError();
      done();
    },

    handleClose() {
      // 保留原有的关闭方法作为备用
      this.stackExpanded = false;
      this.dismissError();
    },

    handleReload() {
      window.location.reload();
    },

    async handleRetry() {
      if (this.retrying) return;
      
      this.retrying = true;
      
      try {
        const errorContext = this.currentError.context;
        
        if (errorContext && errorContext.url) {
          const request = (await import('@/network/request')).default;
          
          const config = {
            url: errorContext.url,
            method: errorContext.method || 'GET'
          };
          
          if (errorContext.params) {
            config.params = errorContext.params;
          }
          
          if (errorContext.data) {
            config.data = errorContext.data;
          }
          
          const response = await request(config);
          
          this.$message({
            message: '重试成功',
            type: 'success'
          });
          
          this.$emit('retry-success', {
            originalError: this.currentError,
            response: response
          });
          
          this.handleClose();
        } else {
          throw new Error('无法重试：缺少请求信息');
        }
      } catch (error) {
        this.$message({
          message: '重试失败：' + (error.message || '未知错误'),
          type: 'error'
        });
        
        console.error('重试失败:', error);
      } finally {
        this.retrying = false;
      }
    },

    formatTime(timestamp) {
      if (!timestamp) return '';
      return new Date(timestamp).toLocaleString('zh-CN');
    }
  }
};
</script>

<style scoped>
/* 全局对话框样式 */
:deep(.modern-error-dialog) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

:deep(.modern-error-dialog .el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 24px 16px;
  border-bottom: none;
}

:deep(.modern-error-dialog .el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: white;
}

:deep(.modern-error-dialog .el-dialog__close) {
  color: white;
  font-size: 20px;
}

:deep(.modern-error-dialog .el-dialog__close:hover) {
  color: rgba(255, 255, 255, 0.8);
}

:deep(.modern-error-dialog .el-dialog__body) {
  padding: 24px;
  background: #fafafa;
}

:deep(.modern-error-dialog .el-dialog__footer) {
  background: white;
  padding: 16px 24px;
  border-top: 1px solid #ebeef5;
}

/* 错误内容样式 */
.error-toast-dialog {
  .error-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  }

  .error-icon {
    font-size: 24px;
    margin-top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: rgba(245, 108, 108, 0.1);
    flex-shrink: 0;
    /* 调整图标与文字的对齐 */
    align-self: flex-start;
    margin-top: 2px;
  }

  .error-details {
    flex: 1;
    min-width: 0;
  }

  .error-message {
    font-size: 16px;
    font-weight: 500;
    margin: 0 0 16px 0;
    line-height: 1.5;
    color: #303133;
    /* 确保文字与图标对齐 */
    margin-top: 0;
  }

  .error-meta {
    font-size: 14px;
    animation: slideDown 0.3s ease-out;
  }

  .meta-item {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
  }

  .meta-label {
    font-weight: 600;
    color: #606266;
    min-width: 60px;
    margin-right: 12px;
  }

  .meta-value {
    color: #909399;
    flex: 1;
  }

  .error-stack {
    margin-top: 16px;
  }

  .stack-header {
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .stack-toggle-btn {
    font-size: 12px;
    padding: 2px 6px;
    color: #409eff;
    
    i {
      margin-left: 4px;
      font-size: 12px;
    }
  }
  
  .stack-content {
    background: #f8f9fa;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    overflow: hidden;

    pre {
      background: transparent;
      padding: 12px;
      margin: 0;
      font-size: 12px;
      font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-all;
      line-height: 1.4;
      color: #495057;
      scrollbar-width: thin;
      scrollbar-color: #cbd5e0 #f7fafc;
      
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: #f7fafc;
        border-radius: 3px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: #cbd5e0;
        border-radius: 3px;
        
        &:hover {
          background: #a0aec0;
        }
      }
    }
    
    &:not(.expanded) pre {
      max-height: 200px;
    }
    
    &.expanded pre {
      max-height: 600px;
    }
  }

  /* 底部按钮区域 */
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .details-btn {
    color: #409eff;
    font-size: 14px;
    padding: 8px 12px;
    
    i {
      margin-right: 4px;
    }
    
    &:hover {
      background: rgba(64, 158, 255, 0.1);
      border-radius: 4px;
    }
  }

  .action-buttons {
    display: flex;
    gap: 8px;
    
    .el-button {
      display: flex;
      align-items: center;
      gap: 4px;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }
  }
}

/* 动画效果 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  :deep(.modern-error-dialog) {
    width: 90% !important;
    margin: 0 5%;
  }
  
  .error-toast-dialog {
    .error-content {
      padding: 16px;
    }
    
    .dialog-footer {
      flex-direction: column;
      gap: 12px;
      align-items: stretch;
    }
    
    .action-buttons {
      justify-content: center;
    }
  }
}
</style>

.request-info {
  margin: 12px 0;
  padding: 8px;
  background: #f0f9ff;
  border-left: 3px solid #0ea5e9;
  border-radius: 4px;
}

.merged-info {
  margin-top: 16px;
  padding: 8px;
  background: #fefce8;
  border-left: 3px solid #eab308;
  border-radius: 4px;
}

.merged-details {
  font-size: 12px;
  color: #713f12;
  
  ul {
    margin: 4px 0;
    padding-left: 16px;
  }
  
  li {
    margin: 2px 0;
  }
}
