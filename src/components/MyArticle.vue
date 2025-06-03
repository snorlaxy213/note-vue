<template>
  <div
    v-loading.fullscreen.lock="loading"
    element-loading-spinner="el-icon-loading"
    element-loading-text="拼命加载中"
  >
    <div class="article-item">
      <!-- 文件名列 -->
      <div class="article-name">
        <el-link
          style="font-weight: bolder; font-size: 14px"
          target="_blank"
          @click="GetArticleInfo(ArticleInfo.id)"
        >
          <i
            class="el-icon-document"
            style="margin-right: 6px; color: #666; font-size: 16px"
          ></i>
          {{ ArticleInfo.title }}
        </el-link>
      </div>

      <!-- 标签列 -->
      <div class="article-tags">
        <span>
          <!-- 循环渲染所有标签 -->
          <el-tag
            v-for="tag in this.ArticleInfo.tags"
            :key="tag"
            :disable-transitions="false"
            closable
            @close="handleClose(tag)"
            size="small"
            style="margin-right: 5px"
          >
            {{ tag }}
          </el-tag>

          <!-- 输入新标签的输入框（仅当 inputVisible 为 true 时显示） -->
          <el-input
            v-if="inputVisible"
            ref="saveTagInput"
            v-model="inputValue"
            class="input-new-tag"
            size="small"
            @blur="handleInputConfirm"
            @keyup.enter.native="handleInputConfirm"
          >
          </el-input>

          <!-- 添加新标签按钮（仅当 inputVisible 为 false 时显示） -->
          <el-button
            v-else
            class="button-new-tag"
            size="small"
            @click="showInput"
          >
            + 新标签
          </el-button>
        </span>
      </div>

      <!-- 修改时间列 -->
      <div class="article-time">
        <span>{{ ArticleInfo.updated_at.slice(0, 16) }}</span>
      </div>

      <!-- 类型列 -->
      <div class="article-type">
        <span>文档</span>
      </div>

      <!-- 大小列 -->
      <div class="article-size">
        <span>{{ ArticleInfo.size || '-' }}</span>
      </div>

      <!-- 操作列 -->
      <div class="article-actions">
        <el-button
          size="mini"
          icon="el-icon-edit"
          @click="EditArticle"
          title="编辑"
        ></el-button>
        <el-button
          size="mini"
          type="danger"
          icon="el-icon-delete"
          @click="DeleteArticle"
          title="删除"
        ></el-button>
        <el-button
          size="mini"
          icon="el-icon-download"
          @click="DownLoad(ArticleInfo)"
          title="下载"
        ></el-button>
      </div>
    </div>
  </div>
</template>

<script>
import request from '@/network/request';

export default {
  name: 'MyArticle',
  props: ['ArticleInfo'],
  mounted() {
    if (this.ArticleInfo.tags[0] === '') {
      this.ArticleInfo.tags = [];
    }
  },
  updated() {
    if (this.ArticleInfo.tags[0] === '') {
      this.ArticleInfo.tags = [];
    }
  },
  data: function () {
    return {
      articleDetail: {
        mkValue: '',
        title: '',
        id: 0
      },
      editDialogVisible: false,
      articleView: null,
      loading: false,
      inputVisible: false,
      inputValue: ''
    };
  },

  methods: {
    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    DownLoad(val) {
      console.log(val.id);
      this.loading = true;
      request({
        url: '/article/download/' + val.id,
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then(res => {
        const blob = new Blob([res.data]);
        const fileName = val.title + '.md';
        if ('download' in document.createElement('a')) {
          // 非IE下载
          const elink = document.createElement('a');
          elink.download = fileName;
          elink.style.display = 'none';
          elink.href = URL.createObjectURL(blob);
          document.body.appendChild(elink);
          elink.click();
          URL.revokeObjectURL(elink.href); // 释放URL 对象
          document.body.removeChild(elink);
        } else {
          // IE10+下载
          navigator.msSaveBlob(blob, fileName);
        }

        this.loading = false;
      });
    },

    GetArticleInfo(id) {
      this.loading = true;

      request({
        url: '/article/get/' + id
      }).then(resp => {
        this.articleDetail = resp.data;
        this.loading = false;
        //this.dialogVisible=true;
        this.$emit('NewTab', this.articleDetail);
      });
    },

    DeleteArticle() {
      this.loading = true;
      request({
        method: 'get',
        url: '/article/delete',
        params: {
          id: this.ArticleInfo.id
        }
      }).then(resp => {
        this.$message({
          type: 'success',
          message: resp.data.msg
        });

        this.$emit('DeleteArticle', resp.data.data);
        this.loading = false;
      });
    },

    handleClose(tag) {
      this.ArticleInfo.tags.splice(this.ArticleInfo.tags.indexOf(tag), 1);
      request({
        method: 'post',
        url: '/article/set_tag',
        params: {
          id: this.ArticleInfo.id,
          tags: this.ArticleInfo.tags.join(',')
        }
      });
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },

    handleInputConfirm() {
      let inputValue = this.inputValue;

      if (inputValue) {
        this.ArticleInfo.tags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = '';

      request({
        method: 'post',
        url: '/article/set_tag',
        params: {
          id: this.ArticleInfo.id,
          tags: this.ArticleInfo.tags.join(',')
        }
      });
    },

    EditArticle() {
      this.loading = true;
      //注意 axios是异步请求
      request({
        url: '/article/edit/' + this.ArticleInfo.id,
        method: 'get'
      }).then(resp => {
        this.articleView = resp.data.data;
        this.$router.push({
          name: 'write',
          params: {
            article: this.articleView
          }
        });
        this.loading = false;
      });
    }
  }
};
</script>

<style scoped>
.article-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f5f5f5;
  transition: background-color 0.3s;
  font-size: 14px;
  border-radius: 4px;
  margin: 0 4px;
}

.article-item:hover {
  background-color: #f8f9fa;
  border-radius: 4px;
}

.article-item:last-child {
  border-bottom: none;
}

.article-name {
  flex: 0 0 30%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.article-tags {
  flex: 0 0 20%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.article-time {
  flex: 0 0 15%;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.article-type {
  flex: 0 0 10%;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.article-size {
  flex: 0 0 10%;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666;
  font-size: 14px;
}

.article-actions {
  flex: 0 0 15%;
  display: flex;
  align-items: center;
  gap: 6px;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.button-new-tag {
  margin-left: 10px;
  height: 24px;
  line-height: 22px;
  padding: 0 8px;
  font-size: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-name {
    flex: 0 0 50%;
  }

  .article-tags {
    flex: 0 0 25%;
  }

  .article-time {
    flex: 0 0 25%;
  }

  .article-type,
  .article-size,
  .article-actions {
    display: none;
  }
}
</style>
