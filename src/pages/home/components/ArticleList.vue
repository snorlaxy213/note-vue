<template>
  <div class="article-list">
    <!-- 文章网格 -->
    <div class="article-grid">
      <ArticleCard
        v-for="article in articles"
        :key="article.id"
        :article="article"
        @click="handleCardClick"
      />
    </div>
    
    <!-- 加载更多按钮 -->
    <div v-if="hasMore" class="load-more-container">
      <el-button
        :loading="loading"
        type="primary"
        @click="handleLoadMore"
      >
        {{ loading ? '加载中...' : '加载更多' }}
      </el-button>
    </div>
    
    <!-- 无更多数据提示 -->
    <div v-if="!hasMore && articles.length > 0" class="no-more-data">
      <span>已加载全部内容</span>
    </div>
  </div>
</template>

<script>
import ArticleCard from './ArticleCard.vue';

export default {
  name: 'ArticleList',
  components: {
    ArticleCard
  },
  props: {
    articles: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    hasMore: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleCardClick(article) {
      this.$emit('card-click', article);
    },
    
    handleLoadMore() {
      this.$emit('load-more');
    }
  }
};
</script>

<style scoped>
.article-list {
  width: 100%;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin: 30px 0;
}

.no-more-data {
  text-align: center;
  padding: 20px;
  color: #909399;
  font-size: 14px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .article-grid {
    gap: 10px;
  }
  
  .load-more-container {
    margin: 20px 0;
  }
}
</style>