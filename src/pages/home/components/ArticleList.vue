<template>
  <div class="article-list">
    <!-- 文章列表 -->
    <div class="article-container">
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
        class="load-more-btn"
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
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 20px 40px;
  flex: 1;
  overflow: visible;
}

.article-container {
  background: #0d1117;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #21262d;
  min-height: 200px;
  overflow: visible;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin: 24px 0;
  padding: 20px 0;
}

.load-more-btn {
  padding: 8px 24px;
  font-size: 13px;
  border-radius: 6px;
  background: #238636;
  border: 1px solid #2ea043;
  color: white;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: #2ea043;
  border-color: #46954a;
  transform: translateY(-1px);
}

.load-more-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.no-more-data {
  text-align: center;
  padding: 16px;
  color: #7d8590;
  font-size: 13px;
  background: #0d1117;
  border-radius: 8px;
  border: 1px solid #21262d;
  margin-top: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-list {
    padding: 0 15px 30px;
  }

  .article-container {
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .article-list {
    padding: 0 10px 20px;
  }

  .article-container {
    padding: 6px;
  }
}
</style>
