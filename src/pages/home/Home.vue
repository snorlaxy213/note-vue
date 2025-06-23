<template>
  <div class="home-container">
    <!-- 页面标题 - 紧凑单行布局 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-inline">
          <div class="title-group">
            <span class="title-icon">📝</span>
            <h1 class="page-title">我的笔记</h1>
            <span class="page-subtitle">记录生活，分享思考</span>
          </div>
          <div class="header-stats" v-if="articles.length > 0">
            <span class="stat-text">{{ articles.length }}篇文章</span>
          </div>
        </div>
      </div>
      <div class="header-decoration"></div>
    </div>

    <!-- 文章列表 -->
    <ArticleList
      :articles="articles"
      :loading="loading"
      :has-more="hasMore"
      @load-more="loadMoreArticles"
      @card-click="handleCardClick"
    />

    <!-- 加载状态 -->
    <div v-if="loading && articles.length === 0" class="loading-container">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p>正在加载精彩内容...</p>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && articles.length === 0" class="empty-state">
      <div class="empty-content">
        <div class="empty-icon">✨</div>
        <h3>还没有文章</h3>
        <p>开始创作你的第一篇文章吧</p>
        <el-button type="primary" @click="$router.push('/write')">
          <i class="el-icon-edit"></i>
          开始写作
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import ArticleList from './components/ArticleList.vue';
import request from '../../network/request';

export default {
  name: 'Home',
  components: {
    ArticleList
  },
  data() {
    return {
      articles: [],
      loading: false,
      currentPage: 1,
      pageSize: 12,
      hasMore: true,
      error: null
    };
  },
  computed: {
    ...mapGetters('ui', ['currentTab'])
  },
  mounted() {
    this.loadArticles();
  },
  methods: {
    ...mapActions('ui', ['setCurrentTab']),

    // 加载文章数据
    async loadArticles() {
      if (this.loading) return;

      this.loading = true;
      this.error = null;

      try {
        const response = await request({
          url: `/article/many/${this.currentPage}`,
          method: 'GET'
        });

        if (response && response.data) {
          const { items, total } = response.data;

          if (this.currentPage === 1) {
            this.articles = items || [];
          } else {
            this.articles.push(...(items || []));
          }

          // 检查是否还有更多数据
          this.hasMore = this.articles.length < total;
        }
      } catch (error) {
        console.error('加载文章失败:', error);
        this.error = '加载文章失败，请稍后重试';
        this.$message.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    // 加载更多文章
    async loadMoreArticles() {
      if (!this.hasMore || this.loading) return;

      this.currentPage++;
      await this.loadArticles();
    },

    // 处理卡片点击
    handleCardClick(article) {
      // 跳转到文章详情页
      this.$router.push({
        name: 'write',
        query: { id: article.id }
      });
    },

    // 刷新数据
    refreshData() {
      this.currentPage = 1;
      this.hasMore = true;
      this.articles = [];
      this.loadArticles();
    }
  }
};
</script>

<style scoped>
.home-container {
  background: #010409;
  padding: 0;
  min-height: 100vh;
  overflow-y: auto;
}

.page-header {
  position: relative;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 100%);
  color: white;
  padding: 16px 20px; /* 减少内边距 */
  margin-bottom: 16px; /* 减少底部间距 */
  border-bottom: 1px solid #21262d;
  flex-shrink: 0;
}

.header-content {
  max-width: 1000px;
  margin: 0 auto;
}

.header-inline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.title-icon {
  font-size: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-3px); }
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  color: #f0f6fc;
  white-space: nowrap;
}

.page-subtitle {
  font-size: 14px;
  margin: 0;
  color: #7d8590;
  font-weight: 400;
  white-space: nowrap;
}

.header-stats {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.stat-text {
  font-size: 14px;
  color: #58a6ff;
  font-weight: 500;
  white-space: nowrap;
}

.header-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.05"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
  opacity: 0.3;
  pointer-events: none;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-inline {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .title-group {
    gap: 8px;
  }
  
  .page-title {
    font-size: 18px;
  }
  
  .page-subtitle {
    font-size: 13px;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 12px 15px;
  }
  
  .title-group {
    flex-wrap: wrap;
    gap: 6px;
  }
  
  .title-icon {
    font-size: 20px;
  }
  
  .page-title {
    font-size: 16px;
  }
  
  .page-subtitle {
    font-size: 12px;
  }
}
</style>
