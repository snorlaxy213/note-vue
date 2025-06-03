<template>
  <div>
    <el-col :span="6">
      <div @click="Link('article')">
        <el-card shadow="hover" style="margin: 1%; background: honeydew"
          >Article</el-card
        >
      </div>
    </el-col>

    <el-col :span="6">
      <div @click="Link('my_book')">
        <el-card shadow="hover" style="margin: 1%; background: honeydew"
          >MyBook</el-card
        >
      </div>
    </el-col>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    Link(path) {
      this.$router.push('/manage/' + path);
    }
  }
};
</script>

<style scoped></style>
