<template>
  <div class="home-container">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">首页</h1>
      <p class="page-subtitle">欢迎来到笔记管理系统</p>
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
      <el-loading text="加载中..."></el-loading>
    </div>

    <!-- 空状态 -->
    <div v-if="!loading && articles.length === 0" class="empty-state">
      <el-empty description="暂无文章"></el-empty>
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
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 200px;
}

.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .home-container {
    padding: 15px;
  }
  
  .page-title {
    font-size: 24px;
  }
  
  .page-subtitle {
    font-size: 14px;
  }
}
</style>