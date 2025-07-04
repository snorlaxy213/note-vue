<template>
  <div class="file-list-container">
    <!-- 导航路径 -->
    <div class="breadcrumb-container">
      <el-breadcrumb separator="/" class="nav-breadcrumb">
        <el-breadcrumb-item
          v-for="(navItem, index) in Nav"
          :key="index"
          :class="{ 'breadcrumb-clickable': index < Nav.length - 1 }"
          @click.native="navigateToPath(navItem, index)"
        >
          <i class="el-icon-folder-opened" v-if="index === 0"></i>
          {{ navItem }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 文件列表区域 -->
    <div
      class="file-list-content"
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
          <span>标签</span>
        </div>
        <div class="header-item time-column">
          <i class="el-icon-time"></i>
          <span>修改时间</span>
        </div>
        <div class="header-item type-column">
          <i class="el-icon-files"></i>
          <span>类型</span>
        </div>
        <div class="header-item size-column">
          <i class="el-icon-coin"></i>
          <span>大小</span>
        </div>
        <div class="header-item action-column">
          <i class="el-icon-setting"></i>
          <span>操作</span>
        </div>
      </div>

      <!-- 文件夹列表 -->
      <div class="folder-list">
        <folder
          v-for="j in FolderList"
          :key="j.id"
          :folder-info="j"
          @AccessFolder="handleAccessFolder"
          @DeleteFolder="DeleteFolder"
        >
        </folder>
      </div>

      <!-- 文件列表 -->
      <div class="article-list">
        <my-article
          v-for="(ArticleInfo, k) in ArticleList"
          :key="k"
          :article-info="ArticleInfo"
          @DeleteArticle="DeleteArticle"
          @NewTab="NewTab"
        >
        </my-article>
      </div>

      <!-- 分页 -->
      <div
        class="pagination-container"
        v-if="FolderList.length !== 0 || ArticleList.length !== 0"
      >
        <el-pagination
          :current-page="currentPage"
          :hide-on-single-page="false"
          :page-size="10"
          :total="Total"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>

      <!-- 空状态 -->
      <div
        v-if="FolderList.length === 0 && ArticleList.length === 0"
        class="empty-state"
      >
        <i class="el-icon-folder-opened empty-icon"></i>
        <p class="empty-text">这里还没有任何文件</p>
        <p class="empty-hint">点击上方按钮创建文件夹或笔记</p>
      </div>
    </div>
  </div>
</template>

<script>
import Folder from '@/components/Folder.vue';
import MyArticle from '@/components/MyArticle';
import request from '@/network/request';

export default {
  name: 'FileList',
  data: function () {
    return {
      loading: false,
      FolderList: [],
      ArticleList: [],
      Nav: [],
      currentPage: 1,
      Total: 1,
      currentTitle: 'Home',
      isInitialized: false // 添加初始化标志
    };
  },

  mounted() {
    if (!this.isInitialized) {
      this.loadData();
      this.isInitialized = true;
    }
  },

  activated() {
    // 只有在已经初始化后才刷新数据
    if (this.isInitialized) {
      this.refreshData();
    }
  },

  methods: {
    // 提取公共的数据加载逻辑
    loadData() {
      this.loading = true;
      request({
        url: '/folder/sub_file/' + this.currentPage
      }).then(resp => {
        this.FolderList = resp.data.Folders;
        this.ArticleList = resp.data.Articles;
        this.loading = false;

        // 处理导航数据，过滤掉空值和重复的 'Home'
        let navData = resp.data.Nav || [];

        // 如果导航数据为空或者第一个元素不是有效值，设置为 ['Home']
        if (!navData || navData.length === 0 || !navData[0]) {
          this.Nav = ['Home'];
        } else {
          // 过滤掉空字符串和重复的 'Home'
          this.Nav = navData.filter((item, index) => {
            return item && item.trim() !== '' && !(item === 'Home' && index > 0);
          });

          // 如果过滤后为空，设置默认值
          if (this.Nav.length === 0) {
            this.Nav = ['Home'];
          }
        }

        this.Total = Number(resp.data.Total);
        if (this.$parent.$refs.navigate) {
          this.$parent.$refs.navigate.$data.Nav = [...this.Nav].reverse();
        }
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        // 错误已经被axios拦截器处理并发送到store
        // 这里只需要处理UI状态
        console.error('加载文件列表失败:', error);
      });
    },
    
    // 导航路径点击
    navigateToPath(navItem, index) {
      if (index < this.Nav.length - 1) {
        // 点击的不是最后一个路径项，执行导航
        this.loading = true;
        request({
          url: '/folder/sub_file/' + this.currentPage, // 使用当前页码
          params: {
            title: navItem
          }
        }).then(resp => {
          this.FolderList = resp.data.Folders;
          this.ArticleList = resp.data.Articles;
          this.Nav = resp.data.Nav || ['Home'];
          this.Total = Number(resp.data.Total);
          this.currentPage = 1; // 导航时重置为第一页
          this.loading = false;

          // 更新导航栏
          if (this.$parent.$refs.navigate) {
            this.$parent.$refs.navigate.$data.Nav = [
              ...resp.data.Nav
            ].reverse();
          }
        }).catch(error => {
          this.loading = false;
          console.error('导航失败:', error);
        });
      }
    },

    // 处理文件夹访问事件
    handleAccessFolder(folders, articles, nav, total) {
      this.FolderList = folders;
      this.ArticleList = articles;
      this.Nav = nav || ['Home'];
      this.Total = Number(total);
      this.currentPage = 1;
    
      // 强制更新分页组件
      this.$nextTick(() => {
        if (this.$refs.pagination) {
          this.$refs.pagination.internalCurrentPage = 1;
        }
      });
    
      // 更新导航栏
      if (this.$parent.$refs.navigate) {
        this.$parent.$refs.navigate.$data.Nav = [...nav].reverse();
      }
    },

    NewTab(ArticleInfo) {
      this.$emit('NewTab', ArticleInfo);
    },

    DeleteArticle(id) {
      for (let i = 0; i < this.ArticleList.length; i++) {
        if (this.ArticleList[i].id === id) {
          this.ArticleList.splice(i, 1);
        }
      }

      this.Total--;
      if (this.Total % 10 === 0) {
        this.$parent.$refs.FileList.handleCurrentChange(
          this.$parent.$refs.FileList.currentPage - 1
        );
      } else {
        this.$parent.$refs.FileList.handleCurrentChange(
          this.$parent.$refs.FileList.currentPage
        );
      }
    },

    handleCurrentChange(val) {
      this.currentPage = val;
      this.loading = true;
      request({
        url: '/folder/sub_file/' + this.currentPage,
        params: {
          title: this.Nav[this.Nav.length - 1]
        }
      }).then(resp => {
        this.FolderList = resp.data.Folders;
        this.ArticleList = resp.data.Articles;
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        console.error('分页加载失败:', error);
      });
    },

    // 处理删除文件夹事件
    DeleteFolder(folderId) {
      // 从文件夹列表中移除已删除的文件夹
      for (let i = 0; i < this.FolderList.length; i++) {
        if (this.FolderList[i].id === folderId) {
          this.FolderList.splice(i, 1);
          break;
        }
      }

      // 更新总数
      this.Total--;

      // 如果当前页没有数据了，跳转到上一页
      if (
        this.FolderList.length === 0 &&
        this.ArticleList.length === 0 &&
        this.currentPage > 1
      ) {
        this.handleCurrentChange(this.currentPage - 1);
      }
    },

    // 新增刷新数据方法
    refreshData() {
      this.loading = true;
      request({
        url: '/folder/sub_file/' + this.currentPage,
        params: {
          title: this.Nav[this.Nav.length - 1]
        }
      }).then(resp => {
        this.FolderList = resp.data.Folders;
        this.ArticleList = resp.data.Articles;
        this.Total = Number(resp.data.Total);
        this.loading = false;
      }).catch(error => {
        this.loading = false;
        console.error('刷新数据失败:', error);
      });
    }
  },
  computed: {},
  components: {
    Folder,
    MyArticle
  }
};
</script>

<style scoped>
.file-list-container {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  /* height: calc(100vh - 20px); 移除这行固定高度 */
  display: flex;
  flex-direction: column;
}

/* 导航路径样式 - 纯白色 */
.breadcrumb-container {
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  flex-shrink: 0;
}

.nav-breadcrumb {
  font-size: 14px;
}

.breadcrumb-clickable {
  cursor: pointer;
  color: #409eff;
  transition: color 0.3s;
}

.breadcrumb-clickable:hover {
  color: #66b1ff;
}

/* 表头样式 - 纯白色 */
.file-header {
  display: flex;
  padding: 16px 20px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  font-weight: 600;
  color: #333;
  flex-shrink: 0;
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
  flex: 0 0 30%;
}

.tag-column {
  flex: 0 0 20%;
}

.time-column {
  flex: 0 0 15%;
}

.type-column {
  flex: 0 0 10%;
}

.size-column {
  flex: 0 0 10%;
}

.action-column {
  flex: 0 0 15%;
}

/* 文件列表内容 - 关键修改 */
.file-list-content {
  background: #fff;
  flex: 1;
  /* overflow-y: auto; 移除或修改这个属性 */
  display: flex;
  flex-direction: column;
  min-height: 0; /* 关键：允许flex子项收缩 */
}

/* 文件夹和文件列表 */
.folder-list,
.article-list {
  padding: 0 20px;
  background: #fff;
  flex-shrink: 0;
}

/* 分页样式 - 关键修改 */
.pagination-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  border-top: 1px solid #f0f0f0;
  background: #fff;
  flex-shrink: 0; /* 确保分页不被压缩 */
  position: sticky; /* 让分页固定在底部 */
  bottom: 0;
  z-index: 10;
}

/* 空状态样式 */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  background: #fff;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px; /* 确保空状态有最小高度 */
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
  .file-list-container {
    height: calc(100vh - 20px);
  }
  
  .file-header {
    font-size: 12px;
    padding: 12px 16px;
  }

  .breadcrumb-container {
    padding: 12px 16px;
  }

  .name-column {
    flex: 0 0 50%;
  }

  .tag-column {
    flex: 0 0 25%;
  }

  .time-column {
    flex: 0 0 25%;
  }

  .type-column,
  .size-column,
  .action-column {
    display: none;
  }
}
</style>
