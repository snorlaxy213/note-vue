<template>
  <div>
    <!--面包导航-->
    <navigate ref="navigate"></navigate>

    <!--文件列表-->
    <file_list ref="file_list" @NewTab="NewTab"></file_list>
  </div>
</template>

<script>
import navigate from "./navigate";
import file_list from "./file-list";

export default {
  name: "tab_content",
  components: {
    navigate,
    file_list,
  },
  methods: {
    NewTab(ArticleInfo) {
      this.$emit("NewTab", ArticleInfo);
    },
  },
};
</script>

<style scoped></style>