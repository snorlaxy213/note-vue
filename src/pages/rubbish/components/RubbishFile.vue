<template>
  <div class="rubbish-file-item">
    <!-- 文件名列 -->
    <div class="file-name">
      <el-link style="font-size: 14px" @click="dialogVisible=true">
        <i class="el-icon-document" style="margin-right: 6px; color: #f56c6c; font-size: 16px;"></i>
        <span style="font-weight: 500;">{{ FileInfo.title }}</span>
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
      <el-button size="mini" type="success" icon="el-icon-refresh-right" @click="Recover">恢复</el-button>
    </div>

    <!-- 预览对话框 -->
    <el-dialog
        :visible.sync="dialogVisible"
        :title="FileInfo.title"
        width="90%"
        class="preview-dialog">
      <div v-html="FileInfo.mkHtml" class="preview-content"></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "RubbishFile",
  props: ["FileInfo"],
  data: function () {
    return {
      dialogVisible: false
    }
  },
  methods: {
    Recover() {
      this.$emit("Recover", this.FileInfo.id)
    }
  }
}
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
  flex: 0 0 15%;
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