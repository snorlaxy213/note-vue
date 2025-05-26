<template>
  <div>
    <el-row v-loading="loading"
            element-loading-spinner="el-icon-loading"
            element-loading-text="拼命加载中"
            style="padding-left: 1%; padding-right: 5%"
    >
      <!-- 添加标题栏 -->
      <el-row style="padding: 20px 0" class="folder-header">
        <el-col :span="10">
          <span class="header-text" style="font-size: 17px">文件名</span>
        </el-col>
        <el-col :span="6">
          <span class="header-text" style="font-size: 17px">标签</span>
        </el-col>
        <el-col :span="4">
          <span class="header-text" style="font-size: 17px">修改时间</span>
        </el-col>
        <el-col :span="2">
          <span class="header-text" style="font-size: 17px">类型</span>
        </el-col>
        <el-col :span="2">
          <span class="header-text" style="font-size: 17px">大小</span>
        </el-col>
      </el-row>

      <!--目录-->
      <folder
          v-for="j in FolderList"
          :key="j.id"
          :folder-info="j">
      </folder>

      <!--分页-->
      <el-row v-if="FolderList.length !== 0 && ArticleList.length !== 0" style="margin-left: 80%">
        <el-pagination :current-page="currentPage" :hide-on-single-page="false" :page-size="13" :total="Total"
                       layout="prev, pager, next" @current-change="handleCurrentChange">
        </el-pagination>
      </el-row>

      <!--文件-->
      <my-article
          v-for="(ArticleInfo, k) in ArticleList"
          :key="k" :article-info="ArticleInfo"
          @DeleteArticle="DeleteArticle"
          @NewTab="NewTab">
      </my-article>

      <div v-if="FolderList.length === 0 && ArticleList.length === 0" style="text-align: center;">
        <i class="el-icon-edit"></i>
        <span style="font-family: system-ui;"> 空空如也</span>
      </div>
    </el-row>
  </div>
</template>

<script>
import Folder from "@/components/Folder.vue";
import MyArticle from "@/components/MyArticle";
import request from "@/network/request";

export default {
  name: "file-list",
  data: function () {
    return {
      loading: false,
      FolderList: [],
      ArticleList: [],
      Nav: [],
      currentPage: 1,
      Total: 1,
      currentTitle: "Home",
    };
  },

  mounted() {
    request({
      url: "/folder/sub_file/" + 1,
    })
        .then((resp) => {
          this.FolderList = resp.data.Folders;
          this.ArticleList = resp.data.Articles;
          this.loading = false;
          this.Nav = resp.data.Nav;
          this.Total = Number(resp.data.Total);
          this.$parent.$refs.navigate.$data.Nav = resp.data.Nav.reverse();
          this.loading = false;
        });
  },

  methods: {
    NewTab(ArticleInfo) {
      this.$emit("NewTab", ArticleInfo);
    },

    DeleteArticle(id) {
      for (let i = 0; i < this.ArticleList.length; i++) {
        if (this.ArticleList[i].id === id) {
          this.ArticleList.splice(i, 1);
        }
      }

      this.Total--;
      if (this.Total % 13 === 0) {
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
        url: "/folder/sub_file/" + this.currentPage,
        params: {
          title: this.Nav[this.Nav.length - 1],
        },
      }).then((resp) => {
        this.FolderList = resp.data.Folders;
        this.ArticleList = resp.data.Articles;
        this.loading = false;
      });
    },
  },
  computed: {},
  components: {
    Folder,
    MyArticle,
  },
};
</script>
<style scoped>
.folder-header {
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 20px;
  /* 增加与内容的间距 */
}

.header-text {
  font-size: 14px;
  color: #606266;
  font-weight: 500;
}
</style>