<template>
  <div class="article-item" @click="handleClick">
    <!-- 左侧头像 -->
    <div class="article-avatar">
      <img
        v-if="article.author?.avatar"
        :src="article.author.avatar"
        :alt="article.author?.name || '作者'"
        class="avatar-image"
      />
      <div v-else class="default-avatar">
        <i class="el-icon-user"></i>
      </div>
    </div>

    <!-- 右侧内容区域 -->
    <div class="article-content">
      <!-- 标题和标签行 -->
      <div class="title-row">
        <h3 class="article-title" :title="article.title">
          {{ article.title || '无标题' }}
        </h3>
        <div class="article-tags">
          <span v-if="article.category" class="tag category-tag">
            {{ article.category }}
          </span>
          <span v-if="article.isTop" class="tag top-tag"> 置顶 </span>
        </div>
      </div>

      <!-- 描述 -->
      <p class="article-description">
        {{ article.summary || article.content || '暂无内容' }}
      </p>

      <!-- 底部信息栏 -->
      <div class="article-meta">
        <div class="meta-left">
          <span class="author-name">
            {{ article.author?.name || '匿名用户' }}
          </span>
          <span class="publish-time">
            {{ formatDate(article.createTime || article.updatedAt) }}
          </span>
        </div>
        <div class="meta-right">
          <div class="stat-item">
            <i class="el-icon-view"></i>
            <span>{{ article.viewCount || 0 }}</span>
          </div>
          <div class="stat-item">
            <i class="el-icon-chat-dot-round"></i>
            <span>{{ article.commentCount || 0 }}</span>
          </div>
          <div class="stat-item">
            <i class="el-icon-star-off"></i>
            <span>{{ article.likeCount || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
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
.article-item {
  display: flex;
  padding: 14px;
  background: #1a1a1a;
  border: 1px solid #2d2d2d;
  border-radius: 8px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #e6e6e6;
  position: relative;
  overflow: hidden;
  min-height: 80px;
}

.article-item:hover {
  background: #252525;
  border-color: #404040;
  transform: translateX(3px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.article-avatar {
  flex-shrink: 0;
  margin-right: 12px;
  z-index: 1;
}

.avatar-image {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #404040;
  display: block;
}

.default-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  border: 2px solid #404040;
}

.article-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1;
}

.title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 6px;
  min-height: 24px;
}

.article-title {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 1.3;
  flex: 1;
  margin-right: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
}

.article-item:hover .article-title {
  color: #4a9eff;
}

.article-tags {
  display: flex;
  gap: 6px;
  flex-shrink: 0;
  align-items: flex-start;
}

.tag {
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
  white-space: nowrap;
  line-height: 1;
}

.category-tag {
  background: #1e3a8a;
  color: #60a5fa;
  border: 1px solid #3b82f6;
}

.top-tag {
  background: #dc2626;
  color: #fca5a5;
  border: 1px solid #ef4444;
}

.article-description {
  font-size: 13px;
  color: #a0a0a0;
  line-height: 1.4;
  margin: 0 0 8px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  flex: 1;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #808080;
  margin-top: auto;
}

.meta-left {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.author-name {
  color: #4a9eff;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.publish-time {
  color: #808080;
  white-space: nowrap;
}

.meta-right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 3px;
  color: #808080;
  transition: color 0.3s ease;
  white-space: nowrap;
}

.stat-item:hover {
  color: #4a9eff;
}

.stat-item i {
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-item {
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
  }

  .article-avatar {
    margin-right: 0;
    margin-bottom: 8px;
    align-self: flex-start;
  }

  .title-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .article-title {
    margin-right: 0;
  }

  .article-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  .meta-right {
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .article-item {
    padding: 10px;
  }

  .avatar-image,
  .default-avatar {
    width: 36px;
    height: 36px;
  }

  .default-avatar {
    font-size: 14px;
  }

  .article-title {
    font-size: 15px;
  }

  .article-description {
    font-size: 12px;
  }
}
</style>
