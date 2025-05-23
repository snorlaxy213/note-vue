<template>
  <div>
    <el-row v-loading="loading" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中"
            style="padding-left: 1%; padding-right: 5%">
      <!--目录-->
      <folder
          v-for="j in FolderList"
          :key="j.id"
          :folder-info="j"
          @AccessFolder="AccessFolder"
          @DeleteFolder="DeleteFolder">
      </folder>

      <!--分页-->
      <el-row style="margin-left: 80%">
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

      <center v-if="FolderList.length == 0 && ArticleList.length == 0">
        <i class="el-icon-edit"></i>
        <span style="font-family: 楷体; font-size: 30px"> 空空如也</span>
      </center>
    </el-row>
  </div>
</template>

<script>
import Folder from "@/components/Folder";
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
      params: {
        title: this.currentTitle,
      },
    })
        .then((resp) => {
          this.FolderList = resp.data.Folders;
          this.ArticleList = resp.data.Articles;
          if (this.FolderList == null) {
            this.FolderList = [];
          }
          if (this.ArticleList == null) {
            this.ArticleList = [];
          }
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

    DeleteFolder(id) {
      for (var i = 0; i < this.FolderList.length; i++) {
        if (this.FolderList[i].id == id) {
          this.FolderList.splice(i, 1);
        }
      }

      this.Total--;
      if (this.Total % 13 === 0) {
        //如果不足一页 则退到上一页
        this.$parent.$refs.FileList.handleCurrentChange(
            this.$parent.$refs.FileList.currentPage - 1
        );
      } else {
        this.$parent.$refs.FileList.handleCurrentChange(
            this.$parent.$refs.FileList.currentPage
        );
      }
    },

    DeleteArticle(id) {
      for (var i = 0; i < this.ArticleList.length; i++) {
        if (this.ArticleList[i].id == id) {
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

    AccessFolder(FolderList, ArticleList, nav, total) {
      this.FolderList = FolderList;
      this.ArticleList = ArticleList;
      this.Nav = nav;
      this.$parent.$refs.navigate.Nav = nav;
      this.Total = Number(total);
      this.currentPage = 1;
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
<style scoped></style>