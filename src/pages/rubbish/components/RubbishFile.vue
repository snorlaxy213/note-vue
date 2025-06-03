<template>
  <div class="rubbish-file-item">
    <!-- 文件名列 -->
    <div class="file-name">
      <el-link style="font-size: 14px" @click="previewArticle">
        <i
          class="el-icon-document"
          style="margin-right: 6px; color: #f56c6c; font-size: 16px"
        ></i>
        <span style="font-weight: 500">{{ FileInfo.title }}</span>
      </el-link>
    </div>

    <!-- 状态列 -->
    <div class="file-status">
      <el-tag size="small" type="danger">已删除</el-tag>
    </div>

    <!-- 删除时间列 -->
    <div class="file-time">
      <span>{{ FileInfo.deleted_time }}</span>
    </div>

    <!-- 类型列 -->
    <div class="file-type">
      <span>文档</span>
    </div>

    <!-- 操作列 -->
    <div class="file-actions">
      <el-button
        size="mini"
        type="success"
        icon="el-icon-refresh-right"
        @click="Recover"
        >恢复</el-button
      >
      <el-button
        size="mini"
        type="danger"
        icon="el-icon-delete"
        @click="PermanentDelete"
        >永久删除</el-button
      >
    </div>

    <!-- 预览对话框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :title="FileInfo.title"
      width="90%"
      class="preview-dialog"
    >
      <pre class="preview-content">{{ articleContent }}</pre>
    </el-dialog>
  </div>
</template>

<script>
import request from '@/network/request';

export default {
  name: 'RubbishFile',
  props: ['FileInfo'],
  data: function () {
    return {
      dialogVisible: false,
      articleContent: '',
      loading: false
    };
  },
  methods: {
    // 预览文章
    previewArticle() {
      this.loading = true;
      request({
        url: '/article/get/' + this.FileInfo.id
      })
        .then(resp => {
          // 直接使用原始Markdown文本
          this.articleContent = resp.data.mkValue || '暂无内容';
          this.dialogVisible = true;
          this.loading = false;
        })
        .catch(() => {
          this.$message({
            type: 'error',
            message: '获取文章内容失败'
          });
          this.loading = false;
        });
    },

    Recover() {
      this.$emit('Recover', this.FileInfo.id);
    },

    // 永久删除文章
    PermanentDelete() {
      this.$confirm('此操作将永久删除该文章，无法恢复，是否继续？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          request({
            url: '/article/clear_rubbish/' + this.FileInfo.id,
            method: 'GET'
          })
            .then(() => {
              this.$message({
                type: 'success',
                message: '文章已永久删除'
              });
              this.$emit('PermanentDelete', this.FileInfo.id);
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败，请重试'
              });
            });
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    }
  }
};
</script>

<style scoped>
.rubbish-file-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s;
  font-size: 14px;
  border-radius: 4px;
  margin: 0 4px;
}

.rubbish-file-item:hover {
  background-color: #f8f9fa;
  border-radius: 4px;
}

.rubbish-file-item:last-child {
  border-bottom: none;
}

.file-name {
  flex: 0 0 35%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.file-status {
  flex: 0 0 15%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.file-time {
  flex: 0 0 25%;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.file-type {
  flex: 0 0 10%;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.file-actions {
  flex: 0 0 20%; /* 从15%增加到20%以容纳两个按钮 */
  display: flex;
  align-items: center;
  gap: 6px;
}

/* 预览内容样式 */
.preview-content {
  max-height: 500px;
  overflow-y: auto;
  padding: 20px;
  background: #f9f9f9;
  border-radius: 4px;
  line-height: 1.6;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-name {
    flex: 0 0 45%;
  }

  .file-status {
    flex: 0 0 20%;
  }

  .file-time {
    flex: 0 0 35%;
  }

  .file-type,
  .file-actions {
    display: none;
  }
}
</style>
