<template>
  <div v-loading.fullscreen.lock="loading" element-loading-spinner="el-icon-loading" element-loading-text="拼命加载中">
    <el-row>
      <el-col :span="10">
        <el-tooltip effect="light" placement="right">
          <div slot="content">
            <el-link icon="el-icon-edit" @click="EditArticle"></el-link>

            <el-divider direction="vertical"></el-divider>

            <el-link class="el-icon-delete" @click="DeleteArticle"></el-link>

            <el-divider direction="vertical"></el-divider>

            <el-link class="el-icon-download" @click="DownLoad(ArticleInfo)"></el-link>
          </div>

          <el-link style="font-weight: bolder; font-size: 15px" target="_blank"
                   @click="GetArticleInfo(ArticleInfo.id)">
            <i class="el-icon-document" style="margin-right: 1px"></i>
            {{ ArticleInfo.title }}
          </el-link>
        </el-tooltip>
      </el-col>

      <!--标签-->
      <el-col :span="6">
        <span>
          <!-- 循环渲染所有标签 -->
          <el-tag
              v-for="tag in this.ArticleInfo.tags"
              :key="tag"
              :disable-transitions="false"
              closable
              @close="handleClose(tag)"
              style="margin-right: 5px;">
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
              @keyup.enter.native="handleInputConfirm">
          </el-input>

          <!-- 添加新标签按钮（仅当 inputVisible 为 false 时显示） -->
          <el-button
              v-else
              class="button-new-tag"
              size="small"
              @click="showInput">
            +
          </el-button>
        </span>
      </el-col>

      <!--日期-->
      <el-col :span="8">
        <i class="el-icon-date">{{ArticleInfo.updated_at }}</i>
      </el-col>
    </el-row>

    <!--横线-->
    <el-row>
      <hr style="border: 0.08em solid lightgoldenrodyellow"/>
    </el-row>
  </div>
</template>

<script>
import request from "@/network/request";

export default {
  name: "MyArticle",
  props: ["ArticleInfo"],
  mounted() {
    if (this.ArticleInfo.tags[0] === "") {
      this.ArticleInfo.tags = [];
    }
  },
  updated() {
    if (this.ArticleInfo.tags[0] === "") {
      this.ArticleInfo.tags = [];
    }
  },
  data: function () {
    return {
      articleDetail: {
        mkValue: "",
        title: "",
        id: 0,
      },

      editDialogVisible: false,
      articleView: null,
      loading: false,
      inputVisible: false,
      inputValue: "",
    };
  },

  methods: {
    DownLoad(val) {
      console.log(val.id);
      this.loading = true;
      request({
        url: "/article/download/" + val.id,
        responseType: "blob", // 表明返回服务器返回的数据类型
      }).then((res) => {
        const blob = new Blob([res.data]);
        const fileName = val.title + ".md";
        if ("download" in document.createElement("a")) {
          // 非IE下载
          const elink = document.createElement("a");
          elink.download = fileName;
          elink.style.display = "none";
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
        url: "/article/get/" + id,
      }).then((resp) => {
        this.articleDetail = resp.data;
        this.loading = false;
        //this.dialogVisible=true;
        this.$emit("NewTab", this.articleDetail);
      });
    },

    DeleteArticle() {
      this.loading = true;
      request({
        method: "get",
        url: "/article/delete",
        params: {
          id: this.ArticleInfo.id,
        },
      }).then((resp) => {
        this.$message({
          type: "success",
          message: resp.data.msg,
        });

        this.$emit("DeleteArticle", resp.data.data);
        this.loading = false;
      });
    },

    handleClose(tag) {
      this.ArticleInfo.tags.splice(this.ArticleInfo.tags.indexOf(tag), 1);
      request({
        method: "post",
        url: "/article/set_tag",
        params: {
          id: this.ArticleInfo.id,
          tags: this.ArticleInfo.tags.join(","),
        },
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
      this.inputValue = "";

      request({
        method: "post",
        url: "/article/set_tag",
        params: {
          id: this.ArticleInfo.id,
          tags: this.ArticleInfo.tags.join(","),
        },
      });
    },

    EditArticle() {
      this.loading = true;
      //注意 axios是异步请求
      request({
        url: "/article/edit/" + this.ArticleInfo.id,
        method: "get",
      }).then((resp) => {
        this.articleView = resp.data.data;
        this.$router.push({
          name: "write",
          params: {
            article: this.articleView,
          },
        });
        this.loading = false;
      });
    },
  },
};
</script>

<style scoped></style>