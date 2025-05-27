<template>
  <div>
    <!--面包导航-->
    <navigate ref="navigate"></navigate>
    <!--文件列表-->
    <file-list ref="FileList" @NewTab="NewTab"></file-list>
  </div>
</template>

<script>
import Navigate from "./Navigate";
import FileList from "./FileList";

export default {
  name: "TabContent",
  components: {
    Navigate,
    FileList,
  },
  methods: {
    NewTab(ArticleInfo) {
      this.$emit("NewTab", ArticleInfo);
    },
  },
};
</script>

<style scoped></style>