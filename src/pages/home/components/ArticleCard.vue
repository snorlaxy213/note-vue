<template>
  <el-card 
    class="article-card" 
    :body-style="{ padding: '0px' }"
    shadow="hover"
    @click.native="handleClick"
  >
    <!-- 文章封面 -->
    <div class="article-cover">
      <img 
        v-if="article.cover" 
        :src="article.cover" 
        :alt="article.title"
        class="cover-image"
      >
      <div v-else class="default-cover">
        <i class="el-icon-document"></i>
      </div>
    </div>
    
    <!-- 文章内容 -->
    <div class="article-content">
      <!-- 标题 -->
      <h3 class="article-title" :title="article.title">
        {{ article.title || '无标题' }}
      </h3>
      
      <!-- 摘要 -->
      <p class="article-summary">
        {{ article.summary || article.content || '暂无内容' }}
      </p>
      
      <!-- 元信息 -->
      <div class="article-meta">
        <div class="meta-item">
          <i class="el-icon-time"></i>
          <span>{{ formatDate(article.createTime || article.updatedAt) }}</span>
        </div>
        <div v-if="article.category" class="meta-item">
          <i class="el-icon-collection-tag"></i>
          <span>{{ article.category }}</span>
        </div>
        <div v-if="article.wordCount" class="meta-item">
          <i class="el-icon-document"></i>
          <span>{{ article.wordCount }}字</span>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ArticleCard',
  props: {
    article: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    handleClick() {
      this.$emit('click', this.article);
    },
    
    formatDate(dateString) {
      if (!dateString) return '未知时间';
      
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        // 小于1天显示相对时间
        if (diff < 24 * 60 * 60 * 1000) {
          if (diff < 60 * 60 * 1000) {
            const minutes = Math.floor(diff / (60 * 1000));
            return `${minutes}分钟前`;
          } else {
            const hours = Math.floor(diff / (60 * 60 * 1000));
            return `${hours}小时前`;
          }
        }
        
        // 大于1天显示具体日期
        return date.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        });
      } catch (error) {
        return '时间格式错误';
      }
    }
  }
};
</script>

<style scoped>
.article-card {
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.article-cover {
  height: 160px;
  overflow: hidden;
  background-color: #f5f7fa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cover-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.article-card:hover .cover-image {
  transform: scale(1.05);
}

.default-cover {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.default-cover i {
  font-size: 48px;
  opacity: 0.8;
}

.article-content {
  padding: 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.article-summary {
  font-size: 14px;
  color: #606266;
  line-height: 1.5;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: auto;
}

.meta-item {
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #909399;
}

.meta-item i {
  margin-right: 4px;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .article-cover {
    height: 120px;
  }
  
  .article-content {
    padding: 12px;
  }
  
  .article-title {
    font-size: 15px;
  }
  
  .article-summary {
    font-size: 13px;
  }
}
</style>