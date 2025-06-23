<template>
  <div class="rubbish-container">
    <!-- 操作栏 -->
    <div class="rubbish-toolbar">
      <el-button plain size="mini" type="danger" @click="ForeverDelete">
        <i class="el-icon-delete" style="margin-right: 4px"></i>清空回收站
      </el-button>
    </div>

    <div
      class="rubbish-content"
      v-loading="loading"
      element-loading-spinner="el-icon-loading"
      element-loading-text="拼命加载中"
    >
      <!-- 表头 -->
      <div class="file-header">
        <div class="header-item name-column">
          <i class="el-icon-document"></i>
          <span>文件名</span>
        </div>
        <div class="header-item tag-column">
          <i class="el-icon-price-tag"></i>
          <span>状态</span>
        </div>
        <div class="header-item time-column">
          <i class="el-icon-time"></i>
          <span>删除时间</span>
        </div>
        <div class="header-item type-column">
          <i class="el-icon-files"></i>
          <span>类型</span>
        </div>
        <div class="header-item action-column">
          <i class="el-icon-s-tools"></i>
          <span>操作</span>
        </div>
      </div>

      <!-- 文件列表 -->
      <div class="rubbish-file-list">
        <rubbish-file
          v-for="f in ArticleList"
          :key="f.id"
          :file-info="f"
          @Recover="Recover"
          @PermanentDelete="PermanentDelete"
        ></rubbish-file>
      </div>

      <!-- 空状态 -->
      <div v-if="ArticleList.length === 0" class="empty-state">
        <i class="el-icon-delete empty-icon"></i>
        <p class="empty-text">回收站为空</p>
        <p class="empty-hint">删除的文件会出现在这里</p>
      </div>
    </div>
  </div>
</template>

<script>
import RubbishFile from '@/pages/rubbish/components/RubbishFile';
import request from '@/network/request';

export default {
  name: 'Rubbish',
  components: { RubbishFile },

  mounted() {
    this.loading = true;
    request({
      url: '/article/rubbish'
    }).then(resp => {
      this.ArticleList = resp.data.items;
      if (this.ArticleList == null) {
        this.ArticleList = [];
      }
      this.Count = resp.data.total;
      this.loading = false;
    }).catch(error => {
      console.error('回收站加载失败:', error);
      this.loading = false;
    });
  },

  data: function () {
    return {
      loading: false,
      keywords: '',
      ArticleList: [],
      Count: 0
    };
  },

  methods: {
    Recover(id) {
      this.loading = true;
      request({
        url: '/article/recover',
        params: {
          id: id
        }
      }).then(resp => {
        if (resp.data.code === 500) {
          this.$message({
            type: 'warning',
            message: resp.data.msg
          });
        } else {
          this.$message({
            type: 'success',
            message: resp.data.msg
          });

          for (let i = 0; i < this.ArticleList.length; i++) {
            if (this.ArticleList[i].id === id) {
              this.ArticleList.splice(i, 1);
            }
          }
        }
        this.loading = false;
      });
    },

    // 添加永久删除单个文件的方法
    PermanentDelete(id) {
      // 从列表中移除被永久删除的文件
      for (let i = 0; i < this.ArticleList.length; i++) {
        if (this.ArticleList[i].id === id) {
          this.ArticleList.splice(i, 1);
          break;
        }
      }
      // 更新计数
      this.Count = this.ArticleList.length;
    },

    ForeverDelete() {
      this.$confirm('此操作将永久删除所有回收站文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.loading = true;
          request({
            url: '/article/clear_rubbish'
          }).then(resp => {
            this.$message({
              type: 'success',
              message: resp.data.msg
            });
            this.ArticleList = [];
            this.loading = false;
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
.rubbish-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
}

/* 操作栏样式 - 与 Navigate 保持一致 */
.rubbish-toolbar {
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
}

.rubbish-content {
  min-height: 400px;
  background: #fff;
}

/* 表头样式 - 与 FileList 保持一致 */
.file-header {
  display: flex;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  color: #333;
}

.header-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.header-item i {
  color: #666;
  font-size: 16px;
}

.name-column {
  flex: 0 0 35%;
}

.tag-column {
  flex: 0 0 15%;
}

.time-column {
  flex: 0 0 25%;
}

.type-column {
  flex: 0 0 10%;
}

.action-column {
  flex: 0 0 15%;
}

/* 文件列表 */
.rubbish-file-list {
  padding: 0 20px;
  background: #fff;
}

/* 空状态样式 - 与 FileList 保持一致 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  background: #fff;
}

.empty-icon {
  font-size: 64px;
  color: #ddd;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #333;
}

.empty-hint {
  font-size: 14px;
  margin: 0;
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .file-header {
    font-size: 12px;
    padding: 12px 16px;
  }

  .rubbish-toolbar {
    padding: 12px 16px;
  }

  .name-column {
    flex: 0 0 45%;
  }

  .tag-column {
    flex: 0 0 20%;
  }

  .time-column {
    flex: 0 0 35%;
  }

  .type-column,
  .action-column {
    display: none;
  }
}
</style>
